import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import type { AppDispatch } from "../store"
import { updateCryptoPrice } from "./cryptoSlice"
import { addNotification } from "./notificationsSlice"

// Keep WebSocket instance outside Redux
let socketInstance: WebSocket | null = null;
let reconnectAttempts = 0;
let reconnectTimeout: NodeJS.Timeout | null = null;
let weatherAlertInterval: NodeJS.Timeout | null = null;
const MAX_RECONNECT_ATTEMPTS = 5;
const RECONNECT_INTERVAL_BASE = 5000; // 5 seconds
const CONNECTION_TIMEOUT = 10000; // 10 seconds

interface WebSocketState {
  connected: boolean;
  connectionError: boolean;
  lastErrorMessage: string | null;
}

const initialState: WebSocketState = {
  connected: false,
  connectionError: false,
  lastErrorMessage: null,
};

// Handle reconnection logic
const handleReconnection = (dispatch: AppDispatch) => {
  if (reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
    reconnectAttempts++;
    const delay = RECONNECT_INTERVAL_BASE * Math.pow(2, reconnectAttempts - 1);
    
    console.log(`Scheduling reconnection attempt ${reconnectAttempts}/${MAX_RECONNECT_ATTEMPTS} in ${delay}ms...`);
    
    if (reconnectTimeout) {
      clearTimeout(reconnectTimeout);
    }
    
    reconnectTimeout = setTimeout(() => {
      console.log(`Attempting to reconnect (${reconnectAttempts}/${MAX_RECONNECT_ATTEMPTS})...`);
      dispatch(initializeWebSocket());
    }, delay);
    
  } else {
    console.error(`Maximum reconnection attempts (${MAX_RECONNECT_ATTEMPTS}) reached`);
    dispatch(websocketFailure("Max reconnection attempts reached. Please reload the page."));
    dispatch(
      addNotification({
        type: "system_error",
        title: "Connection Failed",
        message: "Unable to connect after multiple attempts. Please reload the page.",
      })
    );
  }
};

// Clean up all resources related to WebSocket
const cleanupWebSocketResources = () => {
  if (weatherAlertInterval) {
    clearInterval(weatherAlertInterval);
    weatherAlertInterval = null;
  }
  
  if (reconnectTimeout) {
    clearTimeout(reconnectTimeout);
    reconnectTimeout = null;
  }
  
  if (socketInstance) {
    try {
      if (socketInstance.readyState === WebSocket.OPEN || socketInstance.readyState === WebSocket.CONNECTING) {
        socketInstance.close(1000, "Component unmounted");
      }
    } catch (err) {
      console.error("Error during WebSocket cleanup:", err);
    }
    socketInstance = null;
  }
};

// Main initialization function
export const initializeWebSocket = () => (dispatch: AppDispatch) => {
  // Clean up existing resources
  cleanupWebSocketResources();
  
  try {
    // Connect to WebSocket server
    socketInstance = new WebSocket("wss://ws.coincap.io/prices?assets=bitcoin,ethereum,solana");
    
    // Create connection timeout
    const connectionTimeout = setTimeout(() => {
      if (socketInstance && socketInstance.readyState !== WebSocket.OPEN) {
        console.warn("WebSocket connection timeout");
        
        // Force close and handle reconnection
        try {
          socketInstance.close();
        } catch (err) {
          console.error("Error closing timed out connection:", err);
        }
        
        dispatch(websocketFailure("Connection timeout"));
        dispatch(
          addNotification({
            type: "system_error",
            title: "Connection Timeout",
            message: "Failed to connect to crypto price feed. Retrying...",
          })
        );
        
        // Attempt reconnection
        handleReconnection(dispatch);
      }
    }, CONNECTION_TIMEOUT);
    
    // Connection established successfully
    socketInstance.onopen = () => {
      console.log("WebSocket connected successfully");
      clearTimeout(connectionTimeout);
      reconnectAttempts = 0; // Reset reconnection attempts on success
      dispatch(websocketConnected());
      
      // Clear any error state
      dispatch(websocketClearError());
    };
    
    // Handle incoming messages
    socketInstance.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        
        // Update crypto prices based on WebSocket data
        Object.entries(data).forEach(([id, price]) => {
          const numericPrice = Number.parseFloat(price as string);
          if (!isNaN(numericPrice)) {
            dispatch(updateCryptoPrice({ id, price: numericPrice }));
            
            // Generate notification for significant price changes with 10% chance
            if (Math.random() < 0.1) {
              const priceChange = (Math.random() * 5).toFixed(2);
              const isIncrease = Math.random() < 0.5;
              const cryptoName = id.charAt(0).toUpperCase() + id.slice(1);
              
              dispatch(
                addNotification({
                  type: "price_alert",
                  title: `${cryptoName} ${isIncrease ? "Up" : "Down"} ${priceChange}%`,
                  message: `${cryptoName} has ${isIncrease ? "increased" : "decreased"} by ${priceChange}% in the last hour.`,
                })
              );
            }
          } else {
            console.warn(`Received invalid price for ${id}:`, price);
          }
        });
      } catch (error) {
        console.error("Error processing WebSocket message:", error);
      }
    };
    
    // Handle connection close
    socketInstance.onclose = (event) => {
      clearTimeout(connectionTimeout);
      console.log(`WebSocket disconnected. Code: ${event.code}, Reason: ${event.reason || "No reason provided"}`);
      
      const wasClean = event.wasClean;
      dispatch(websocketDisconnected());
      
      // Only attempt reconnection for unexpected closures and if socketInstance still exists
      // This prevents reconnection attempts after component unmounting
      if (socketInstance && !wasClean && event.code !== 1000) {
        console.log("Connection closed unexpectedly, attempting to reconnect...");
        handleReconnection(dispatch);
      }
    };
    
    // Handle connection errors
    socketInstance.onerror = () => {
      // Check if socket instance still exists before proceeding
      if (!socketInstance) {
        console.log("WebSocket error occurred, but socket was already cleaned up");
        return;
      }
      
      // Browser security restrictions prevent access to detailed error information
      // Log what we can about the connection state
      try {
        const connectionState = {
          timestamp: new Date().toISOString(),
          readyState: socketInstance ? 
            ["CONNECTING", "OPEN", "CLOSING", "CLOSED"][socketInstance.readyState] : "UNKNOWN",
          url: socketInstance?.url || "UNKNOWN",
        };
        
        console.error("WebSocket error occurred:", connectionState);
        
        dispatch(websocketFailure("Connection error detected"));
        dispatch(
          addNotification({
            type: "system_error",
            title: "Connection Issue",
            message: "Problem connecting to crypto price service. Will attempt to reconnect automatically.",
          })
        );
      } catch (err) {
        console.error("Error handling WebSocket error:", err);
      }
      
      // No need to call close() here as the error will trigger onclose event naturally
    };
    
    // Simulate weather alerts every 30 seconds (this is simulated data for demo purposes)
    weatherAlertInterval = setInterval(() => {
      if (Math.random() < 0.2) { // 20% chance of weather alert
        const cities = ["New York", "London", "Tokyo", "Sydney", "Berlin"];
        const city = cities[Math.floor(Math.random() * cities.length)];
        const alerts = [
          "Heavy Rain Expected",
          "High Winds Alert",
          "Extreme Temperature Warning",
          "Thunderstorm Warning",
          "Air Quality Alert",
        ];
        const alert = alerts[Math.floor(Math.random() * alerts.length)];
        
        dispatch(
          addNotification({
            type: "weather_alert",
            title: `${alert} for ${city}`,
            message: `Weather alert: ${alert} has been issued for ${city}. Take necessary precautions.`,
          })
        );
      }
    }, 30000);
    
    // Return cleanup function for component unmount
    return () => {
      clearTimeout(connectionTimeout);
      cleanupWebSocketResources();
      dispatch(websocketDisconnected());
    };
  } catch (error) {
    console.error("Error initializing WebSocket:", error);
    dispatch(websocketFailure(error instanceof Error ? error.message : "Unknown error"));
    dispatch(
      addNotification({
        type: "system_error",
        title: "Connection Error",
        message: "Failed to initialize connection to crypto price feed.",
      })
    );
    
    // Attempt reconnection
    handleReconnection(dispatch);
    
    // Return empty cleanup function
    return () => {
      cleanupWebSocketResources();
    };
  }
};

// Helper function to access socket outside Redux
export const getSocketInstance = () => socketInstance;

// Manually trigger reconnection
export const reconnectWebSocket = () => (dispatch: AppDispatch) => {
  reconnectAttempts = 0; // Reset the counter for manual reconnection
  dispatch(initializeWebSocket());
};

const websocketSlice = createSlice({
  name: "websocket",
  initialState,
  reducers: {
    websocketConnected: (state) => {
      state.connected = true;
      state.connectionError = false;
      state.lastErrorMessage = null;
    },
    websocketDisconnected: (state) => {
      state.connected = false;
    },
    websocketFailure: (state, action: PayloadAction<string>) => {
      state.connected = false;
      state.connectionError = true;
      state.lastErrorMessage = action.payload;
    },
    websocketClearError: (state) => {
      state.connectionError = false;
      state.lastErrorMessage = null;
    },
    websocketMessageReceived: (state, action: PayloadAction<any>) => {
      // This is a placeholder - actual message handling happens in the middleware
    },
  },
});

export const {
  websocketConnected,
  websocketDisconnected,
  websocketFailure,
  websocketClearError,
  websocketMessageReceived
} = websocketSlice.actions;

export default websocketSlice.reducer;


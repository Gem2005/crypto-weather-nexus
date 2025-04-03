import type { Middleware, MiddlewareAPI, Dispatch, AnyAction } from "redux"
import type { RootState } from "../store"

interface WebSocketMessage {
  type: string;
  [key: string]: any;
}

interface PriceMessage extends WebSocketMessage {
  type: "price";
  id: string;
  price: number;
}

interface AlertMessage extends WebSocketMessage {
  type: "alert";
  alertType: string;
  title: string;
  message: string;
}

// Type guard functions to safely handle different message types
function isPriceMessage(message: any): message is PriceMessage {
  return message?.type === "price" && typeof message.id === "string" && typeof message.price === "number";
}

function isAlertMessage(message: any): message is AlertMessage {
  return message?.type === "alert" && typeof message.title === "string" && typeof message.message === "string";
}

const websocketMiddleware: Middleware = (store) => 
  (next) => 
  (action: any) => {
    // Handle WebSocket messages here if needed
    if (action.type === "websocket/websocketMessageReceived") {
      try {
        const message = action.payload;

        // Use type guards to safely process different message types
        if (isPriceMessage(message)) {
          store.dispatch({
            type: "crypto/updateCryptoPrice",
            payload: {
              id: message.id,
              price: message.price,
            },
          });
        } else if (isAlertMessage(message)) {
          store.dispatch({
            type: "notifications/addNotification",
            payload: {
              type: message.alertType,
              title: message.title,
              message: message.message,
            },
          });
        } else {
          console.warn("Received unknown WebSocket message format:", message);
        }
      } catch (error) {
        console.error("Error processing WebSocket message in middleware:", error);
      }
    }

    // Always pass the action to the next middleware
    return next(action);
  };

export default websocketMiddleware;


import { configureStore } from "@reduxjs/toolkit"
import weatherReducer from "./features/weatherSlice"
import cryptoReducer from "./features/cryptoSlice"
import newsReducer from "./features/newsSlice"
import userPreferencesReducer from "./features/userPreferencesSlice"
import notificationsReducer from "./features/notificationsSlice"
import websocketReducer from "./features/websocketSlice"
import websocketMiddleware from "./middleware/websocketMiddleware"

export const store = configureStore({
  reducer: {
    weather: weatherReducer,
    crypto: cryptoReducer,
    news: newsReducer,
    userPreferences: userPreferencesReducer,
    notifications: notificationsReducer,
    websocket: websocketReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: ["websocket/connected", "websocket/disconnected", "websocket/messageReceived"],
        // Ignore these field paths in all actions
        ignoredActionPaths: ["payload.socket", "meta.arg.socket"],
        // Ignore these paths in the state
        ignoredPaths: ["websocket.socket"],
      },
    }).concat(websocketMiddleware),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch


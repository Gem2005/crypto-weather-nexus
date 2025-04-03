import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

interface Notification {
  id: string
  type: "price_alert" | "weather_alert" | "system_error"
  title: string
  message: string
  timestamp: string
  read: boolean
}

interface NotificationsState {
  notifications: Notification[]
}

const initialState: NotificationsState = {
  notifications: [],
}

const notificationsSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    addNotification: (state, action: PayloadAction<Omit<Notification, "id" | "timestamp" | "read">>) => {
      const { type, title, message } = action.payload

      state.notifications.unshift({
        id: Date.now().toString(),
        type,
        title,
        message,
        timestamp: new Date().toISOString(),
        read: false,
      })

      // Limit to 20 notifications
      if (state.notifications.length > 20) {
        state.notifications = state.notifications.slice(0, 20)
      }
    },
    markNotificationAsRead: (state, action: PayloadAction<string>) => {
      const notification = state.notifications.find((n) => n.id === action.payload)
      if (notification) {
        notification.read = true
      }
    },
    markAllNotificationsAsRead: (state) => {
      state.notifications.forEach((notification) => {
        notification.read = true
      })
    },
    clearNotifications: (state) => {
      state.notifications = []
    },
  },
})

export const { addNotification, markNotificationAsRead, markAllNotificationsAsRead, clearNotifications } =
  notificationsSlice.actions

export default notificationsSlice.reducer


"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useSelector } from "react-redux"
import type { RootState } from "@/redux/store"
import { ModeToggle } from "./mode-toggle"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { useDispatch } from "react-redux"
import {
  markNotificationAsRead,
  markAllNotificationsAsRead,
  clearNotifications,
} from "@/redux/features/notificationsSlice"

export default function Navbar() {
  const pathname = usePathname()
  const dispatch = useDispatch()
  const { notifications } = useSelector((state: RootState) => state.notifications)
  const unreadCount = notifications.filter((n) => !n.read).length

  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold">
          CryptoWeather Nexus
        </Link>
        <nav className="hidden md:flex items-center space-x-6">
          <Link
            href="/"
            className={`text-sm font-medium transition-colors ${
              pathname === "/" ? "text-primary" : "text-muted-foreground hover:text-primary"
            }`}
          >
            Dashboard
          </Link>
        </nav>
        <div className="flex items-center space-x-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <Badge
                    className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
                    variant="destructive"
                  >
                    {unreadCount}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <div className="p-2 flex items-center justify-between border-b">
                <span className="font-medium">Notifications</span>
                {notifications.length > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 text-xs"
                    onClick={() => {
                      dispatch(markAllNotificationsAsRead())
                    }}
                  >
                    Mark all as read
                  </Button>
                )}
              </div>
              {notifications.length === 0 ? (
                <div className="p-4 text-center text-sm text-muted-foreground">No notifications</div>
              ) : (
                notifications.slice(0, 5).map((notification) => (
                  <DropdownMenuItem key={notification.id} className="p-3 cursor-default">
                    <div className="flex flex-col gap-1 w-full">
                      <div className="flex items-center justify-between">
                        <span className={`font-medium ${notification.read ? "text-muted-foreground" : ""}`}>
                          {notification.title}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {new Date(notification.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">{notification.message}</p>
                      <div className="flex justify-end gap-2 mt-1">
                        {!notification.read && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 text-xs"
                            onClick={(e) => {
                              e.stopPropagation()
                              dispatch(markNotificationAsRead(notification.id))
                            }}
                          >
                            Mark as read
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 text-xs text-destructive hover:text-destructive"
                          onClick={(e) => {
                            e.stopPropagation()
                            dispatch(clearNotifications())
                          }}
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  </DropdownMenuItem>
                ))
              )}
              {notifications.length > 5 && (
                <div className="p-2 text-center text-xs text-muted-foreground border-t">
                  + {notifications.length - 5} more notifications
                </div>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
          <ModeToggle />
        </div>
      </div>
    </header>
  )
}


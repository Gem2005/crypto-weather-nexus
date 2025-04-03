"use client"

import { useEffect } from "react"
import { useDispatch } from "react-redux"
import type { AppDispatch } from "@/redux/store"
import { fetchWeatherData } from "@/redux/features/weatherSlice"
import { fetchCryptoData } from "@/redux/features/cryptoSlice"
import { fetchNewsData } from "@/redux/features/newsSlice"
import { initializeWebSocket } from "@/redux/features/websocketSlice"
import WeatherSection from "./weather-section"
import CryptoSection from "./crypto-section"
import NewsSection from "./news-section"
import FavoritesSection from "./favorites-section"

export default function DashboardPage() {
  const dispatch = useDispatch<AppDispatch>()

  useEffect(() => {
    // Fetch initial data
    dispatch(fetchWeatherData())
    dispatch(fetchCryptoData())
    dispatch(fetchNewsData())

    // Initialize WebSocket connection
    dispatch(initializeWebSocket())

    // Set up periodic data refresh (every 60 seconds)
    const refreshInterval = setInterval(() => {
      dispatch(fetchWeatherData())
      dispatch(fetchCryptoData())
      dispatch(fetchNewsData())
    }, 60000)

    // Clean up on unmount
    return () => {
      clearInterval(refreshInterval)
    }
  }, [dispatch])

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Dashboard</h1>

      <FavoritesSection />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <WeatherSection />
        <CryptoSection />
      </div>

      <NewsSection />
    </div>
  )
}


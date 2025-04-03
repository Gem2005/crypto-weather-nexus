"use client"

import { useSelector, useDispatch } from "react-redux"
import type { RootState, AppDispatch } from "@/redux/store"
import { toggleCityFavorite } from "@/redux/features/userPreferencesSlice"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { Star, Cloud, Droplets, Wind, ExternalLink } from "lucide-react"
import Link from "next/link"

export default function WeatherSection() {
  const dispatch = useDispatch<AppDispatch>()
  const { cities, loading, error } = useSelector((state: RootState) => state.weather)
  const { favoriteCities } = useSelector((state: RootState) => state.userPreferences)

  const handleToggleFavorite = (cityId: number) => {
    dispatch(toggleCityFavorite(cityId))
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-72" />
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-32 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Weather</CardTitle>
          <CardDescription>Current weather conditions in major cities</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="p-6 text-center">
            <h3 className="text-lg font-medium mb-2">Error Loading Weather Data</h3>
            <p className="text-sm text-muted-foreground mb-4">{error}</p>
            <Button onClick={() => dispatch({ type: "weather/fetchWeatherData" })}>Retry</Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Weather</CardTitle>
        <CardDescription>Current weather conditions in major cities</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-4">
          {cities.map((city) => (
            <div key={city.id} className="flex flex-col p-4 border rounded-lg hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="text-lg font-medium">{city.name}</h3>
                  <p className="text-3xl font-bold">{city.temperature}°C</p>
                  <p className="text-sm text-muted-foreground">{city.description}</p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleToggleFavorite(Number(city.id))}
                    className={favoriteCities.includes(Number(city.id)) ? "text-yellow-500" : ""}
                  >
                    <Star className="h-5 w-5" fill={favoriteCities.includes(Number(city.id)) ? "currentColor" : "none"} />
                    <span className="sr-only">
                      {favoriteCities.includes(Number(city.id)) ? "Remove from favorites" : "Add to favorites"}
                    </span>
                  </Button>
                  <Link href={`/city/${city.id}`}>
                    <Button variant="ghost" size="icon">
                      <ExternalLink className="h-5 w-5" />
                      <span className="sr-only">View details</span>
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2 mt-2">
                <div className="flex items-center gap-1 text-sm">
                  <Cloud className="h-4 w-4 text-muted-foreground" />
                  <span>{city.clouds}%</span>
                </div>
                <div className="flex items-center gap-1 text-sm">
                  <Droplets className="h-4 w-4 text-muted-foreground" />
                  <span>{city.humidity}%</span>
                </div>
                <div className="flex items-center gap-1 text-sm">
                  <Wind className="h-4 w-4 text-muted-foreground" />
                  <span>{city.windSpeed} m/s</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}


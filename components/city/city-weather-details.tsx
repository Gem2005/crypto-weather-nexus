"use client"

import { Cloud, Droplets, Wind, Thermometer, Sunrise, Sunset } from "lucide-react"

interface CityWeatherDetailsProps {
  city: {
    id: number
    name: string
    temperature: number
    feelsLike?: number
    description: string
    humidity: number
    windSpeed?: number
    clouds?: number
    sunrise?: number
    sunset?: number
  }
}

export default function CityWeatherDetails({ city }: CityWeatherDetailsProps) {
  const formatTime = (timestamp: number | undefined) => {
    if (timestamp === undefined) return "N/A"
    const date = new Date(timestamp * 1000)
    return date.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" })
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-4 p-4 border rounded-lg">
          <Thermometer className="h-8 w-8 text-orange-500" />
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Feels Like</h3>
            <p className="text-2xl font-bold">{city.feelsLike}°C</p>
          </div>
        </div>
        <div className="flex items-center gap-4 p-4 border rounded-lg">
          <Droplets className="h-8 w-8 text-blue-500" />
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Humidity</h3>
            <p className="text-2xl font-bold">{city.humidity}%</p>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-4 p-4 border rounded-lg">
          <Wind className="h-8 w-8 text-gray-500" />
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Wind Speed</h3>
            <p className="text-2xl font-bold">{city.windSpeed} m/s</p>
          </div>
        </div>
        <div className="flex items-center gap-4 p-4 border rounded-lg">
          <Cloud className="h-8 w-8 text-gray-400" />
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Cloud Cover</h3>
            <p className="text-2xl font-bold">{city.clouds}%</p>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-4 p-4 border rounded-lg md:col-span-2">
        <div className="flex items-center gap-4 flex-1">
          <Sunrise className="h-8 w-8 text-yellow-500" />
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Sunrise</h3>
            <p className="text-xl font-bold">{formatTime(city.sunrise)}</p>
          </div>
        </div>
        <div className="flex items-center gap-4 flex-1">
          <Sunset className="h-8 w-8 text-orange-400" />
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Sunset</h3>
            <p className="text-xl font-bold">{formatTime(city.sunset)}</p>
          </div>
        </div>
      </div>
    </div>
  )
}


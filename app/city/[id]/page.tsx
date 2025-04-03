"use client"

import { useEffect } from "react"
import { useParams } from "next/navigation"
import { useDispatch, useSelector } from "react-redux"
import { fetchCityHistory } from "@/redux/features/weatherSlice"
import type { RootState, AppDispatch } from "@/redux/store"
import CityWeatherChart from "@/components/city/city-weather-chart"
import CityWeatherDetails from "@/components/city/city-weather-details"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function CityPage() {
  const { id } = useParams()
  const dispatch = useDispatch<AppDispatch>()
  const { cities, cityHistory, loading, error } = useSelector((state: RootState) => state.weather)
  const city = cities.find((city) => city.id.toString() === id)

  useEffect(() => {
    if (id) {
      dispatch(fetchCityHistory(id.toString()))
    }
  }, [dispatch, id])

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center">
          <Skeleton className="h-8 w-24 mr-2" />
          <Skeleton className="h-8 w-40" />
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-72" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-[300px] w-full" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-48" />
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-24 w-full" />
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh]">
        <h2 className="text-2xl font-bold mb-4">Error Loading City Data</h2>
        <p className="text-gray-500 mb-6">{error}</p>
        <Link href="/">
          <Button>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
        </Link>
      </div>
    )
  }

  if (!city) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh]">
        <h2 className="text-2xl font-bold mb-4">City Not Found</h2>
        <p className="text-gray-500 mb-6">The city you're looking for doesn't exist in our database.</p>
        <Link href="/">
          <Button>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <Link href="/">
          <Button variant="ghost" className="mr-2">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">{city.name} Weather Details</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Temperature History (Last 5 Days)</CardTitle>
          <CardDescription>Historical temperature data for {city.name}</CardDescription>
        </CardHeader>
        <CardContent>
          <CityWeatherChart cityHistory={cityHistory} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Detailed Weather Information</CardTitle>
        </CardHeader>
        <CardContent>
          <CityWeatherDetails city={city} />
        </CardContent>
      </Card>
    </div>
  )
}


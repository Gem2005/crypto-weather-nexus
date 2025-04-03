"use client"

import { useSelector } from "react-redux"
import type { RootState } from "@/redux/store"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"
import { ExternalLink } from "lucide-react"

export default function FavoritesSection() {
  const { favoriteCities, favoriteCryptos } = useSelector((state: RootState) => state.userPreferences)
  const { cities = [] } = useSelector((state: RootState) => state.weather)
  const { cryptos = [] } = useSelector((state: RootState) => state.crypto)

  // Use safe access to avoid filter on undefined
  const favoriteCitiesData = cities?.filter((city) => favoriteCities.includes(Number(city.id))) || []
  const favoriteCryptosData = cryptos?.filter((crypto) => favoriteCryptos.includes((crypto.id))) || []

  if (favoriteCitiesData.length === 0 && favoriteCryptosData.length === 0) {
    return null
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Favorites</CardTitle>
        <CardDescription>Your favorite cities and cryptocurrencies</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="cities" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="cities">Cities</TabsTrigger>
            <TabsTrigger value="cryptos">Cryptocurrencies</TabsTrigger>
          </TabsList>
          <TabsContent value="cities">
            {favoriteCitiesData.length === 0 ? (
              <p className="text-center py-4 text-muted-foreground">No favorite cities yet</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                {favoriteCitiesData.map((city) => (
                  <div key={city.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">{city.name}</h3>
                        <p className="text-2xl font-bold">{city.temperature}°C</p>
                        <p className="text-sm text-muted-foreground">{city.description}</p>
                      </div>
                      <Link href={`/city/${city.id}`}>
                        <ExternalLink className="h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
          <TabsContent value="cryptos">
            {favoriteCryptosData.length === 0 ? (
              <p className="text-center py-4 text-muted-foreground">No favorite cryptocurrencies yet</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                {favoriteCryptosData.map((crypto) => (
                  <div key={crypto.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-2">
                        {crypto.image && (
                          <img src={crypto.image || "/placeholder.svg"} alt={crypto.name} className="h-6 w-6" />
                        )}
                        <div>
                          <h3 className="font-medium">{crypto.name}</h3>
                          <p className="text-xl font-bold">
                            $
                            {crypto.currentPrice?.toLocaleString(undefined, {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            }) || '0.00'}
                          </p>
                          <p
                            className={`text-sm ${(crypto.priceChangePercentage24h || 0) >= 0 ? "text-green-500" : "text-red-500"}`}
                          >
                            {(crypto.priceChangePercentage24h || 0) >= 0 ? "+" : ""}
                            {(crypto.priceChangePercentage24h || 0).toFixed(2)}%
                          </p>
                        </div>
                      </div>
                      <Link href={`/crypto/${crypto.id}`}>
                        <ExternalLink className="h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}


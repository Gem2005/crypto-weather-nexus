"use client"

import { useSelector, useDispatch } from "react-redux"
import type { RootState, AppDispatch } from "@/redux/store"
import { toggleCryptoFavorite } from "@/redux/features/userPreferencesSlice"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { Star, TrendingDown, TrendingUp, ExternalLink } from "lucide-react"
import Link from "next/link"

export default function CryptoSection() {
  const dispatch = useDispatch<AppDispatch>()
  const { cryptos, loading, error } = useSelector((state: RootState) => state.crypto)
  const { favoriteCryptos } = useSelector((state: RootState) => state.userPreferences)

  const handleToggleFavorite = (cryptoId: string) => {
    dispatch(toggleCryptoFavorite(cryptoId))
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value)
  }

  const formatLargeNumber = (value: number) => {
    if (value >= 1e12) return (value / 1e12).toFixed(2) + "T"
    if (value >= 1e9) return (value / 1e9).toFixed(2) + "B"
    if (value >= 1e6) return (value / 1e6).toFixed(2) + "M"
    return value.toFixed(2)
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
          <CardTitle>Cryptocurrency</CardTitle>
          <CardDescription>Live cryptocurrency prices and market data</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="p-6 text-center">
            <h3 className="text-lg font-medium mb-2">Error Loading Cryptocurrency Data</h3>
            <p className="text-sm text-muted-foreground mb-4">{error}</p>
            <Button onClick={() => dispatch({ type: "crypto/fetchCryptoData" })}>Retry</Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Cryptocurrency</CardTitle>
        <CardDescription>Live cryptocurrency prices and market data</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-4">
          {cryptos.map((crypto) => (
            <div key={crypto.id} className="flex flex-col p-4 border rounded-lg hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <div className="flex items-center gap-2">
                    {crypto.image && (
                      <img src={crypto.image || "/placeholder.svg"} alt={crypto.name} className="h-6 w-6" />
                    )}
                    <h3 className="text-lg font-medium">{crypto.name}</h3>
                    <span className="text-sm text-muted-foreground">{crypto.symbol.toUpperCase()}</span>
                  </div>
                  <p className="text-2xl font-bold mt-1">{formatCurrency(crypto.currentPrice)}</p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleToggleFavorite(crypto.id)}
                    className={favoriteCryptos.includes(crypto.id) ? "text-yellow-500" : ""}
                  >
                    <Star className="h-5 w-5" fill={favoriteCryptos.includes(crypto.id) ? "currentColor" : "none"} />
                    <span className="sr-only">
                      {favoriteCryptos.includes(crypto.id) ? "Remove from favorites" : "Add to favorites"}
                    </span>
                  </Button>
                  <Link href={`/crypto/${crypto.id}`}>
                    <Button variant="ghost" size="icon">
                      <ExternalLink className="h-5 w-5" />
                      <span className="sr-only">View details</span>
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-2">
                <div className="flex flex-col">
                  <span className="text-sm text-muted-foreground">24h Change</span>
                  <div
                    className={`flex items-center ${crypto.priceChangePercentage24h >= 0 ? "text-green-500" : "text-red-500"}`}
                  >
                    {crypto.priceChangePercentage24h >= 0 ? (
                      <TrendingUp className="h-4 w-4 mr-1" />
                    ) : (
                      <TrendingDown className="h-4 w-4 mr-1" />
                    )}
                    <span>{crypto.priceChangePercentage24h.toFixed(2)}%</span>
                  </div>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm text-muted-foreground">Market Cap</span>
                  <span>${formatLargeNumber(crypto.marketCap)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}


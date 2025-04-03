"use client"

import { TrendingUp, TrendingDown, DollarSign, BarChart3, Activity } from "lucide-react"

interface CryptoMetricsProps {
  crypto: {
    id: string
    name: string
    symbol: string
    currentPrice: number
    marketCap: number
    totalVolume: number
    high24h: number
    low24h: number
    priceChangePercentage24h: number
    priceChangePercentage7d?: number
    priceChangePercentage30d?: number
  }
}

export default function CryptoMetrics({ crypto }: CryptoMetricsProps) {
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

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="flex items-center gap-4 p-4 border rounded-lg">
        <DollarSign className="h-8 w-8 text-green-500" />
        <div>
          <h3 className="text-sm font-medium text-muted-foreground">Market Cap</h3>
          <p className="text-xl font-bold">${formatLargeNumber(crypto.marketCap)}</p>
        </div>
      </div>
      <div className="flex items-center gap-4 p-4 border rounded-lg">
        <BarChart3 className="h-8 w-8 text-blue-500" />
        <div>
          <h3 className="text-sm font-medium text-muted-foreground">24h Volume</h3>
          <p className="text-xl font-bold">${formatLargeNumber(crypto.totalVolume)}</p>
        </div>
      </div>
      <div className="flex items-center gap-4 p-4 border rounded-lg">
        <Activity className="h-8 w-8 text-purple-500" />
        <div>
          <h3 className="text-sm font-medium text-muted-foreground">24h Range</h3>
          <p className="text-xl font-bold">
            {formatCurrency(crypto.low24h)} - {formatCurrency(crypto.high24h)}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4 p-4 border rounded-lg">
        <div
          className={`h-8 w-8 flex items-center justify-center rounded-full ${crypto.priceChangePercentage24h >= 0 ? "bg-green-100 text-green-500" : "bg-red-100 text-red-500"}`}
        >
          {crypto.priceChangePercentage24h >= 0 ? (
            <TrendingUp className="h-5 w-5" />
          ) : (
            <TrendingDown className="h-5 w-5" />
          )}
        </div>
        <div>
          <h3 className="text-sm font-medium text-muted-foreground">24h Change</h3>
          <p
            className={`text-xl font-bold ${crypto.priceChangePercentage24h >= 0 ? "text-green-500" : "text-red-500"}`}
          >
            {crypto.priceChangePercentage24h >= 0 ? "+" : ""}
            {crypto.priceChangePercentage24h.toFixed(2)}%
          </p>
        </div>
      </div>

      {crypto.priceChangePercentage7d !== undefined && (
        <div className="flex items-center gap-4 p-4 border rounded-lg">
          <div
            className={`h-8 w-8 flex items-center justify-center rounded-full ${crypto.priceChangePercentage7d >= 0 ? "bg-green-100 text-green-500" : "bg-red-100 text-red-500"}`}
          >
            {crypto.priceChangePercentage7d >= 0 ? (
              <TrendingUp className="h-5 w-5" />
            ) : (
              <TrendingDown className="h-5 w-5" />
            )}
          </div>
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">7d Change</h3>
            <p
              className={`text-xl font-bold ${crypto.priceChangePercentage7d >= 0 ? "text-green-500" : "text-red-500"}`}
            >
              {crypto.priceChangePercentage7d >= 0 ? "+" : ""}
              {crypto.priceChangePercentage7d.toFixed(2)}%
            </p>
          </div>
        </div>
      )}

      {crypto.priceChangePercentage30d !== undefined && (
        <div className="flex items-center gap-4 p-4 border rounded-lg">
          <div
            className={`h-8 w-8 flex items-center justify-center rounded-full ${crypto.priceChangePercentage30d >= 0 ? "bg-green-100 text-green-500" : "bg-red-100 text-red-500"}`}
          >
            {crypto.priceChangePercentage30d >= 0 ? (
              <TrendingUp className="h-5 w-5" />
            ) : (
              <TrendingDown className="h-5 w-5" />
            )}
          </div>
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">30d Change</h3>
            <p
              className={`text-xl font-bold ${crypto.priceChangePercentage30d >= 0 ? "text-green-500" : "text-red-500"}`}
            >
              {crypto.priceChangePercentage30d >= 0 ? "+" : ""}
              {crypto.priceChangePercentage30d.toFixed(2)}%
            </p>
          </div>
        </div>
      )}
    </div>
  )
}


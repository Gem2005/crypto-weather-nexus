"use client"

interface CryptoDetailsHeaderProps {
  crypto: {
    id: string
    name: string
    symbol: string
    image?: string
    currentPrice: number
    priceChangePercentage24h: number
  }
}

export default function CryptoDetailsHeader({ crypto }: CryptoDetailsHeaderProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value)
  }

  return (
    <div className="flex items-center">
      <div className="flex items-center gap-3">
        {crypto.image && <img src={crypto.image || "/placeholder.svg"} alt={crypto.name} className="h-10 w-10" />}
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            {crypto.name}
            <span className="text-lg text-muted-foreground font-normal">{crypto.symbol.toUpperCase()}</span>
          </h1>
          <div className="flex items-center gap-2">
            <span className="text-xl font-semibold">{formatCurrency(crypto.currentPrice)}</span>
            <span className={`text-sm ${crypto.priceChangePercentage24h >= 0 ? "text-green-500" : "text-red-500"}`}>
              {crypto.priceChangePercentage24h >= 0 ? "+" : ""}
              {crypto.priceChangePercentage24h.toFixed(2)}%
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}


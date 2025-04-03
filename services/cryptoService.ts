// Predefined cryptocurrencies to fetch data for
export const CRYPTO_IDS = [
  { id: "bitcoin", name: "Bitcoin", symbol: "btc" },
  { id: "ethereum", name: "Ethereum", symbol: "eth" },
  { id: "solana", name: "Solana", symbol: "sol" },
]

export interface CoinGeckoResponse {
  id: string
  symbol: string
  name: string
  image: string
  current_price: number
  market_cap: number
  market_cap_rank: number
  fully_diluted_valuation: number
  total_volume: number
  high_24h: number
  low_24h: number
  price_change_24h: number
  price_change_percentage_24h: number
  price_change_percentage_7d_in_currency?: number
  price_change_percentage_30d_in_currency?: number
  market_cap_change_24h: number
  market_cap_change_percentage_24h: number
  circulating_supply: number
  total_supply: number
  max_supply: number
  ath: number
  ath_change_percentage: number
  ath_date: string
  atl: number
  atl_change_percentage: number
  atl_date: string
  last_updated: string
}

export interface CoinGeckoHistoryResponse {
  prices: [number, number][]
  market_caps: [number, number][]
  total_volumes: [number, number][]
}

export async function fetchCryptoData() {
  const ids = CRYPTO_IDS.map((crypto) => crypto.id).join(",")

  const response = await fetch(
    `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${ids}&order=market_cap_desc&per_page=100&page=1&sparkline=false&price_change_percentage=24h,7d,30d&x_cg_api_key=${process.env.NEXT_PUBLIC_COINGECKO_API_KEY}`,
  )

  if (!response.ok) {
    throw new Error("Failed to fetch cryptocurrency data")
  }

  const data: CoinGeckoResponse[] = await response.json()

  return data.map((crypto) => ({
    id: crypto.id,
    name: crypto.name,
    symbol: crypto.symbol,
    image: crypto.image,
    currentPrice: crypto.current_price,
    marketCap: crypto.market_cap,
    totalVolume: crypto.total_volume,
    high24h: crypto.high_24h,
    low24h: crypto.low_24h,
    priceChangePercentage24h: crypto.price_change_percentage_24h,
    priceChangePercentage7d: crypto.price_change_percentage_7d_in_currency,
    priceChangePercentage30d: crypto.price_change_percentage_30d_in_currency,
  }))
}

export async function fetchCryptoDetails(cryptoId: string) {
  const response = await fetch(
    `https://api.coingecko.com/api/v3/coins/${cryptoId}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=false&x_cg_api_key=${process.env.NEXT_PUBLIC_COINGECKO_API_KEY}`,
  )

  if (!response.ok) {
    throw new Error("Failed to fetch cryptocurrency details")
  }

  const data = await response.json()

  return {
    id: data.id,
    name: data.name,
    symbol: data.symbol,
    image: data.image.large,
    currentPrice: data.market_data.current_price.usd,
    marketCap: data.market_data.market_cap.usd,
    totalVolume: data.market_data.total_volume.usd,
    high24h: data.market_data.high_24h.usd,
    low24h: data.market_data.low_24h.usd,
    priceChangePercentage24h: data.market_data.price_change_percentage_24h,
    priceChangePercentage7d: data.market_data.price_change_percentage_7d,
    priceChangePercentage30d: data.market_data.price_change_percentage_30d,
  }
}

export async function fetchCryptoHistory(cryptoId: string) {
  // Get 7 days of historical data
  const response = await fetch(
    `https://api.coingecko.com/api/v3/coins/${cryptoId}/market_chart?vs_currency=usd&days=7&x_cg_api_key=${process.env.NEXT_PUBLIC_COINGECKO_API_KEY}`,
  )

  if (!response.ok) {
    throw new Error("Failed to fetch cryptocurrency history")
  }

  const data: CoinGeckoHistoryResponse = await response.json()

  // Take one data point per day
  const dailyData = data.prices.filter((_, index) => index % 24 === 0)

  return dailyData.map(([timestamp, price]) => ({
    date: new Date(timestamp).toISOString(),
    price: price,
  }))
}


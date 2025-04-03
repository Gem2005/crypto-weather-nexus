"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Chart, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Area, AreaChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from "recharts"
import { fetchCryptoHistory } from "@/redux/features/cryptoSlice"
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from '@/redux/store';

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

interface CryptoPriceChartProps {
  cryptoHistory: {
    date: string
    price: number
  }[]
  cryptoId?: string // Optional prop to fetch data directly in the component
}

export default function CryptoPriceChart({ cryptoHistory, cryptoId }: CryptoPriceChartProps) {
  const dispatch = useAppDispatch()
  const [isLoading, setIsLoading] = useState(false)
  const [localData, setLocalData] = useState<{date: string, price: number}[]>([])
  
  // If cryptoId is provided, fetch data directly
  useEffect(() => {
    if (cryptoId && cryptoHistory.length === 0) {
      setIsLoading(true)
      dispatch(fetchCryptoHistory(cryptoId))
        .unwrap()
        .then((data) => {
          setLocalData(data)
          setIsLoading(false)
        })
        .catch(() => {
          setIsLoading(false)
        })
    } else if (cryptoHistory.length > 0) {
      setLocalData(cryptoHistory)
    }
  }, [cryptoId, cryptoHistory, dispatch])
  
  // Choose which data to display - either passed through props or fetched locally
  const displayData = cryptoHistory.length > 0 ? cryptoHistory : localData
  
  // Show loading state
  if (isLoading) {
    return (
      <Card className="p-6 text-center">
        <p className="text-muted-foreground">Loading chart data...</p>
      </Card>
    )
  }
  
  // If no data is available
  if (!displayData || displayData.length === 0) {
    return (
      <Card className="p-6 text-center">
        <p className="text-muted-foreground">No historical data available</p>
      </Card>
    )
  }

  // Ensure data is properly formatted with valid dates and numeric prices
  const formattedData = displayData.map(item => ({
    date: item.date,
    price: typeof item.price === 'number' ? item.price : parseFloat(String(item.price))
  })).filter(item => !isNaN(item.price) && item.date);

  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr)
      return date.toLocaleDateString(undefined, { month: "short", day: "numeric" })
    } catch (e) {
      console.error("Error formatting date:", dateStr, e);
      return dateStr;
    }
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value)
  }

  // If after filtering we have no valid data, show error message
  if (formattedData.length === 0) {
    return (
      <Card className="p-6 text-center">
        <p className="text-muted-foreground">Invalid historical data format</p>
      </Card>
    )
  }

  return (
    <div className="w-full h-[300px]">
      <ChartContainer>
        <Chart>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={formattedData}
              margin={{
                top: 10,
                right: 30,
                left: 0,
                bottom: 0,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis 
                dataKey="date" 
                tickFormatter={formatDate} 
                className="text-xs text-muted-foreground"
                tick={{ fontSize: 12 }}
              />
              <YAxis
                domain={["auto", "auto"]}
                className="text-xs text-muted-foreground"
                tickFormatter={formatCurrency}
                tick={{ fontSize: 12 }}
                width={80}
              />
              <Tooltip content={<CustomTooltip />} />
              <defs>
                <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                </linearGradient>
              </defs>
              <Area 
                type="monotone" 
                dataKey="price" 
                stroke="#8884d8" 
                strokeWidth={2}
                fillOpacity={1} 
                fill="url(#colorPrice)" 
                isAnimationActive={true}
              />
            </AreaChart>
          </ResponsiveContainer>
        </Chart>
      </ChartContainer>
    </div>
  )
}

function CustomTooltip({ active, payload, label }: any) {
  if (active && payload && payload.length) {
    try {
      return (
        <ChartTooltip>
          <ChartTooltipContent>
            <div className="text-sm font-medium">{new Date(label).toLocaleDateString()}</div>
            <div className="flex items-center gap-1 mt-1">
              <div className="h-2 w-2 rounded-full bg-[#8884d8]" />
              <span className="text-xs">
                Price:{" "}
                {new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: "USD",
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                }).format(payload[0].value)}
              </span>
            </div>
          </ChartTooltipContent>
        </ChartTooltip>
      )
    } catch (e) {
      console.error("Error rendering tooltip:", e);
      return null;
    }
  }

  return null
}


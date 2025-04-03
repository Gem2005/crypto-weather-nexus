"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Chart, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Area, AreaChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from "recharts"
import { fetchCryptoHistory } from "@/services/cryptoService"; // Correct import for fetchCryptoHistory
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

// Mock data for development and fallback
const MOCK_DATA = [
  { date: new Date(Date.now() - 6 * 86400000).toISOString(), price: 45000 },
  { date: new Date(Date.now() - 5 * 86400000).toISOString(), price: 46200 },
  { date: new Date(Date.now() - 4 * 86400000).toISOString(), price: 47500 },
  { date: new Date(Date.now() - 3 * 86400000).toISOString(), price: 46800 },
  { date: new Date(Date.now() - 2 * 86400000).toISOString(), price: 48000 },
  { date: new Date(Date.now() - 1 * 86400000).toISOString(), price: 49200 },
  { date: new Date().toISOString(), price: 50000 },
];

export default function CryptoPriceChart({ cryptoHistory = [], cryptoId }: CryptoPriceChartProps) {
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [localData, setLocalData] = useState<{date: string, price: number}[]>([]);
  const [error, setError] = useState<string | null>(null);
  
  
  // If cryptoId is provided, fetch data directly
  useEffect(() => {
    async function loadData() {
      if (!cryptoId) return;
      
      try {
        setIsLoading(true);
        setError(null);
        
        console.log("Fetching data for cryptoId:", cryptoId);
        const data = await fetchCryptoHistory(cryptoId);
        console.log("Fetched crypto history data:", data);
        
        if (data && data.length > 0) {
          setLocalData(data);
        } else {
          console.warn("No data points returned from API, using mock data");
          setLocalData(MOCK_DATA);
        }
      } catch (err) {
        console.error("Error fetching crypto history:", err);
        setError(err instanceof Error ? err.message : "Failed to fetch data");
        // Use mock data on error for development purposes
        console.log("Using mock data due to fetch error");
        setLocalData(MOCK_DATA);
      } finally {
        setIsLoading(false);
      }
    }

    if (cryptoId && cryptoHistory.length === 0) {
      loadData();
    } else if (cryptoHistory.length > 0) {
      console.log("Using provided cryptoHistory data:", cryptoHistory);
      setLocalData(cryptoHistory);
    } else {
      // No crypto ID and no history provided, use mock data
      console.log("No crypto data source available, using mock data");
      setLocalData(MOCK_DATA);
    }
  }, [cryptoId, cryptoHistory]);
  
  // Choose which data to display - either passed through props or fetched locally
  const displayData = cryptoHistory.length > 0 ? cryptoHistory : localData;
  
  // Debug the display data
  useEffect(() => {
    console.log("displayData for chart:", displayData);
  }, [displayData]);
  
  // Show loading state
  if (isLoading) {
    return (
      <Card className="p-6 text-center">
        <p className="text-muted-foreground">Loading chart data...</p>
      </Card>
    );
  }
  
  // Show error state
  if (error) {
    return (
      <Card className="p-6 text-center">
        <p className="text-destructive">Error: {error}</p>
      </Card>
    );
  }
  
  // If no data is available
  if (!displayData || displayData.length === 0) {
    return (
      <Card className="p-6 text-center">
        <p className="text-muted-foreground">
          {cryptoId ? `No historical data available for ${cryptoId}` : "No historical data available"}
        </p>
      </Card>
    );
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
                minTickGap={30}
              />
              <YAxis
                domain={["auto", "auto"]}
                className="text-xs text-muted-foreground"
                tickFormatter={formatCurrency}
                tick={{ fontSize: 12 }}
                width={80}
                allowDecimals={false}
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
                isAnimationActive={false} // Disable animation to troubleshoot
              />
            </AreaChart>
          </ResponsiveContainer>
        </Chart>
      </ChartContainer>
      {/* Debug info */}
      <div className="text-xs text-muted-foreground mt-2">
        {formattedData.length} data points | ID: {cryptoId || "none"}
      </div>
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


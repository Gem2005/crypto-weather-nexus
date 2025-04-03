"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import {
  Chart,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendItem,
} from "@/components/ui/chart"
import { Line, LineChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from "recharts"

interface CityWeatherChartProps {
  cityHistory: {
    date: string
    temperature: number
    humidity: number
  }[]
}

// Improved fallback data with current dates
const generateFallbackData = () => {
  const now = new Date();
  return Array.from({ length: 7 }).map((_, i) => {
    const date = new Date();
    date.setDate(now.getDate() - (6 - i)); // Last 7 days
    return {
      date: date.toISOString(),
      temperature: Math.round(15 + Math.random() * 10), // 15-25°C
      humidity: Math.round(50 + Math.random() * 40), // 50-90%
    };
  });
};

export default function CityWeatherChart({ cityHistory }: CityWeatherChartProps) {
  const [chartData, setChartData] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  
  // Process input data or use fallback
  useEffect(() => {
    console.log("CityWeatherChart received data:", cityHistory);
    
    try {
      if (cityHistory && cityHistory.length > 0) {
        // Validate the data format
        const validData = cityHistory.filter(item => 
          item.date && 
          typeof item.temperature === 'number' && 
          typeof item.humidity === 'number' && 
          !isNaN(new Date(item.date).getTime())
        );
        
        if (validData.length > 0) {
          console.log("Using provided city weather data:", validData);
          setChartData(validData);
        } else {
          console.log("Provided data invalid, using fallback data");
          setChartData(generateFallbackData());
        }
      } else {
        console.log("No history data provided, using fallback data");
        setChartData(generateFallbackData());
      }
    } catch (err) {
      console.error("Error processing weather chart data:", err);
      setError("Failed to process chart data");
      setChartData(generateFallbackData());
    }
  }, [cityHistory]);
  
  // Show error state if needed
  if (error) {
    return (
      <Card className="p-4 text-center">
        <p className="text-destructive">{error}</p>
      </Card>
    );
  }

  // Make sure we have data to display
  if (chartData.length === 0) {
    return (
      <Card className="p-4 text-center">
        <p className="text-muted-foreground">Loading weather data...</p>
      </Card>
    );
  }

  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      // Check if the date is valid
      if (isNaN(date.getTime())) {
        return "Invalid Date";
      }
      return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
    } catch (error) {
      console.error("Error parsing date:", dateStr, error);
      return "Invalid Date";
    }
  }

  return (
    <div className="w-full h-[300px]">
      <ChartContainer>
        <Chart>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{
                top: 5,
                right: 30,
                left: 10,
                bottom: 0,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis 
                dataKey="date" 
                tickFormatter={formatDate} 
                className="text-xs text-muted-foreground"
                minTickGap={30}
              />
              <YAxis
                yAxisId="temperature"
                orientation="left"
                domain={["auto", "auto"]}
                className="text-xs text-muted-foreground"
                tickFormatter={(value) => `${value}°C`}
                width={60}
              />
              <YAxis
                yAxisId="humidity"
                orientation="right"
                domain={[0, 100]}
                className="text-xs text-muted-foreground"
                tickFormatter={(value) => `${value}%`}
                width={50}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line
                yAxisId="temperature"
                type="monotone"
                dataKey="temperature"
                stroke="#f97316"
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
                isAnimationActive={false}
              />
              <Line
                yAxisId="humidity"
                type="monotone"
                dataKey="humidity"
                stroke="#0ea5e9"
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
                isAnimationActive={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </Chart>
        <ChartLegend className="mt-4 justify-center">
          <ChartLegendItem name="Temperature" color="#f97316" />
          <ChartLegendItem name="Humidity" color="#0ea5e9" />
        </ChartLegend>
        {/* Debug info */}
        <div className="text-xs text-muted-foreground mt-2 text-center">
          Showing {chartData.length} data points
        </div>
      </ChartContainer>
    </div>
  )
}

function CustomTooltip({ active, payload, label }: any) {
  if (active && payload && payload.length) {
    let displayDate;
    try {
      displayDate = new Date(label).toLocaleDateString();
      if (displayDate === "Invalid Date") {
        displayDate = label;
      }
    } catch (error) {
      displayDate = label;
    }
    
    return (
      <ChartTooltip>
        <ChartTooltipContent>
          <div className="text-sm font-medium">{displayDate}</div>
          <div className="flex flex-col gap-1 mt-1">
            <div className="flex items-center gap-1">
              <div className="h-2 w-2 rounded-full bg-[#f97316]" />
              <span className="text-xs">Temperature: {payload[0].value}°C</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="h-2 w-2 rounded-full bg-[#0ea5e9]" />
              <span className="text-xs">Humidity: {payload[1].value}%</span>
            </div>
          </div>
        </ChartTooltipContent>
      </ChartTooltip>
    )
  }

  return null
}


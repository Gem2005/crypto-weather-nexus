"use client"

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

export default function CityWeatherChart({ cityHistory }: CityWeatherChartProps) {
  // Create fallback data if no historical data is available or for development testing
  const fallbackData = [
    { date: "2025-04-03T00:00:00.000Z", temperature: 18, humidity: 65 },
    { date: "2025-04-02T00:00:00.000Z", temperature: 20, humidity: 62 },
    { date: "2025-04-01T00:00:00.000Z", temperature: 17, humidity: 70 },
    { date: "2025-03-31T00:00:00.000Z", temperature: 16, humidity: 75 },
    { date: "2025-03-30T00:00:00.000Z", temperature: 19, humidity: 68 },
  ];
  
  // Use real data if available, otherwise use fallback data
  const dataToUse = cityHistory && cityHistory.length > 0 ? cityHistory : fallbackData;

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
              data={dataToUse}
              margin={{
                top: 5,
                right: 10,
                left: 10,
                bottom: 0,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="date" tickFormatter={formatDate} className="text-xs text-muted-foreground" />
              <YAxis
                yAxisId="temperature"
                orientation="left"
                domain={["auto", "auto"]}
                className="text-xs text-muted-foreground"
                tickFormatter={(value) => `${value}°C`}
              />
              <YAxis
                yAxisId="humidity"
                orientation="right"
                domain={[0, 100]}
                className="text-xs text-muted-foreground"
                tickFormatter={(value) => `${value}%`}
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
              />
              <Line
                yAxisId="humidity"
                type="monotone"
                dataKey="humidity"
                stroke="#0ea5e9"
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </Chart>
        <ChartLegend className="mt-4 justify-center">
          <ChartLegendItem name="Temperature" color="#f97316" />
          <ChartLegendItem name="Humidity" color="#0ea5e9" />
        </ChartLegend>
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


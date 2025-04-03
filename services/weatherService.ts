// Map of city IDs to coordinates for OpenWeatherMap API
const CITY_COORDINATES = {
  5128581: { lat: 40.7143, lon: -74.006, name: "New York" }, // New York
  2643743: { lat: 51.5085, lon: -0.1257, name: "London" }, // London
  1850147: { lat: 35.6895, lon: 139.6917, name: "Tokyo" }, // Tokyo
}

export type CityId = 5128581 | 2643743 | 1850147

export interface WeatherResponse {
  coord: {
    lon: number
    lat: number
  }
  weather: {
    id: number
    main: string
    description: string
    icon: string
  }[]
  base: string
  main: {
    temp: number
    feels_like: number
    temp_min: number
    temp_max: number
    pressure: number
    humidity: number
  }
  visibility: number
  wind: {
    speed: number
    deg: number
  }
  clouds: {
    all: number
  }
  dt: number
  sys: {
    type: number
    id: number
    country: string
    sunrise: number
    sunset: number
  }
  timezone: number
  id: number
  name: string
  cod: number
}

export interface WeatherHistoryResponse {
  list: {
    dt: number
    main: {
      temp: number
      feels_like: number
      temp_min: number
      temp_max: number
      pressure: number
      humidity: number
    }
    weather: {
      id: number
      main: string
      description: string
      icon: string
    }[]
  }[]
}

export async function fetchCityWeather(cityId: CityId) {
  const { lat, lon, name } = CITY_COORDINATES[cityId]

  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY}`,
  )

  if (!response.ok) {
    throw new Error("Failed to fetch weather data")
  }

  const data: WeatherResponse = await response.json()

  return {
    id: cityId,
    name: name,
    temperature: Math.round(data.main.temp),
    feelsLike: Math.round(data.main.feels_like),
    description: data.weather[0].description,
    humidity: data.main.humidity,
    windSpeed: data.wind.speed,
    clouds: data.clouds.all,
    sunrise: data.sys.sunrise,
    sunset: data.sys.sunset,
  }
}

export async function fetchCityWeatherHistory(cityId: CityId) {
  const { lat, lon } = CITY_COORDINATES[cityId]

  // Get 5 days of historical data using the 5 day / 3 hour forecast API
  // Since OpenWeatherMap doesn't provide free historical data, we'll use the forecast API
  // and pretend it's historical data for the demo
  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY}`,
  )

  if (!response.ok) {
    throw new Error("Failed to fetch weather history")
  }

  const data: WeatherHistoryResponse = await response.json()

  // Take one data point per day (every 8th item is roughly 24 hours)
  const dailyData = data.list.filter((_, index) => index % 8 === 0).slice(0, 5)

  return dailyData.map((item) => ({
    date: new Date(item.dt * 1000).toISOString(),
    temperature: Math.round(item.main.temp),
    humidity: item.main.humidity,
  }))
}


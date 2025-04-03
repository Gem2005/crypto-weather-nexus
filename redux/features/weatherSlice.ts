import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { CityId, fetchCityWeather, fetchCityWeatherHistory } from "@/services/weatherService";

// Define proper interfaces for your state
interface City {
  id: CityId;
  name: string;
  temperature: number;
  description: string;
  icon?: string;
  humidity: number;
  windSpeed: number;
  country?: string;
  clouds: number;
  sunrise: number;
  sunset: number;
  feelsLike?: number;
}

interface WeatherHistoryItem {
  date: string;
  temperature: number;
  humidity: number;
}

interface WeatherState {
  currentWeather: City | null;
  cityHistory: WeatherHistoryItem[];
  cities: City[];
  loading: boolean;
  error: string | null;
}

const initialState: WeatherState = {
  currentWeather: null,
  cityHistory: [],
  cities: [],
  loading: false,
  error: null,
};

// Create thunk for fetching data for default cities
export const fetchWeatherData = createAsyncThunk(
  "weather/fetchWeatherData",
  async (_, { dispatch }) => {
    // Default cities to fetch weather for using IDs
    const defaultCityIds: CityId[] = [5128581, 2643743, 1850147]; // New York, London, Tokyo
    
    // Fetch weather for multiple cities
    const results = await Promise.all(
      defaultCityIds.map(async (cityId) => {
        try {
          return await fetchCityWeather(cityId);
        } catch (error) {
          console.error(`Error fetching weather for city ID ${cityId}:`, error);
          return null;
        }
      })
    );
    
    // Filter out failed requests
    return results.filter(Boolean);
  }
);

// Updated thunk to use city ID instead of name
export const fetchCityWeatherById = createAsyncThunk(
  "weather/fetchCityWeatherById",
  async (cityId: CityId) => {
    return await fetchCityWeather(cityId);
  }
);

// Updated history thunk to use city ID
export const fetchCityHistoryById = createAsyncThunk(
  "weather/fetchCityHistoryById",
  async (cityId: CityId) => {
    return await fetchCityWeatherHistory(cityId);
  }
);

const weatherSlice = createSlice({
  name: "weather",
  initialState,
  reducers: {
    addCity: (state, action: PayloadAction<City>) => {
      // Check if city already exists, replace it if it does
      const cityIndex = state.cities.findIndex(city => city.id === action.payload.id);
      if (cityIndex >= 0) {
        state.cities[cityIndex] = action.payload;
      } else {
        state.cities.push(action.payload);
      }
    },
    updateWeather: (state, action: PayloadAction<City>) => {
      state.currentWeather = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Handle fetchWeatherData thunk
      .addCase(fetchWeatherData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWeatherData.fulfilled, (state, action) => {
        state.loading = false;
        // The processed cities will come directly from the service
        state.cities = action.payload as City[];
      })
      .addCase(fetchWeatherData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch weather data";
      })
    
      // Handle fetchCityWeatherById thunk
      .addCase(fetchCityWeatherById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCityWeatherById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentWeather = action.payload as City;
        
        // Also add to cities array
        if (action.payload) {
          const newCity = action.payload as City;
          
          // Check if city already exists, replace it if it does
          const cityIndex = state.cities.findIndex(city => city.id === newCity.id);
          if (cityIndex >= 0) {
            state.cities[cityIndex] = newCity;
          } else {
            state.cities.push(newCity);
          }
        }
      })
      .addCase(fetchCityWeatherById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch city weather";
      })
      
      // Handle fetchCityHistoryById thunk
      .addCase(fetchCityHistoryById.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCityHistoryById.fulfilled, (state, action) => {
        state.loading = false;
        state.cityHistory = action.payload as WeatherHistoryItem[];
      })
      .addCase(fetchCityHistoryById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch forecast";
      });
  },
});

export const { addCity, updateWeather } = weatherSlice.actions;
export default weatherSlice.reducer;

// Keep the old functions for backward compatibility, but they'll be deprecated
export const fetchCityWeatherByName = createAsyncThunk(
  "weather/fetchCityWeatherByName",
  async (cityName: string) => {
    console.warn("fetchCityWeatherByName is deprecated, use fetchCityWeatherById instead");
    // Map city names to IDs (simplified approach)
    const cityNameToId: Record<string, CityId> = {
      "New York": 5128581,
      "London": 2643743,
      "Tokyo": 1850147,
    };
    
    const cityId = cityNameToId[cityName];
    if (!cityId) {
      throw new Error(`City "${cityName}" is not supported`);
    }
    
    return await fetchCityWeather(cityId);
  }
);

export const fetchCityHistory = createAsyncThunk(
  "weather/fetchCityHistory",
  async (cityName: string) => {
    console.warn("fetchCityHistory is deprecated, use fetchCityHistoryById instead");
    // Map city names to IDs (simplified approach)
    const cityNameToId: Record<string, CityId> = {
      "New York": 5128581,
      "London": 2643743,
      "Tokyo": 1850147,
    };
    
    const cityId = cityNameToId[cityName];
    if (!cityId) {
      throw new Error(`City "${cityName}" is not supported`);
    }
    
    return await fetchCityWeatherHistory(cityId);
  }
);


import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

interface UserPreferencesState {
  favoriteCities: number[]
  favoriteCryptos: string[]
}

// Initialize state from localStorage if available
const loadInitialState = (): UserPreferencesState => {
  if (typeof window !== "undefined") {
    const savedFavoriteCities = localStorage.getItem("favoriteCities")
    const savedFavoriteCryptos = localStorage.getItem("favoriteCryptos")

    return {
      favoriteCities: savedFavoriteCities ? JSON.parse(savedFavoriteCities) : [],
      favoriteCryptos: savedFavoriteCryptos ? JSON.parse(savedFavoriteCryptos) : [],
    }
  }

  return {
    favoriteCities: [],
    favoriteCryptos: [],
  }
}

const initialState: UserPreferencesState = loadInitialState()

const userPreferencesSlice = createSlice({
  name: "userPreferences",
  initialState,
  reducers: {
    toggleCityFavorite: (state, action: PayloadAction<number>) => {
      const cityId = action.payload
      const index = state.favoriteCities.indexOf(cityId)

      if (index === -1) {
        state.favoriteCities.push(cityId)
      } else {
        state.favoriteCities.splice(index, 1)
      }

      // Save to localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem("favoriteCities", JSON.stringify(state.favoriteCities))
      }
    },
    toggleCryptoFavorite: (state, action: PayloadAction<string>) => {
      const cryptoId = action.payload
      const index = state.favoriteCryptos.indexOf(cryptoId)

      if (index === -1) {
        state.favoriteCryptos.push(cryptoId)
      } else {
        state.favoriteCryptos.splice(index, 1)
      }

      // Save to localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem("favoriteCryptos", JSON.stringify(state.favoriteCryptos))
      }
    },
  },
})

export const { toggleCityFavorite, toggleCryptoFavorite } = userPreferencesSlice.actions
export default userPreferencesSlice.reducer


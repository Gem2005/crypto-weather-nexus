import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit"
import {
  fetchCryptoData as fetchCryptoDataService,
  fetchCryptoDetails as fetchCryptoDetailsService,
  fetchCryptoHistory as fetchCryptoHistoryService,
} from "@/services/cryptoService"

interface Crypto {
  id: string
  name: string
  symbol: string
  image?: string
  currentPrice: number
  marketCap: number
  totalVolume: number
  high24h: number
  low24h: number
  priceChangePercentage24h: number
  priceChangePercentage7d?: number
  priceChangePercentage30d?: number
}

interface CryptoHistoryItem {
  date: string
  price: number
}

interface CryptoState {
  cryptos: Crypto[]
  selectedCrypto: Crypto | null
  cryptoHistory: CryptoHistoryItem[]
  loading: boolean
  error: string | null
}

const initialState: CryptoState = {
  cryptos: [],
  selectedCrypto: null,
  cryptoHistory: [],
  loading: false,
  error: null,
}

export const fetchCryptoData = createAsyncThunk("crypto/fetchCryptoData", async (_, { rejectWithValue }) => {
  try {
    return await fetchCryptoDataService()
  } catch (error) {
    return rejectWithValue("Failed to fetch cryptocurrency data. Please try again later.")
  }
})

export const fetchCryptoDetails = createAsyncThunk(
  "crypto/fetchCryptoDetails",
  async (cryptoId: string, { rejectWithValue }) => {
    try {
      return await fetchCryptoDetailsService(cryptoId)
    } catch (error) {
      return rejectWithValue("Failed to fetch cryptocurrency details. Please try again later.")
    }
  },
)

export  const fetchCryptoHistory = createAsyncThunk(
  "crypto/fetchCryptoHistory",
  async (cryptoId: string, { rejectWithValue }) => {
    try {
      return await fetchCryptoHistoryService(cryptoId)
    } catch (error) {
      return rejectWithValue("Failed to fetch cryptocurrency history. Please try again later.")
    }
  },
)

const cryptoSlice = createSlice({
  name: "crypto",
  initialState,
  reducers: {
    updateCryptoPrice: (state, action: PayloadAction<{ id: string; price: number }>) => {
      const { id, price } = action.payload
      const crypto = state.cryptos.find((c) => c.id === id)
      if (crypto) {
        const oldPrice = crypto.currentPrice
        crypto.currentPrice = price

        // Update 24h change percentage based on the new price
        const percentageChange = ((price - oldPrice) / oldPrice) * 100
        crypto.priceChangePercentage24h = crypto.priceChangePercentage24h + percentageChange
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCryptoData.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchCryptoData.fulfilled, (state, action: PayloadAction<Crypto[]>) => {
        state.loading = false
        state.cryptos = action.payload
      })
      .addCase(fetchCryptoData.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      .addCase(fetchCryptoDetails.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchCryptoDetails.fulfilled, (state, action: PayloadAction<Crypto>) => {
        state.loading = false
        state.selectedCrypto = action.payload
      })
      .addCase(fetchCryptoDetails.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      .addCase(fetchCryptoHistory.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchCryptoHistory.fulfilled, (state, action: PayloadAction<CryptoHistoryItem[]>) => {
        state.loading = false
        state.cryptoHistory = action.payload
      })
      .addCase(fetchCryptoHistory.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
  },
})

export const { updateCryptoPrice } = cryptoSlice.actions
export default cryptoSlice.reducer


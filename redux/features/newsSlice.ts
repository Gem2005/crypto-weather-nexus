import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit"
import { fetchNewsData as fetchNews } from "@/services/newsService"

interface NewsItem {
  id: string
  title: string
  description: string
  url: string
  source: string
  publishedAt: string
}

interface NewsState {
  news: NewsItem[]
  loading: boolean
  error: string | null
}

const initialState: NewsState = {
  news: [],
  loading: false,
  error: null,
}

export const fetchNewsData = createAsyncThunk("news/fetchNewsData", async (_, { rejectWithValue }) => {
  try {
    return await fetchNews()
  } catch (error) {
    return rejectWithValue("Failed to fetch news data. Please try again later.")
  }
})

const newsSlice = createSlice({
  name: "news",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchNewsData.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchNewsData.fulfilled, (state, action: PayloadAction<NewsItem[]>) => {
        state.loading = false
        state.news = action.payload
      })
      .addCase(fetchNewsData.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
  },
})

export default newsSlice.reducer


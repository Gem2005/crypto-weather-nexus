export interface NewsDataResponse {
  status: string
  totalResults: number
  results: {
    title: string
    link: string
    keywords: string[]
    creator: string[]
    video_url: string | null
    description: string
    content: string
    pubDate: string
    image_url: string | null
    source_id: string
    source_priority: number
    country: string[]
    category: string[]
    language: string
  }[]
  nextPage: string
}

export async function fetchNewsData() {
  const response = await fetch(
    `https://newsdata.io/api/1/news?apikey=${process.env.NEXT_PUBLIC_NEWSDATA_API_KEY}&q=cryptocurrency&language=en&category=business`,
  )

  if (!response.ok) {
    throw new Error("Failed to fetch news data")
  }

  const data: NewsDataResponse = await response.json()

  return data.results.slice(0, 6).map((item, index) => ({
    id: index.toString(),
    title: item.title,
    description: item.description,
    url: item.link,
    source: item.source_id,
    publishedAt: item.pubDate,
  }))
}


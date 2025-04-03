"use client"

import { useSelector, useDispatch } from "react-redux"
import type { RootState, AppDispatch } from "@/redux/store"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { ExternalLink } from "lucide-react"

export default function NewsSection() {
  const dispatch = useDispatch<AppDispatch>()
  const { news, loading, error } = useSelector((state: RootState) => state.news)

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-72" />
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-24 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Crypto News</CardTitle>
          <CardDescription>Latest cryptocurrency news and updates</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="p-6 text-center">
            <h3 className="text-lg font-medium mb-2">Error Loading News Data</h3>
            <p className="text-sm text-muted-foreground mb-4">{error}</p>
            <Button onClick={() => dispatch({ type: "news/fetchNewsData" })}>Retry</Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Crypto News</CardTitle>
        <CardDescription>Latest cryptocurrency news and updates</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-4">
          {news.slice(0, 5).map((item) => (
            <div key={item.id} className="flex flex-col p-4 border rounded-lg hover:shadow-md transition-shadow">
              <div className="flex justify-between">
                <div>
                  <h3 className="font-medium">{item.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{item.description}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-xs text-muted-foreground">{item.source}</span>
                    <span className="text-xs text-muted-foreground">
                      {new Date(item.publishedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <a href={item.url} target="_blank" rel="noopener noreferrer" className="ml-4 flex-shrink-0">
                  <Button variant="ghost" size="icon">
                    <ExternalLink className="h-5 w-5" />
                    <span className="sr-only">Read more</span>
                  </Button>
                </a>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}


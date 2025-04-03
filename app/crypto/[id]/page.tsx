"use client"

import { useEffect } from "react"
import { useParams } from "next/navigation"
import { useDispatch, useSelector } from "react-redux"
import { fetchCryptoDetails, fetchCryptoHistory } from "@/redux/features/cryptoSlice"
import type { RootState, AppDispatch } from "@/redux/store"
import CryptoDetailsHeader from "@/components/crypto/crypto-details-header"
import CryptoPriceChart from "@/components/crypto/crypto-price-chart"
import CryptoMetrics from "@/components/crypto/crypto-metrics"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function CryptoPage() {
  const { id } = useParams()
  const dispatch = useDispatch<AppDispatch>()
  const { cryptos, selectedCrypto, cryptoHistory, loading, error } = useSelector((state: RootState) => state.crypto)

  useEffect(() => {
    if (id) {
      dispatch(fetchCryptoDetails(id.toString()))
      dispatch(fetchCryptoHistory(id.toString()))
    }
  }, [dispatch, id])

  const crypto = cryptos.find((c) => c.id === id) || selectedCrypto

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center">
          <Skeleton className="h-8 w-24 mr-2" />
          <Skeleton className="h-8 w-40" />
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-72" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-[300px] w-full" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-48" />
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-24 w-full" />
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh]">
        <h2 className="text-2xl font-bold mb-4">Error Loading Cryptocurrency Data</h2>
        <p className="text-gray-500 mb-6">{error}</p>
        <Link href="/">
          <Button>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
        </Link>
      </div>
    )
  }

  if (!crypto) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh]">
        <h2 className="text-2xl font-bold mb-4">Cryptocurrency Not Found</h2>
        <p className="text-gray-500 mb-6">The cryptocurrency you're looking for doesn't exist in our database.</p>
        <Link href="/">
          <Button>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <Link href="/">
          <Button variant="ghost" className="mr-2">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </Link>
        <CryptoDetailsHeader crypto={crypto} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Price History (Last 7 Days)</CardTitle>
          <CardDescription>Historical price data for {crypto.name}</CardDescription>
        </CardHeader>
        <CardContent>
          <CryptoPriceChart cryptoHistory={cryptoHistory} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Market Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          <CryptoMetrics crypto={crypto} />
        </CardContent>
      </Card>
    </div>
  )
}


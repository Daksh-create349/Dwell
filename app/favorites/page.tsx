'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Spinner } from '@/components/ui/spinner'
import { Heart } from 'lucide-react'

interface Property {
  id: string
  title: string
  location: string
  price_per_night: number
  bedrooms: number
  bathrooms: number
}

interface Favorite {
  id: string
  property_id: string
  properties: Property
}

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<Favorite[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchFavorites()
  }, [])

  const fetchFavorites = async () => {
    try {
      const response = await fetch('/api/favorites')
      if (!response.ok) throw new Error('Failed to fetch favorites')
      const data = await response.json()
      setFavorites(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleRemove = async (favoriteId: string) => {
    try {
      const response = await fetch(`/api/favorites/${favoriteId}`, { method: 'DELETE' })
      if (!response.ok) throw new Error('Failed to remove favorite')
      setFavorites(favorites.filter(f => f.id !== favoriteId))
    } catch (err) {
      alert(err instanceof Error ? err.message : 'An error occurred')
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner className="w-8 h-8" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Dwell</h1>
          <Link href="/dashboard">
            <Button variant="ghost">Dashboard</Button>
          </Link>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold mb-8">My Favorites</h2>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6">
            {error}
          </div>
        )}

        {favorites.length === 0 ? (
          <Card>
            <CardContent className="pt-12 text-center">
              <Heart className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-slate-600 mb-4">No favorites yet</p>
              <Link href="/search">
                <Button>Browse Properties</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favorites.map((favorite) => (
              <Card key={favorite.id}>
                <CardHeader>
                  <CardTitle className="text-lg">{favorite.properties.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-slate-600">{favorite.properties.location}</p>
                  
                  <div className="flex gap-4 text-sm text-slate-600">
                    <span>{favorite.properties.bedrooms} Beds</span>
                    <span>{favorite.properties.bathrooms} Baths</span>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t">
                    <div>
                      <p className="text-2xl font-bold">₹{favorite.properties.price_per_night}</p>
                      <p className="text-xs text-slate-600">/night</p>
                    </div>
                    <div className="flex gap-2">
                      <Link href={`/properties/${favorite.properties.id}/book`}>
                        <Button size="sm">Book</Button>
                      </Link>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleRemove(favorite.id)}
                      >
                        <Heart className="w-4 h-4 fill-red-600 text-red-600" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

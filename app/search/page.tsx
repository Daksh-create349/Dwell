'use client'

import { useEffect, useState, Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Spinner } from '@/components/ui/spinner'
import { Heart, MapPin, Users } from 'lucide-react'

interface Property {
  id: string
  title: string
  location: string
  city: string
  bedrooms: number
  bathrooms: number
  max_guests: number
  price_per_night: number
  description: string
  images: string[]
}

function SearchPageContent() {
  const searchParams = useSearchParams()
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [favorites, setFavorites] = useState<Set<string>>(new Set())
  
  const [city, setCity] = useState(searchParams.get('city') || '')
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '')
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '')
  const [bedrooms, setBedrooms] = useState(searchParams.get('bedrooms') || '')

  useEffect(() => {
    searchProperties()
    fetchFavorites()
  }, [])

  const searchProperties = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (city) params.append('city', city)
      if (minPrice) params.append('minPrice', minPrice)
      if (maxPrice) params.append('maxPrice', maxPrice)
      if (bedrooms) params.append('bedrooms', bedrooms)

      const response = await fetch(`/api/properties/search?${params}`)
      if (!response.ok) throw new Error('Search failed')
      const data = await response.json()
      setProperties(data)
    } catch (error) {
      console.error('Search error:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchFavorites = async () => {
    try {
      const response = await fetch('/api/favorites')
      if (response.ok) {
        const data = await response.json()
        setFavorites(new Set(data.map((f: any) => f.property_id)))
      }
    } catch (error) {
      console.error('Error fetching favorites:', error)
    }
  }

  const toggleFavorite = async (propertyId: string) => {
    try {
      if (favorites.has(propertyId)) {
        // Remove from favorites
        const response = await fetch('/api/favorites')
        if (response.ok) {
          const favorites = await response.json()
          const fav = favorites.find((f: any) => f.property_id === propertyId)
          if (fav) {
            await fetch(`/api/favorites/${fav.id}`, { method: 'DELETE' })
            setFavorites(prev => {
              const newSet = new Set(prev)
              newSet.delete(propertyId)
              return newSet
            })
          }
        }
      } else {
        // Add to favorites
        const response = await fetch('/api/favorites', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ property_id: propertyId }),
        })
        if (response.ok) {
          setFavorites(prev => new Set([...prev, propertyId]))
        }
      }
    } catch (error) {
      console.error('Error toggling favorite:', error)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Dwell</h1>
          <div className="flex gap-4">
            <Link href="/favorites">
              <Button variant="ghost">Favorites</Button>
            </Link>
            <Link href="/dashboard">
              <Button variant="ghost">Dashboard</Button>
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Search Bar */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Search Properties</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-5 gap-4">
              <div className="space-y-2">
                <Label>City</Label>
                <Input
                  placeholder="Search by city..."
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Min Price</Label>
                <Input
                  type="number"
                  placeholder="Min"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Max Price</Label>
                <Input
                  type="number"
                  placeholder="Max"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Bedrooms</Label>
                <Input
                  type="number"
                  placeholder="Bedrooms"
                  value={bedrooms}
                  onChange={(e) => setBedrooms(e.target.value)}
                />
              </div>
              <div className="flex items-end">
                <Button className="w-full" onClick={searchProperties}>
                  Search
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <Spinner className="w-8 h-8" />
          </div>
        ) : properties.length === 0 ? (
          <Card>
            <CardContent className="pt-12 text-center">
              <p className="text-slate-600 mb-4">No properties found. Try adjusting your search.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((property) => (
              <Card key={property.id} className="overflow-hidden hover:shadow-lg transition">
                <div className="relative h-48 w-full overflow-hidden bg-slate-100">
                  <img
                    src={property.images && property.images[0] ? property.images[0] : "/images/property-mountain-cabin.jpg"}
                    alt={property.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{property.title}</CardTitle>
                      <div className="flex items-center gap-2 text-sm text-slate-600 mt-1">
                        <MapPin className="w-4 h-4" />
                        {property.location}
                      </div>
                    </div>
                    <button
                      onClick={() => toggleFavorite(property.id)}
                      className="focus:outline-none"
                    >
                      <Heart
                        className={`w-5 h-5 ${
                          favorites.has(property.id)
                            ? 'fill-red-600 text-red-600'
                            : 'text-gray-300'
                        }`}
                      />
                    </button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-slate-600 line-clamp-2">{property.description}</p>
                  
                  <div className="flex gap-4 text-sm text-slate-600">
                    <span className="flex items-center gap-1">
                      <span className="font-semibold">{property.bedrooms}</span> Beds
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="font-semibold">{property.bathrooms}</span> Baths
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      {property.max_guests}
                    </span>
                  </div>

                  <div className="pt-4 border-t flex items-center justify-between">
                    <div>
                      <p className="text-2xl font-bold">₹{property.price_per_night}</p>
                      <p className="text-xs text-slate-600">/night</p>
                    </div>
                    <Link href={`/properties/${property.id}/book`}>
                      <Button>Book</Button>
                    </Link>
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

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="flex justify-center items-center min-h-screen">Loading...</div>}>
      <SearchPageContent />
    </Suspense>
  )
}

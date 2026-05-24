'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Spinner } from '@/components/ui/spinner'
import { Trash2, Edit, Plus } from 'lucide-react'

interface Property {
  id: string
  title: string
  location: string
  bedrooms: number
  bathrooms: number
  price_per_night: number
  is_active: boolean
  created_at: string
}

export default function HostPropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchProperties()
  }, [])

  const fetchProperties = async () => {
    try {
      const response = await fetch('/api/properties')
      if (!response.ok) throw new Error('Failed to fetch properties')
      const data = await response.json()
      setProperties(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this property?')) return

    try {
      const response = await fetch(`/api/properties/${id}`, { method: 'DELETE' })
      if (!response.ok) throw new Error('Failed to delete property')
      setProperties(properties.filter(p => p.id !== id))
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
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold">My Properties</h2>
            <p className="text-slate-600">Manage all your rental properties</p>
          </div>
          <Link href="/host/properties/new">
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              List New Property
            </Button>
          </Link>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6">
            {error}
          </div>
        )}

        {properties.length === 0 ? (
          <Card>
            <CardContent className="pt-12 text-center">
              <p className="text-slate-600 mb-4">No properties listed yet</p>
              <Link href="/host/properties/new">
                <Button>List Your First Property</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6">
            {properties.map((property) => (
              <Card key={property.id}>
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold">{property.title}</h3>
                      <p className="text-slate-600">{property.location}</p>
                      <div className="mt-2 flex gap-4 text-sm text-slate-600">
                        <span>{property.bedrooms} Bedrooms</span>
                        <span>{property.bathrooms} Bathrooms</span>
                        <span>₹{property.price_per_night}/night</span>
                      </div>
                      <div className="mt-2">
                        <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                          property.is_active 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-gray-100 text-gray-700'
                        }`}>
                          {property.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Link href={`/host/properties/${property.id}/edit`}>
                        <Button variant="outline" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                      </Link>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleDelete(property.id)}
                      >
                        <Trash2 className="w-4 h-4 text-red-600" />
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

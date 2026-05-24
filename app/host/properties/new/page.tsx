'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'

export default function NewPropertyPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    property_type: 'apartment',
    bedrooms: '1',
    bathrooms: '1',
    max_guests: '2',
    price_per_night: '',
    address: '',
    city: '',
    country: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/properties', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          bedrooms: parseInt(formData.bedrooms),
          bathrooms: parseFloat(formData.bathrooms),
          max_guests: parseInt(formData.max_guests),
          price_per_night: parseFloat(formData.price_per_night),
        }),
      })

      if (!response.ok) throw new Error('Failed to create property')
      
      router.push('/host/properties')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Dwell</h1>
          <Link href="/host/properties">
            <Button variant="ghost">Back</Button>
          </Link>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto px-4 py-12">
        <Card>
          <CardHeader>
            <CardTitle>List New Property</CardTitle>
            <CardDescription>Fill in the details about your property</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-50 text-red-600 p-3 rounded-lg">
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="title">Property Title</Label>
                <Input
                  id="title"
                  name="title"
                  placeholder="Beautiful beachfront villa"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Describe your property..."
                  value={formData.description}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  rows={4}
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="property_type">Property Type</Label>
                  <select
                    id="property_type"
                    name="property_type"
                    value={formData.property_type}
                    onChange={handleChange}
                    disabled={loading}
                    className="w-full px-3 py-2 border rounded-lg"
                  >
                    <option value="apartment">Apartment</option>
                    <option value="house">House</option>
                    <option value="villa">Villa</option>
                    <option value="condo">Condo</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bedrooms">Bedrooms</Label>
                  <Input
                    id="bedrooms"
                    name="bedrooms"
                    type="number"
                    min="1"
                    value={formData.bedrooms}
                    onChange={handleChange}
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="bathrooms">Bathrooms</Label>
                  <Input
                    id="bathrooms"
                    name="bathrooms"
                    type="number"
                    min="0.5"
                    step="0.5"
                    value={formData.bathrooms}
                    onChange={handleChange}
                    required
                    disabled={loading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="max_guests">Max Guests</Label>
                  <Input
                    id="max_guests"
                    name="max_guests"
                    type="number"
                    min="1"
                    value={formData.max_guests}
                    onChange={handleChange}
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="price_per_night">Price Per Night (₹)</Label>
                <Input
                  id="price_per_night"
                  name="price_per_night"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="100.00"
                  value={formData.price_per_night}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  name="location"
                  placeholder="e.g., Bandra, Mumbai"
                  value={formData.location}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Street Address</Label>
                <Input
                  id="address"
                  name="address"
                  placeholder="123 Main Street"
                  value={formData.address}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    name="city"
                    placeholder="Mumbai"
                    value={formData.city}
                    onChange={handleChange}
                    required
                    disabled={loading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="country">Country</Label>
                  <Input
                    id="country"
                    name="country"
                    placeholder="India"
                    value={formData.country}
                    onChange={handleChange}
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="flex gap-4">
                <Button type="submit" disabled={loading}>
                  {loading ? 'Creating...' : 'Create Property'}
                </Button>
                <Link href="/host/properties">
                  <Button variant="outline">Cancel</Button>
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

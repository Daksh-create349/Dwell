'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

interface Property {
  id: string
  title: string
  location: string
  price_per_night: number
  bedrooms: number
  bathrooms: number
  description: string
}

export default function BookPropertyPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [property, setProperty] = useState<Property | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [checkInDate, setCheckInDate] = useState('')
  const [checkOutDate, setCheckOutDate] = useState('')
  const [notes, setNotes] = useState('')
  const [totalPrice, setTotalPrice] = useState(0)

  useEffect(() => {
    fetchProperty()
  }, [])

  useEffect(() => {
    calculatePrice()
  }, [checkInDate, checkOutDate, property])

  const fetchProperty = async () => {
    try {
      const response = await fetch(`/api/properties/${params.id}`)
      if (!response.ok) throw new Error('Property not found')
      const data = await response.json()
      setProperty(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load property')
    } finally {
      setLoading(false)
    }
  }

  const calculatePrice = () => {
    if (!checkInDate || !checkOutDate || !property) return

    const checkIn = new Date(checkInDate)
    const checkOut = new Date(checkOutDate)
    const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24))

    if (nights > 0) {
      setTotalPrice(nights * property.price_per_night)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError(null)

    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          property_id: params.id,
          check_in_date: checkInDate,
          check_out_date: checkOutDate,
          notes,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to create booking')
      }

      router.push('/dashboard')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>
  }

  if (!property) {
    return <div className="flex justify-center items-center min-h-screen">Property not found</div>
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <Link href="/dashboard">
          <Button variant="ghost" className="mb-6">← Back</Button>
        </Link>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>{property.title}</CardTitle>
                <CardDescription>{property.location}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-slate-600">{property.description}</p>
                <div className="grid grid-cols-2 gap-4 py-4 border-y">
                  <div>
                    <p className="text-sm text-slate-600">Bedrooms</p>
                    <p className="text-2xl font-bold">{property.bedrooms}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600">Bathrooms</p>
                    <p className="text-2xl font-bold">{property.bathrooms}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600">Price per Night</p>
                    <p className="text-2xl font-bold">₹{property.price_per_night}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card>
              <CardHeader>
                <CardTitle>Book Now</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  {error && (
                    <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
                      {error}
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="checkIn">Check-in Date</Label>
                    <Input
                      id="checkIn"
                      type="date"
                      value={checkInDate}
                      onChange={(e) => setCheckInDate(e.target.value)}
                      required
                      disabled={submitting}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="checkOut">Check-out Date</Label>
                    <Input
                      id="checkOut"
                      type="date"
                      value={checkOutDate}
                      onChange={(e) => setCheckOutDate(e.target.value)}
                      required
                      disabled={submitting}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="notes">Special Requests</Label>
                    <Textarea
                      id="notes"
                      placeholder="Any special requests..."
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      disabled={submitting}
                      rows={3}
                    />
                  </div>

                  {totalPrice > 0 && (
                    <div className="border-t pt-4">
                      <div className="flex justify-between mb-2">
                        <span>Subtotal:</span>
                        <span>₹{totalPrice.toFixed(2)}</span>
                      </div>
                      <div className="text-lg font-bold flex justify-between">
                        <span>Total:</span>
                        <span>₹{totalPrice.toFixed(2)}</span>
                      </div>
                    </div>
                  )}

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={submitting || !checkInDate || !checkOutDate}
                  >
                    {submitting ? 'Booking...' : 'Request Booking'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

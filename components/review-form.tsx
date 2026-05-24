'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Star } from 'lucide-react'

interface ReviewFormProps {
  bookingId: string
  propertyId: string
  onSuccess?: () => void
}

export function ReviewForm({ bookingId, propertyId, onSuccess }: ReviewFormProps) {
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          booking_id: bookingId,
          property_id: propertyId,
          rating,
          comment,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error)
      }

      setSuccess(true)
      setRating(5)
      setComment('')
      onSuccess?.()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit review')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <Card className="bg-green-50">
        <CardContent className="pt-6">
          <p className="text-green-700">Thank you for your review!</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Leave a Review</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <Label>Rating</Label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className="focus:outline-none"
                >
                  <Star
                    className={`w-6 h-6 ${
                      star <= rating
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="comment">Comment</Label>
            <Textarea
              id="comment"
              placeholder="Share your experience..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              disabled={loading}
              rows={4}
            />
          </div>

          <Button type="submit" disabled={loading}>
            {loading ? 'Submitting...' : 'Submit Review'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

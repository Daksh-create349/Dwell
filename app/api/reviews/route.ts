import { createServerClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerClient()
    const searchParams = request.nextUrl.searchParams
    const propertyId = searchParams.get('propertyId')

    let query = supabase
      .from('reviews')
      .select('*, users(full_name, avatar_url)')

    if (propertyId) {
      query = query.eq('property_id', propertyId)
    }

    const { data: reviews, error } = await query.order('created_at', { ascending: false })

    if (error) throw error

    return NextResponse.json(reviews)
  } catch (error) {
    console.error('Error fetching reviews:', error)
    return NextResponse.json(
      { error: 'Failed to fetch reviews' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { booking_id, property_id, rating, comment } = body

    // Verify the user completed this booking
    const { data: booking } = await supabase
      .from('bookings')
      .select('guest_id, status')
      .eq('id', booking_id)
      .single()

    if (!booking || booking.guest_id !== user.id) {
      return NextResponse.json(
        { error: 'You can only review properties you have booked' },
        { status: 403 }
      )
    }

    if (booking.status !== 'completed') {
      return NextResponse.json(
        { error: 'You can only review completed bookings' },
        { status: 400 }
      )
    }

    // Check if review already exists
    const { data: existingReview } = await supabase
      .from('reviews')
      .select('id')
      .eq('booking_id', booking_id)
      .single()

    if (existingReview) {
      return NextResponse.json(
        { error: 'You have already reviewed this booking' },
        { status: 400 }
      )
    }

    const { data: review, error } = await supabase
      .from('reviews')
      .insert({
        booking_id,
        property_id,
        reviewer_id: user.id,
        rating,
        comment,
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(review, { status: 201 })
  } catch (error) {
    console.error('Error creating review:', error)
    return NextResponse.json(
      { error: 'Failed to create review' },
      { status: 500 }
    )
  }
}

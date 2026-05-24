import { createServerClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createServerClient()

    const { data: booking, error } = await supabase
      .from('bookings')
      .select('*, properties(*), users(*)')
      .eq('id', params.id)
      .single()

    if (error) throw error

    return NextResponse.json(booking)
  } catch (error) {
    console.error('Error fetching booking:', error)
    return NextResponse.json(
      { error: 'Failed to fetch booking' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createServerClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { status } = body

    // Get booking and verify authorization
    const { data: booking } = await supabase
      .from('bookings')
      .select('guest_id, property_id, properties(owner_id)')
      .eq('id', params.id)
      .single()

    if (!booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 })
    }

    // Check if user is guest or host
    const isGuest = booking.guest_id === user.id
    const isHost = booking.properties?.owner_id === user.id

    if (!isGuest && !isHost) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Only guests can cancel, hosts can confirm/reject
    if (isGuest && status === 'cancelled') {
      // Allow
    } else if (isHost && (status === 'confirmed' || status === 'cancelled')) {
      // Allow
    } else if (!isGuest) {
      return NextResponse.json({ error: 'Guests can only cancel bookings' }, { status: 400 })
    }

    const { data: updated, error } = await supabase
      .from('bookings')
      .update({ status })
      .eq('id', params.id)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(updated)
  } catch (error) {
    console.error('Error updating booking:', error)
    return NextResponse.json(
      { error: 'Failed to update booking' },
      { status: 500 }
    )
  }
}

import { createServerClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const searchParams = request.nextUrl.searchParams
    const status = searchParams.get('status')

    let query = supabase
      .from('bookings')
      .select('*, properties(*), users(*)')
      .or(`guest_id.eq.${user.id},owner_id.eq.${user.id}`)

    if (status) {
      query = query.eq('status', status)
    }

    const { data: bookings, error } = await query.order('created_at', { ascending: false })

    if (error) throw error

    return NextResponse.json(bookings)
  } catch (error) {
    console.error('Error fetching bookings:', error)
    return NextResponse.json(
      { error: 'Failed to fetch bookings' },
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
    const { property_id, check_in_date, check_out_date, notes } = body

    // Check for date conflicts
    const { data: conflicts } = await supabase
      .from('bookings')
      .select('id')
      .eq('property_id', property_id)
      .eq('status', 'confirmed')
      .lt('check_out_date', check_out_date)
      .gt('check_in_date', check_in_date)

    if (conflicts && conflicts.length > 0) {
      return NextResponse.json(
        { error: 'Property is not available for these dates' },
        { status: 400 }
      )
    }

    // Get property details for pricing
    const { data: property } = await supabase
      .from('properties')
      .select('price_per_night')
      .eq('id', property_id)
      .single()

    if (!property) {
      return NextResponse.json({ error: 'Property not found' }, { status: 404 })
    }

    const checkIn = new Date(check_in_date)
    const checkOut = new Date(check_out_date)
    const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24))
    const totalPrice = nights * property.price_per_night

    const { data: booking, error } = await supabase
      .from('bookings')
      .insert({
        property_id,
        guest_id: user.id,
        check_in_date,
        check_out_date,
        number_of_nights: nights,
        total_price: totalPrice,
        notes,
        status: 'pending',
        payment_status: 'pending',
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(booking, { status: 201 })
  } catch (error) {
    console.error('Error creating booking:', error)
    return NextResponse.json(
      { error: 'Failed to create booking' },
      { status: 500 }
    )
  }
}

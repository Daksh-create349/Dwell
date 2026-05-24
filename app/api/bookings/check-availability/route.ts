import { createServerClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerClient()
    const body = await request.json()
    const { property_id, check_in, check_out } = body

    const { data: bookings, error } = await supabase
      .from('bookings')
      .select('check_in_date, check_out_date')
      .eq('property_id', property_id)
      .eq('status', 'confirmed')

    if (error) throw error

    // Check for conflicts
    const hasConflict = bookings.some(booking => {
      const bookingStart = new Date(booking.check_in_date)
      const bookingEnd = new Date(booking.check_out_date)
      const requestStart = new Date(check_in)
      const requestEnd = new Date(check_out)

      return requestStart < bookingEnd && requestEnd > bookingStart
    })

    return NextResponse.json({ available: !hasConflict })
  } catch (error) {
    console.error('Error checking availability:', error)
    return NextResponse.json(
      { error: 'Failed to check availability' },
      { status: 500 }
    )
  }
}

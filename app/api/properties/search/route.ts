import { createServerClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerClient()
    const searchParams = request.nextUrl.searchParams
    
    const city = searchParams.get('city')
    const minPrice = searchParams.get('minPrice')
    const maxPrice = searchParams.get('maxPrice')
    const bedrooms = searchParams.get('bedrooms')
    const limit = parseInt(searchParams.get('limit') || '20')

    let query = supabase
      .from('properties')
      .select('*')
      .eq('is_active', true)

    if (city) {
      query = query.eq('city', city)
    }

    if (minPrice) {
      query = query.gte('price_per_night', parseFloat(minPrice))
    }

    if (maxPrice) {
      query = query.lte('price_per_night', parseFloat(maxPrice))
    }

    if (bedrooms) {
      query = query.gte('bedrooms', parseInt(bedrooms))
    }

    const { data: properties, error } = await query
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) throw error

    return NextResponse.json(properties)
  } catch (error) {
    console.error('Error searching properties:', error)
    return NextResponse.json(
      { error: 'Failed to search properties' },
      { status: 500 }
    )
  }
}

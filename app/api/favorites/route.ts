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

    const { data: favorites, error } = await supabase
      .from('favorites')
      .select('*, properties(*)')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) throw error

    return NextResponse.json(favorites)
  } catch (error) {
    console.error('Error fetching favorites:', error)
    return NextResponse.json(
      { error: 'Failed to fetch favorites' },
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
    const { property_id } = body

    // Check if already favorited
    const { data: existing } = await supabase
      .from('favorites')
      .select('id')
      .eq('user_id', user.id)
      .eq('property_id', property_id)
      .single()

    if (existing) {
      return NextResponse.json(
        { error: 'Already in favorites' },
        { status: 400 }
      )
    }

    const { data: favorite, error } = await supabase
      .from('favorites')
      .insert({
        user_id: user.id,
        property_id,
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(favorite, { status: 201 })
  } catch (error) {
    console.error('Error adding favorite:', error)
    return NextResponse.json(
      { error: 'Failed to add favorite' },
      { status: 500 }
    )
  }
}

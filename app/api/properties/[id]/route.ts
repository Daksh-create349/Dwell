import { createServerClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createServerClient()

    const { data: property, error } = await supabase
      .from('properties')
      .select('*')
      .eq('id', params.id)
      .single()

    if (error) throw error

    return NextResponse.json(property)
  } catch (error) {
    console.error('Error fetching property:', error)
    return NextResponse.json(
      { error: 'Failed to fetch property' },
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

    // Verify ownership
    const { data: property } = await supabase
      .from('properties')
      .select('owner_id')
      .eq('id', params.id)
      .single()

    if (!property || property.owner_id !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await request.json()

    const { data: updated, error } = await supabase
      .from('properties')
      .update(body)
      .eq('id', params.id)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(updated)
  } catch (error) {
    console.error('Error updating property:', error)
    return NextResponse.json(
      { error: 'Failed to update property' },
      { status: 500 }
    )
  }
}

export async function DELETE(
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

    // Verify ownership
    const { data: property } = await supabase
      .from('properties')
      .select('owner_id')
      .eq('id', params.id)
      .single()

    if (!property || property.owner_id !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { error } = await supabase
      .from('properties')
      .delete()
      .eq('id', params.id)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting property:', error)
    return NextResponse.json(
      { error: 'Failed to delete property' },
      { status: 500 }
    )
  }
}

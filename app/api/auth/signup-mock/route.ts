import { readDb, writeDb } from '@/lib/supabase/mock-db-helper'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { id, email, fullName, userType } = await request.json()
    if (!id || !email) {
      return NextResponse.json({ error: 'Missing parameters' }, { status: 400 })
    }

    const db = readDb()
    const exists = db.users.find(u => u.id === id || u.email === email)

    if (!exists) {
      db.users.push({
        id,
        email,
        full_name: fullName,
        name: fullName,
        avatar_url: '',
        user_type: userType,
        role: userType,
        created_at: new Date().toISOString()
      })
      writeDb(db)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error in mock signup:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

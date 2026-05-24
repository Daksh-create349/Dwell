import { cookies } from 'next/headers'
import { readDb, writeDb } from './mock-db-helper'

// Mock query builder to support chainable table query interface
class MockQueryBuilder {
  private tableName: string
  private filters: Array<(item: any) => boolean> = []
  private sortColumn: string | null = null
  private sortAscending = true
  private limitCount: number | null = null
  private action: 'select' | 'insert' | 'update' | 'delete' = 'select'
  private insertData: any = null
  private updateData: any = null
  private selectFields = '*'

  constructor(tableName: string) {
    this.tableName = tableName
  }

  select(fields = '*') {
    this.selectFields = fields
    this.action = 'select'
    return this
  }

  insert(data: any) {
    this.insertData = data
    this.action = 'insert'
    return this
  }

  update(data: any) {
    this.updateData = data
    this.action = 'update'
    return this
  }

  delete() {
    this.action = 'delete'
    return this
  }

  eq(column: string, value: any) {
    this.filters.push((item) => {
      // Support matching boolean/string conversions if needed, but strict equality is fine for our schema
      return item[column] === value
    })
    return this
  }

  or(queryString: string) {
    // parses 'guest_id.eq.XXX,owner_id.eq.XXX'
    this.filters.push((item) => {
      const parts = queryString.split(',')
      return parts.some((part) => {
        const [col, op, val] = part.split('.')
        if (op === 'eq') {
          return item[col] === val
        }
        return false
      })
    })
    return this
  }

  lt(column: string, value: any) {
    this.filters.push((item) => {
      const itemVal = item[column]
      return itemVal < value
    })
    return this
  }

  gt(column: string, value: any) {
    this.filters.push((item) => {
      const itemVal = item[column]
      return itemVal > value
    })
    return this
  }

  lte(column: string, value: any) {
    this.filters.push((item) => {
      const itemVal = item[column]
      return itemVal <= value
    })
    return this
  }

  gte(column: string, value: any) {
    this.filters.push((item) => {
      const itemVal = item[column]
      return itemVal >= value
    })
    return this
  }

  order(column: string, options: { ascending?: boolean } = {}) {
    this.sortColumn = column
    this.sortAscending = options.ascending ?? true
    return this
  }

  limit(count: number) {
    this.limitCount = count
    return this
  }

  async execute() {
    const db = readDb()
    const collection = db[this.tableName as keyof typeof db] as any[]
    if (!collection) {
      return { data: null, error: new Error(`Table ${this.tableName} not found`) }
    }

    if (this.action === 'select') {
      let data = [...collection]
      // Apply filters
      for (const filter of this.filters) {
        data = data.filter(filter)
      }
      // Apply sort
      if (this.sortColumn) {
        data.sort((a, b) => {
          const valA = a[this.sortColumn!]
          const valB = b[this.sortColumn!]
          if (valA < valB) return this.sortAscending ? -1 : 1
          if (valA > valB) return this.sortAscending ? 1 : -1
          return 0
        })
      }
      // Apply limit
      if (this.limitCount !== null) {
        data = data.slice(0, this.limitCount)
      }

      // Apply joins (if selecting specific nested tables)
      const dataWithJoins = data.map((item) => {
        const itemCopy = { ...item }

        // Join properties
        if (this.selectFields.includes('properties(*)') && (itemCopy.property_id || itemCopy.id)) {
          const propId = itemCopy.property_id
          const property = db.properties.find((p) => p.id === propId)
          itemCopy.properties = property || null
        }

        // Join users
        if (this.selectFields.includes('users(*)') || this.selectFields.includes('users(')) {
          const userId = itemCopy.guest_id || itemCopy.reviewer_id || itemCopy.user_id
          const userObj = db.users.find((u) => u.id === userId)
          // format matching users table
          itemCopy.users = userObj
            ? {
                id: userObj.id,
                email: userObj.email,
                full_name: userObj.full_name,
                name: userObj.name,
                avatar_url: userObj.avatar_url,
                user_type: userObj.user_type,
                role: userObj.role,
              }
            : null
        }

        // Join bookings
        if (this.selectFields.includes('bookings(*)') && itemCopy.booking_id) {
          const booking = db.bookings.find((b) => b.id === itemCopy.booking_id)
          itemCopy.bookings = booking || null
        }

        return itemCopy
      })

      return { data: dataWithJoins, error: null }
    }

    if (this.action === 'insert') {
      const itemsToInsert = Array.isArray(this.insertData) ? this.insertData : [this.insertData]
      const inserted: any[] = []

      for (const rawItem of itemsToInsert) {
        const id = rawItem.id || (this.tableName.substring(0, 4) + '-' + Math.random().toString(36).substring(2, 11))

        // Auto-assign owner_id for bookings
        let ownerId = rawItem.owner_id
        if (this.tableName === 'bookings' && rawItem.property_id && !ownerId) {
          const property = db.properties.find((p) => p.id === rawItem.property_id)
          if (property) {
            ownerId = property.owner_id || property.host_id
          }
        }

        const newItem = {
          ...rawItem,
          id,
          ...(ownerId ? { owner_id: ownerId } : {}),
          created_at: rawItem.created_at || new Date().toISOString(),
        }

        collection.push(newItem)
        inserted.push(newItem)
      }

      writeDb(db)
      return { data: Array.isArray(this.insertData) ? inserted : inserted[0], error: null }
    }

    if (this.action === 'update') {
      let count = 0
      const updatedItems: any[] = []
      const updatedCollection = collection.map((item) => {
        let matches = true
        for (const filter of this.filters) {
          if (!filter(item)) {
            matches = false
            break
          }
        }
        if (matches) {
          count++
          const updated = { ...item, ...this.updateData }
          updatedItems.push(updated)
          return updated
        }
        return item
      })

      if (count > 0) {
        ;(db as any)[this.tableName] = updatedCollection
        writeDb(db)
      }
      return { data: updatedItems.length === 1 ? updatedItems[0] : updatedItems, error: null }
    }

    if (this.action === 'delete') {
      let count = 0
      const remainingCollection = collection.filter((item) => {
        let matches = true
        for (const filter of this.filters) {
          if (!filter(item)) {
            matches = false
            break
          }
        }
        if (matches) {
          count++
          return false
        }
        return true
      })

      if (count > 0) {
        ;(db as any)[this.tableName] = remainingCollection
        writeDb(db)
      }
      return { data: null, error: null }
    }

    return { data: null, error: null }
  }

  async single() {
    const { data, error } = await this.execute()
    if (error) return { data: null, error }
    if (Array.isArray(data)) {
      return { data: data[0] || null, error: null }
    }
    return { data, error: null }
  }

  then(onfulfilled?: (value: any) => any, onrejected?: (reason: any) => any) {
    return this.execute().then(onfulfilled, onrejected)
  }
}

// createServerClient works with either zero arguments (routes) or custom options (middleware/proxy.ts)
export async function createServerClient(
  url?: string,
  key?: string,
  options?: {
    cookies: {
      getAll: () => any[]
      setAll?: (cookies: any[]) => void
    }
  }
) {
  let getAllCookies: () => any[]
  let setAllCookies: (cookies: any[]) => void

  if (options && options.cookies) {
    getAllCookies = options.cookies.getAll
    setAllCookies = options.cookies.setAll || (() => {})
  } else {
    // If running in a server context without explicit params
    const cookieStore = await cookies()
    getAllCookies = () => cookieStore.getAll()
    setAllCookies = (cookiesToSet) => {
      try {
        cookiesToSet.forEach(({ name, value, options }) =>
          cookieStore.set(name, value, options)
        )
      } catch {
        // ignore warning
      }
    }
  }

  const getSessionFromCookies = () => {
    const all = getAllCookies()
    const sessionCookie = all.find((c: any) => c.name === 'homie-session')
    if (!sessionCookie || !sessionCookie.value) return null
    try {
      return JSON.parse(decodeURIComponent(sessionCookie.value))
    } catch {
      return null
    }
  }

  return {
    auth: {
      async getUser() {
        const session = getSessionFromCookies()
        if (!session || !session.user) {
          return { data: { user: null }, error: null }
        }
        return { data: { user: session.user }, error: null }
      },

      async signInWithPassword({ email }: { email: string; password?: string }) {
        let id = 'guest-456'
        let fullName = 'Bob Guest'
        let userType = 'guest'

        if (email.toLowerCase().includes('host')) {
          id = 'host-123'
          fullName = 'Alice Host'
          userType = 'host'
        } else if (email !== 'guest@example.com') {
          id = 'user-' + Math.random().toString(36).substring(2, 11)
          fullName = email.split('@')[0]
          userType = 'guest'
        }

        const user = {
          id,
          email,
          user_metadata: {
            full_name: fullName,
            user_type: userType,
          },
        }

        const session = { user, profile: { id, email, full_name: fullName, user_type: userType } }
        setAllCookies([
          {
            name: 'homie-session',
            value: JSON.stringify(session),
            options: { path: '/' },
          },
        ])

        return { data: { user, session }, error: null }
      },

      async signUp({ email, options }: { email: string; password?: string; options?: any }) {
        const id = 'user-' + Math.random().toString(36).substring(2, 11)
        const fullName = options?.data?.full_name || email.split('@')[0]
        const userType = options?.data?.user_type || 'guest'

        const user = {
          id,
          email,
          user_metadata: {
            full_name: fullName,
            user_type: userType,
          },
        }

        const session = { user, profile: { id, email, full_name: fullName, user_type: userType } }
        setAllCookies([
          {
            name: 'homie-session',
            value: JSON.stringify(session),
            options: { path: '/' },
          },
        ])

        return { data: { user, session }, error: null }
      },

      async signOut() {
        setAllCookies([
          {
            name: 'homie-session',
            value: '',
            options: { path: '/', maxAge: -1 },
          },
        ])
        return { error: null }
      },

      async exchangeCodeForSession(code: string) {
        return { error: null }
      },
    },

    from(tableName: string) {
      return new MockQueryBuilder(tableName)
    },
  }
}

// Alias createClient to createServerClient
export const createClient = createServerClient
export type SupabaseClient = Awaited<ReturnType<typeof createServerClient>>

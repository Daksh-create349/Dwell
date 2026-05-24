import fs from 'fs'
import path from 'path'

const DB_PATH = path.join(process.cwd(), 'lib/supabase/mock-db.json')

export interface User {
  id: string
  email: string
  full_name: string
  name: string
  avatar_url: string
  user_type: string
  role: string
  created_at: string
}

export interface Property {
  id: string
  owner_id: string
  host_id: string
  title: string
  description: string
  location: string
  city: string
  price_per_night: number
  images: string[]
  capacity: number
  max_guests: number
  bedrooms: number
  bathrooms: number
  amenities: string[]
  status: string
  is_active: boolean
  created_at: string
}

export interface Booking {
  id: string
  property_id: string
  guest_id: string
  owner_id?: string
  check_in_date: string
  check_out_date: string
  number_of_nights: number
  total_price: number
  notes?: string
  status: string
  payment_status: string
  created_at: string
}

export interface Review {
  id: string
  booking_id: string
  property_id: string
  reviewer_id: string
  rating: number
  comment: string
  created_at: string
}

export interface Favorite {
  id: string
  user_id: string
  property_id: string
  created_at: string
}

export interface Payment {
  id: string
  booking_id: string
  amount: number
  currency: string
  status: string
  created_at: string
}

export interface DatabaseState {
  users: User[]
  properties: Property[]
  bookings: Booking[]
  reviews: Review[]
  favorites: Favorite[]
  payments: Payment[]
}

const DEFAULT_DB: DatabaseState = {
  users: [
    {
      id: 'host-123',
      email: 'host@example.com',
      full_name: 'Alice Host',
      name: 'Alice Host',
      avatar_url: '',
      user_type: 'host',
      role: 'host',
      created_at: new Date().toISOString()
    },
    {
      id: 'guest-456',
      email: 'guest@example.com',
      full_name: 'Bob Guest',
      name: 'Bob Guest',
      avatar_url: '',
      user_type: 'guest',
      role: 'guest',
      created_at: new Date().toISOString()
    }
  ],
  properties: [
    {
      id: 'prop-1',
      owner_id: 'host-123',
      host_id: 'host-123',
      title: 'Charming Downtown Apartment',
      description: 'A beautiful cozy apartment in the heart of the city. Close to main attractions, public transport, and top restaurants. Features high-speed Wi-Fi, fully equipped kitchen, and a beautiful city view.',
      location: 'Bandra West, Mumbai, India',
      city: 'Mumbai',
      price_per_night: 15000,
      images: ['https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80'],
      capacity: 4,
      max_guests: 4,
      bedrooms: 2,
      bathrooms: 1,
      amenities: ['Wi-Fi', 'Kitchen', 'Air Conditioning', 'Heating', 'TV'],
      status: 'active',
      is_active: true,
      created_at: new Date().toISOString()
    },
    {
      id: 'prop-2',
      owner_id: 'host-123',
      host_id: 'host-123',
      title: 'Luxury Beachfront Villa',
      description: 'Stunning private beachfront villa with spectacular ocean views. Features a private pool, direct beach access, outdoor dining, and high-end luxury finishes throughout.',
      location: 'Juhu Beach, Mumbai, India',
      city: 'Mumbai',
      price_per_night: 28000,
      images: ['https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=800&q=80'],
      capacity: 8,
      max_guests: 8,
      bedrooms: 4,
      bathrooms: 3,
      amenities: ['Wi-Fi', 'Pool', 'Beach access', 'Kitchen', 'Dryer', 'Air Conditioning'],
      status: 'active',
      is_active: true,
      created_at: new Date().toISOString()
    },
    {
      id: 'prop-3',
      owner_id: 'host-123',
      host_id: 'host-123',
      title: 'Modern Cozy Loft',
      description: 'Stylish and modern loft located in a vibrant neighborhood. Features exposed brick walls, tall ceilings, and large windows that let in plenty of natural light. Perfect for couples or solo travelers.',
      location: 'Colaba, South Mumbai, India',
      city: 'Mumbai',
      price_per_night: 12000,
      images: ['https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=800&q=80'],
      capacity: 2,
      max_guests: 2,
      bedrooms: 1,
      bathrooms: 1,
      amenities: ['Wi-Fi', 'Kitchen', 'Heating', 'Washer', 'Iron'],
      status: 'active',
      is_active: true,
      created_at: new Date().toISOString()
    },
    {
      id: 'prop-4',
      owner_id: 'host-123',
      host_id: 'host-123',
      title: 'Stunning Mountain Cabin',
      description: 'Escape to the mountains in this gorgeous rustic cabin. Offers breathtaking views of the Rockies, a wood-burning fireplace, a hot tub, and easy access to hiking and ski slopes.',
      location: 'Powai Hills, Mumbai, India',
      city: 'Mumbai',
      price_per_night: 18000,
      images: ['https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=800&q=80'],
      capacity: 6,
      max_guests: 6,
      bedrooms: 3,
      bathrooms: 2,
      amenities: ['Wi-Fi', 'Hot tub', 'Fireplace', 'Kitchen', 'Heating'],
      status: 'active',
      is_active: true,
      created_at: new Date().toISOString()
    }
  ],
  bookings: [],
  reviews: [],
  favorites: [],
  payments: []
}

export function readDb(): DatabaseState {
  try {
    if (!fs.existsSync(DB_PATH)) {
      writeDb(DEFAULT_DB)
      return DEFAULT_DB
    }
    const raw = fs.readFileSync(DB_PATH, 'utf-8')
    return JSON.parse(raw) as DatabaseState
  } catch (error) {
    console.error('Error reading mock database, returning default:', error)
    return DEFAULT_DB
  }
}

export function writeDb(state: DatabaseState): void {
  try {
    const dir = path.dirname(DB_PATH)
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true })
    }
    fs.writeFileSync(DB_PATH, JSON.stringify(state, null, 2), 'utf-8')
  } catch (error) {
    console.error('Error writing mock database:', error)
  }
}

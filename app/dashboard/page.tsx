import { createServerClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default async function DashboardPage() {
  const supabase = await createServerClient()
  
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  // Get user profile
  const { data: profile } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single()

  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Dwell</h1>
          <Link href="/api/auth/sign-out">
            <Button variant="outline">Sign Out</Button>
          </Link>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-3 gap-6">
          {/* Welcome Card */}
          <Card className="md:col-span-3">
            <CardHeader>
              <CardTitle>Welcome, {profile?.full_name || user.email}!</CardTitle>
              <CardDescription>
                Account Type: {profile?.user_type === 'host' ? 'Host' : 'Guest'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600 mb-4">
                {profile?.user_type === 'host'
                  ? 'Welcome to your hosting dashboard. Start by listing your first property.'
                  : 'Welcome to Dwell! Explore properties and book your next stay.'}
              </p>
              {profile?.user_type === 'host' ? (
                <Link href="/host/properties">
                  <Button>Go to My Properties</Button>
                </Link>
              ) : (
                <Link href="/search">
                  <Button>Browse Properties</Button>
                </Link>
              )}
            </CardContent>
          </Card>

          {/* Quick Stats */}
          {profile?.user_type === 'host' && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Properties</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">0</p>
                  <p className="text-sm text-slate-600">Active listings</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Bookings</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">0</p>
                  <p className="text-sm text-slate-600">Upcoming reservations</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Revenue</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">₹0</p>
                  <p className="text-sm text-slate-600">This month</p>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

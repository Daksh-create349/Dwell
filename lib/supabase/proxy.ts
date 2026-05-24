import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  // Directly parse the cookie in the Edge Runtime to avoid importing
  // Node.js 'fs' and 'path' modules.
  const sessionCookie = request.cookies.get('homie-session')?.value
  let user = null

  if (sessionCookie) {
    try {
      const session = JSON.parse(decodeURIComponent(sessionCookie))
      user = session?.user || null
    } catch {
      // ignore
    }
  }

  if (
    request.nextUrl.pathname.startsWith('/protected') &&
    !user
  ) {
    const url = request.nextUrl.clone()
    url.pathname = '/auth/login'
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}

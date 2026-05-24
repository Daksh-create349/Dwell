'use client'

function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null
  const nameEQ = name + '='
  const ca = document.cookie.split(';')
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i]
    while (c.charAt(0) === ' ') c = c.substring(1, c.length)
    if (c.indexOf(nameEQ) === 0) return decodeURIComponent(c.substring(nameEQ.length, c.length))
  }
  return null
}

function setCookie(name: string, value: string, days = 7) {
  if (typeof document === 'undefined') return
  let expires = ''
  if (days) {
    const date = new Date()
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000)
    expires = '; expires=' + date.toUTCString()
  }
  document.cookie = name + '=' + encodeURIComponent(value) + expires + '; path=/'
}

function deleteCookie(name: string) {
  if (typeof document === 'undefined') return
  document.cookie = name + '=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;'
}

export function createClient() {
  return {
    auth: {
      async getUser() {
        const sessionStr = getCookie('homie-session')
        if (!sessionStr) {
          return { data: { user: null }, error: null }
        }
        try {
          const session = JSON.parse(sessionStr)
          return { data: { user: session.user }, error: null }
        } catch {
          return { data: { user: null }, error: null }
        }
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
        setCookie('homie-session', JSON.stringify(session))

        // Also hit our local signup endpoint to save to mock DB if needed
        try {
          await fetch('/api/auth/signup-mock', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id, email, fullName, userType })
          })
        } catch (e) {
          // ignore
        }

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
        setCookie('homie-session', JSON.stringify(session))

        // Hit mock signup endpoint to persist to mock DB
        try {
          await fetch('/api/auth/signup-mock', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id, email, fullName, userType })
          })
        } catch (e) {
          // ignore
        }

        return { data: { user, session }, error: null }
      },

      async signOut() {
        deleteCookie('homie-session')
        return { error: null }
      },
    },

    from(tableName: string) {
      return {
        select() {
          return {
            eq() {
              return {
                async single() {
                  const sessionStr = getCookie('homie-session')
                  if (!sessionStr) return { data: null, error: new Error('Not logged in') }
                  try {
                    const session = JSON.parse(sessionStr)
                    return { data: session.profile, error: null }
                  } catch (e) {
                    return { data: null, error: e }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}

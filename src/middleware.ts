import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: { headers: request.headers },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: Record<string, unknown>) {
          request.cookies.set({ name, value, ...options })
          response = NextResponse.next({
            request: { headers: request.headers },
          })
          response.cookies.set({ name, value, ...options })
        },
        remove(name: string, options: Record<string, unknown>) {
          request.cookies.set({ name, value: '', ...options })
          response = NextResponse.next({
            request: { headers: request.headers },
          })
          response.cookies.set({ name, value: '', ...options })
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  if (request.nextUrl.pathname.startsWith('/account') &&
      !request.nextUrl.pathname.startsWith('/account/login') &&
      !request.nextUrl.pathname.startsWith('/account/register') &&
      !request.nextUrl.pathname.startsWith('/account/check-email') &&
      !request.nextUrl.pathname.startsWith('/account/callback') &&
      !user) {
    return NextResponse.redirect(new URL('/account/login', request.url))
  }

  if ((request.nextUrl.pathname === '/account/login' ||
       request.nextUrl.pathname === '/account/register') && user) {
    return NextResponse.redirect(new URL('/account', request.url))
  }

  return response
}

export const config = {
  matcher: ['/account/:path*'],
}

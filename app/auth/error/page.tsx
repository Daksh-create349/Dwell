'use client'

import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { AlertCircle } from 'lucide-react'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

function AuthErrorContent() {
  const searchParams = useSearchParams()
  const error = searchParams.get('error') || 'An authentication error occurred'

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-4">
          <AlertCircle className="w-12 h-12 text-red-600" />
        </div>
        <CardTitle className="text-2xl">Authentication Error</CardTitle>
        <CardDescription>{error}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-slate-600">
          Something went wrong during authentication. Please try again.
        </p>

        <Link href="/auth/login">
          <Button className="w-full">Back to Sign In</Button>
        </Link>
      </CardContent>
    </Card>
  )
}

export default function AuthErrorPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <Suspense fallback={<div className="text-sm text-slate-500">Loading...</div>}>
        <AuthErrorContent />
      </Suspense>
    </div>
  )
}


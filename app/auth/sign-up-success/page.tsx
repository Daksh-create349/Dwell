'use client'

import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CheckCircle } from 'lucide-react'

export default function SignUpSuccessPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <CardTitle className="text-2xl">Verify Your Email</CardTitle>
          <CardDescription>Check your inbox for a confirmation link</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-slate-600">
            We&apos;ve sent a confirmation email to your inbox. Please click the link to verify your account and complete your registration.
          </p>
          
          <p className="text-sm text-slate-500">
            Didn&apos;t receive the email? Check your spam folder or try signing up again.
          </p>

          <Link href="/auth/login">
            <Button className="w-full">Back to Sign In</Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  )
}

import type React from "react"
import type { Metadata } from "next"
import { Inter, Geist_Mono, Playfair_Display } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { SmoothScroll } from "@/components/smooth-scroll"
import "./globals.css"

const _inter = Inter({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })
const _playfair = Playfair_Display({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Dwell - Direct Rental Marketplace for Modern Homes",
  description: "Find your ideal home or rent yours out. Simple, secure, direct from owners.",
  generator: 'v0.app'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="lenis">
      <body className={`font-sans antialiased`}>
        <SmoothScroll />
        {children}
        <Analytics />
      </body>
    </html>
  )
}

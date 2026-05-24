"use client"

import { useEffect } from "react"
import Lenis from "lenis"

export function SmoothScroll() {
  useEffect(() => {
    // Initialize Lenis
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // fast start, smooth settle
      direction: "vertical",
      gestureDirection: "vertical",
      smooth: true,
      syncTouch: false, // let mobile use native touch scroll
    } as any)

    // Scroll event callback
    function raf(time: number) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }

    requestAnimationFrame(raf)

    // Store in global window for debugging or manual triggers
    ;(window as any).lenis = lenis

    return () => {
      lenis.destroy()
      delete (window as any).lenis
    }
  }, [])

  return null
}

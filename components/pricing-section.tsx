"use client"

import { useRef, useEffect, useState } from "react"
import { PropertyBookingCard } from "./property-booking-card"

const properties = [
  {
    propertyName: "Sunset Beach Villa",
    location: "Juhu Beach, Mumbai, India",
    duration: "Min. 3 nights",
    availableDate: "Available now",
    image: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=800&q=80",
    pricePerNight: 28000,
    currency: "₹",
    propertyType: "Beachfront Villa",
    features: ["Ocean View", "Private Beach", "Infinity Pool", "Chef Kitchen"],
    amenities: ["Free Wifi", "Parking", "Pool"],
    rating: 4.9,
  },
  {
    propertyName: "Hills Retreat Villa",
    location: "Powai Hills, Mumbai, India",
    duration: "Min. 2 nights",
    availableDate: "Available now",
    image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=800&q=80",
    pricePerNight: 18000,
    currency: "₹",
    propertyType: "Hillside Cabin",
    features: ["Lake Views", "Fireplace", "Lush Greenery", "Game Room"],
    amenities: ["Free Wifi", "Parking", "4 Guests"],
    rating: 4.8,
  },
  {
    propertyName: "Downtown Luxury Loft",
    location: "Bandra West, Mumbai, India",
    duration: "Min. 1 night",
    availableDate: "Available now",
    image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80",
    pricePerNight: 15000,
    currency: "₹",
    propertyType: "City Loft",
    features: ["Sea Link View", "Rooftop Access", "Designer Interior", "Central Location"],
    amenities: ["Free Wifi", "2 Guests", "Parking"],
    rating: 4.7,
  },
  {
    propertyName: "Marine Drive Skyline Penthouse",
    location: "Marine Drive, Mumbai, India",
    duration: "Min. 4 nights",
    availableDate: "Available now",
    image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80",
    pricePerNight: 35000,
    currency: "₹",
    propertyType: "Luxury Suite",
    features: ["Queen's Necklace View", "Private Balcony", "Butler Service", "Jacuzzi"],
    amenities: ["Free Wifi", "Parking", "8 Guests"],
    rating: 4.9,
  },
  {
    propertyName: "Tropical Paradise Bungalow",
    location: "Madh Island, Mumbai, India",
    duration: "Min. 2 nights",
    availableDate: "Available now",
    image: "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&w=800&q=80",
    pricePerNight: 12000,
    currency: "₹",
    propertyType: "Island Bungalow",
    features: ["Quiet Beach Access", "Open Air Living", "Private Garden", "Yoga Deck"],
    amenities: ["Free Wifi", "Pool", "2 Guests"],
    rating: 4.8,
  },
  {
    propertyName: "Lakefront Modern House",
    location: "Worli Sea Face, Mumbai, India",
    duration: "Min. 3 nights",
    availableDate: "Year-round",
    image: "https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=800&q=80",
    pricePerNight: 24000,
    currency: "₹",
    propertyType: "Sea Face Home",
    features: ["Sea Access", "Private Dock", "Floor-to-ceiling Windows", "Hot Tub"],
    amenities: ["Free Wifi", "Parking", "6 Guests"],
    rating: 4.9,
  },
]

export function PricingSection() {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [isHovered, setIsHovered] = useState(false)
  const positionRef = useRef(0)
  const animationRef = useRef<number>()

  const duplicatedProperties = [...properties, ...properties, ...properties]

  useEffect(() => {
    const scrollContainer = scrollRef.current
    if (!scrollContainer) return

    const speed = isHovered ? 0.3 : 1 // Slow down on hover instead of changing animation duration
    let lastTime = performance.now()

    const animate = (currentTime: number) => {
      const deltaTime = currentTime - lastTime
      lastTime = currentTime

      positionRef.current += speed * (deltaTime / 16)

      const totalWidth = scrollContainer.scrollWidth / 3

      if (positionRef.current >= totalWidth) {
        positionRef.current = 0
      }

      scrollContainer.style.transform = `translateX(-${positionRef.current}px)`
      animationRef.current = requestAnimationFrame(animate)
    }

    animationRef.current = requestAnimationFrame(animate)

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [isHovered])

  return (
    <section id="pricing" className="py-32 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 text-center mb-20">
        <h2 className="text-4xl md:text-5xl font-normal mb-6 text-balance font-serif">Featured properties</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          Discover handpicked homes from verified owners. Book with confidence.
        </p>
      </div>

      <div className="relative w-full" onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
        <div ref={scrollRef} className="flex gap-6" style={{ width: "fit-content" }}>
          {duplicatedProperties.map((property, index) => (
            <div key={index} className="flex-shrink-0 w-[85vw] sm:w-[60vw] lg:w-[400px]">
              <PropertyBookingCard {...property} onBook={() => console.log(`Booking ${property.propertyName}`)} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Search,
  Heart,
  Trees,
  Umbrella,
  Building,
  Sparkles,
  Star,
  MapPin,
  Compass,
  User,
  Wifi,
  Battery,
  ChevronRight,
  Bell
} from "lucide-react"

interface DemoProperty {
  id: string
  title: string
  location: string
  price: number
  rating: number
  bedrooms: number
  bathrooms: number
  image: string
  amenities: string[]
}

const DEMO_PROPERTIES: Record<string, DemoProperty> = {
  cabin: {
    id: "prop-4",
    title: "Stunning Hills Villa",
    location: "Powai Hills, Mumbai",
    price: 18000,
    rating: 4.95,
    bedrooms: 3,
    bathrooms: 2,
    image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=800&q=80",
    amenities: ["Hills View", "Infinity Pool", "Wi-Fi"]
  },
  beach: {
    id: "prop-2",
    title: "Luxury Beachfront Villa",
    location: "Juhu Beach, Mumbai",
    price: 28000,
    rating: 4.88,
    bedrooms: 4,
    bathrooms: 3,
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80",
    amenities: ["Private Pool", "Beach Access", "AC"]
  },
  city: {
    id: "prop-3",
    title: "Modern Cozy Loft",
    location: "Colaba, South Mumbai",
    price: 15000,
    rating: 4.76,
    bedrooms: 1,
    bathrooms: 1,
    image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80",
    amenities: ["Kitchen", "Heating", "Gym Access"]
  },
  luxury: {
    id: "prop-5",
    title: "Marine Drive Skyline Penthouse",
    location: "Marine Drive, Mumbai",
    price: 35000,
    rating: 4.98,
    bedrooms: 6,
    bathrooms: 5,
    image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80",
    amenities: ["Ocean View", "Private Bar", "Chef"]
  }
}

export function MobileDemoScreen() {
  const [activeCategory, setActiveCategory] = useState<"cabin" | "beach" | "city" | "luxury">("cabin")
  const [activeTab, setActiveTab] = useState<"explore" | "wishlists" | "trips" | "profile">("explore")
  const [isFavorited, setIsFavorited] = useState<Record<string, boolean>>({
    "prop-4": true,
    "prop-2": false,
    "prop-3": false,
    "prop-5": false
  })
  
  // Dynamic Island States
  const [islandState, setIslandState] = useState<"default" | "expanded">("default")
  const [islandNotification, setIslandNotification] = useState<string | null>(null)

  const activeProperty = DEMO_PROPERTIES[activeCategory]

  // Trigger a dynamic island notification 3 seconds after load
  useEffect(() => {
    const timer = setTimeout(() => {
      triggerNotification("Booking confirmed at Mountain Cabin! 🏔️")
    }, 3000)
    return () => clearTimeout(timer)
  }, [])

  const triggerNotification = (message: string) => {
    setIslandNotification(message)
    setIslandState("expanded")
    setTimeout(() => {
      setIslandState("default")
    }, 4500)
  }

  const toggleFavorite = (e: React.MouseEvent, id: string) => {
    e.stopPropagation()
    setIsFavorited(prev => ({ ...prev, [id]: !prev[id] }))
    if (!isFavorited[id]) {
      triggerNotification("Added to wishlists! ❤️")
    }
  }

  return (
    <div className="absolute inset-0 bg-slate-50 text-slate-900 flex flex-col justify-between overflow-hidden select-none font-sans">
      
      {/* 1. iOS Status Bar with Notch / Dynamic Island */}
      <div className="relative h-10 px-5 flex items-center justify-between z-50 text-[11px] font-semibold text-slate-800">
        <span className="cursor-default">9:41</span>
        
        {/* Dynamic Island Container */}
        <motion.div
          animate={islandState}
          variants={{
            default: {
              width: 80,
              height: 22,
              borderRadius: 999,
              backgroundColor: "#000000",
              y: 0,
              padding: "0px 8px"
            },
            expanded: {
              width: 200,
              height: 48,
              borderRadius: 24,
              backgroundColor: "#000000",
              y: 4,
              padding: "8px 12px",
              boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.4), 0 8px 10px -6px rgba(0, 0, 0, 0.4)"
            }
          }}
          transition={{ type: "spring", stiffness: 350, damping: 25 }}
          onClick={() => {
            if (islandState === "default") {
              triggerNotification("Welcome back to Dwell App! 👋")
            }
          }}
          className="absolute left-1/2 -translate-x-1/2 flex items-center justify-center cursor-pointer overflow-hidden border border-neutral-900/50"
        >
          {islandState === "default" ? (
            <div className="w-full h-full flex items-center justify-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              <span className="text-[9px] text-neutral-400">Dwell</span>
            </div>
          ) : (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="flex items-center gap-2 w-full text-left"
            >
              <div className="w-6 h-6 rounded-full bg-indigo-500/20 flex items-center justify-center shrink-0">
                <Bell className="w-3.5 h-3.5 text-indigo-400" />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-[8px] uppercase tracking-wider text-neutral-500 font-bold">Notification</span>
                <span className="text-[10px] text-neutral-200 font-medium truncate">{islandNotification}</span>
              </div>
            </motion.div>
          )}
        </motion.div>

        <div className="flex items-center gap-1.5">
          <Wifi className="w-3.5 h-3.5 text-slate-800" />
          <Battery className="w-4 h-4 text-slate-800" />
        </div>
      </div>

      {/* 2. Main Scrollable Content Panel */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden px-4 pt-1 pb-4 flex flex-col gap-4 scrollbar-none">
        
        <AnimatePresence mode="wait">
          {activeTab === "explore" && (
            <motion.div
              key="explore"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col gap-4"
            >
              {/* Search Pill */}
              <div className="flex items-center gap-2 bg-white border border-slate-200/60 rounded-full px-4 py-2.5 shadow-md shadow-slate-100 cursor-pointer">
                <Search className="w-4 h-4 text-slate-500" />
                <div className="flex flex-col text-left">
                  <span className="text-xs font-semibold text-slate-900">Where to?</span>
                  <span className="text-[9px] text-slate-500">Anywhere • Any week • Guests</span>
                </div>
              </div>

              {/* Category Icons Selector */}
              <div className="flex items-center justify-between px-1">
                {(Object.keys(DEMO_PROPERTIES) as Array<keyof typeof DEMO_PROPERTIES>).map((cat) => {
                  const isActive = activeCategory === cat
                  const label = cat.charAt(0).toUpperCase() + cat.slice(1)
                  
                  const getIcon = () => {
                    switch (cat) {
                      case "cabin": return <Trees className="w-4 h-4" />
                      case "beach": return <Umbrella className="w-4 h-4" />
                      case "city": return <Building className="w-4 h-4" />
                      case "luxury": return <Sparkles className="w-4 h-4" />
                    }
                  }

                  return (
                    <button
                      key={cat}
                      onClick={() => setActiveCategory(cat)}
                      className={`flex flex-col items-center gap-1 transition-all ${
                        isActive ? "text-indigo-600 font-semibold scale-105" : "text-slate-500 hover:text-slate-700"
                      }`}
                    >
                      <div className={`p-2 rounded-xl transition ${
                        isActive ? "bg-indigo-50 text-indigo-600" : "bg-white border border-slate-200/40 shadow-sm"
                      }`}>
                        {getIcon()}
                      </div>
                      <span className="text-[10px]">{label}</span>
                      {isActive && (
                        <motion.div
                          layoutId="activeCategoryDot"
                          className="w-1 h-1 rounded-full bg-indigo-600"
                        />
                      )}
                    </button>
                  )
                })}
              </div>

              {/* Dynamic Property Showcase Card */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeCategory}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                  className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-lg shadow-slate-100"
                >
                  {/* Property Image Container */}
                  <div className="relative aspect-[4/3] bg-neutral-100 w-full overflow-hidden">
                    <img
                      src={activeProperty.image}
                      alt={activeProperty.title}
                      className="w-full h-full object-cover"
                    />
                    
                    {/* Favorite Heart Trigger */}
                    <button
                      onClick={(e) => toggleFavorite(e, activeProperty.id)}
                      className="absolute top-3 right-3 p-2 rounded-full bg-black/40 backdrop-blur-md border border-white/10 hover:bg-black/60 transition"
                    >
                      <Heart
                        className={`w-4 h-4 transition ${
                          isFavorited[activeProperty.id] ? "fill-red-500 text-red-500 scale-110" : "text-white"
                        }`}
                      />
                    </button>

                    <div className="absolute bottom-3 left-3 bg-indigo-600 text-white text-[9px] font-bold px-2 py-0.5 rounded-full">
                      ★ {activeProperty.rating}
                    </div>
                  </div>

                  {/* Card description details */}
                  <div className="p-3.5 flex flex-col gap-2 text-left">
                    <div className="flex items-start justify-between gap-1">
                      <div>
                        <h3 className="text-xs font-bold leading-tight text-slate-900">{activeProperty.title}</h3>
                        <p className="text-[10px] text-slate-500 flex items-center gap-0.5 mt-0.5">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          {activeProperty.location}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-bold text-slate-900">₹{activeProperty.price}</span>
                        <span className="text-[9px] text-slate-500 block">/night</span>
                      </div>
                    </div>

                    {/* Room features */}
                    <div className="flex gap-2.5 text-[9px] text-slate-500 pt-2 border-t border-slate-100">
                      <span>{activeProperty.bedrooms} Beds</span>
                      <span>•</span>
                      <span>{activeProperty.bathrooms} Baths</span>
                      <span>•</span>
                      <span className="text-indigo-600 font-medium truncate">{activeProperty.amenities.join(", ")}</span>
                    </div>

                    <button 
                      onClick={() => triggerNotification(`Checking availability for ${activeProperty.title}... 📅`)}
                      className="w-full mt-2 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-[10px] font-semibold text-white transition flex items-center justify-center gap-1 shadow-md shadow-indigo-600/10"
                    >
                      <span>Check Availability</span>
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                </motion.div>
              </AnimatePresence>
            </motion.div>
          )}

          {activeTab === "wishlists" && (
            <motion.div
              key="wishlists"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex flex-col gap-3 py-2 text-left"
            >
              <h2 className="text-sm font-bold text-slate-900">Wishlists</h2>
              <div className="grid grid-cols-2 gap-2.5">
                {Object.values(DEMO_PROPERTIES).map((prop) => (
                  <div key={prop.id} className="relative rounded-xl overflow-hidden bg-white border border-slate-100 shadow-sm">
                    <img src={prop.image} className="w-full aspect-[4/3] object-cover" />
                    <button
                      onClick={(e) => toggleFavorite(e, prop.id)}
                      className="absolute top-2 right-2 p-1.5 rounded-full bg-black/40 backdrop-blur-sm"
                    >
                      <Heart className={`w-3.5 h-3.5 ${isFavorited[prop.id] ? "fill-red-500 text-red-500" : "text-white"}`} />
                    </button>
                    <div className="p-2">
                      <span className="text-[10px] font-bold block truncate text-slate-900">{prop.title}</span>
                      <span className="text-[9px] text-slate-500 block mt-0.5">₹{prop.price}/night</span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === "trips" && (
            <motion.div
              key="trips"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex flex-col gap-4 py-2 text-left"
            >
              <h2 className="text-sm font-bold text-slate-900">Upcoming Trips</h2>
              <div className="p-4 rounded-xl bg-white border border-slate-100 shadow-sm flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 text-sm">
                    🏔️
                  </div>
                  <div>
                    <span className="text-xs font-bold block text-slate-900">Mountain Cabin</span>
                    <span className="text-[9px] text-slate-500">June 12 - June 17, 2026</span>
                  </div>
                </div>
                <span className="text-[9px] px-2 py-0.5 rounded-full bg-green-50 text-green-700 border border-green-200/50 font-semibold">
                  Confirmed
                </span>
              </div>
            </motion.div>
          )}

          {activeTab === "profile" && (
            <motion.div
              key="profile"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex flex-col gap-4 py-2 text-center items-center"
            >
              <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-xl font-bold text-white relative">
                BG
                <div className="absolute bottom-0 right-0 w-4 h-4 rounded-full bg-green-500 border-2 border-slate-50" />
              </div>
              <div>
                <span className="text-sm font-bold block text-slate-900">Bob Guest</span>
                <span className="text-[9px] text-slate-500">guest@example.com</span>
              </div>
              <div className="w-full bg-white border border-slate-100 rounded-xl text-left overflow-hidden shadow-sm">
                <div className="p-3 border-b border-slate-100 flex items-center justify-between text-xs cursor-pointer hover:bg-slate-50">
                  <span className="text-slate-800">Personal Info</span>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                </div>
                <div className="p-3 border-b border-slate-100 flex items-center justify-between text-xs cursor-pointer hover:bg-slate-50">
                  <span className="text-slate-800">Payments & Payouts</span>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                </div>
                <div className="p-3 flex items-center justify-between text-xs cursor-pointer hover:bg-slate-50" onClick={() => triggerNotification("Demo mode - signed out! 🔒")}>
                  <span className="text-red-500 font-medium">Sign Out</span>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>

      {/* 3. Bottom Tab Bar and Home Indicator */}
      <div className="bg-white border-t border-slate-200/60 px-4 pt-2 pb-4 flex flex-col gap-2">
        <div className="flex items-center justify-between">
          
          <button
            onClick={() => setActiveTab("explore")}
            className={`flex flex-col items-center gap-0.5 flex-1 transition ${
              activeTab === "explore" ? "text-indigo-600" : "text-slate-400"
            }`}
          >
            <Compass className="w-4 h-4" />
            <span className="text-[9px]">Explore</span>
          </button>
          
          <button
            onClick={() => setActiveTab("wishlists")}
            className={`flex flex-col items-center gap-0.5 flex-1 transition ${
              activeTab === "wishlists" ? "text-indigo-600" : "text-slate-400"
            }`}
          >
            <Heart className="w-4 h-4" />
            <span className="text-[9px]">Wishlists</span>
          </button>

          <button
            onClick={() => setActiveTab("trips")}
            className={`flex flex-col items-center gap-0.5 flex-1 transition ${
              activeTab === "trips" ? "text-indigo-600" : "text-slate-400"
            }`}
          >
            <Compass className="w-4 h-4 rotate-45" />
            <span className="text-[9px]">Trips</span>
          </button>

          <button
            onClick={() => setActiveTab("profile")}
            className={`flex flex-col items-center gap-0.5 flex-1 transition ${
              activeTab === "profile" ? "text-indigo-600" : "text-slate-400"
            }`}
          >
            <User className="w-4 h-4" />
            <span className="text-[9px]">Profile</span>
          </button>
        </div>

        {/* Home Indicator line */}
        <div className="w-24 h-1 bg-slate-900/20 rounded-full mx-auto mt-1" />
      </div>

    </div>
  )
}

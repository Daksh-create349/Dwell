# Dwell

Dwell is a premium, direct peer-to-peer rental marketplace designed for modern homes. It connects hosts and guests directly, enabling transparent transactions, verified profile trust scores, and simple booking workflows.

This platform is currently under active preparation and is launching soon.

## Core Features

### For Guests
- Advanced search: Filter listings by location, price constraints, and bedroom capacity.
- Favorites system: Bookmark and save desired properties to a curated personal list.
- Real-time booking: Check date-based availability instantly and request reservations.
- Verified reviews: Read and write authentic reviews with a 5-star rating system.
- Guest dashboard: Manage active, upcoming, and past reservations.

### For Hosts
- Instant listings: Set up detailed listings with locations, pricing, and key amenities.
- Rental dashboard: Keep track of guest bookings, calendar availability, and confirm or reject incoming booking requests.
- Income tracking: Monitor monthly revenue and financial statistics.
- Review management: View guest comments and property ratings.

### Platform Infrastructure
- Localized pricing: Formatted in Indian Rupees (INR) with locations tailored to premium Mumbai neighborhoods (Bandra, Juhu, Colaba, Powai).
- Authentication: Secure email-based sessions synced via cookies.
- Responsive design: Optimized for desktop screens and features an interactive iOS mobile mockup screen in the hero display.
- Smooth scrolling: Built-in momentum scrolling using the Lenis physics engine.

## Tech Stack

| Category | Technology |
|----------|-------------|
| Frontend | Next.js 16, React 19, TypeScript |
| Styling | Tailwind CSS, Shadcn UI |
| Scroll Physics | Lenis |
| Backend | Next.js Server Components and API routes |
| Database Helper | Local filesystem JSON database engine (mock-db) |
| Hosting | Vercel |

## Quick Start

### 1. Clone the Repository
```bash
git clone <repository-url>
cd dwell
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Run the Development Server
```bash
npm run dev
```
Open http://localhost:3000 in your browser to view the application.

## Project Structure

```
app/                    # Next.js page routing and layouts
├── api/                # REST endpoints for favorites, bookings, properties, and auth
├── auth/               # Login, sign-up, and verification screens
├── dashboard/          # Guest and host control panel
├── favorites/          # Saved properties directory
├── host/               # Property owner listing and booking manager
├── search/             # Search portal and filters
└── layout.tsx          # Root layout and theme injection

components/             # React visual components
├── ui/                 # Reusable primitive blocks (buttons, dialogs, cards)
├── header.tsx          # Dwell navigation bar
├── hero-section.tsx    # Parallax video section with integrated iPhone device
├── footer.tsx          # Unified footer layout with twilight modern home image
├── services-section.tsx# Features backdrop with Unsplash modern villa photo
└── mobile-demo-screen.tsx # Interactive iPhone preview mockup screen
```

## Launch Plan and Status

Status: Building (Mock Mode)

Dwell is currently in an active building state. All database tables and user authentication services are configured to run in mock mode using a local JSON database, enabling rapid prototyping and local execution without external service dependencies.


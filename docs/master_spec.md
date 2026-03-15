# 🏰 Master Specification: Project Digital Plaid (Final & Exhaustive)

## I. Technical Architecture & Stack

- **Frontend**: React Native (Expo) with NativeWind.
- **Backend Architecture (LIVE)**:
  - **Core**: Node.js/TypeScript on AWS EC2 (Auto-PM2).
  - **Database**: Supabase (Postgres) - Consolidated "Skipper Factory" Project.
  - **Cache**: Upstash Managed Redis (Remote).
  - **AI Strategist**: Dual-LLM Balancing (Gemini 1.5 Flash for speed/cost, GPT-4o for complex Guardian reasoning).
  - **Automation**: Cloudflare Worker "OTP Sniffer" for Disney authentication interception.
- **Offline-First Resilience**: Mandatory local caching (SQLite/AsyncStorage). Must function in Wi-Fi "dead zones."
- **Battery Strategy**:
  - **Strict No-GPS**: Location inferred from the "Last Completed Step."
  - **FuelRod Integration**: Maps nearest swap stations when battery < 20%.
  - **Lazy Fetching**: API pings only on Step Completion, Manual Recalibrate, or Mobile Order triggers.

## II. The Multi-Guest Intake System

- **Demographics**: Tracks Name, Age, Gender, and Height (Mandatory for Rider Switch).
- **Link-Share Surveys**: Unique URLs for all guests; Leader can act on behalf of others.
- **Preference Matrix**:
  - **Rides & Characters**: Must-Do, Like-to-Do, Will Avoid.
  - **Foodie Profile**: Allergies (auto-filter), Cuisine, and Dining Style.
  - **Sensory Tags**: Sensitivity identification (Loud, Dark, Drops) for warnings.
  - **Ambition & Stamina**: Day’s pace (1–10 scale) to minimize walking distance.

## III. Year-Round Seasonal Logic Layer

- **SeasonalCalendar Query**: Adjusts logic based on the date.
- **Crowd Displacement**: Peak Season counter-programming (Opposite to parade/firework flows).
- **Magic Key Layer**: Priority to Festivals, Seasonal Snacks, and Limited-Time Characters for locals.
- **Weather-Driven Prep**: Dynamic Packing Lists (Ponchos/socks for rain; cooling towels for heat).

## IV. 2026 Temporal Rule Engine

- **Resort Switching**: Flip per day based on ParkID (WDW vs. DL).
- **WDW (4 Parks)**: Pre-booking (7/3 days), LL Multi Pass Tiers, 45-min transport buffers.
- **DL Resort (DL/DCA)**: Day-of booking, 5-min walking buffers, DCA 25th event overlays.
- **2026 Exclusions**: Big Thunder (WDW), Buzz Lightyear (WDW), Rock 'n' Roller Muppet retheme, Jungle Cruise (DL), Space Mountain (DL).

## V. Tactical Coach & "Invisible Itinerary" Logic

- **Rider Switch Double-Block**: 1.5x duration multiplier + Waiting Parent steps.
- **Task Killer**: Character Dining automatically marks characters as "Met."
- **The Bio-Clock (Bathrooms)**: 10-15m "Bio-Break" buffers every 2-3 hours (Party-aware).
- **Stroller Logic**: 5m "Park & Prep" and "Retrieve" buffers. Exit vs. entrance mapping.
- **Baby Care Centers**: Prioritized as "Safe Harbors" for families with children < 3 years.
- **Parade Wall**: Hard-barrier logic preventing crossing during showtimes.
- **Mobile Order Watchdog**: Dynamic alerts (Kitchen lead time + 10m buffer).
- **Persona**: "Tactical Expert" — Decisive, protective, narrative style.

## VI. Mini Memory Maker (Recap)

- **Planned vs. Actual**: Vertical timeline comparison.
- **Trophy Room**: "Wait Time Defeated," "Characters High-Fived," etc.
- **Joy Graph**: Sentiment emojis mapped against the timeline.
- **Memory Note**: High-point description + photo upload.

## VII. UX/UI Design Philosophy

- **Theme**: "Executive Plaid" (Forest Green, Cream, Gold) for mobile; "Sophisticated Whimsy" (Aged Parchment, Dark Navy, Royal Thistle, Burnished Gold) for the pre-trip Web-App.
- **Sophisticated Whimsy Dashboard (Web)**: Four Experience Collections (The Daily Pulse, The Grand Plan, The Field Kit, The Keepsake). Stationery-style cards with sharp corners and "No-Bleed" data grids.
- **Sunlight Mode**: Ultra-high contrast, 16pt+ sans-serif fonts.
- **Thumb-Zone Layout**: Interactive elements in bottom 30%.
- **Nudge Triggers**: Sensory cues, Photo-ops, Hidden Mickeys.

## XII. Spring Break 2026 Stress Test Dataset

- **Crowd Displacement**: +40% wait time penalty during March-April 2026.
- **Parade Wall (WDW)**: Festival of Fantasy at 12:00 PM and 3:00 PM. No transitions between Frontierland/Tomorrowland 15m before/during (11:45-12:40, 2:45-3:40).
- **Festival Overlays**:
  - **EPCOT**: Garden Graze (Foodie Crawl) and morning Butterfly Garden priority.
  - **DCA 25th**: "Better Together" +15 min transit penalty for Hollywood Land.
- **Construction Refurbs**: Big Thunder (WDW), Rock 'n' Roller (WDW), Haunted Mansion (DL - VQ Only).

## XIII. "Invisible Itinerary" Validation (The 23-Min Test)

- **Scenario**: Family of 4 + 2yo in stroller.
- **Calculation**: Exit/Retrieve (5m) + Bio-Break (10m) + Transit (3m) + Stroller Park (5m).
- **Hard Rule**: Total transition = 23 mins. Any result < 23m is a failure state.

## XIV. Detailed Packing List Logic

- **Heat (>80°F)**: Cooling towels, electrolyte packets, AC spot mapping.
- **Rain (>40%)**: Ponchos, Ziploc bags, Indoor show pivots.
- **Cold (<65°F)**: Light hoodies for post-fireworks.

> [!IMPORTANT]
> **Master Constraint**: Every `ItineraryStep` must include a `LogisticalShadow` (5-10m) for bathroom/stroller management.

## XV. Repository Ownership & Tooling Boundaries

> [!CAUTION]
> **These ownership rules are strict and must never be violated without explicit user approval.**

| Repository | Primary Editor | Antigravity Access | Notes |
| --- | --- | --- | --- |
| `castle-web` | **Lovable** | 🔒 **Read-Only** | Marketing site. Sourced from `castle-web2` on GitHub (Lovable-built, cloned 2026-03-15). Old version backed up to `castle-web-backup`. Antigravity must NOT commit or push to this repo. |
| `castle-dashboard` | **Antigravity** | ✅ Full Access | Admin ops dashboard. Antigravity is the primary editor. |
| `digital-plaid` | **Antigravity** | ✅ Full Access | Mobile app spec & docs. Antigravity is the primary editor. |

### Rules for Antigravity

1. **`castle-web` is READ-ONLY.** Do not create, modify, commit, or push any files in this repo unless the user explicitly requests it *and* confirms they want Antigravity (not Lovable) to make the change.
2. **Always `git pull` before editing.** Before making changes to any repo, pull the latest from `origin/main` to avoid overwriting remote changes from Lovable or other tools.
3. **Branch policy.** If the user requests Antigravity changes to a Lovable-owned repo, work on a separate branch (e.g., `antigravity/fix-name`) — never commit directly to `main`.

# Implementation Plan - Digital Plaid

Digital Plaid is a high-end, tactical Disney companion PWA designed for parents. It features a 2026-ready rule engine, offline-first resilience, and a sophisticated "Executive Plaid" design.

## Proposed Changes

### [Component] Project Setup

- [NEW] Initialize Expo (React Native) with TypeScript.
- [NEW] Integrate NativeWind for styling.
- [NEW] Setup Supabase for backend services (Auth, Database, Edge Functions).

### [Component] Data Layer

- [NEW] Refined Supabase Schema:
  - `trips`: `id`, `user_id`, `resort_id`, `start_date`, `end_date`, `goal`, `stamina_score` (1-10).
  - `seasonal_rules`: `id`, `park_id`, `date`, `is_peak`, `crowd_modifier`, `standard_wait_override`.
  - `park_exclusions`: `id`, `park_id`, `item_name`, `status` (Refurb/VQ), `start_date`, `end_date`.
  - `guests`: `id`, `trip_id`, `name`, `age`, `gender`, `height_cm`, `sensory_sensitivities` (JSON), `stroller_required` (boolean).
  - `preferences`: `guest_id`, `item_id`, `item_type`, `rank`, `allergies`, `character_type_pref`, `snack_habit`, `already_done` (boolean), `requires_das` (boolean).
  - `surveys`: `id`, `trip_id`, `guest_id`, `status` (Sent/Completed/LeaderFilled).
  - `itinerary_steps`: `id`, `trip_id`, `step_name`, `park_id`, `planned_start`, `actual_start`, `status`, `is_pivot`, `nudge_id`.
  - `memory_logs`: `id`, `trip_id`, `log_date`, `planned_v_actual`, `sentiment_score`, `memory_note`, `nudge_log` (JSON).

### [Component] Logic Engines

- [NEW] `2026RuleEngine.ts`:
  - **Dynamic Rule Switching**: WDW/DL logic.
  - **Pathing Penalty**: +20 min crossing penalty for parades/fireworks.
  - **Refurbishments**: Hard-coded exclusions.
- [NEW] `Recalibrator.ts`:
  - **The Brain**: Triggers on `Down` or `>20min` spikes.
  - **Comfort Logic**: Time-aware pivots (1-4 PM) for AC/indoor shows.
  - **Proximity Search**: Finds Like-to-Do/Characters < 20 min wait.
- [NEW] `TacticalCoach.ts`:
  - **Persona Identity**: Narrative [Pivot] + [Data] + [Benefit] structure.
  - **Hanger Watchdog**: 3-hour gap detection for snack nudges.
  - **Rider Switch Tone**: Logistical empathy for the waiting parent.
- [NEW] `MemoryRecapScreen.tsx`:
  - **Comparison Timeline**: Vertical side-by-side (Original vs. Actual).
  - **Joy Sparkline**: SVG-based chart mapping sentiment.
  - **Wins Header**: Dynamic calculation of minutes saved.
- [NEW] `ItineraryProcessor.ts`:
  - **Logistical Shadows**: Injects 5-10 min buffers for strollers and bio-breaks into EVERY step.
  - **Parade Wall**: Prevents back-to-back cross-park transitions during showtime windows.
  - **Counter-Programming**: Suggests "Opposite side" rides during major parade/firework flows.
- [NEW] `BatteryStrategist.ts`:
  - **Ultra-Light Mode**: Activates < 20% battery. Switches UI to text-only mode at < 15%.
  - **Lazy Fetching**: Event-driven data pings.

### [Component] UI/UX

- [NEW] `DesignSystem.ts`: Theme constants for "Executive Plaid" (Forest Green `#1B3022`, Cream `#F4F1DE`, Gold `#D4AF37`).
- [NEW] `GroupIntakeScreen.tsx`: Multi-step form for demographics and rankings.
- [NEW] `TacticalDashboard.tsx`: Glaceable view of the next steps and nudges.
- [NEW] `MemoryMakerRecap.tsx`: Side-by-side timeline of Planned vs Actual.

## Verification Plan

### Automated Tests

- **[NEW] `stress_spring_break.ts`**: Validates +40% penalties, Parade Wall blocks, and Hollywood Land transit penalties.
- **[NEW] `audit_invisible_itinerary.ts`**: Hard validation of the 23-minute "Invisible Itinerary" Scenario XIII.
- `npx tsx stress_tests.ts`: Core logic verification (Hanger, Rider Switch).
- `npx tsx stress_human.ts`: Basic logistical shadow verification.

### Manual Verification

- Verify the "Executive Plaid" theme colors and high-contrast accessibility.
- Test the "one-handed" navigation on mobile-sized screen.
- Simulate wait time spikes to trigger the Recalibrator.

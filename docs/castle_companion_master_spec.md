# 🏰 Castle Companion: The Master Specification

## I. Mission & Product Philosophy

**Castle Companion** (Project Digital Plaid) is a luxury concierge **"Anti-App"** designed for families who prioritize presence over phone usage. It moves beyond simple utility by providing a **"Concierge Reasoning"** experience—handling complex logistics in the background so families can remain immersed in the magic.

- **Persona**: "Warm Authority"—Knowledgeable like a VIP guide, caring like a family member.
- **Tone**: Quietly Confident and Elegantly Simple.
- **Core Promise**: To handle the logistics of the "Our Day" flow, ensuring 100% success on priorities while maintaining an unhurried, luminous experience.

---

## II. System Architecture

The platform follows a **Distributed Foundation & Hybrid Intelligence** model to balance scale, reliability, and precision.

### 1. Frontend Architecture

- **Marketing App (`castleplaid`)**: Awareness-focused discovery funnel.
- **Product & Admin App (`castle-dashboard`)**: Dedicated service portal and guest success interface.

### 2. Backend & Data Layer

- **Core**: Resilient service layer on cloud infrastructure.
- **Database**: Supabase (Postgres) for secure guest profiles and history.
- **Real-time**: High-fidelity service nodes for immediate awareness and coordination.
- **Authentication**: Seamless, secure handling of guest credentials.

### 3. Intelligence Layer (Hybrid)

- **The Reasoning Engine**: Advanced intelligence for intent and context analysis.
- **The Lore Layer (RAG)**: Guest-focused knowledge base (Accessibility rules, wait-time history, VIP strategies).
- **The Experience Layer**: Fine-tuned models optimized for a professional, warm concierge tone.
- **Service Guardrails**: Absolute reliability for guest comfort (Weather pivots, Flow buffers).

---

## III. User Application Features

### 1. Multi-Guest Intake System

- **Profile Matrix**: Tracks Name, Age, and Accessibility needs.
- **Survey Link-Share**: Collaborative planning via unique guest URLs.
- **Preference Weighting**: "Preferred" vs. "Will Avoid," including Comfort Tags (Loud, Dark, Intensity).

### 2. 2026 Temporal Engine

- **Resort Awareness**: Seamless switching between WDW (Orlando) and DL (California).
- **2026 Anniversary Content**: Integration of major park milestones and specialized refurbishments.
- **Service Integration**: Planning logic for current resort systems.

### 3. The "Comfort Layer" Physics

The system calculates the **"Logistical Buffer"** for every step:

- **Mobility Prep**: 5-10m buffers for equipment (strollers/mobility aids) during transitions.
- **Refreshment Breaks**: Automated 10-15m pauses every 2-3 hours based on party age.
- **Crowd Flow Buffer**: Prevents high-friction transitions during peak showtimes or parades.
- **Wellness Awareness**: 3-hour interval checks to suggest hydration and snacks.

### 4. Memory Gallery (Post-Trip)

- **Our Day Recap**: A comparison of the planned moments versus the actual experience.
- **Sentiment Map**: A visual timeline of guest satisfaction across the day.
- **Value Header**: Highlights "Time Saved" and "Unique Experiences Captured."

---

## IV. Administrative & Service Operations

### 1. Assistant Network (Service Nodes)

To ensure 100% uptime and responsiveness, the system operates a managed network of high-fidelity service nodes.

- **Automated Service Initialization**: Scalable cloud nodes that spin up to meet peak resort demand.
- **Network Resilience**: Diverse entry points to ensure reliable connection to park telemetry.
- **Service Lifecycle**: Managed node health with pro-active awareness and renewal.

### 2. Concierge Presence Hub (Monitoring & Self-Healing)

The Admin interface is a **Proactive Care Engine** designed to stop complications before they impact the guest.

- **Real-time Guest Telemetry**: Live awareness of "In-Park" sessions, highlighting guests with "Low Joy" scores or stalled progress.
- **Proactive Issue Awareness**:
    - **Wait-Time Volatility**: Detects 20min+ spikes in planned attractions and triggers auto-recalculations across the impacted guest pool.
    - **Physical Constraints**: Monitors park parade pathing and shuttle shifts to preemptively update "Comfort Buffers."
- **Self-Healing Protocols**:
    - **IP Rotation & Auth Healing**: System detects service node interruptions or Auth-Loops and automatically cycles cloud IPs and re-initializes sessions.
    - **Capacity Failover**: Reasoning latency drift triggers automatic routing to high-fidelity fallback clusters.
- **Verification Loop**: Every care action (IP Cycle, Cache Purge, Cluster Shift) is followed by a "Service Heartbeat" check to verify restoration of nominal performance.

### 3. Guest Support & Experience Management

Comprehensive tools for the support team to ensure guest success.

- **Guest Care Mode (Impersonation)**: Support staff can view a guest's live flow and "Concierge Reasoning" to troubleshoot specific issues in real-time.
- **Manual Overrides**: Global and per-trip overrides for park closures, sensory sensitivity adjustments, and emergency care pauses.
- **Support Inbox**: Integrated guest feedback loop for immediate assistance during park hours.
- **Lore Editor**: Tools to manually inject "Hyper-Local" tips (e.g., hidden characters, temporary snack availability).

---

## V. Design & UX Standards

- **Primary**: Deep Royal Lapis (`#1C2A4A`) — Foundation and trust.
- **Accent**: Champagne Gold (`#D4A843`) — Magic and VIP status.
- **Secondary**: Alabaster Cream (`#F7F3EE`) — Clean luxury and background "breathing room."
- **Typography Foreground**: Lapis Navy (`#1B2948`) — High-contrast readability.

- **Typography**: 
    - **Headings**: Playfair Display (Italics for accent).
    - **UI/Body**: Inter.
- **Ambient Design**: Minimalist UX with a focus on Dynamic Island and Lock Screen awareness.
- **Intentional Motion**: Animations (0.6–0.8s) that feel unhurried and elegant.

---

## VI. Data Schema Overview (Consolidated)

- `trips`: Resort location, guest goals, and trip parameters.
- `guests`: Demographics and accessibility requirements.
- `itinerary_steps`: Planned actions with associated comfort buffers.
- `service_nodes`: Node health, connection fidelity, and assignment.
- `lore_updates`: Time-bounded modifiers for seasonal flow and capacity.
- `support_tickets`: Guest issues, status, and care logs.

---

> [!IMPORTANT]
> **Constraint #1**: No transition can be shorter than the calculated Logistical Buffer for the party's mobility profile.
> **Constraint #2**: All service node traffic must prioritize reliability and mimic authentic guest interaction patterns.
> **Constraint #3**: Any "Service Alert" requires mandatory verification within 4s of remediation.

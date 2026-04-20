export type ResortID = 'DL' | 'WDW';

export type ParkID = 'MK' | 'EP' | 'HS' | 'AK' | 'DL' | 'DCA';

export type SubscriptionTier = 'voyage' | 'pixie_dust' | 'glass_slipper' | 'intelligent_blueprint';
export type SubscriptionStatus = 'active' | 'past_due' | 'canceled' | 'none';

export type Goal = 'The Completionist' | 'The Relaxed Parent' | 'The Socialite' | 'The Romantic';

export type TripType = 'family' | 'adult' | 'date' | 'solo';

export type StepStatus = 'pending' | 'completed' | 'skipped' | 'down';

export type StepType = 'ride' | 'character' | 'food' | 'transport' | 'break' | 'show' | 'snack';

export type Ranking = 'must-do' | 'like-to-do' | 'avoid';

export interface ParkRule {
    resort_id: ResortID;
    dining_window_days: number;
    ll_booking_window_resort: number;
    ll_booking_window_other: number;
    has_tiers: boolean;
    transport_buffer_mins: number;
    virtual_queue_times: string[];
}

export interface Trip {
    id: string;
    user_id: string;
    resort_id: ResortID;
    trip_type: TripType;
    start_date: string;
    end_date: string;
    goal: Goal;
    stamina_score: number; // 1-10 walking capacity
}

export interface Ride {
    id: string;
    name: string;
    park_id: ParkID;
    height_requirement_cm?: number;
    intensity: 'High' | 'Moderate' | 'Low';
    sensory_tags?: string[];
    // Strategic metadata (enriched from backend API)
    singleRider?: boolean;
    hasRiderSwitch?: boolean;
    heightRequirement?: number;     // inches (from backend)
    rideType?: 'thrill' | 'family' | 'dark' | 'water' | 'show' | 'transport' | 'spinner';
    durationMinutes?: number;
    llTier?: 1 | 2 | null;
    earlyEntryAvailable?: boolean;
    eehAvailable?: boolean;
    virtualQueue?: boolean;
    landmark?: string;
}

export type WDWPassTier = 'Incredi-Pass' | 'Sorcerer' | 'Pirate' | 'Pixie';
export type DLPassTier = 'Inspire' | 'Believe' | 'Enchant' | 'Imagine';
export type UnifiedPassTier = 'Premier'; // Placeholder for future unified/premier offerings

export interface Membership {
    is_dvc: boolean;
    wdw_ap_tier?: WDWPassTier;
    dl_ap_tier?: DLPassTier;
    unified_ap_tier?: UnifiedPassTier;
}

export interface Guest {
    id: string;
    trip_id: string;
    name: string;
    age: number;
    gender: string;
    height_cm: number;
    is_first_timer?: boolean;
    sensory_sensitivities?: string[]; // e.g., 'Loud', 'Dark', 'Drops'
    stroller_required?: boolean;
    memberships?: Membership;
}

export interface Preference {
    id: string;
    guest_id: string;
    item_id: string;
    item_type: StepType;
    rank: Ranking;
    allergies?: string[];
    character_type_pref?: 'Furry' | 'Face';
    snack_habit?: string;
    already_done?: boolean; // For locals/repeat visitors
    requires_das?: boolean;
}

export interface Survey {
    id: string;
    trip_id: string;
    guest_id: string;
    status: 'Sent' | 'Completed' | 'LeaderFilled';
}

export interface ItineraryStep {
    id: string;
    trip_id: string;
    park_id: ParkID;
    step_name: string;
    step_type: StepType;
    planned_start: string;
    actual_start?: string;
    planned_wait?: number;
    actual_wait?: number;
    status: StepStatus;
    is_pivot: boolean;
    nudge_id?: string;
    notes?: string;
    sensory_tags?: string[]; // e.g., ['Loud', 'Dark']
    intensity?: 'High' | 'Moderate' | 'Low';
    recovery_buffer?: number; // minutes for quiet time
    extra_buffers?: {
        pre?: number; // minutes
        post?: number; // minutes
    };
    logistical_shadow?: number; // Mandatory 5-10m buffer
    duration_mins?: number;
}

export interface SeasonalRule {
    id: string;
    park_id: ParkID;
    date: string;
    is_peak: boolean;
    crowd_modifier: number; // e.g., 1.2 for 20% spike
    standard_wait_override?: Record<string, number>;
}

export interface MemoryLog {
    id: string;
    trip_id: string;
    log_date: string;
    planned_v_actual: any; // Comparison JSON
    nudge_log?: any; // Contextual nudges history
    sentiment_score: number;
    memory_note: string;
    photo_url?: string;
}

export interface Achievement {
    id: string;
    title: string;
    description: string;
    icon: string;
}

export interface MemorySnapshot {
    id: string;
    title: string;
    location: string;
    timestamp: string;
    type: string;
    highlight?: string;
}

export interface JourneySummary {
    adventureName: string;
    totalSteps: number;
    memories: MemorySnapshot[];
    narrative: string;
    date: string;
    achievements?: Achievement[];
    minutesSaved?: number;
}

export interface BookingRequest {
    id: string;
    rideId: string;
    rideName: string;
    targetTimeWindow: 'Morning' | 'Afternoon' | 'Evening' | 'Anytime' | string;
    status: 'Searching' | 'Booked' | 'Failed' | 'On Hold';
    splitAllowed?: boolean;
    reason?: string;
}

export interface StrategyProfile {
    // Modular Synthesis Fields (Mapped directly from castle-web)
    pacingFilter: 'intense' | 'moderate' | 'relaxed';
    primaryFocus: 'thrills' | 'toddlers' | 'classic' | 'shows';
    diningStyle: 'snacks' | 'quick' | 'table' | 'signature';

    // Logistical Parameters
    singleRiderAllowed: boolean;
    dasAllowed: boolean;
    onSiteResort: boolean;

    // Proposed Future Additions
    arrivalIntent?: 'rope-drop' | 'leisurely' | 'evening-only';
    splurgeAppetite: 'low' | 'moderate' | 'high';
    premiumInterests: string[]; // e.g., ['droids', 'lightsabers', 'makeovers', 'dessert-party', 'vip-tour']

    budgetDirectives: {
        llMultiPassAllowed: boolean;
        llSinglePassAllowed: boolean;
        autoPurchasePhotoPass: boolean;
        allowMerchandiseUpcharges: boolean;
        allowReservedSeatingPackages: boolean;
    };

    rideDirectives: {
        maxWaitToleranceMins: number;
        thrillCap: 'Low' | 'Moderate' | 'High';
        prioritizeIndoor: boolean;
        strobeSensitivity?: boolean;
        loudNoiseSensitivity?: boolean;
    };
}

export type FeedbackScore = -5 | -1 | 1 | 5;

export interface PivotRecord {
    id: string;
    tripId: string;
    timestamp: string;
    triggerEvent: string; // e.g., "Space Mountain Downtime"
    suggestedAction: string; // e.g., "Ride Astro Orbiter"
    implicitFeedbackScore?: FeedbackScore; // Captured via Telemetry
    explicitFeedbackScore?: FeedbackScore; // Captured via User UI
    context: StrategyProfile; // Replaced StrategyArchetype
}

export interface TelemetryEvent {
    id: string;
    tripId: string;
    timestamp: string;
    eventType: 'Ride_Skipped' | 'Pace_Slower_Than_Expected' | 'Pace_Faster_Than_Expected' | 'Break_Taken_Early';
    details: string;
}

// ── Phase 5A: Park Status & Closure Intelligence ──────────────────────

export type AttractionOperatingStatus = 'OPEN' | 'CLOSED' | 'REFURB' | 'DELAYED' | 'WEATHER_HOLD';

export interface AttractionStatus {
    attractionId: string;
    name: string;
    parkId: string;
    status: AttractionOperatingStatus;
    currentWaitMins?: number;
    lastUpdated: string;
    closureReason?: string;
    reopenDate?: string;
    alternativeIds?: string[];
}

export interface ParkClosure {
    attractionId: string;
    name: string;
    parkId: string;
    closureType: 'temporary' | 'permanent' | 'seasonal' | 'refurbishment';
    closureStart: string;
    closureEnd?: string;
    reason: string;
    alternativeNames: string[];
}

// ── Phase 5C: Notification & Haptic Protocol ──────────────────────────

export type HapticPattern = 'DOUBLE_TAP' | 'LONG_VIBRATION' | 'TRIPLE_PULSE' | 'GENTLE_NUDGE';
export type NudgeType = 'PIVOT' | 'RAIN_ALERT' | 'DINING_HANDOFF' | 'SHOWTIME_SHIFT' | 'LL_READY' | 'GENERAL';

export interface NudgePayload {
    nudgeType: NudgeType;
    hapticPattern: HapticPattern;
    message: string;
    actionLink?: string;
    funSeekTrigger?: string;
    expiresAt?: string;
    priority: 'low' | 'medium' | 'high' | 'critical';
}

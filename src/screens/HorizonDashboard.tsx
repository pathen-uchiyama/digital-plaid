import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, Modal, Dimensions } from 'react-native';
import { THEME } from '../utils/DesignSystem';
import {
    Rocket, Clock, Sparkles, Utensils, Zap, Users, Star, Heart, Shield, CheckCircle, CloudRain, Sun, Thermometer,
    Search,
    Map as MapIcon,
    Battery,
    Wand2,
    Zap as ZapIcon
} from 'lucide-react-native';
import { Recalibrator, PivotDecision } from '../utils/Recalibrator';
import { RefinedCoach } from '../utils/ConciergeCoach';
import { BatteryStrategist } from '../utils/BatteryStrategist';
import { ItineraryStep, Guest, Preference, JourneySummary, Achievement, Ride } from '../types';
import FamilyVoteModal from '../components/FamilyVoteModal';
import FamilyIntegrityModal from '../components/FamilyIntegrityModal';
import { ContextManager } from '../utils/ContextManager';
import { SubscriptionManager, FeatureFlag } from '../utils/SubscriptionManager';
import { MemoryMaker } from '../utils/MemoryMaker';
import MemoryRecapScreen from './MemoryRecapScreen';
import { LightningLaneStrategist } from '../utils/LightningLaneStrategist';
import { LogisticsEngine, LogisticsAlert } from '../utils/LogisticsEngine';
import RideReviewModal from '../components/RideReviewModal';
import { findAndSeekStore } from '../utils/FindAndSeekEngine';
import { WeatherProtocol, WeatherCondition } from '../utils/WeatherProtocol';
import { AchievementsEngine } from '../utils/AchievementsEngine';
import { autoBookingEngine } from '../utils/AutoBookingManager';

import { CharacterIntelEngine, CharacterSighting } from '../utils/CharacterIntelEngine';
import { BestSpotDatabase } from '../utils/BestSpotDatabase';
import { YelpIntegrator, YelpSupport } from '../utils/YelpIntegrator';
import { TransportTracker, TransportOption } from '../utils/TransportTracker';
import { ParkHopCoordinator, ParkHopRecommendation } from '../utils/ParkHopCoordinator';
import { AutoModifyEngine, BetterTime } from '../utils/AutoModifyEngine';
import { StrandedProtocol, FailoverRoute } from '../utils/StrandedProtocol';
import { EnergyOptimizer, PathEfficiency } from '../utils/EnergyOptimizer';
import { LiveActivityManager } from '../utils/LiveActivityManager';
import { RoutingEngine, RouteRecommendation } from '../utils/RoutingEngine';
import { Troubleshooter, Diagnosis } from '../utils/Troubleshooter';
import { DecompressionEngine, QuietZone } from '../utils/DecompressionEngine';
import { MobileOrderWatchdog } from '../utils/MobileOrderWatchdog';
import { PersonalityModule } from '../utils/PersonalityModule';
import { OfflineSyncManager } from '../utils/OfflineSyncManager';
import { RLHFEngine } from '../utils/RLHFEngine';
import { useParkStatus } from '../hooks/useParkStatus';

const { width } = Dimensions.get('window');

interface HorizonDashboardProps {
    adventureName?: string;
    initialGuests?: Guest[];
    initialPreferences?: Preference[];
    napStrategy?: 'power' | 'nap' | 'quiet';
    staminaLevel?: number;
    rideCountGoal?: 'max' | 'relaxed';
    resortId?: 'WDW' | 'DL';
    weather: WeatherCondition;
    setWeather: (w: WeatherCondition) => void;
    characterSightings: CharacterSighting[];
    setCharacterSightings: (s: CharacterSighting[]) => void;
    yelpData: Record<string, YelpSupport>;
    setYelpData: (y: Record<string, YelpSupport>) => void;
    strollerPin: LogisticsAlert | null;
    setStrollerPin: (p: LogisticsAlert | null) => void;
    parkingPin: LogisticsAlert | null;
    setParkingPin: (p: LogisticsAlert | null) => void;
    rendezvousPin: LogisticsAlert | null;
    setRendezvousPin: (p: LogisticsAlert | null) => void;
    intelAlert: string | null;
    setIntelAlert: (a: string | null) => void;
    sunlightMode: boolean;
    setSunlightMode: (m: boolean) => void;
    minutesSaved: number;
    isConsensusActive: boolean;
    setIsConsensusActive: (b: boolean) => void;
    setHeadsUpNudge: (n: string | null) => void;
    subscriptionTier?: string;
    onPaywall?: () => void;
}

export default function HorizonDashboard({
    adventureName = "Magic Expedition",
    initialGuests,
    initialPreferences,
    napStrategy = 'power',
    staminaLevel = 5,
    rideCountGoal = 'relaxed',
    resortId = 'WDW',
    weather,
    setWeather,
    characterSightings,
    setCharacterSightings,
    yelpData,
    setYelpData,
    strollerPin,
    setStrollerPin,
    parkingPin,
    setParkingPin,
    rendezvousPin,
    setRendezvousPin,
    intelAlert,
    setIntelAlert,
    sunlightMode,
    setSunlightMode,
    minutesSaved,
    isConsensusActive,
    setIsConsensusActive,
    setHeadsUpNudge,
    subscriptionTier = 'explorer',
    onPaywall
}: HorizonDashboardProps) {
    const [pivot, setPivot] = useState<PivotDecision | null>(null);
    const [batteryLevel, setBatteryLevel] = useState(0.8);
    const [gpsEnabled, setGpsEnabled] = useState(true);
    const [showReview, setShowReview] = useState(false);
    const [currentReviewRide, setCurrentReviewRide] = useState('');
    const [seekPoints, setSeekPoints] = useState(0);
    const [completedSteps, setCompletedSteps] = useState<ItineraryStep[]>([]);
    const [transportOptions, setTransportOptions] = useState<TransportOption[]>([]);
    const [hopRecommendation, setHopRecommendation] = useState<ParkHopRecommendation | null>(null);
    const [failoverRoute, setFailoverRoute] = useState<FailoverRoute | null>(null);
    const [pathEfficiency, setPathEfficiency] = useState<PathEfficiency | null>(null);
    const [betterTime, setBetterTime] = useState<BetterTime | null>(null);
    const [auditSummary, setAuditSummary] = useState<string | null>(null);
    const [pivotAlert, setPivotAlert] = useState<string | null>(null);
    const [routingAlert, setRoutingAlert] = useState<RouteRecommendation | null>(null);
    const [activeItinerary, setActiveItinerary] = useState<ItineraryStep[]>([]);
    const [showIntegrityModal, setShowIntegrityModal] = useState(false);
    const [holdRequest, setHoldRequest] = useState<any>(null);
    const [advisoryNudge, setAdvisoryNudge] = useState<string | null>(null);
    const [diagnoses, setDiagnoses] = useState<Diagnosis[]>([]);
    const [showTroubleshooter, setShowTroubleshooter] = useState(false);
    const [decompressionZone, setDecompressionZone] = useState<QuietZone | null>(null);
    const [hungerAlert, setHungerAlert] = useState<string | null>(null);
    const [snackNudge, setSnackNudge] = useState<string | null>(null);
    const [coachingTone, setCoachingTone] = useState<string | null>(null);
    const [contextualNudge, setContextualNudge] = useState<{ type: 'Photo' | 'Sensory' | 'Hidden'; text: string } | null>(null);
    const [familyConflicts, setFamilyConflicts] = useState<{ rideId: string; type: string; guestsInvolved: string[] }[]>([]);
    const [lastCompletionTime, setLastCompletionTime] = useState<number | null>(null);
    const [lastRecalibrateTime, setLastRecalibrateTime] = useState<number | null>(null);
    const [isRecalibrating, setIsRecalibrating] = useState(false);
    const [showFullSchedule, setShowFullSchedule] = useState(false);

    // Live Queue Telemetry Bridge
    const currentParkId = activeItinerary[0]?.park_id || resortId === 'WDW' ? 'MK' : 'DL';
    const { statuses: liveStatuses, isBackendOffline } = useParkStatus(currentParkId as string);

    // Merge live wait times into the active itinerary
    const syncedItinerary = activeItinerary.map(step => {
        if (step.id.includes('MK_SPACE')) { // Mapping heuristic for mock vs live
            const live = liveStatuses.find(s => s.name.includes('Space Mountain'));
            return live ? { ...step, actual_wait: live.currentWaitMins } : step;
        }
        if (step.id.includes('MK_POTC')) {
            const live = liveStatuses.find(s => s.name.includes('Pirates of the Caribbean'));
            return live ? { ...step, actual_wait: live.currentWaitMins } : step;
        }
        return step;
    });

    const handleStartVote = () => {
        setIsConsensusActive(true);
    };

    const getDynamicCTA = () => {
        if (completedSteps.length === 0) return "Start Day";
        if (activeItinerary.length > 0) return "Explore Next Step";
        return "Complete Adventure";
    };

    const [guests] = useState<Guest[]>(initialGuests || [
        { id: 'g1', name: 'Patchen', age: 42, height_cm: 185, trip_id: 't1', gender: 'M' },
        { id: 'g2', name: 'Family Member', age: 38, height_cm: 165, trip_id: 't1', gender: 'F' }
    ]);

    const hasStroller = guests.some(g => g.stroller_required);

    const [itinerary] = useState<ItineraryStep[]>([
        {
            id: 'MK_SPACE',
            trip_id: 'trip_123',
            step_name: 'Space Mountain',
            step_type: 'ride',
            park_id: 'MK',
            planned_start: new Date().toISOString(),
            actual_wait: 70,
            planned_wait: 45,
            status: 'pending',
            is_pivot: false,
            intensity: 'High',
            sensory_tags: ['Loud', 'Dark'],
            extra_buffers: hasStroller ? { pre: 5, post: 5 } : undefined
        },
        {
            id: 'MK_POTC',
            trip_id: 'trip_123',
            step_name: 'Pirates of the Caribbean',
            step_type: 'ride',
            park_id: 'MK',
            planned_start: new Date().toISOString(),
            actual_wait: 25,
            planned_wait: 20,
            status: 'pending',
            is_pivot: false,
            intensity: 'Moderate',
            sensory_tags: ['Dark', 'Water']
        }
    ]);

    const handleRecalibrate = () => {
        if (!SubscriptionManager.hasFeatureAccess(subscriptionTier as any, 'canUseLivePivots')) {
            if (onPaywall) onPaywall();
            return;
        }

        const now = Date.now();
        const COOLDOWN_MS = 5 * 60 * 1000; // 5 minute strategic lock

        if (lastRecalibrateTime && now - lastRecalibrateTime < COOLDOWN_MS) {
            const minsLeft = Math.ceil((COOLDOWN_MS - (now - lastRecalibrateTime)) / 60000);
            Alert.alert(
                'Strategic Analysis Active',
                `Your Guardian is currently monitoring live queue telemetry and 5G signal strength. A fresh recalibration will be available in ${minsLeft} minutes.`
            );
            return;
        }

        setIsRecalibrating(true);
        Alert.alert('Recalibrating...', 'Optimizing for current wait times and group stamina.');

        // Simulation of the "Analytical Loop"
        setTimeout(() => {
            setSeekPoints(s => s + 5);
            setLastRecalibrateTime(Date.now());
            setIsRecalibrating(false);
        }, 3000);
    };

    React.useEffect(() => {
        const loadInitialData = async () => {
            const sightings = await CharacterIntelEngine.scanForSightings();
            setCharacterSightings(sightings);

            const yelp = await YelpIntegrator.getSocialProof('Food Lab');
            setYelpData({ 'Be Our Guest': yelp });

            const hop = await ParkHopCoordinator.getHopRecommendation('MK');
            setHopRecommendation(hop);

            const failover = await StrandedProtocol.analyzeFailover('EPCOT', 'Resort');
            setFailoverRoute(failover);

            const efficiency = EnergyOptimizer.analyzePath(itinerary.map(s => s.id));
            setPathEfficiency(efficiency);

            const potentialUpgrade = AutoModifyEngine.findBetterTime('MK_SPACE', '12:00 PM');
            if (potentialUpgrade) {
                setBetterTime(potentialUpgrade);
            }

            // Logistics Mocks for Misc Tab
            setStrollerPin({ id: 's1', type: 'gear', title: 'Stroller Found', message: 'Fantasyland Stroller Parking (Section B)', priority: 'medium' });
            setParkingPin({ id: 'p1', type: 'gear', title: 'Car Located', message: 'Villains Lot, Row 102', priority: 'medium' });
            setRendezvousPin({ id: 'r1', type: 'gear', title: 'Group Meeting Point', message: 'Partners Statue', priority: 'medium' });

            const shiftWarning = RefinedCoach.getCharacterShiftWarning('Mickey', new Date());
            if (shiftWarning) setIntelAlert(shiftWarning);

            // In the real app, this comes from the backend. For the UI visualizer, just set it directly.
            const refinedItinerary = itinerary;

            const { updatedItinerary: finalItinerary, pivotAlert: weatherPivot } = WeatherProtocol.evaluateWeatherPivots(
                refinedItinerary,
                weather
            );
            setPivotAlert(weatherPivot);
            setActiveItinerary(finalItinerary);

            // Mocks for family conflicts
            const conflicts: any[] = [];
            setFamilyConflicts(conflicts);

            const current = finalItinerary[0];
            if (current.step_type === 'ride' && (current.actual_wait || 0) < 15) {
                setAdvisoryNudge(`Advisory: The wait for ${current.step_name} is only ${current.actual_wait}m right now.`);
            }
        };
        loadInitialData();
    }, [weather]);

    const handleStepCompletion = async (stepId: string, review: string) => {
        const step = activeItinerary.find(s => s.id === stepId);
        if (step) {
            const updatedStep = { ...step, status: 'completed' as const, notes: review };
            setCompletedSteps([...completedSteps, updatedStep]);
            setActiveItinerary(activeItinerary.filter(s => s.id !== stepId));
            setLastCompletionTime(Date.now());
            setSeekPoints(s => s + 25);
        }
        setShowReview(false);
    };

    if (BatteryStrategist.isDeadPhoneMode(batteryLevel)) {
        return (
            <View className="flex-1 bg-black p-8 justify-center">
                <Text className="text-plaid-gold font-header text-3xl mb-4">RESCUE UI</Text>
                <Text className="text-white/60 font-body text-sm mb-10">Castle Companion is in power-survival mode.</Text>
                <View className="gap-y-8">
                    <View>
                        <Text className="text-plaid-gold font-header text-[10px] uppercase tracking-widest mb-2">Current Mission</Text>
                        <Text className="text-white font-header text-xl">{activeItinerary[0]?.step_name || 'Standby'}</Text>
                    </View>
                    <TouchableOpacity onPress={() => setBatteryLevel(0.8)} className="border border-white/20 py-4 rounded-xl items-center">
                        <Text className="text-white font-header text-[10px] uppercase tracking-[2px]">Simulate Charge</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    return (
        <View className="flex-1">
            <ScrollView
                className={`flex-1 ${sunlightMode ? 'bg-[#F4F1DE]' : 'bg-plaid-alabaster'}`}
                contentContainerStyle={{ paddingBottom: 150 }}
            >
                {/* Header */}
                <View className="px-6 pt-12 pb-4 flex-row justify-between items-center">
                    <View>
                        <Text className={`font-header text-4xl ${sunlightMode ? 'text-[#1B3022]' : 'text-plaid-navy'}`}>Horizon</Text>
                        <View className="flex-row items-center mt-1">
                            <Text className={`font-body text-[10px] uppercase tracking-widest ${sunlightMode ? 'text-[#1B3022]/60' : 'text-plaid-navy/40'}`}>Tactical Command</Text>
                            <TouchableOpacity
                                onPress={() => setShowFullSchedule(true)}
                                className="ml-4 bg-plaid-navy/5 px-2 py-1 rounded-md border border-plaid-navy/10"
                            >
                                <Text className="text-plaid-navy font-header text-[8px] uppercase tracking-[1px]">Full Schedule</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View className="flex-row items-center">
                        <TouchableOpacity
                            onPress={() => setSunlightMode(!sunlightMode)}
                            className={`mr-4 p-2 rounded-full border ${sunlightMode ? 'bg-[#1B3022] border-[#1B3022]' : 'bg-white border-plaid-navy/10'}`}
                        >
                            <Sun size={20} color={sunlightMode ? "#F4F1DE" : "#12232E"} />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Notifications & Alerts */}
                <View className="px-6 gap-y-4 mt-2">
                    {hungerAlert && (
                        <View className="bg-red-900/40 p-4 rounded-2xl border border-red-500/50">
                            <Text className="text-white font-body text-xs">{hungerAlert}</Text>
                        </View>
                    )}
                    {pivotAlert && (
                        <View className="bg-plaid-rose p-4 rounded-2xl border border-white/20">
                            <Text className="text-white font-header text-xs mb-1">Plaid Pivot Active</Text>
                            <Text className="text-white/80 font-body text-[10px] mb-3">{pivotAlert}</Text>

                            <View className="flex-row items-center justify-between border-t border-white/10 pt-3 mt-2">
                                <Text className="text-white/60 font-body text-[9px] italic flex-1">Did this save the moment?</Text>
                                <View className="flex-row gap-2">
                                    <TouchableOpacity
                                        onPress={() => {
                                            RLHFEngine.recordExplicitFeedback('current_pivot', -5);
                                            setPivotAlert(null); // Dismiss after rating
                                        }}
                                        className="bg-white/10 px-3 py-2 rounded-xl border border-white/20"
                                    >
                                        <Text className="text-white text-xs">👎</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        onPress={() => {
                                            RLHFEngine.recordExplicitFeedback('current_pivot', 5);
                                            setPivotAlert(null);
                                        }}
                                        className="bg-plaid-gold/20 px-3 py-2 rounded-xl border border-plaid-gold/40"
                                    >
                                        <Text className="text-white text-xs">👍</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    )}
                    {isBackendOffline && (
                        <View className="bg-red-950 p-4 rounded-2xl border border-red-500 flex-row items-center">
                            <Shield size={20} color="#EF4444" className="mr-3" />
                            <View className="flex-1">
                                <Text className="text-red-500 font-header text-xs uppercase tracking-widest">Tactical Link Offline</Text>
                                <Text className="text-white/60 font-body text-[10px]">Syncing suspended. Displaying cached intelligence.</Text>
                            </View>
                        </View>
                    )}
                </View>

                {/* TACTICAL SLIDER: NOW / NEXT UP */}
                <ScrollView
                    horizontal
                    pagingEnabled
                    showsHorizontalScrollIndicator={false}
                    className="mt-6"
                    contentContainerStyle={{ paddingHorizontal: 25 }}
                >
                    {/* CARD 1: NOW */}
                    <View style={{ width: width - 50, marginRight: 20 }}>
                        <View className="bg-white rounded-[40px] p-8 border border-plaid-gold/20 shadow-2xl h-[480px]">
                            <View className="flex-row items-center mb-8">
                                <View className="p-4 rounded-2xl bg-plaid-amber/5 border border-plaid-gold/30">
                                    <Rocket size={32} color="#D4AF37" strokeWidth={1.5} />
                                </View>
                                <View className="ml-6 flex-1">
                                    <Text className="text-plaid-gold font-header text-[10px] uppercase tracking-[3px] mb-1">Current Mission</Text>
                                    <Text className="font-header text-3xl text-plaid-navy">{(activeItinerary[0] || itinerary[0]).step_name}</Text>
                                </View>
                            </View>

                            <View className="flex-row items-center mb-6">
                                <Clock size={16} color="#D4AF37" className="mr-2" />
                                <Text className="text-plaid-navy/60 font-body text-sm">Deployment: {(syncedItinerary[0] || activeItinerary[0] || itinerary[0]).actual_wait}m wait</Text>
                            </View>

                            <Text className="text-plaid-navy/60 font-body text-base mb-8 leading-6">
                                {PersonalityModule.getContextualNudge(activeItinerary[0] || itinerary[0])?.text || "Your group is staged for a world-class experience."}
                            </Text>

                            <View className="flex-1 justify-end">
                                <TouchableOpacity
                                    onPress={() => {
                                        setCurrentReviewRide((activeItinerary[0] || itinerary[0]).step_name);
                                        setShowReview(true);
                                    }}
                                    className="bg-plaid-navy py-5 rounded-2xl items-center shadow-lg"
                                >
                                    <Text className="text-plaid-gold font-header text-xs uppercase tracking-[3px]">Complete Objective</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>

                    {/* CARD 2: NEXT UP */}
                    {activeItinerary.length > 1 && (
                        <View style={{ width: width - 50 }}>
                            <View className="bg-plaid-navy rounded-[40px] p-8 border border-plaid-gold/20 shadow-2xl h-[480px]">
                                <View className="flex-row items-center mb-8">
                                    <View className="p-4 rounded-2xl border border-plaid-gold/30 bg-white/5">
                                        <ZapIcon size={32} color="#D4AF37" strokeWidth={1.5} />
                                    </View>
                                    <View className="ml-6 flex-1">
                                        <Text className="text-plaid-gold font-header text-[10px] uppercase tracking-[3px] mb-1">Next Objective</Text>
                                        <Text className="font-header text-3xl text-white">{activeItinerary[1].step_name}</Text>
                                    </View>
                                </View>

                                <View className="bg-white/5 p-6 rounded-3xl border border-white/10 mb-6">
                                    <Text className="text-plaid-gold font-header text-[8px] uppercase tracking-[2px] mb-2">Tactical Memo</Text>
                                    <Text className="text-white/60 font-body text-xs italic leading-5">
                                        "Expect a {(syncedItinerary[1]?.actual_wait || activeItinerary[1]?.actual_wait || 0)}m wait. Optimized for your group's stamina."
                                    </Text>
                                </View>

                                <View className="flex-1 justify-end">
                                    <View className="bg-white/10 py-5 rounded-2xl items-center border border-white/20">
                                        <Text className="text-white/40 font-header text-xs uppercase tracking-[3px]">T-Minus {activeItinerary[1].actual_wait || 30}m</Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                    )}
                </ScrollView>

                {/* FIND & SEEK WIDGET */}
                <View className="px-6 mt-10">
                    <TouchableOpacity
                        onPress={() => {
                            findAndSeekStore.awardPoints('g1', 'hm_1');
                            setSeekPoints(s => s + 50);
                            Alert.alert('Magic Found!', '+50 points awarded.');
                        }}
                        className="bg-plaid-navy rounded-[40px] p-8 border border-plaid-gold/30 shadow-2xl overflow-hidden"
                    >
                        <View className="flex-row items-center mb-4">
                            <Sparkles size={24} color="#D4AF37" />
                            <Text className="text-plaid-gold font-header text-[10px] uppercase tracking-[3px] ml-4">Find & Seek</Text>
                        </View>
                        <Text className="text-white font-header text-xl mb-4">The Hidden Magic</Text>
                        <Text className="text-white/60 font-body text-sm italic mb-6">
                            "{findAndSeekStore.getLineTrivia(activeItinerary[0]?.id || 'MK_SPACE')}"
                        </Text>
                        <View className="bg-white/10 py-4 rounded-2xl items-center border border-white/20">
                            <Text className="text-plaid-gold font-header text-[10px] uppercase tracking-[2px]">I Found It!</Text>
                        </View>
                    </TouchableOpacity>
                </View>

                {/* Mini Simulation Toggles */}
                <View className="px-6 mt-10 opacity-30">
                    <Text className="text-plaid-navy font-header text-[8px] uppercase tracking-widest mb-4">Tactical Overrides</Text>
                    <View className="flex-row justify-between">
                        <TouchableOpacity onPress={() => setBatteryLevel(0.3)} className="bg-white p-4 rounded-xl border border-plaid-navy/10 flex-1 mr-2 items-center">
                            <Battery size={16} color="#12232E" />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => setWeather(WeatherCondition.RAIN)} className="bg-white p-4 rounded-xl border border-plaid-navy/10 flex-1 mr-2 items-center">
                            <CloudRain size={16} color="#12232E" />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => setShowReview(true)} className="bg-white p-4 rounded-xl border border-plaid-navy/10 flex-1 items-center">
                            <Star size={16} color="#12232E" />
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>

            {/* Modals & Overlays */}
            <Modal visible={showFullSchedule} animationType="slide" transparent>
                <View className="flex-1 bg-plaid-navy/98 pt-20">
                    <View className="px-8 pb-8 flex-row justify-between items-center border-b border-white/10">
                        <Text className="text-plaid-gold font-header text-3xl">Full Mission</Text>
                        <TouchableOpacity onPress={() => setShowFullSchedule(false)}>
                            <Text className="text-white/60 font-header text-xs uppercase tracking-widest">Close</Text>
                        </TouchableOpacity>
                    </View>
                    <ScrollView className="px-8 pt-8">
                        {activeItinerary.map((step, idx) => (
                            <View key={step.id} className="mb-10 flex-row">
                                <View className="items-center mr-6">
                                    <View className={`w-3 h-3 rounded-full ${idx === 0 ? 'bg-plaid-gold' : 'bg-white/20'}`} />
                                    {idx < activeItinerary.length - 1 && <View className="w-px h-16 bg-white/10" />}
                                </View>
                                <View className="flex-1">
                                    <Text className="text-plaid-gold font-header text-[10px] uppercase tracking-[2px] mb-1">{step.step_type}</Text>
                                    <Text className="text-white font-header text-xl mb-1">{step.step_name}</Text>
                                    <Text className="text-white/40 font-body text-xs">{(syncedItinerary.find(s => s.id === step.id)?.actual_wait || step.actual_wait || 0)}m Wait</Text>
                                </View>
                            </View>
                        ))}
                    </ScrollView>
                </View>
            </Modal>

            {isConsensusActive && (
                <FamilyVoteModal
                    visible={isConsensusActive}
                    onClose={() => setIsConsensusActive(false)}
                    optionA={{ name: 'Maintain Strategy', icon: Shield, type: 'maintain' }}
                    optionB={{ name: 'Refined Pivot', icon: Zap, type: 'pivot' }}
                    onSelect={(option) => {
                        Alert.alert('Consensus Reached', `Proceeding with: ${option}`);
                        setIsConsensusActive(false);
                    }}
                />
            )}

            {showReview && (
                <RideReviewModal
                    visible={showReview}
                    rideName={currentReviewRide}
                    onClose={() => setShowReview(false)}
                    onSubmit={(rating, feedback) => {
                        handleStepCompletion(activeItinerary[0]?.id || '', feedback);
                    }}
                />
            )}


            {decompressionZone && (
                <Modal visible={!!decompressionZone} transparent animationType="fade">
                    <View className="flex-1 bg-plaid-navy/95 justify-center p-8">
                        <View className="bg-white rounded-[40px] p-8">
                            <Text className="text-plaid-navy font-header text-2xl mb-4">Quiet Zone: {decompressionZone.name}</Text>
                            <Text className="text-plaid-navy/70 font-body text-sm mb-8">{decompressionZone.description}</Text>
                            <TouchableOpacity onPress={() => setDecompressionZone(null)} className="bg-plaid-navy py-4 rounded-xl items-center">
                                <Text className="text-white font-header text-xs uppercase">Dismiss</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
            )}

            {/* Thumb Zone High-Alert CTA */}
            <View className="absolute bottom-10 left-6 right-6 flex-row">
                <TouchableOpacity
                    onPress={handleRecalibrate}
                    disabled={isRecalibrating}
                    className={`${isRecalibrating ? 'bg-plaid-gold/50' : 'bg-plaid-gold'} flex-1 py-6 rounded-[25px] flex-row justify-center items-center shadow-2xl mr-2`}
                >
                    <Zap size={20} color="#12232E" className="mr-3" />
                    <Text className="text-plaid-navy font-header text-sm tracking-widest uppercase">
                        {isRecalibrating ? 'Monitoring Live Data...' : 'Auto-Pilot: Recalibrate'}
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

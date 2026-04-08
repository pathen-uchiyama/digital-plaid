import './global.css';
import React, { useState } from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import * as Linking from 'expo-linking';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import RegistrationScreen from './src/screens/RegistrationScreen';
import AdventureSetupScreen from './src/screens/AdventureSetupScreen';
import GuestProfileScreen from './src/screens/GuestProfileScreen';
import InvitationScreen from './src/screens/InvitationScreen';
import HorizonDashboard from './src/screens/HorizonDashboard';
import MemoryRecapScreen from './src/screens/MemoryRecapScreen';
import GroupIntakeScreen from './src/screens/GroupIntakeScreen';
import BriefingScreen from './src/screens/BriefingScreen';
import HomeScreen from './src/screens/HomeScreen';
import AdventureSynopsisScreen from './src/screens/AdventureSynopsisScreen';
import ItineraryDesignerScreen from './src/screens/ItineraryDesignerScreen';
import AccountScreen from './src/screens/AccountScreen';
import TripHistoryScreen from './src/screens/TripHistoryScreen';
import GuardianScreen from './src/screens/GuardianScreen';
import PaywallScreen from './src/screens/PaywallScreen';
import { autoBookingEngine } from './src/utils/AutoBookingManager';
import { WeatherCondition } from './src/utils/WeatherProtocol';
import { CharacterSighting } from './src/utils/CharacterIntelEngine';
import { YelpSupport } from './src/utils/YelpIntegrator';
import { LogisticsAlert } from './src/utils/LogisticsEngine';
import { ItineraryStep, Guest, Preference, SubscriptionTier } from './src/types';
import { EnergyOptimizer } from './src/utils/EnergyOptimizer';
import { StrategyEngine, ModularInputs } from './src/utils/StrategyEngine';
import AdminLoginScreen from './src/screens/AdminLoginScreen';
import AdminDashboardScreen from './src/screens/AdminDashboardScreen';

export default function App() {
  const [appState, setAppState] = useState<'onboarding-setup' | 'onboarding-profile' | 'onboarding-invite' | 'onboarding-synopsis' | 'onboarding-itinerary' | 'onboarding-briefing' | 'home' | 'active' | 'account' | 'history' | 'admin-login' | 'admin-dashboard' | 'paywall'>('home');
  const [subscriptionTier, setSubscriptionTier] = useState<SubscriptionTier>('voyage');
  const [isWebLinked, setIsWebLinked] = useState(false);
  console.log('DEBUG: Pocket Plaid App State is:', appState);
  const [currentScreen, setCurrentScreen] = useState<'plan' | 'dining' | 'moments' | 'lead' | 'guardian'>('plan');
  const [adventureName, setAdventureName] = useState('The Plaid Legacy');
  const [napStrategy, setNapStrategy] = useState<'power' | 'nap' | 'quiet'>('power');
  const [staminaLevel, setStaminaLevel] = useState(5);
  const [rideCountGoal, setRideCountGoal] = useState<'max' | 'relaxed'>('relaxed');
  const [ambitionMetric, setAmbitionMetric] = useState<'relaxed' | 'completionist'>('relaxed');
  const [resortId, setResortId] = useState<'WDW' | 'DL'>('WDW');

  React.useEffect(() => {
    const handleDeepLink = (event: { url: string }) => {
      const { queryParams } = Linking.parse(event.url);
      if (queryParams?.token) {
        console.log('DEBUG: Magic Token Detected:', queryParams.token);

        // Data Hydration Logic (Simulation)
        // In a real app, we'd fetch from Supabase/Backend using the token
        // For the MVP, we can encode basic metadata or use defaults
        if (queryParams.name) setAdventureName(decodeURIComponent(queryParams.name as string));
        if (queryParams.park) setResortId(queryParams.park === 'DL' ? 'DL' : 'WDW');

        setIsWebLinked(true);
        setAppState('active'); // Instantly enter "Day-Of" mode
      }
    };

    const subscription = Linking.addEventListener('url', handleDeepLink);

    // Check if app was opened via a link
    Linking.getInitialURL().then((url) => {
      if (url) handleDeepLink({ url });
    });

    return () => subscription.remove();
  }, []);

  const handleSetupComplete = (data: {
    adventureName: string;
    leadName: string;
    location: 'WDW' | 'DL';
    napStrategy: 'power' | 'nap' | 'quiet';
    staminaLevel: number;
    rideCountGoal: 'max' | 'relaxed';
  }) => {
    setAdventureName(data.adventureName);
    setNapStrategy(data.napStrategy);
    setStaminaLevel(data.staminaLevel);
    setRideCountGoal(data.rideCountGoal);
    setAmbitionMetric(data.rideCountGoal === 'max' ? 'completionist' : 'relaxed');
    setResortId(data.location);
    autoBookingEngine.setRideCountGoal(data.rideCountGoal);
    setAppState('onboarding-profile');
  };
  const handleProfileComplete = (guests: any[]) => {
    // Calculate Master Strategy based on guest makeup and earlier trip settings

    const hasToddlers = guests.some(g => parseInt(g.age, 10) <= 5);
    const hasGradeSchoolers = guests.some(g => parseInt(g.age, 10) > 5 && parseInt(g.age, 10) <= 10);
    const allAdults = guests.every(g => parseInt(g.age, 10) >= 18);

    const masterStrategyInputs: ModularInputs = {
      pacing: staminaLevel >= 8 ? 'intense' : (staminaLevel <= 4 ? 'relaxed' : 'moderate'),
      primaryFocus: hasToddlers ? 'toddlers' : (allAdults && staminaLevel >= 7 ? 'thrills' : 'classic'),
      diningStyle: ambitionMetric === 'completionist' ? 'quick' : 'table',
      singleRiderAllowed: allAdults,
      dasAllowed: false,
      llMultiPassAllowed: true,
      llSinglePassAllowed: staminaLevel >= 7,
      onSite: true,
      hasStrobeSensitivity: false,
      hasLoudNoiseSensitivity: false,
      arrivalIntent: staminaLevel >= 8 ? 'rope-drop' : 'leisurely',
      splurgeAppetite: 'low',
      premiumInterests: [],
      subscriptionTier: subscriptionTier
    };

    const masterStrategy = StrategyEngine.generateMasterStrategy(masterStrategyInputs);
    console.log("=== MASTER STRATEGY CALCULATED ===");
    console.log("Pacing:", masterStrategy.pacingFilter);
    console.log("Thrill Cap:", masterStrategy.rideDirectives.thrillCap);
    console.log("LL Strategy:", masterStrategy.budgetDirectives);
    console.log("==================================");

    setAppState('onboarding-invite');
  };
  const handleInviteComplete = () => setAppState('onboarding-synopsis');
  const handleSynopsisComplete = () => setAppState('onboarding-itinerary');
  const handleItineraryComplete = () => setAppState('onboarding-briefing');
  const handleBriefingComplete = () => setAppState('home');

  const [weather, setWeather] = useState<WeatherCondition>(WeatherCondition.CLEAR);
  const [characterSightings, setCharacterSightings] = useState<CharacterSighting[]>([]);
  const [yelpData, setYelpData] = useState<Record<string, YelpSupport>>({});
  const [strollerPin, setStrollerPin] = useState<LogisticsAlert | null>(null);
  const [parkingPin, setParkingPin] = useState<LogisticsAlert | null>(null);
  const [rendezvousPin, setRendezvousPin] = useState<LogisticsAlert | null>(null);
  const [intelAlert, setIntelAlert] = useState<string | null>(null);
  const [sunlightMode, setSunlightMode] = useState(false);
  const [minutesSaved, setMinutesSaved] = useState(142);
  const [isConsensusActive, setIsConsensusActive] = useState(false);
  const [batteryLevel, setBatteryLevel] = useState(100);
  const [isRescueMode, setIsRescueMode] = useState(false);

  React.useEffect(() => {
    if (batteryLevel < 15) {
      setIsRescueMode(true);
    } else {
      setIsRescueMode(false);
    }
  }, [batteryLevel]);

  const renderActiveApp = () => {
    if (isRescueMode) {
      return (
        <View style={{ flex: 1, backgroundColor: '#000', padding: 30, justifyContent: 'center' }}>
          <Text style={{ color: '#fff', fontSize: 24, fontWeight: '800', marginBottom: 20 }}>RESCUE MODE</Text>
          <Text style={{ color: '#aaa', fontSize: 14, marginBottom: 40 }}>Battery Critical ({"<"} 15%). Essentials only.</Text>

          <View style={{ marginBottom: 30 }}>
            <Text style={{ color: '#D4AF37', fontSize: 10, fontWeight: '800', letterSpacing: 2, marginBottom: 10 }}>NEXT MISSION</Text>
            <Text style={{ color: '#fff', fontSize: 18 }}>Pirates of the Caribbean</Text>
            <Text style={{ color: '#aaa', fontSize: 12 }}>Wait: 25 min • Head there now.</Text>
          </View>

          <View style={{ marginBottom: 30 }}>
            <Text style={{ color: '#D4AF37', fontSize: 10, fontWeight: '800', letterSpacing: 2, marginBottom: 10 }}>FUELROD LOCATIONS</Text>
            <Text style={{ color: '#fff', fontSize: 14 }}>• Pecos Bill Tall Tale Inn</Text>
            <Text style={{ color: '#fff', fontSize: 14 }}>• Cosmic Ray's Starlight Café</Text>
            <Text style={{ color: '#fff', fontSize: 14 }}>• Curtain Call Collectibles</Text>
          </View>

          <TouchableOpacity
            onPress={() => setBatteryLevel(100)}
            style={{ marginTop: 50, borderBottomWidth: 1, borderBottomColor: '#333', paddingBottom: 10 }}
          >
            <Text style={{ color: '#444', fontSize: 10, textAlign: 'center' }}>SIMULATE CHARGE (RESTORE UI)</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <View style={{ flex: 1, backgroundColor: isWebLinked ? '#12232E' : '#FAF9F6' }}>
        {isWebLinked && (
          <View style={{ paddingVertical: 10, paddingHorizontal: 20, backgroundColor: '#D4AF37', alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ color: '#12232E', fontSize: 10, fontWeight: '900', letterSpacing: 1.5 }}>SILENT GUARDIAN ACTIVE • WEB SYNCED</Text>
          </View>
        )}
        <View style={{ flex: 1 }}>
          {currentScreen === 'plan' && <HorizonDashboard
            adventureName={adventureName}
            napStrategy={napStrategy}
            staminaLevel={staminaLevel}
            rideCountGoal={rideCountGoal}
            resortId={resortId}
            weather={weather}
            setWeather={setWeather}
            characterSightings={characterSightings}
            setCharacterSightings={setCharacterSightings}
            yelpData={yelpData}
            setYelpData={setYelpData}
            strollerPin={strollerPin}
            setStrollerPin={setStrollerPin}
            parkingPin={parkingPin}
            setParkingPin={setParkingPin}
            rendezvousPin={rendezvousPin}
            setRendezvousPin={setRendezvousPin}
            intelAlert={intelAlert}
            setIntelAlert={setIntelAlert}
            sunlightMode={sunlightMode}
            setHeadsUpNudge={() => { }} // Placeholder or actual implementation
            setSunlightMode={setSunlightMode}
            minutesSaved={minutesSaved}
            isConsensusActive={isConsensusActive}
            setIsConsensusActive={setIsConsensusActive}
            subscriptionTier={subscriptionTier}
            onPaywall={() => setAppState('paywall')}
          />}
          {currentScreen === 'dining' && <View className="flex-1 items-center justify-center"><Text className="font-header text-3xl text-plaid-navy">Dining Concierge</Text></View>}
          {currentScreen === 'moments' && (
            <MemoryRecapScreen
              summary={{
                adventureName: adventureName,
                totalSteps: 12,
                memories: [],
                narrative: 'A legendary expedition.',
                date: 'October 24, 2025'
              }}
              onClose={() => setCurrentScreen('plan')}
            />
          )}
          {currentScreen === 'lead' && <GroupIntakeScreen />}
          {currentScreen === 'guardian' && (
            <GuardianScreen
              strollerPin={strollerPin}
              parkingPin={parkingPin}
              rendezvousPin={rendezvousPin}
              characterSightings={characterSightings}
              yelpData={yelpData}
              weather={weather}
              intelAlert={intelAlert}
              sunlightMode={sunlightMode}
              minutesSaved={minutesSaved}
              setIsConsensusActive={setIsConsensusActive}
            />
          )}
        </View>

        {/* Tactile Boutique V3 Lead Adventurer Tray */}
        <View
          className="flex-row p-6 justify-around border-t-4 border-plaid-gold shadow-2xl relative overflow-hidden"
          style={{
            backgroundColor: '#12232E',
            // @ts-ignore - backgroundImage works on web
            backgroundImage: `
            repeating-linear-gradient(45deg, rgba(255,255,255,0.03) 0px, rgba(255,255,255,0.03) 1px, transparent 1px, transparent 20px),
            repeating-linear-gradient(-45deg, rgba(255,255,255,0.03) 0px, rgba(255,255,255,0.03) 1px, transparent 1px, transparent 20px)
          `
          } as any}
        >
          <TouchableOpacity onPress={() => setAppState('home')} className="items-center">
            <Text className={`font-header text-xs uppercase tracking-widest ${isWebLinked ? 'text-plaid-gold' : 'text-plaid-gold'}`}>Home</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setCurrentScreen('plan')} className="items-center">
            <Text className={`font-header text-xs uppercase tracking-widest ${currentScreen === 'plan' ? 'text-plaid-gold' : (isWebLinked ? 'text-plaid-alabaster opacity-30' : 'text-plaid-alabaster opacity-40')}`}>The Plan</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setCurrentScreen('guardian')} className="items-center">
            <Text className={`font-header text-xs uppercase tracking-widest ${currentScreen === 'guardian' ? 'text-plaid-gold' : (isWebLinked ? 'text-plaid-alabaster opacity-30' : 'text-plaid-alabaster opacity-40')}`}>Guardian</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setCurrentScreen('dining')} className="items-center">
            <Text className={`font-header text-xs uppercase tracking-widest ${currentScreen === 'dining' ? 'text-plaid-gold' : (isWebLinked ? 'text-plaid-alabaster opacity-30' : 'text-plaid-alabaster opacity-40')}`}>Dining</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setCurrentScreen('moments')} className="items-center">
            <Text className={`font-header text-xs uppercase tracking-widest ${currentScreen === 'moments' ? 'text-plaid-gold' : (isWebLinked ? 'text-plaid-alabaster opacity-30' : 'text-plaid-alabaster opacity-40')}`}>Moments</Text>
          </TouchableOpacity>
          {isWebLinked && (
            <View style={{ position: 'absolute', top: -10, right: 10, backgroundColor: '#D4AF37', paddingHorizontal: 6, borderRadius: 4 }}>
              <Text style={{ color: '#12232E', fontSize: 8, fontWeight: '800' }}>GUARDIAN MODE</Text>
            </View>
          )}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1, backgroundColor: '#FAF9F6' }}>
        {appState === 'onboarding-setup' && <AdventureSetupScreen onComplete={handleSetupComplete} subscriptionTier={subscriptionTier} onPaywall={() => setAppState('paywall')} />}
        {appState === 'onboarding-profile' && <GuestProfileScreen onComplete={handleProfileComplete} />}
        {appState === 'onboarding-invite' && <InvitationScreen adventureName={adventureName} onComplete={handleInviteComplete} />}
        {appState === 'onboarding-synopsis' && (
          <AdventureSynopsisScreen
            adventure={{
              name: adventureName,
              dates: 'October 24 - 30, 2025',
              location: 'Walt Disney World',
              leadName: 'Lead Adventurer',
              members: [{ name: 'Alice', relationship: 'Child' }, { name: 'Bob', relationship: 'Friend' }]
            }}
            onReviewItinerary={handleSynopsisComplete}
            onClose={() => setAppState('home')}
          />
        )}
        {appState === 'onboarding-itinerary' && (
          <ItineraryDesignerScreen onComplete={handleItineraryComplete} />
        )}
        {appState === 'onboarding-briefing' && <BriefingScreen adventureName={adventureName} onComplete={handleBriefingComplete} />}
        {appState === 'home' && (
          <HomeScreen
            isExecuting={false} // This should be dynamic based on if a trip is "active"
            isWebLinked={isWebLinked}
            adventureName={adventureName}
            onNewTrip={() => setAppState('onboarding-setup')}
            onContinueTrip={() => setAppState('active')}
            onViewHistory={() => setAppState('history')}
            onAdmin={() => setAppState('admin-login')}
          />
        )}
        {appState === 'account' && <AccountScreen onClose={() => setAppState('home')} />}
        {appState === 'admin-login' && (
          <AdminLoginScreen
            onBack={() => setAppState('home')}
            onSuccess={() => setAppState('admin-dashboard')}
          />
        )}
        {appState === 'admin-dashboard' && (
          <AdminDashboardScreen onBack={() => setAppState('home')} />
        )}
        {appState === 'paywall' && (
          <PaywallScreen onClose={() => setAppState('home')} currentTier={subscriptionTier} />
        )}
        {appState === 'history' && <TripHistoryScreen onClose={() => setAppState('home')} onSelectTrip={() => { }} />}
        {appState === 'active' && renderActiveApp()}
        <StatusBar style="dark" />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

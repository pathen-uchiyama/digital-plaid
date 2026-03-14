import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Switch, Alert, Platform } from 'react-native';
import { SecurityEngine } from '../utils/SecurityEngine';
import { THEME } from '../utils/DesignSystem';
import {
    User,
    Bell,
    Battery,
    CreditCard,
    ChevronRight,
    LogOut,
    Shield,
    Smartphone,
    Map,
    Settings,
    Package,
    Layout,
    Monitor,
    Activity,
    MessageSquare,
    Info
} from 'lucide-react-native';
import { Membership, WDWPassTier, DLPassTier, UnifiedPassTier } from '../types';
import TermsOfServiceModal from '../components/TermsOfServiceModal';
import DisneyLinkModal from '../components/DisneyLinkModal';
import CreditCardModal from '../components/CreditCardModal';
import StrategicInsightModal from '../components/StrategicInsightModal';

const STRATEGIC_INSIGHTS: Record<string, { title: string, description: string, pro: string, con: string, security?: string, isLegalRequirement?: boolean }> = {
    'Push Alerts': {
        title: 'Push Alerts',
        description: 'Enables the application to send real-time notifications to your device. This is the primary channel for time-sensitive updates from the Boutique Concierge.',
        pro: 'Get immediate feedback on Lightning Lane modifications and dining availability shifts as they happen.',
        con: 'High-frequency updates during peak hours may lead to notification fatigue or increased screen-on time.'
    },
    'Screen Banners': {
        title: 'Screen Banners',
        description: 'Dynamic visual overlays that appear at the top of your interface. These provide non-intrusive status updates for background processes.',
        pro: 'Maintain visual awareness of your trip status while browsing other app sections without interrupting your current flow.',
        con: 'Banners occupy vertical screen real estate, which may slightly obscure map views or itinerary details.'
    },
    'Home Screen Widgets': {
        title: 'Home Screen Widgets',
        description: 'Miniature application views placed directly on your device home screen. These widgets maintain a persistent connection to the live itinerary engine.',
        pro: 'Review your next three scheduled experiences and current transit times without needing to launch the full application.',
        con: 'Widgets require background data refresh cycles, which can contribute to minor cumulative battery consumption over a full park day.'
    },
    'Dynamic Island Experience': {
        title: 'Dynamic Island',
        description: 'Advanced iOS integration that utilizes the Dynamic Island for high-priority status tracking and countdowns.',
        pro: 'Keeps your next Lightning Lane window or bus arrival time visible at the top of your phone at all times, even when other apps are active.',
        con: 'Continuous active-area rendering increases power draw on the primary logic cores to sustain real-time pixel updates.'
    },
    'Live Activities': {
        title: 'Live Activities',
        description: 'Interactive lock screen elements that provide detailed, real-time tracking for ongoing park events and transit legs.',
        pro: 'Monitor your party\'s consensus on the next ride or track your monorail\'s precise location without unlocking your device.',
        con: 'The persistent lock screen connection requires the device to remain in an active data-polling state, affecting total standby time.'
    },
    'Always-On Display Alerts': {
        title: 'Always-On Display',
        description: 'Low-power visual indicators designed for OLED screens, allowing trip data to remain legible while the phone is sitting on a table or in a pocket.',
        pro: 'Instant visibility of critical alerts with zero physical interaction required, reducing the need to wake your device repeatedly.',
        con: 'Even in extreme low-power mode, the screen pixels remain active, causing a slow but steady drain on the reserve capacity.'
    },
    'Glance Experiences': {
        title: 'Quick Look Reviews',
        description: 'Condensed horizontal summaries of upcoming daily milestones, optimized for rapid mental processing during transit.',
        pro: 'Synthesize your entire afternoon strategy in under three seconds with an ultra-efficient visual layout.',
        con: 'Generating these complex summaries requires the AI engine to perform secondary processing, using additional system resources.'
    },
    'Text Message Updates': {
        title: 'Text Message Updates',
        description: 'Cellular-based notification protocol that bypasses the need for high-speed data. This is your primary backup for critical instructions in dead zones.',
        pro: 'Ensures delivery of bypass codes and dining links in areas where park Wi-Fi is congested or cellular data is weak.',
        con: 'Subject to standard carrier messaging rates and the inherent latency of the SMS network compared to push notifications.',
        isLegalRequirement: true
    },
    'Smart Location Tracking': {
        title: 'Smart Location Tracking',
        description: 'The "Human Realities" sensing engine that uses GPS and Bluetooth to detect crowds, parade progress, and your proximity to specific landmarks.',
        pro: 'Enables automatic itinerary pivots. The app can suggest a quiet spot for a break or a faster route to your next ride based on real-time crowds.',
        con: 'Precise geolocation requires continuous antenna activity, making this the most power-intensive feature in the App Settings suite.'
    },
    'Battery Limit': {
        title: 'Battery Limit',
        description: 'A critical failover system that automatically throttles background features when your phone hits a specific energy remaining percentage.',
        pro: 'Guarantees you will have enough power to use your digital park entry and mobile ordering for the remainder of the evening.',
        con: 'Reaching the limit will disable high-touch features like Dynamic Island and Live Activities to preserve the core communication link.'
    },
    'Mobile': {
        title: 'Your Phone Number',
        description: 'A required data field used exclusively for interaction with Disney\'s booking systems and for out-of-app communication.',
        pro: 'Directly enables the auto-booking engine to secure dining tables and provides a secure channel for time-sensitive bypass alerts.',
        con: 'Requires an active cellular link to be effective; cannot be used as a primary communication channel in Wi-Fi-only scenarios.',
        security: 'Disney requires this to book a table. Your number is locked in our secure vault and we don\'t store it on our own servers.'
    },
    'Billing': {
        title: 'Payment Info',
        description: 'Encrypted credit card storage required by third-party reservations to "hold" a booking window against no-show penalties.',
        pro: 'Allows the Concierge to autonomously book high-demand tables (like Oga\'s Cantina) the second they become available.',
        con: 'Accessing this data requires secondary biometric authentication every time it is needed for an active booking process.',
        security: 'Disney requires this to hold your reservation. It stays in our secure vault; we cannot see or use your actual card info.'
    }
};

export default function AccountScreen({ onClose }: { onClose: () => void }) {
    console.log('DEBUG: Rendering AccountScreen v2.5');
    const [notifications, setNotifications] = useState(true);
    const [gpsSmartMode, setGpsSmartMode] = useState(true);
    const [batteryThreshold, setBatteryThreshold] = useState('25');
    const [phoneNumber, setPhoneNumber] = useState('+1 (555) 000-0000');
    const [billingInfo, setBillingInfo] = useState('Visa ending in 4242');

    // App Settings Toggles
    const [bannersEnabled, setBannersEnabled] = useState(true);
    const [widgetsEnabled, setWidgetsEnabled] = useState(false);
    const [islandEnabled, setIslandEnabled] = useState(true);
    const [liveActivitiesEnabled, setLiveActivitiesEnabled] = useState(true);
    const [aodEnabled, setAodEnabled] = useState(false);
    const [glanceEnabled, setGlanceEnabled] = useState(true);
    const [smsEnabled, setSmsEnabled] = useState(false);

    const [membership, setMembership] = useState<Membership>({
        is_dvc: false,
        wdw_ap_tier: undefined,
        dl_ap_tier: undefined,
        unified_ap_tier: undefined
    });
    const [isAegisUnlocked, setIsAegisUnlocked] = useState(false);
    const [isToSVisible, setIsToSVisible] = useState(false);
    const [isDisneyLinkVisible, setIsDisneyLinkVisible] = useState(false);
    const [isCreditCardVisible, setIsCreditCardVisible] = useState(false);

    // Tip Modal State
    const [currentInsight, setCurrentInsight] = useState<any | null>(null);

    const handleIntegrationPress = async () => {
        if (!isAegisUnlocked) {
            const success = await SecurityEngine.authenticateBiometric();
            if (success) {
                setIsAegisUnlocked(true);
                setIsDisneyLinkVisible(true);
            } else {
                Alert.alert("Secure Vault", "ID verification failed. Access denied.");
            }
        } else {
            setIsDisneyLinkVisible(true);
        }
    };

    const renderSettingItem = (label: string, icon: any, value: any, onValueChange?: (v: boolean) => void, isToggle = false) => (
        <View className="flex-row items-center justify-between py-6 border-b border-plaid-navy/5">
            <View className="flex-row items-center flex-1">
                <View className="w-10 h-10 bg-plaid-navy/5 rounded-xl items-center justify-center mr-4">
                    {React.createElement(icon, { size: 20, color: "#12232E" })}
                </View>
                <View className="flex-row items-center">
                    <Text className="text-plaid-navy font-header text-sm mr-2">{label}</Text>
                    {STRATEGIC_INSIGHTS[label] && (
                        <TouchableOpacity onPress={() => {
                            console.log('DEBUG: Opening Insight for:', label, STRATEGIC_INSIGHTS[label]);
                            setCurrentInsight(STRATEGIC_INSIGHTS[label]);
                        }}>
                            <Info size={12} color="#12232E44" />
                        </TouchableOpacity>
                    )}
                </View>
            </View>
            {isToggle ? (
                <Switch
                    value={value}
                    onValueChange={onValueChange}
                    trackColor={{ false: '#12232E11', true: '#D4AF37' }}
                    thumbColor={value ? '#FFF' : '#FFF'}
                />
            ) : (
                <TouchableOpacity className="flex-row items-center">
                    <Text className="text-plaid-navy/40 font-body text-xs mr-2">{value}</Text>
                    <ChevronRight size={16} color="#12232E22" />
                </TouchableOpacity>
            )}
        </View>
    );

    const renderPassTierList = (label: string, tiers: string[], currentTier: string | undefined, onSelect: (tier: any) => void) => (
        <View className="mb-6">
            <Text className="text-plaid-navy/60 font-body text-[10px] mb-3 uppercase tracking-tight">{label}</Text>
            <View className="flex-row flex-wrap gap-2">
                {tiers.map((tier) => (
                    <TouchableOpacity
                        key={tier}
                        onPress={() => onSelect(currentTier === tier ? undefined : tier)}
                        className={`px-4 py-2 rounded-xl border-2 ${currentTier === tier ? 'bg-plaid-gold border-plaid-gold' : 'bg-white border-plaid-navy/10'}`}
                    >
                        <Text className={`font-header text-[9px] uppercase tracking-tighter ${currentTier === tier ? 'text-plaid-navy' : 'text-plaid-navy/60'}`}>{tier}</Text>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );

    return (
        <View className="flex-1 bg-plaid-alabaster">
            {/* Header */}
            <View className="bg-plaid-navy pt-16 pb-12 px-8 rounded-b-[60px] shadow-2xl">
                <View className="flex-row justify-between items-center mb-6">
                    <Text className="text-plaid-gold font-header text-[10px] uppercase tracking-[4px]">Account & Memberships v2.5</Text>
                    <TouchableOpacity onPress={onClose} className="bg-white/10 px-4 py-2 rounded-full border border-white/20">
                        <Text className="text-white font-header text-[8px] uppercase tracking-[1px]">Close</Text>
                    </TouchableOpacity>
                </View>
                <View className="flex-row items-center">
                    <View className="w-16 h-16 bg-plaid-gold rounded-full items-center justify-center mr-6 border-4 border-white/10">
                        <Text className="text-plaid-navy font-header text-2xl">P</Text>
                    </View>
                    <View>
                        <Text className="text-white font-header text-2xl">Patchen Uchiyama</Text>
                        <Text className="text-plaid-gold font-body text-sm mt-1">Lead Adventurer • Pro Member</Text>
                    </View>
                </View>
            </View>

            <ScrollView className="px-8 mt-[-30px]" showsVerticalScrollIndicator={false}>
                {/* Your Profile */}
                <View className="bg-white rounded-[40px] p-8 shadow-xl mb-8 border border-plaid-gold/10">
                    <Text className="text-plaid-gold font-header text-[10px] uppercase tracking-[3px] mb-6">Your Profile</Text>
                    {renderSettingItem('Name', User, 'Patchen Uchiyama')}
                    {renderSettingItem('Email', Smartphone, 'patchen@example.com')}

                    {/* Mobile with Info */}
                    <View className="flex-row items-center justify-between py-6 border-b border-plaid-navy/5">
                        <View className="flex-row items-center">
                            <View className="w-10 h-10 bg-plaid-navy/5 rounded-xl items-center justify-center mr-4">
                                <Bell size={20} color="#12232E" />
                            </View>
                            <View className="flex-row items-center">
                                <Text className="text-plaid-navy font-header text-sm mr-2">Mobile</Text>
                                <TouchableOpacity onPress={() => setCurrentInsight(STRATEGIC_INSIGHTS['Mobile'])}>
                                    <Info size={12} color="#12232E44" />
                                </TouchableOpacity>
                            </View>
                        </View>
                        <Text className="text-plaid-navy/40 font-body text-xs">{phoneNumber}</Text>
                    </View>

                    {/* Billing with Info */}
                    <TouchableOpacity
                        onPress={() => setIsCreditCardVisible(true)}
                        className="flex-row items-center justify-between py-6"
                    >
                        <View className="flex-row items-center">
                            <View className="w-10 h-10 bg-plaid-navy/5 rounded-xl items-center justify-center mr-4">
                                <CreditCard size={20} color="#12232E" />
                            </View>
                            <View className="flex-row items-center">
                                <Text className="text-plaid-navy font-header text-sm mr-2">Billing</Text>
                                <TouchableOpacity onPress={() => setCurrentInsight(STRATEGIC_INSIGHTS['Billing'])}>
                                    <Info size={12} color="#12232E44" />
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View className="flex-row items-center">
                            <Text className="text-plaid-navy/40 font-body text-xs mr-2">{billingInfo}</Text>
                            <ChevronRight size={16} color="#12232E22" />
                        </View>
                    </TouchableOpacity>
                </View>

                {/* DVC Toggle */}
                <TouchableOpacity
                    onPress={() => setMembership((prev) => ({ ...prev, is_dvc: !prev.is_dvc }))}
                    className={`py-5 items-center rounded-2xl border-2 mb-6 ${membership.is_dvc ? 'bg-plaid-navy border-plaid-gold' : 'bg-white border-plaid-navy/10'}`}
                >
                    <Text className={`font-header text-[12px] uppercase tracking-[3px] ${membership.is_dvc ? 'text-white' : 'text-plaid-navy/40'}`}>Disney Vacation Club Status</Text>
                </TouchableOpacity>

                {/* Member Details */}
                <View className="bg-white rounded-[40px] p-8 shadow-xl mb-8 border border-plaid-gold/10">
                    <Text className="text-plaid-gold font-header text-[10px] uppercase tracking-[2px] mb-6">Member Details</Text>

                    {/* WDW Annual Pass Section */}
                    <View className="bg-plaid-navy/5 p-6 rounded-[30px] border border-plaid-gold/10 mb-6">
                        <View className="flex-row justify-between items-center mb-4">
                            <Text className="text-plaid-gold font-header text-[9px] uppercase tracking-[2px]">Walt Disney World Resort</Text>
                            <View className="bg-plaid-navy/10 px-2 py-1 rounded">
                                <Text className="text-plaid-navy/40 font-header text-[8px] uppercase">Annual Pass</Text>
                            </View>
                        </View>
                        {renderPassTierList('Available Tiers', ['Incredi-Pass', 'Sorcerer', 'Pirate', 'Pixie'], membership.wdw_ap_tier, (tier) => setMembership(p => ({ ...p, wdw_ap_tier: tier })))}
                    </View>

                    {/* DLR Annual Pass Section */}
                    <View className="bg-plaid-navy/5 p-6 rounded-[30px] border border-plaid-gold/10 mb-6">
                        <View className="flex-row justify-between items-center mb-4">
                            <Text className="text-plaid-gold font-header text-[9px] uppercase tracking-[2px]">Disneyland Resort</Text>
                            <View className="bg-plaid-navy/10 px-2 py-1 rounded">
                                <Text className="text-plaid-navy/40 font-header text-[8px] uppercase">Magic Key</Text>
                            </View>
                        </View>
                        {renderPassTierList('Available Keys', ['Inspire', 'Believe', 'Enchant', 'Imagine'], membership.dl_ap_tier, (tier) => setMembership(p => ({ ...p, dl_ap_tier: tier })))}
                    </View>

                    {/* All-in-One Pass Placeholder */}
                    <View className="bg-plaid-teal/5 p-6 rounded-[30px] border border-dashed border-plaid-teal/30">
                        <View className="flex-row justify-between items-center mb-2">
                            <Text className="text-plaid-teal font-header text-[9px] uppercase tracking-[2px]">All-in-One Pass Support</Text>
                            <Text className="text-plaid-teal/40 font-header text-[7px] uppercase italic">Future Options</Text>
                        </View>
                        <TouchableOpacity
                            onPress={() => setMembership(p => ({ ...p, unified_ap_tier: p.unified_ap_tier ? undefined : 'Premier' }))}
                            className={`py-3 items-center rounded-xl border border-plaid-teal/20 ${membership.unified_ap_tier ? 'bg-plaid-teal/20' : 'bg-white/50'}`}
                        >
                            <Text className={`font-header text-[9px] uppercase tracking-[1px] ${membership.unified_ap_tier ? 'text-plaid-teal' : 'text-plaid-teal/40'}`}>
                                {membership.unified_ap_tier ? 'Unified Premier Pass Active' : 'Enable Unified Support'}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* App Settings */}
                <View className="bg-white rounded-[40px] p-8 shadow-xl mb-8 border border-plaid-gold/10">
                    <Text className="text-plaid-gold font-header text-[10px] uppercase tracking-[3px] mb-6">App Settings</Text>

                    {renderSettingItem('Push Alerts', Bell, notifications, setNotifications, true)}
                    {renderSettingItem('Screen Banners', Smartphone, bannersEnabled, setBannersEnabled, true)}
                    {renderSettingItem('Home Screen Widgets', Layout, widgetsEnabled, setWidgetsEnabled, true)}

                    {Platform.OS === 'ios' ? (
                        <>
                            {renderSettingItem('Dynamic Island Experience', Monitor, islandEnabled, setIslandEnabled, true)}
                            {renderSettingItem('Live Activities', Activity, liveActivitiesEnabled, setLiveActivitiesEnabled, true)}
                        </>
                    ) : (
                        <>
                            {renderSettingItem('Always-On Display Alerts', Monitor, aodEnabled, setAodEnabled, true)}
                            {renderSettingItem('Glance Experiences', Activity, glanceEnabled, setGlanceEnabled, true)}
                        </>
                    )}

                    {/* Text Message Updates */}
                    <View className="py-6 border-b border-plaid-navy/5">
                        <View className="flex-row items-center justify-between mb-2">
                            <View className="flex-row items-center">
                                <View className="w-10 h-10 bg-plaid-navy/5 rounded-xl items-center justify-center mr-4">
                                    <MessageSquare size={20} color="#12232E" />
                                </View>
                                <View className="flex-row items-center">
                                    <Text className="text-plaid-navy font-header text-sm mr-2">Text Message Updates</Text>
                                    <TouchableOpacity onPress={() => setCurrentInsight(STRATEGIC_INSIGHTS['Text Message Updates'])}>
                                        <Info size={12} color="#12232E44" />
                                    </TouchableOpacity>
                                </View>
                            </View>
                            <Switch
                                value={smsEnabled}
                                onValueChange={setSmsEnabled}
                                trackColor={{ false: '#12232E11', true: '#D4AF37' }}
                                thumbColor={smsEnabled ? '#FFF' : '#FFF'}
                            />
                        </View>
                        <Text className="text-plaid-navy/40 font-body text-[8px] leading-relaxed ml-14">
                            By joining, you agree to receive automated trip updates and alerts. Msg & data rates may apply. Reply STOP to cancel. Msg frequency varies.
                        </Text>
                    </View>

                    {renderSettingItem('Smart Location Tracking', Map, gpsSmartMode, setGpsSmartMode, true)}

                    {/* Battery Limit */}
                    <View className="flex-row items-center justify-between py-6">
                        <View className="flex-row items-center">
                            <View className="w-10 h-10 bg-plaid-navy/5 rounded-xl items-center justify-center mr-4">
                                <Battery size={20} color="#12232E" />
                            </View>
                            <View className="flex-row items-center">
                                <Text className="text-plaid-navy font-header text-sm mr-2">Battery Limit</Text>
                                <TouchableOpacity onPress={() => setCurrentInsight(STRATEGIC_INSIGHTS['Battery Limit'])}>
                                    <Info size={12} color="#12232E44" />
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View className="flex-row items-center bg-plaid-navy/5 rounded-lg px-3 py-2 border border-plaid-navy/10">
                            <TextInput
                                value={batteryThreshold}
                                onChangeText={setBatteryThreshold}
                                keyboardType="numeric"
                                maxLength={2}
                                className="text-plaid-navy font-header text-sm w-8 text-center"
                            />
                            <Text className="text-plaid-navy font-header text-[10px] ml-1">%</Text>
                        </View>
                    </View>

                    <Text className="text-plaid-navy/30 font-body text-[10px] mt-4 italic">
                        Location tracking and smart features are optimized for {Platform.OS === 'ios' ? 'iPhone' : 'your phone'} to save battery while updating your trip.
                    </Text>
                </View>

                {/* Connect Accounts */}
                <View className="bg-white rounded-[40px] p-8 shadow-xl mb-8 border border-plaid-gold/10">
                    <View className="flex-row justify-between items-center mb-6">
                        <Text className="text-plaid-gold font-header text-[10px] uppercase tracking-[3px]">Connect Accounts</Text>
                        <Shield size={12} color={isAegisUnlocked ? THEME.colors.teal : THEME.colors.gold} />
                    </View>

                    <TouchableOpacity
                        onPress={handleIntegrationPress}
                        className="flex-row items-center justify-between py-2"
                    >
                        <View className="flex-row items-center">
                            <View className={`w-10 h-10 ${isAegisUnlocked ? 'bg-plaid-teal' : 'bg-plaid-navy'} rounded-xl items-center justify-center mr-4`}>
                                <Package size={20} color="#D4AF37" />
                            </View>
                            <View>
                                <Text className="text-plaid-navy font-header text-sm">Disney Account</Text>
                                <Text className={`${isAegisUnlocked ? 'text-plaid-teal' : 'text-plaid-navy/40'} font-header text-[8px] uppercase mt-1`}>
                                    {isAegisUnlocked ? 'Status: Connected (Secure)' : 'Tap to Connect'}
                                </Text>
                            </View>
                        </View>
                        {isAegisUnlocked ? (
                            <Text className="text-plaid-rose font-header text-[8px] uppercase tracking-[1px]">Unlink</Text>
                        ) : (
                            <ChevronRight size={16} color="#12232E22" />
                        )}
                    </TouchableOpacity>
                </View>

                {/* Legal & Privacy */}
                <View className="bg-white rounded-[40px] p-8 shadow-xl mb-8 border border-plaid-gold/10">
                    <Text className="text-plaid-gold font-header text-[10px] uppercase tracking-[3px] mb-6">Legal & Privacy</Text>

                    <TouchableOpacity
                        onPress={() => setIsToSVisible(true)}
                        className="flex-row items-center justify-between py-6 border-b border-plaid-navy/5"
                    >
                        <View className="flex-row items-center">
                            <View className="w-10 h-10 bg-plaid-navy/5 rounded-xl items-center justify-center mr-4">
                                <Shield size={20} color="#12232E" />
                            </View>
                            <Text className="text-plaid-navy font-header text-sm">Terms of Service</Text>
                        </View>
                        <ChevronRight size={16} color="#12232E22" />
                    </TouchableOpacity>

                    <TouchableOpacity
                        className="flex-row items-center justify-between py-6 border-b border-plaid-navy/5"
                    >
                        <View className="flex-row items-center">
                            <View className="w-10 h-10 bg-plaid-navy/5 rounded-xl items-center justify-center mr-4">
                                <Settings size={20} color="#12232E" />
                            </View>
                            <Text className="text-plaid-navy font-header text-sm">Privacy Policy</Text>
                        </View>
                        <ChevronRight size={16} color="#12232E22" />
                    </TouchableOpacity>

                    <Text className="text-plaid-navy/30 font-body text-[10px] mt-4 italic">
                        Castle Companion is an independent app for planning your trip. By using this service, you agree to our terms and other service policies.
                    </Text>
                </View>

                {/* Sign Out */}
                <TouchableOpacity className="flex-row items-center justify-center p-8 bg-plaid-rose/5 rounded-[30px] border border-dashed border-plaid-rose/20 mb-20">
                    <LogOut size={18} color="#B33951" className="mr-3" />
                    <Text className="text-plaid-rose font-header text-sm uppercase tracking-[2px]">Sign Out of App</Text>
                </TouchableOpacity>

                <TermsOfServiceModal isVisible={isToSVisible} onClose={() => setIsToSVisible(false)} />
                <DisneyLinkModal isVisible={isDisneyLinkVisible} onClose={() => setIsDisneyLinkVisible(false)} />
                <CreditCardModal
                    isVisible={isCreditCardVisible}
                    onClose={() => setIsCreditCardVisible(false)}
                    onSave={(v) => setBillingInfo(v)}
                />
                <StrategicInsightModal
                    isVisible={!!currentInsight}
                    onClose={() => setCurrentInsight(null)}
                    data={currentInsight}
                />
            </ScrollView>
        </View>
    );
}

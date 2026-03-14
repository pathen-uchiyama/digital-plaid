import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { Calendar, MapPin, Sparkles, ChevronRight, Compass, ShieldCheck, ExternalLink, Lock } from 'lucide-react-native';
import TermsOfServiceModal from '../components/TermsOfServiceModal';
import { SubscriptionManager } from '../utils/SubscriptionManager';
import { SubscriptionTier } from '../types';

interface AdventureSetupData {
    adventureName: string;
    dates: string;
    location: 'WDW' | 'DL';
    leadName: string;
    napStrategy: 'power' | 'nap' | 'quiet';
    staminaLevel: number;
    rideCountGoal: 'max' | 'relaxed';
}

interface AdventureSetupScreenProps {
    onComplete: (data: AdventureSetupData) => void;
    subscriptionTier?: SubscriptionTier;
    onPaywall?: () => void;
}

export default function AdventureSetupScreen({ onComplete, subscriptionTier, onPaywall }: AdventureSetupScreenProps) {
    const [adventureName, setAdventureName] = useState('');
    const [dates, setDates] = useState('');
    const [location, setLocation] = useState<'WDW' | 'DL'>('WDW');
    const [leadName, setLeadName] = useState('');
    const [napStrategy, setNapStrategy] = useState<'power' | 'nap' | 'quiet'>('power');
    const [staminaLevel, setStaminaLevel] = useState(5);
    const [rideCountGoal, setRideCountGoal] = useState<'max' | 'relaxed'>('relaxed');
    const [hasAgreedToToS, setHasAgreedToToS] = useState(false);
    const [isToSVisible, setIsToSVisible] = useState(false);

    const handleContinue = () => {
        if (adventureName && dates && leadName && hasAgreedToToS) {
            onComplete({
                adventureName,
                dates,
                location,
                leadName,
                napStrategy,
                staminaLevel,
                rideCountGoal
            });
        }
    };

    const isFormValid = adventureName && dates && leadName && hasAgreedToToS;

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            className="flex-1 bg-plaid-alabaster"
        >
            <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="p-8">
                <View className="items-center mt-12 mb-10">
                    <View className="bg-plaid-navy p-6 rounded-full shadow-xl mb-4">
                        <Compass size={48} color="#D4AF37" strokeWidth={1.2} />
                    </View>
                    <Text className="font-header text-plaid-navy text-4xl text-center">New Adventure</Text>
                    <Text className="font-body text-plaid-navy/60 text-lg text-center mt-2 px-6">
                        Define the foundation of your upcoming magical journey.
                    </Text>
                </View>

                <View className="bg-white rounded-[40px] p-8 shadow-2xl border border-plaid-gold/20 mb-8">
                    {/* Adventure Name */}
                    <View className="mb-8">
                        <Text className="text-plaid-gold font-header text-[10px] uppercase tracking-[3px] mb-3">Adventure Name</Text>
                        <TextInput
                            value={adventureName}
                            onChangeText={setAdventureName}
                            placeholder="e.g. The Smith Enchancement"
                            placeholderTextColor="#12232E44"
                            className="bg-plaid-alabaster/50 border border-plaid-navy/10 p-5 rounded-2xl text-xl font-header text-plaid-navy font-bold"
                        />
                    </View>

                    {/* Dates */}
                    <View className="mb-8">
                        <View className="flex-row items-center mb-3">
                            <Calendar size={14} color="#D4AF37" className="mr-2" />
                            <Text className="text-plaid-gold font-header text-[10px] uppercase tracking-[3px]">Travel Dates</Text>
                            {!SubscriptionManager.hasFeatureAccess(subscriptionTier, 'canUseMultiDay') && (
                                <TouchableOpacity onPress={onPaywall} className="ml-2 flex-row items-center bg-plaid-navy/5 px-2 py-0.5 rounded-full border border-plaid-navy/10">
                                    <Lock size={10} color="#D4AF37" className="mr-1" />
                                    <Text className="text-plaid-navy font-header text-[8px] uppercase tracking-widest">Unlock Multi-Day</Text>
                                </TouchableOpacity>
                            )}
                        </View>
                        <TextInput
                            value={dates}
                            onChangeText={setDates}
                            placeholder={SubscriptionManager.hasFeatureAccess(subscriptionTier, 'canUseMultiDay') ? "e.g. October 24 - 30, 2025" : "e.g. October 24, 2025"}
                            placeholderTextColor="#12232E44"
                            className="bg-plaid-alabaster/50 border border-plaid-navy/10 p-5 rounded-2xl text-lg font-body text-plaid-navy"
                        />
                    </View>

                    {/* Location */}
                    <View className="mb-8">
                        <View className="flex-row items-center mb-3">
                            <MapPin size={14} color="#D4AF37" className="mr-2" />
                            <Text className="text-plaid-gold font-header text-[10px] uppercase tracking-[3px]">Resort Destination</Text>
                        </View>
                        <View className="flex-row gap-4">
                            <TouchableOpacity
                                onPress={() => setLocation('WDW')}
                                className={`flex-1 p-4 rounded-2xl border-2 items-center ${location === 'WDW' ? 'bg-plaid-navy border-plaid-gold' : 'bg-white border-plaid-gold/10'}`}
                            >
                                <Text className={`font-header text-xs uppercase tracking-widest ${location === 'WDW' ? 'text-white' : 'text-plaid-navy/40'}`}>Walt Disney World</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => setLocation('DL')}
                                className={`flex-1 p-4 rounded-2xl border-2 items-center ${location === 'DL' ? 'bg-plaid-navy border-plaid-gold' : 'bg-white border-plaid-gold/10'}`}
                            >
                                <Text className={`font-header text-xs uppercase tracking-widest ${location === 'DL' ? 'text-white' : 'text-plaid-navy/40'}`}>Disneyland Resort</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Lead Adventurer */}
                    <View className="mb-8">
                        <View className="flex-row items-center mb-3">
                            <Sparkles size={14} color="#D4AF37" className="mr-2" />
                            <Text className="text-plaid-gold font-header text-[10px] uppercase tracking-[3px]">Lead Adventurer Name</Text>
                        </View>
                        <TextInput
                            value={leadName}
                            onChangeText={setLeadName}
                            placeholder="Your full name"
                            placeholderTextColor="#12232E44"
                            className="bg-plaid-alabaster/50 border border-plaid-navy/10 p-5 rounded-2xl text-lg font-body text-plaid-navy"
                        />
                        <Text className="text-plaid-navy/40 text-[10px] mt-3 italic text-center">
                            As the Lead Adventurer, you will steward the refined plan for your group.
                        </Text>
                    </View>

                    {/* Napping Strategy */}
                    <View className="mb-8">
                        <Text className="text-plaid-gold font-header text-[10px] uppercase tracking-[3px] mb-3">Napping Strategy</Text>
                        <View className="flex-row flex-wrap gap-2">
                            {([
                                { id: 'power', label: 'Power Through' },
                                { id: 'nap', label: 'Hotel Nap' },
                                { id: 'quiet', label: 'Quiet Corner' }
                            ] as const).map((opt) => (
                                <TouchableOpacity
                                    key={opt.id}
                                    onPress={() => setNapStrategy(opt.id)}
                                    className={`px-4 py-3 rounded-xl border-2 ${napStrategy === opt.id ? 'bg-plaid-navy border-plaid-gold' : 'bg-white border-plaid-gold/10'}`}
                                >
                                    <Text className={`font-header text-[10px] uppercase tracking-widest ${napStrategy === opt.id ? 'text-white' : 'text-plaid-navy/40'}`}>{opt.label}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                        <Text className="text-plaid-navy/40 text-[9px] mt-2 italic">
                            {napStrategy === 'nap' ? 'We will block ~2.5 hours for travel and rest.' : 'We will optimize for continuous park presence.'}
                        </Text>
                    </View>

                    {/* Stamina Level */}
                    <View className="mb-8">
                        <Text className="text-plaid-gold font-header text-[10px] uppercase tracking-[3px] mb-3">Family Stamina (1-10)</Text>
                        <View className="flex-row items-center gap-4">
                            <TextInput
                                keyboardType="numeric"
                                value={String(staminaLevel)}
                                onChangeText={(val) => setStaminaLevel(Math.min(10, Math.max(1, parseInt(val) || 1)))}
                                className="bg-plaid-alabaster/50 border border-plaid-navy/10 w-16 p-3 rounded-xl text-center font-header text-plaid-navy"
                            />
                            <Text className="flex-1 font-body text-[11px] text-plaid-navy/60">
                                {staminaLevel <= 3 ? 'Itinerary will prioritize "Land-based" clusters to minimize walking.' : 'Standard spatial optimization will be applied.'}
                            </Text>
                        </View>
                    </View>

                    {/* Ride Count Goal */}
                    <View className="mb-8">
                        <Text className="text-plaid-gold font-header text-[10px] uppercase tracking-[3px] mb-3">Daily Goal</Text>
                        <View className="flex-row gap-4">
                            <TouchableOpacity
                                onPress={() => setRideCountGoal('max')}
                                className={`flex-1 p-4 rounded-2xl border-2 items-center ${rideCountGoal === 'max' ? 'bg-plaid-navy border-plaid-gold' : 'bg-white border-plaid-gold/10'}`}
                            >
                                <Text className={`font-header text-[10px] uppercase tracking-widest ${rideCountGoal === 'max' ? 'text-white' : 'text-plaid-navy/40'}`}>Maximum Rides</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => setRideCountGoal('relaxed')}
                                className={`flex-1 p-4 rounded-2xl border-2 items-center ${rideCountGoal === 'relaxed' ? 'bg-plaid-navy border-plaid-gold' : 'bg-white border-plaid-gold/10'}`}
                            >
                                <Text className={`font-header text-[10px] uppercase tracking-widest ${rideCountGoal === 'relaxed' ? 'text-white' : 'text-plaid-navy/40'}`}>Relaxed Vibe</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Legal Agreement Checkbox */}
                    <View className="bg-plaid-navy/5 p-6 rounded-3xl flex-row items-center border border-plaid-navy/5">
                        <TouchableOpacity
                            onPress={() => setHasAgreedToToS(!hasAgreedToToS)}
                            className={`w-8 h-8 rounded-xl items-center justify-center border-2 ${hasAgreedToToS ? 'bg-plaid-navy border-plaid-navy' : 'bg-white border-plaid-navy/10'}`}
                        >
                            {hasAgreedToToS && <ShieldCheck size={20} color="white" />}
                        </TouchableOpacity>
                        <View className="flex-1 ml-4">
                            <View className="flex-row flex-wrap">
                                <Text className="font-body text-[11px] text-plaid-navy/60">I have read and agree to the </Text>
                                <TouchableOpacity onPress={() => setIsToSVisible(true)}>
                                    <View className="flex-row items-center border-b border-plaid-gold">
                                        <Text className="font-header text-[11px] text-plaid-navy uppercase tracking-tighter">Terms of Service</Text>
                                        <ExternalLink size={10} color="#12232E" className="ml-1" />
                                    </View>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </View>

                <TouchableOpacity
                    onPress={handleContinue}
                    disabled={!isFormValid}
                    className={`p-6 rounded-3xl items-center shadow-xl flex-row justify-center ${!isFormValid ? 'bg-plaid-navy/20' : 'bg-plaid-navy'}`}
                >
                    <Text className="text-white font-header text-lg uppercase tracking-[2px] mr-2">Begin Adventure</Text>
                    <ChevronRight size={20} color="#FFF" />
                </TouchableOpacity>

                <TermsOfServiceModal isVisible={isToSVisible} onClose={() => setIsToSVisible(false)} />
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

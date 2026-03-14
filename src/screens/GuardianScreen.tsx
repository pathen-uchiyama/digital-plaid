import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import {
    Truck, MapPin, Users, Info, Star, CloudRain, Sun, Thermometer,
    Shield, Zap, Sparkles, MessageCircle, Heart, Search, Rocket
} from 'lucide-react-native';
import { LogisticsAlert } from '../utils/LogisticsEngine';
import { CharacterSighting } from '../utils/CharacterIntelEngine';
import { YelpSupport } from '../utils/YelpIntegrator';
import { WeatherCondition } from '../utils/WeatherProtocol';
import { findAndSeekStore } from '../utils/FindAndSeekEngine';

interface MiscScreenProps {
    strollerPin?: LogisticsAlert | null;
    parkingPin?: LogisticsAlert | null;
    rendezvousPin?: LogisticsAlert | null;
    characterSightings?: CharacterSighting[];
    yelpData?: Record<string, YelpSupport>;
    weather?: WeatherCondition;
    intelAlert?: string | null;
    sunlightMode?: boolean;
    minutesSaved: number;
    setIsConsensusActive: (b: boolean) => void;
}

export default function GuardianScreen({
    strollerPin,
    parkingPin,
    rendezvousPin,
    characterSightings = [],
    yelpData = {},
    weather = WeatherCondition.CLEAR,
    intelAlert,
    sunlightMode = false,
    minutesSaved,
    setIsConsensusActive
}: MiscScreenProps) {
    const handleRecalibrate = () => {
        Alert.alert('Recalibrating...', 'Optimizing for current wait times and group stamina.');
    };
    return (
        <ScrollView
            className={`flex-1 ${sunlightMode ? 'bg-[#F4F1DE]' : 'bg-plaid-alabaster'}`}
            contentContainerStyle={{ paddingBottom: 100 }}
        >
            {/* Header */}
            <View className="px-6 pt-12 pb-6">
                <Text className={`font-header text-4xl ${sunlightMode ? 'text-[#1B3022]' : 'text-plaid-navy'}`}>Misc</Text>
                <Text className={`font-body text-[10px] uppercase tracking-widest mt-1 ${sunlightMode ? 'text-[#1B3022]/60' : 'text-plaid-navy/40'}`}>Tactical Intelligence & Logistics</Text>
            </View>

            {/* Performance Metrics */}
            <View className="px-6 mb-8">
                <Text className="text-plaid-gold font-header text-[10px] uppercase tracking-[2px] mb-4">Tactical Performance</Text>
                <View className="bg-plaid-navy p-6 rounded-[30px] border border-plaid-gold/30 shadow-2xl flex-row items-center justify-between">
                    <View>
                        <Text className="text-white/60 font-body text-[10px] uppercase tracking-widest mb-1">Total Intelligence Win</Text>
                        <Text className="text-white font-header text-3xl">{minutesSaved}m Saved</Text>
                    </View>
                    <View className="bg-plaid-gold/20 p-4 rounded-full">
                        <Zap size={24} color="#D4AF37" />
                    </View>
                </View>
            </View>

            {/* Tactical Strategy Controls */}
            <View className="px-6 mb-8">
                <Text className="text-plaid-gold font-header text-[10px] uppercase tracking-[2px] mb-4">Strategic Controls</Text>
                <View className="flex-row justify-between">
                    <TouchableOpacity
                        onPress={handleRecalibrate}
                        className="w-[48%] bg-white p-5 rounded-3xl border border-plaid-navy/10 shadow-sm items-center"
                    >
                        <Search size={20} color="#12232E" className="mb-2" />
                        <Text className="text-plaid-navy font-header text-xs">Recalibrate</Text>
                        <Text className="text-plaid-navy/40 font-body text-[8px] mt-1 text-center">Sync current waits</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => setIsConsensusActive(true)}
                        className="w-[48%] bg-white p-5 rounded-3xl border border-plaid-navy/10 shadow-sm items-center"
                    >
                        <Users size={20} color="#12232E" className="mb-2" />
                        <Text className="text-plaid-navy font-header text-xs">Consensus</Text>
                        <Text className="text-plaid-navy/40 font-body text-[8px] mt-1 text-center">Start group vote</Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* Logistics Section */}
            <View className="px-6 mb-8">
                <Text className="text-plaid-gold font-header text-[10px] uppercase tracking-[2px] mb-4">Logistics Pinned</Text>
                <View className="flex-row flex-wrap justify-between">
                    <View className="w-[48%] bg-white p-4 rounded-3xl border border-plaid-navy/5 shadow-sm mb-4">
                        <Truck size={20} color="#D4AF37" className="mb-2" />
                        <Text className="text-plaid-navy font-header text-xs">Stroller</Text>
                        <Text className="text-plaid-navy/40 font-body text-[10px]">{strollerPin?.message || 'Not Set'}</Text>
                    </View>
                    <View className="w-[48%] bg-white p-4 rounded-3xl border border-plaid-navy/5 shadow-sm mb-4">
                        <MapPin size={20} color="#D4AF37" className="mb-2" />
                        <Text className="text-plaid-navy font-header text-xs">Parking</Text>
                        <Text className="text-plaid-navy/40 font-body text-[10px]">{parkingPin?.message || 'General'}</Text>
                    </View>
                    <View className="w-[100%] bg-white p-4 rounded-3xl border border-plaid-navy/5 shadow-sm">
                        <Users size={20} color="#D4AF37" className="mb-2" />
                        <Text className="text-plaid-navy font-header text-xs">Rendezvous</Text>
                        <Text className="text-plaid-navy/40 font-body text-[10px]">{rendezvousPin?.message || 'Main Entrance'}</Text>
                    </View>
                </View>
            </View>

            {/* Intelligence Section */}
            <View className="px-6 mb-8">
                <Text className="text-plaid-gold font-header text-[10px] uppercase tracking-[2px] mb-4">Operational Intel</Text>
                {intelAlert && (
                    <View className="bg-plaid-navy p-6 rounded-[30px] border border-plaid-gold/20 mb-4 shadow-xl">
                        <View className="flex-row items-center mb-2">
                            <Shield size={16} color="#D4AF37" />
                            <Text className="text-plaid-gold font-header text-[10px] uppercase tracking-[2px] ml-2">Sherpa Strategy</Text>
                        </View>
                        <Text className="text-white font-body text-sm leading-5">{intelAlert}</Text>
                    </View>
                )}

                <View className="bg-white p-6 rounded-[30px] border border-plaid-navy/5 shadow-sm">
                    <Text className="text-plaid-navy font-header text-base mb-4">Recent Sightings</Text>
                    {characterSightings.length > 0 ? (
                        characterSightings.map((s, i) => (
                            <View key={i} className="flex-row items-center mb-3">
                                <View className="w-8 h-8 rounded-full bg-plaid-gold/10 items-center justify-center mr-3">
                                    <Sparkles size={14} color="#D4AF37" />
                                </View>
                                <View>
                                    <Text className="text-plaid-navy font-header text-xs">{s.name}</Text>
                                    <Text className="text-plaid-navy/40 font-body text-[10px]">{s.location} • {s.rarity}</Text>
                                </View>
                            </View>
                        ))
                    ) : (
                        <Text className="text-plaid-navy/30 font-body text-xs italic">No active sightings nearby.</Text>
                    )}
                </View>
            </View>

            {/* Discovery Section (Social Proof) */}
            <View className="px-6 mb-8">
                <Text className="text-plaid-gold font-header text-[10px] uppercase tracking-[2px] mb-4">Social Discovery</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    {Object.entries(yelpData).map(([name, data], i) => (
                        <View key={i} className="bg-white p-5 rounded-[30px] border border-plaid-navy/5 shadow-sm mr-4 w-64">
                            <View className="flex-row justify-between items-center mb-3">
                                <Text className="text-plaid-navy font-header text-sm">{name}</Text>
                                <View className="flex-row items-center">
                                    <Star size={12} color="#D4AF37" fill="#D4AF37" />
                                    <Text className="text-plaid-navy font-header text-xs ml-1">{data.rating}</Text>
                                </View>
                            </View>
                            <Text className="text-plaid-navy/60 font-body text-[10px] leading-4 mb-4">
                                "{data.topReviewSnippet}"
                            </Text>
                            <TouchableOpacity className="bg-plaid-navy/5 py-2 rounded-xl items-center border border-plaid-navy/10">
                                <Text className="text-plaid-navy font-header text-[8px] uppercase tracking-[1px]">View Discussion</Text>
                            </TouchableOpacity>
                        </View>
                    ))}
                    {Object.keys(yelpData).length === 0 && (
                        <View className="bg-white p-6 rounded-[30px] border border-plaid-navy/5 shadow-sm w-full">
                            <Text className="text-plaid-navy/30 font-body text-xs italic">Scanning for local consensus...</Text>
                        </View>
                    )}
                </ScrollView>
            </View>

            {/* Weather & Status Section */}
            <View className="px-6">
                <Text className="text-plaid-gold font-header text-[10px] uppercase tracking-[2px] mb-4">System Status</Text>
                <View className="bg-white p-6 rounded-[30px] border border-plaid-navy/5 shadow-sm">
                    <View className="flex-row items-center justify-between mb-4">
                        <View className="flex-row items-center">
                            <CloudRain size={20} color="#12232E" />
                            <Text className="text-plaid-navy font-header text-sm ml-3">Weather Protocol</Text>
                        </View>
                        <Text className="text-plaid-navy/60 font-body text-xs">{weather}</Text>
                    </View>
                    <View className="h-px bg-plaid-navy/5 mb-4" />
                    <View className="flex-row items-center justify-between mb-4">
                        <View className="flex-row items-center">
                            <Info size={20} color="#12232E" />
                            <Text className="text-plaid-navy font-header text-sm ml-3">VQ Sniper Status</Text>
                        </View>
                        <Text className="text-plaid-gold font-header text-xs italic">Armed & Ready</Text>
                    </View>
                    <View className="h-px bg-plaid-navy/5 mb-4" />
                    <View className="flex-row items-center justify-between mb-4">
                        <View className="flex-row items-center">
                            <Heart size={20} color="#12232E" />
                            <Text className="text-plaid-navy font-header text-sm ml-3">Family Sentiment</Text>
                        </View>
                        <Text className="text-plaid-gold font-header text-xs">High (8.5/10)</Text>
                    </View>
                    <View className="h-px bg-plaid-navy/5 mb-4" />
                    <View className="flex-row items-center justify-between mb-4">
                        <View className="flex-row items-center">
                            <Rocket size={20} color="#12232E" />
                            <Text className="text-plaid-navy font-header text-sm ml-3">Ambition Pacing</Text>
                        </View>
                        <Text className="text-plaid-navy/60 font-body text-xs italic">Completionist</Text>
                    </View>
                    <View className="h-px bg-plaid-navy/5 mb-4" />
                    <View className="flex-row items-center justify-between">
                        <View className="flex-row items-center">
                            <Zap size={20} color="#12232E" />
                            <Text className="text-plaid-navy font-header text-sm ml-3">Battery Strategy</Text>
                        </View>
                        <Text className="text-green-600 font-header text-xs">Optimized</Text>
                    </View>
                </View>
            </View>

            {/* Decompression Option */}
            <View className="px-6 mt-8">
                <TouchableOpacity
                    className="bg-white/50 border border-plaid-navy/10 py-4 rounded-2xl items-center flex-row justify-center"
                    onPress={() => Alert.alert('Routing...', 'Identifying the nearest Quiet Zone sanctuary.')}
                >
                    <Heart size={16} color="#12232E" className="mr-3" />
                    <Text className="text-plaid-navy font-header text-[10px] uppercase tracking-[2px]">Tap for Decompression Routing</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}

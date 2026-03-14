import React, { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, Animated, Dimensions } from 'react-native';
import { Plus, BookOpen, User, Bell, Wind, Clock, Sparkles, ChevronRight } from 'lucide-react-native';

const { width } = Dimensions.get('window');

interface HomeScreenProps {
    onNewTrip: () => void;
    onContinueTrip: () => void;
    onViewHistory: () => void;
    onAdmin: () => void;
    isExecuting: boolean;
    isWebLinked: boolean;
    adventureName?: string;
}

export default function HomeScreen({
    onNewTrip,
    onContinueTrip,
    onViewHistory,
    onAdmin,
    isExecuting,
    isWebLinked,
    adventureName = "Magic Kingdom Adventure"
}: HomeScreenProps) {
    const sweepAnim = useRef(new Animated.Value(-width)).current;
    const fadeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(sweepAnim, {
                toValue: width,
                duration: 1500,
                useNativeDriver: true,
            }),
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 1000,
                useNativeDriver: true,
            })
        ]).start();
    }, []);

    return (
        <SafeAreaView className="flex-1 bg-plaid-alabaster">
            {/* Luminous Sweep Animation Overlay */}
            <Animated.View
                style={{
                    position: 'absolute',
                    top: 0,
                    bottom: 0,
                    width: width / 2,
                    backgroundColor: 'rgba(212, 175, 55, 0.1)',
                    transform: [{ translateX: sweepAnim }],
                    zIndex: 0
                }}
            />

            <Animated.View style={{ flex: 1, opacity: fadeAnim }} className="px-8 pt-8 pb-12">
                {/* 1. TOP SECTION: Alerts & Notifications (The "Landing Banner") */}
                <View className="bg-white/80 backdrop-blur-md px-6 py-4 rounded-3xl border border-plaid-gold/20 shadow-sm mb-10 flex-row items-center justify-between">
                    <View className="flex-row items-center">
                        <View className="bg-plaid-gold/10 p-2 rounded-xl mr-4">
                            <Bell size={20} color="#D4AF37" />
                        </View>
                        <View>
                            <Text className="text-plaid-gold font-header text-[10px] uppercase tracking-[2px] mb-0.5">
                                {isWebLinked ? "Guardian Active" : "Tactical Alert"}
                            </Text>
                            <Text className="text-plaid-navy font-body text-sm font-semibold">
                                {isWebLinked ? "Sync via Pre-Trip Portal" : "Rainy Day Pivot Active"}
                            </Text>
                        </View>
                    </View>
                    <View className="items-end">
                        <Text className="text-plaid-navy/40 font-header text-[10px] uppercase tracking-[1px]">Orlando</Text>
                        <Text className="text-plaid-navy font-body text-xs">82° • 10% 🌧️</Text>
                    </View>
                </View>

                {/* 2. THE LEDGER: Mini Stats */}
                <View className="flex-row gap-4 mb-12">
                    <View className="flex-1 bg-white p-4 rounded-2xl border border-plaid-gold/10 shadow-sm">
                        <Text className="text-plaid-gold font-header text-[8px] uppercase tracking-[2px] mb-1">Magic Captured</Text>
                        <Text className="text-plaid-navy font-header text-lg">12 Adventures</Text>
                    </View>
                    <View className="flex-1 bg-white p-4 rounded-2xl border border-plaid-gold/10 shadow-sm">
                        <Text className="text-plaid-gold font-header text-[8px] uppercase tracking-[2px] mb-1">Group Happiness</Text>
                        <Text className="text-plaid-navy font-header text-lg">98% Avg</Text>
                    </View>
                </View>

                {/* 3. THE HEART: Dynamic Action Button */}
                <View className="flex-1 justify-center items-center">
                    <TouchableOpacity
                        onPress={onContinueTrip}
                        className="bg-plaid-navy w-full py-10 rounded-[40px] items-center shadow-2xl border border-plaid-gold/30"
                        style={{
                            shadowColor: '#12232E',
                            shadowOffset: { width: 0, height: 20 },
                            shadowOpacity: 0.3,
                            shadowRadius: 30,
                        }}
                    >
                        <View className="bg-plaid-gold/10 p-5 rounded-full mb-6">
                            <Sparkles size={40} color="#D4AF37" strokeWidth={1} />
                        </View>

                        <Text className="text-plaid-gold font-header text-[10px] uppercase tracking-[4px] mb-2 text-center">
                            {isWebLinked ? "SILENT GUARDIAN" : (isExecuting ? "Active Adventure" : "Upcoming Journey")}
                        </Text>
                        <Text className="text-white font-header text-3xl text-center px-6 mb-6">
                            {isWebLinked ? "Your Master Plan is Ready" : (isExecuting ? "Resume Horizon View" : "Finalize Your Intent")}
                        </Text>

                        <View className="bg-plaid-gold px-8 py-3 rounded-2xl flex-row items-center">
                            <Text className="text-plaid-navy font-header text-sm uppercase tracking-[2px] mr-2">
                                {isWebLinked ? "Activate Guardian" : (isExecuting ? "Enter The Adventure" : "Review Itinerary")}
                            </Text>
                            <ChevronRight size={16} color="#12232E" />
                        </View>
                    </TouchableOpacity>

                    {/* Countdown / Context */}
                    {!isExecuting && (
                        <View className="mt-8 flex-row items-center">
                            <Clock size={14} color="#D4AF37" />
                            <Text className="text-plaid-navy/40 font-body text-xs ml-2 italic">
                                Departure in 2 Days • 4h 12m
                            </Text>
                        </View>
                    )}
                </View>

                {/* 4. THE GILDED NAV: Bottom Bar */}
                <View className="flex-row items-center justify-between bg-white px-8 py-6 rounded-[30px] border border-plaid-gold/20 shadow-lg mt-auto">
                    <TouchableOpacity onPress={onNewTrip} className="items-center">
                        <Plus size={24} color="#12232E" opacity={0.6} />
                        <Text className="text-plaid-navy/60 font-header text-[8px] uppercase tracking-[1px] mt-1">New Trip</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={onViewHistory} className="items-center">
                        <BookOpen size={24} color="#12232E" opacity={0.6} />
                        <Text className="text-plaid-navy/60 font-header text-[8px] uppercase tracking-[1px] mt-1">History</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={onAdmin} className="items-center">
                        <User size={24} color="#12232E" opacity={0.6} />
                        <Text className="text-plaid-navy/60 font-header text-[8px] uppercase tracking-[1px] mt-1">Lead Adventurer</Text>
                    </TouchableOpacity>
                </View>
            </Animated.View>
        </SafeAreaView>
    );
}

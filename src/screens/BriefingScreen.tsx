import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import { Cloud, Package, Zap, ChevronRight, Sun, Thermometer } from 'lucide-react-native';
import { LogisticsEngine } from '../utils/LogisticsEngine';

interface BriefingScreenProps {
    adventureName: string;
    onComplete: () => void;
}

export default function BriefingScreen({ adventureName, onComplete }: BriefingScreenProps) {
    // Mock Data
    const weather = { temp: 88, rainChance: 45, condition: 'Partly Cloudy' };
    const gear = LogisticsEngine.getGearRecommendations(weather);
    const target7AM = "Slinky Dog Dash (HS) or Tron (MK)";

    return (
        <SafeAreaView className="flex-1 bg-plaid-navy">
            <ScrollView className="px-8 pt-12">
                <View className="mb-12">
                    <Text className="text-plaid-gold font-header text-xs uppercase tracking-[4px] mb-2">Morning Briefing</Text>
                    <Text className="text-white font-header text-4xl">{adventureName}</Text>
                </View>

                {/* Weather Card */}
                <View className="bg-white/5 border border-white/10 p-6 rounded-[30px] mb-8">
                    <View className="flex-row items-center justify-between mb-4">
                        <View className="flex-row items-center">
                            <Cloud size={24} color="#D4AF37" />
                            <Text className="text-white font-header text-lg ml-3">Climate Outlook</Text>
                        </View>
                        <Text className="text-plaid-gold font-header text-xl">{weather.temp}°</Text>
                    </View>
                    <Text className="text-white/60 font-body text-sm leading-6">
                        Expect {weather.condition.toLowerCase()} with a {weather.rainChance}% chance of afternoon showers. Stay hydrated.
                    </Text>
                </View>

                {/* Packing List */}
                <View className="bg-white/5 border border-white/10 p-6 rounded-[30px] mb-8">
                    <View className="flex-row items-center mb-6">
                        <Package size={24} color="#D4AF37" />
                        <Text className="text-white font-header text-lg ml-3">Essential Kit</Text>
                    </View>
                    <View className="flex-row flex-wrap gap-3">
                        {gear.map((item, i) => (
                            <View key={i} className="bg-plaid-gold/20 px-4 py-2 rounded-full border border-plaid-gold/30">
                                <Text className="text-plaid-gold font-header text-[10px] uppercase tracking-[1px]">{item}</Text>
                            </View>
                        ))}
                    </View>
                </View>

                {/* 7 AM Priority */}
                <View className="bg-white/5 border border-white/10 p-6 rounded-[30px] mb-12">
                    <View className="flex-row items-center mb-4">
                        <Zap size={24} color="#D4AF37" />
                        <Text className="text-white font-header text-lg ml-3">Boutique Priority: 07:00</Text>
                    </View>
                    <Text className="text-white font-body text-base leading-6 mb-4">
                        We recommend targeting:
                    </Text>
                    <View className="bg-white/10 p-4 rounded-xl">
                        <Text className="text-plaid-gold font-header text-center italic">{target7AM}</Text>
                    </View>
                </View>

                <TouchableOpacity
                    onPress={onComplete}
                    className="bg-plaid-gold p-6 rounded-2xl items-center shadow-2xl mb-24"
                >
                    <View className="flex-row items-center">
                        <Text className="text-plaid-navy font-header text-xl uppercase tracking-[2px] mr-2">Initiate Entry</Text>
                        <ChevronRight size={20} color="#12232E" />
                    </View>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
}

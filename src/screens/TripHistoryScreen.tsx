import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { THEME } from '../utils/DesignSystem';
import {
    Clock,
    ChevronRight,
    Star,
    Map,
    Calendar,
    Award,
    Ticket
} from 'lucide-react-native';

const PAST_TRIPS = [
    {
        id: '1',
        name: 'The Plaid Legacy',
        dates: 'Dec 12 - Dec 18, 2024',
        parks: ['Magic Kingdom', 'EPCOT', 'Animal Kingdom'],
        logo: 'https://images.unsplash.com/photo-1544085311-1220216c909c?w=100&h=100&fit=crop', // Cinderella Castle mock
        score: 4.8,
        findings: 12
    },
    {
        id: '2',
        name: 'Refined Winter Break',
        dates: 'Jan 05 - Jan 09, 2024',
        parks: ['Hollywood Studios', 'Disneyland'],
        logo: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&h=100&fit=crop', // Star Wars mock
        score: 4.2,
        findings: 8
    }
];

export default function TripHistoryScreen({ onSelectTrip, onClose }: { onSelectTrip: (id: string) => void, onClose: () => void }) {
    return (
        <View className="flex-1 bg-plaid-alabaster">
            {/* Header */}
            <View className="bg-plaid-navy pt-16 pb-12 px-8 rounded-b-[60px] shadow-2xl">
                <View className="flex-row justify-between items-center mb-6">
                    <Text className="text-plaid-gold font-header text-[10px] uppercase tracking-[4px]">Mission Archives</Text>
                    <TouchableOpacity onPress={onClose} className="bg-white/10 px-4 py-2 rounded-full border border-white/20">
                        <Text className="text-white font-header text-[8px] uppercase tracking-[1px]">Back</Text>
                    </TouchableOpacity>
                </View>
                <Text className="text-white font-header text-4xl leading-tight">Past Adventures</Text>
                <Text className="text-white/40 font-body text-sm mt-2 font-light">The legends of expeditions gone by.</Text>
            </View>

            <ScrollView className="px-8 mt-[-30px]" showsVerticalScrollIndicator={false}>
                {PAST_TRIPS.length > 0 ? (
                    PAST_TRIPS.map((trip) => (
                        <TouchableOpacity
                            key={trip.id}
                            onPress={() => onSelectTrip(trip.id)}
                            className="bg-white rounded-[40px] p-8 shadow-xl mb-6 border border-plaid-gold/5 overflow-hidden"
                        >
                            <View className="flex-row items-center">
                                <View className="w-16 h-16 rounded-2xl bg-plaid-navy/5 overflow-hidden mr-6 border border-plaid-gold/20">
                                    <Image source={{ uri: trip.logo }} className="w-full h-full opacity-60" />
                                </View>
                                <View className="flex-1">
                                    <Text className="text-plaid-gold font-header text-[8px] uppercase tracking-[2px] mb-1">{trip.dates}</Text>
                                    <Text className="text-plaid-navy font-header text-xl mb-2">{trip.name}</Text>
                                    <View className="flex-row items-center">
                                        <Map size={10} color="#12232E44" />
                                        <Text className="text-plaid-navy/40 font-body text-[10px] ml-1">{trip.parks.join(' • ')}</Text>
                                    </View>
                                </View>
                                <ChevronRight size={20} color="#D4AF37" />
                            </View>

                            <View className="flex-row mt-6 pt-6 border-t border-plaid-navy/5 justify-between">
                                <View className="flex-row items-center">
                                    <Award size={14} color="#D4AF37" />
                                    <Text className="text-plaid-navy font-header text-[10px] ml-2">{trip.score} Utility Score</Text>
                                </View>
                                <View className="flex-row items-center">
                                    <Star size={14} color="#E8A838" />
                                    <Text className="text-plaid-navy font-header text-[10px] ml-2">{trip.findings} Hidden Mickeys</Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                    ))
                ) : (
                    <View className="items-center justify-center py-20 px-8">
                        <View className="w-24 h-24 bg-plaid-navy/5 rounded-full items-center justify-center mb-6">
                            <Ticket size={40} color="#D4AF37" className="opacity-80" />
                        </View>
                        <Text className="text-plaid-navy font-header text-2xl mb-4 text-center">Your Story Awaits</Text>
                        <Text className="text-plaid-navy/50 font-body text-sm text-center leading-relaxed">
                            Every great legacy begins with a single step into the unknown. When you complete your first expedition, its legend will be recorded here forever.
                        </Text>
                        <TouchableOpacity onPress={onClose} className="mt-8 bg-plaid-gold px-8 py-4 rounded-full border-b-4 border-plaid-gold/50 shadow-xl" style={{ shadowColor: '#D4AF37', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.3, shadowRadius: 20 }}>
                            <Text className="text-plaid-navy font-header text-[10px] uppercase tracking-widest">Plan the First Trip</Text>
                        </TouchableOpacity>
                    </View>
                )}

                {PAST_TRIPS.length > 0 && (
                    <View className="mb-20 items-center">
                        <Text className="text-plaid-navy/20 font-header text-[8px] uppercase tracking-[4px]">END OF ARCHIVE</Text>
                    </View>
                )}
            </ScrollView>
        </View>
    );
}

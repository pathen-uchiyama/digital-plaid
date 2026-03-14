import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Share } from 'react-native';
import { Calendar, Bell, Package, Info, Users, Link, ChevronRight, Map, Clock, AlertTriangle, Sparkles } from 'lucide-react-native';

interface AdventureSynopsisScreenProps {
    adventure: {
        name: string;
        dates: string;
        location: string;
        leadName: string;
        members: any[];
    };
    onReviewItinerary: () => void;
    onClose: () => void;
}

export default function AdventureSynopsisScreen({ adventure, onReviewItinerary, onClose }: AdventureSynopsisScreenProps) {
    const handleShareLink = async () => {
        try {
            await Share.share({
                message: `Join our Castle Companion adventure: ${adventure.name}! Link your Disney account here: [Link Placeholder]`,
            });
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <View className="flex-1 bg-plaid-alabaster">
            {/* Header Area */}
            <View className="bg-plaid-navy pt-16 pb-12 px-8 rounded-b-[60px] shadow-2xl">
                <View className="flex-row justify-between items-center mb-6">
                    <TouchableOpacity onPress={onClose} className="bg-white/10 p-2 rounded-full">
                        <ChevronRight size={18} color="#FFF" style={{ transform: [{ rotate: '180deg' }] }} />
                    </TouchableOpacity>
                    <View className="bg-plaid-gold/20 px-4 py-1 rounded-full border border-plaid-gold/30">
                        <Text className="text-plaid-gold font-header text-[8px] uppercase tracking-[2px]">Briefing in Progress</Text>
                    </View>
                </View>

                <Text className="text-plaid-gold font-header text-[10px] uppercase tracking-[4px] mb-2">{adventure.dates}</Text>
                <Text className="text-white font-header text-4xl leading-tight mb-4">
                    {adventure.name}
                </Text>

                <View className="flex-row items-center">
                    <Map size={14} color="#D4AF37" />
                    <Text className="text-white/60 font-body text-sm ml-2">{adventure.location} • Lead: {adventure.leadName}</Text>
                </View>
            </View>

            <ScrollView className="px-8 mt-[-30px]" showsVerticalScrollIndicator={false}>
                {/* 1. STRATEGIC MILESTONES */}
                <View className="bg-white rounded-[35px] border border-plaid-gold/20 p-8 shadow-xl mb-8">
                    <Text className="text-plaid-navy font-header text-lg mb-6 flex-row items-center">
                        <Bell size={18} color="#D4AF37" className="mr-3" /> Critical Milestones
                    </Text>

                    <View className="space-y-6">
                        <View className="flex-row items-center">
                            <View className="w-10 h-10 bg-plaid-gold/10 rounded-xl items-center justify-center mr-4">
                                <Clock size={20} color="#D4AF37" />
                            </View>
                            <View className="flex-1">
                                <Text className="text-plaid-navy font-header text-sm">Lightning Lane Window</Text>
                                <Text className="text-plaid-gold font-header text-[10px] uppercase mt-1">Opens in 12 Days</Text>
                            </View>
                            <View className="bg-plaid-navy/5 px-3 py-1 rounded-full"><Text className="text-plaid-navy/40 font-header text-[8px]">OCT 12</Text></View>
                        </View>

                        <View className="flex-row items-center mt-6">
                            <View className="w-10 h-10 bg-plaid-navy/5 rounded-xl items-center justify-center mr-4">
                                <Sparkles size={20} color="#12232E" />
                            </View>
                            <View className="flex-1">
                                <Text className="text-plaid-navy font-header text-sm">Dining Reservations</Text>
                                <Text className="text-plaid-navy/40 font-header text-[10px] uppercase mt-1">Booking Window Open</Text>
                            </View>
                            <TouchableOpacity className="bg-plaid-gold px-3 py-1 rounded-full"><Text className="text-plaid-navy font-header text-[8px]">ACTION</Text></TouchableOpacity>
                        </View>
                    </View>
                </View>

                {/* 2. GROUP READINESS */}
                <View className="mb-8">
                    <Text className="text-plaid-navy font-header text-xl mb-4">Group Readiness</Text>
                    <View className="bg-white rounded-[35px] border border-plaid-gold/10 p-6 shadow-lg">
                        {adventure.members.map((member, i) => (
                            <View key={i} className={`flex-row items-center py-4 ${i < adventure.members.length - 1 ? 'border-b border-plaid-navy/5' : ''}`}>
                                <View className="w-10 h-10 bg-plaid-navy rounded-full items-center justify-center mr-4">
                                    <Text className="text-plaid-gold font-header text-sm">{member.name[0]}</Text>
                                </View>
                                <View className="flex-1">
                                    <Text className="text-plaid-navy font-header text-sm">{member.name}</Text>
                                    <Text className="text-plaid-navy/40 font-body text-[10px]">{member.relationship}</Text>
                                </View>
                                {i === 0 ? (
                                    <View className="bg-plaid-teal/10 px-3 py-1 rounded-full border border-plaid-teal/30">
                                        <Text className="text-plaid-teal font-header text-[8px] uppercase">Profile Complete</Text>
                                    </View>
                                ) : (
                                    <TouchableOpacity className="bg-plaid-rose/10 px-3 py-1 rounded-full border border-plaid-rose/30">
                                        <Text className="text-plaid-rose font-header text-[8px] uppercase tracking-[1px]">Nudge</Text>
                                    </TouchableOpacity>
                                )}
                            </View>
                        ))}
                    </View>
                </View>

                {/* 3. PARK INTEL & CLOSURES */}
                <View className="bg-plaid-navy rounded-[40px] p-8 mb-8 shadow-2xl">
                    <Text className="text-plaid-gold font-header text-lg mb-6">Boutique Park Intel</Text>

                    <View className="bg-white/5 p-5 rounded-2xl mb-4 flex-row items-start">
                        <AlertTriangle size={18} color="#D4AF37" className="mr-3" />
                        <View className="flex-1">
                            <Text className="text-white font-header text-sm mb-1">Ride Closures: MK</Text>
                            <Text className="text-white/60 font-body text-[10px]">Splash Mountain is currently under construction. Big Thunder opens at 9:00 AM.</Text>
                        </View>
                    </View>

                    <View className="bg-white/5 p-5 rounded-2xl flex-row items-start">
                        <Clock size={18} color="#D4AF37" className="mr-3" />
                        <View className="flex-1">
                            <Text className="text-white font-header text-sm mb-1">Extended Evening Hours</Text>
                            <Text className="text-white/60 font-body text-[10px]">Oct 26: Magic Kingdom remains open until 11:00 PM for Deluxe Resort guests.</Text>
                        </View>
                    </View>
                </View>

                {/* 4. THIRD-PARTY SYNC */}
                <TouchableOpacity
                    onPress={handleShareLink}
                    className="bg-white p-6 rounded-[30px] border border-dashed border-plaid-gold/40 flex-row items-center mb-12"
                >
                    <Link size={24} color="#D4AF37" className="mr-4" />
                    <View className="flex-1">
                        <Text className="text-plaid-navy font-header text-sm">Link External Experience</Text>
                        <Text className="text-plaid-navy/40 font-body text-[10px]">Sync your MyDisneyExperience or Disneyland App plans.</Text>
                    </View>
                    <ChevronRight size={18} color="#D4AF37" />
                </TouchableOpacity>

                {/* 5. PRIMARY ACTION */}
                <TouchableOpacity
                    onPress={onReviewItinerary}
                    className="bg-plaid-navy p-8 rounded-[35px] border-b-4 border-plaid-gold shadow-2xl mb-20 items-center"
                >
                    <Text className="text-plaid-gold font-header text-[10px] uppercase tracking-[4px] mb-2">The Final Step</Text>
                    <Text className="text-white font-header text-xl uppercase tracking-[2px]">Review Recommended Itinerary</Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
}

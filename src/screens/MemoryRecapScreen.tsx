import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { THEME } from '../utils/DesignSystem';
import { Sparkles, Star, MapPin, Clock, Share2, Rocket, Utensils, X, Award, Zap, Library } from 'lucide-react-native';
import { JourneySummary } from '../types';

interface MemoryRecapScreenProps {
    summary: JourneySummary;
    onClose: () => void;
}

export default function MemoryRecapScreen({ summary, onClose }: MemoryRecapScreenProps) {
    return (
        <View className="flex-1 bg-plaid-alabaster">
            {/* Header Area */}
            <View className="bg-plaid-navy pt-16 pb-12 px-8 rounded-b-[60px] shadow-2xl">
                <View className="flex-row justify-between items-center mb-6">
                    <Sparkles size={24} color="#D4AF37" />
                    <TouchableOpacity onPress={onClose} className="p-2 bg-white/10 rounded-full">
                        <X size={24} color="#FFF" />
                    </TouchableOpacity>
                </View>
                <Text className="text-plaid-gold font-header text-xs uppercase tracking-[4px] mb-2">{summary.date}</Text>
                <Text className="text-white font-header text-4xl leading-tight">
                    {summary.adventureName}
                </Text>
                <Text className="text-white/60 font-body text-sm mt-4 leading-relaxed">
                    {summary.narrative}
                </Text>
            </View>

            <ScrollView className="px-8 mt-[-30px]" showsVerticalScrollIndicator={false}>
                {/* Stats Section */}
                <View className="flex-row gap-4 mb-8">
                    <View className="flex-1 bg-white p-6 rounded-[30px] border border-plaid-gold/20 shadow-xl items-center">
                        <Text className="text-plaid-gold font-header text-2xl mb-1">{summary.totalSteps}</Text>
                        <Text className="text-plaid-navy/40 font-header text-[10px] uppercase tracking-widest">Adventures</Text>
                    </View>
                    <View className="flex-1 bg-white p-6 rounded-[30px] border border-plaid-gold/20 shadow-xl items-center">
                        <Text className="text-plaid-gold font-header text-2xl mb-1">{summary.minutesSaved || 0}</Text>
                        <Text className="text-plaid-navy/40 font-header text-[10px] uppercase tracking-widest">Min. Saved</Text>
                    </View>
                    <View className="flex-1 bg-white p-6 rounded-[30px] border border-plaid-gold/20 shadow-xl items-center">
                        <Award size={24} color="#D4AF37" className="mb-2" />
                        <Text className="text-plaid-navy/40 font-header text-[10px] uppercase tracking-widest">Elite Status</Text>
                    </View>
                </View>

                {/* Achievements Section */}
                {summary.achievements && summary.achievements.length > 0 && (
                    <View className="mb-12">
                        <Text className="text-plaid-navy font-header text-xl mb-6">Boutique Achievements</Text>
                        <View className="flex-row flex-wrap gap-4">
                            {summary.achievements.map((ach) => (
                                <View key={ach.id} className="bg-white p-6 rounded-[35px] items-center w-[45%] border border-plaid-gold/10 shadow-lg">
                                    <View className="bg-plaid-gold/10 p-3 rounded-2xl mb-3">
                                        {ach.icon === 'Award' && <Award size={20} color="#D4AF37" />}
                                        {ach.icon === 'Zap' && <Zap size={20} color="#D4AF37" />}
                                        {ach.icon === 'Star' && <Star size={20} color="#D4AF37" />}
                                    </View>
                                    <Text className="text-plaid-navy font-header text-[10px] uppercase text-center mb-1">{ach.title}</Text>
                                    <Text className="text-plaid-navy/40 font-body text-[8px] text-center leading-relaxed">{ach.description}</Text>
                                </View>
                            ))}
                        </View>
                    </View>
                )}

                {/* Memories Timeline */}
                <View className="mb-12">
                    <Text className="text-plaid-navy font-header text-xl mb-6">Journey Highlights</Text>
                    {summary.memories && summary.memories.length > 0 ? (
                        summary.memories.map((memory, index) => (
                            <View key={memory.id} className="flex-row mb-6">
                                <View className="items-center mr-6">
                                    <View className={`w-8 h-8 rounded-full items-center justify-center ${index === 0 ? 'bg-plaid-gold' : 'bg-plaid-navy'}`}>
                                        {getIconForType(memory.type, index === 0)}
                                    </View>
                                    {index < summary.memories.length - 1 && (
                                        <View className="w-[1px] flex-1 bg-plaid-gold/30 mt-2" />
                                    )}
                                </View>

                                <View className="flex-1 bg-white p-6 rounded-[35px] border border-plaid-gold/10 shadow-lg mb-2">
                                    <View className="flex-row justify-between items-start mb-2">
                                        <Text className="flex-1 text-plaid-navy font-header text-lg leading-tight mr-4">{memory.title}</Text>
                                        <Text className="text-plaid-navy/30 font-header text-[10px]">{memory.timestamp}</Text>
                                    </View>
                                    {memory.highlight && (
                                        <View className="bg-plaid-gold/5 p-3 rounded-2xl border border-plaid-gold/10">
                                            <Text className="text-plaid-gold font-body text-xs italic">{memory.highlight}</Text>
                                        </View>
                                    )}
                                </View>
                            </View>
                        ))
                    ) : (
                        <View className="items-center justify-center py-12 px-6 bg-white rounded-[35px] border border-plaid-navy/5 shadow-sm">
                            <View className="w-16 h-16 bg-plaid-navy/5 rounded-full items-center justify-center mb-4">
                                <Library size={24} color="#D4AF37" className="opacity-80" />
                            </View>
                            <Text className="text-plaid-navy font-header text-lg mb-2 text-center">No Memories Recorded</Text>
                            <Text className="text-plaid-navy/50 font-body text-[11px] text-center leading-relaxed">
                                As you experience attractions and dining, your personalized highlights will automatically populate here to chronicle your day.
                            </Text>
                        </View>
                    )}
                </View>

                {/* Action Row */}
                <View className="mb-20">
                    <TouchableOpacity
                        className="bg-plaid-gold py-6 rounded-[25px] flex-row justify-center items-center shadow-2xl"
                    >
                        <Share2 size={20} color="#12232E" className="mr-3" />
                        <Text className="text-plaid-navy font-header text-sm tracking-widest uppercase">Export Souvenir</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    );
}

function getIconForType(type: string, isFirst: boolean) {
    const color = isFirst ? "#12232E" : "#D4AF37";
    const size = 16;
    if (type === 'ride') return <Rocket size={size} color={color} />;
    if (type === 'dining') return <Utensils size={size} color={color} />;
    return <Sparkles size={size} color={color} />;
}

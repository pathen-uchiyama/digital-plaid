import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, LayoutAnimation } from 'react-native';
import { THEME } from '../utils/DesignSystem';
import { Sparkles, Zap, Heart, Skull, ArrowRight, User, Info, Megaphone, Moon, UserCheck, Eye, Clock, Activity, Coffee, Flag } from 'lucide-react-native';

interface Attraction {
    id: string;
    name: string;
    type: 'ride' | 'character' | 'show' | 'parade';
    intel: string;
    sensory?: string[]; // 'Loud', 'Dark', 'Strobe', 'Drops'
    intensity?: 'Low' | 'Moderate' | 'High';
}

const CATEGORIES = [
    { id: 'ride', label: 'Rides', icon: Zap },
    { id: 'character', label: 'Characters', icon: UserCheck },
    { id: 'show', label: 'Shows', icon: Sparkles },
    { id: 'parade', label: 'Parades', icon: Megaphone },
];

const TRIP_STYLES = [
    { id: 'completionist', label: 'The Completionist', icon: Flag, desc: 'Every ride, every show. Fast-paced.' },
    { id: 'relaxed', label: 'The Romantic Wanderer', icon: Coffee, desc: 'Casual pacing, focus on atmosphere and dining.' },
    { id: 'refined', label: 'The Refined Strategist', icon: Activity, desc: 'Focus on high-value Lightning Lanes and efficiency.' },
];

const MASTER_DATA: Attraction[] = [
    { id: 'MK_SPACE', name: 'Space Mountain', type: 'ride', intel: 'A high-speed, indoor roller coaster in the dark.', sensory: ['Dark', 'Loud'], intensity: 'High' },
    { id: 'MK_PIRATES', name: 'Pirates of the Caribbean', type: 'ride', intel: 'Slow boat ride. Dark with small drops.', sensory: ['Dark'], intensity: 'Low' },
    { id: 'MK_MANSION', name: 'Haunted Mansion', type: 'ride', intel: 'Spooky slow-moving tour. No drops.', sensory: ['Dark', 'Loud'], intensity: 'Moderate' },
    { id: 'MK_MICKEY', name: 'Meet Mickey at Town Square', type: 'character', intel: 'Classic meet and greet.', sensory: [], intensity: 'Low' },
    { id: 'MK_ARIEL', name: 'Meet Ariel in Her Grotto', type: 'character', intel: 'Meet Ariel underwater.', sensory: [], intensity: 'Low' },
    { id: 'MK_PHILHAR', name: "Mickey's PhilharMagic", type: 'show', intel: '3D musical adventure with 4D effects.', sensory: ['Loud', 'Strobe'], intensity: 'Moderate' },
    { id: 'MK_FOF', name: 'Festival of Fantasy', type: 'parade', intel: 'Grand daytime parade.', sensory: ['Loud'], intensity: 'Moderate' },
];

interface SelectionProcessScreenProps {
    memberName: string;
    onComplete: (selections: any) => void;
}

export default function SelectionProcessScreen({ memberName, onComplete }: SelectionProcessScreenProps) {
    const [tripStyle, setTripStyle] = useState('refined');
    const [selectedCategory, setSelectedCategory] = useState('ride');
    const [mustDos, setMustDos] = useState<string[]>([]);
    const [avoids, setAvoids] = useState<string[]>([]);
    const [expandedIntel, setExpandedIntel] = useState<string | null>(null);

    const filteredItems = MASTER_DATA.filter(item => item.type === selectedCategory);

    const toggleMustDo = (id: string) => {
        if (avoids.includes(id)) {
            setAvoids(avoids.filter(a => a !== id));
        }
        setMustDos(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
    };

    const toggleAvoid = (id: string) => {
        if (mustDos.includes(id)) {
            setMustDos(mustDos.filter(m => m !== id));
        }
        setAvoids(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
    };

    const toggleIntel = (id: string) => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setExpandedIntel(expandedIntel === id ? null : id);
    };

    return (
        <View className="flex-1 bg-plaid-alabaster">
            {/* Header */}
            <View className="bg-plaid-navy pt-16 pb-12 px-8 rounded-b-[60px] shadow-2xl">
                <View className="flex-row items-center mb-4">
                    <View className="bg-plaid-gold/20 p-2 rounded-full mr-3">
                        <Sparkles size={16} color="#D4AF37" />
                    </View>
                    <Text className="text-plaid-gold font-header text-xs uppercase tracking-[3px]">Strategic Intent</Text>
                </View>
                <Text className="text-white font-header text-4xl leading-tight">
                    Personalizing {memberName}'s Adventure
                </Text>
            </View>

            <ScrollView className="px-8 mt-[-30px]" showsVerticalScrollIndicator={false}>
                {/* Trip Style Selection */}
                <View className="mb-10">
                    <Text className="text-plaid-navy font-header text-xl mb-6">Adventure Style</Text>
                    {TRIP_STYLES.map(style => (
                        <TouchableOpacity
                            key={style.id}
                            onPress={() => setTripStyle(style.id)}
                            className={`flex-row items-center p-6 rounded-[30px] border-2 mb-4 ${tripStyle === style.id ? 'bg-white border-plaid-gold shadow-lg' : 'bg-white/50 border-plaid-navy/5'}`}
                        >
                            <View className={`p-4 rounded-2xl mr-4 ${tripStyle === style.id ? 'bg-plaid-navy' : 'bg-plaid-navy/5'}`}>
                                <style.icon size={24} color={tripStyle === style.id ? "#D4AF37" : "#12232E44"} />
                            </View>
                            <View className="flex-1">
                                <Text className={`font-header text-lg ${tripStyle === style.id ? 'text-plaid-navy' : 'text-plaid-navy/40'}`}>{style.label}</Text>
                                <Text className={`font-body text-[10px] mt-1 ${tripStyle === style.id ? 'text-plaid-navy/60' : 'text-plaid-navy/20'}`}>{style.desc}</Text>
                            </View>
                            {tripStyle === style.id && (
                                <View className="w-6 h-6 rounded-full bg-plaid-gold items-center justify-center">
                                    <View className="w-2 h-2 bg-plaid-navy rounded-full" />
                                </View>
                            )}
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Refined Selection */}
                <View className="mb-6">
                    <Text className="text-plaid-navy font-header text-xl mb-6">Must-Do vs. Avoid</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row gap-4 mb-8">
                        {CATEGORIES.map(cat => (
                            <TouchableOpacity
                                key={cat.id}
                                onPress={() => setSelectedCategory(cat.id)}
                                className={`flex-row items-center px-6 py-4 rounded-[25px] border-2 mr-4 ${selectedCategory === cat.id ? 'bg-plaid-navy border-plaid-gold shadow-lg' : 'bg-white border-plaid-gold/10'}`}
                            >
                                <cat.icon size={18} color={selectedCategory === cat.id ? "#D4AF37" : "#12232E"} className="mr-3" />
                                <Text className={`font-header text-xs uppercase tracking-widest ${selectedCategory === cat.id ? 'text-white' : 'text-plaid-navy'}`}>{cat.label}</Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>

                    {filteredItems.map(item => {
                        const isMust = mustDos.includes(item.id);
                        const isAvoid = avoids.includes(item.id);
                        const isExpanded = expandedIntel === item.id;

                        return (
                            <View key={item.id} className="bg-white rounded-[35px] border border-plaid-gold/10 shadow-lg mb-4 overflow-hidden">
                                <View className="p-6 flex-row items-center">
                                    <View className="flex-1 mr-4">
                                        <Text className="text-plaid-navy font-header text-lg leading-tight">{item.name}</Text>
                                        <TouchableOpacity onPress={() => toggleIntel(item.id)} className="flex-row items-center mt-2">
                                            <Info size={12} color="#D4AF37" className="mr-2" />
                                            <Text className="text-plaid-gold font-header text-[10px] uppercase tracking-widest">Boutique Intel</Text>
                                        </TouchableOpacity>
                                    </View>
                                    <View className="flex-row gap-2">
                                        <TouchableOpacity onPress={() => toggleMustDo(item.id)} className={`p-4 rounded-2xl border-2 ${isMust ? 'bg-plaid-gold/20 border-plaid-gold' : 'bg-plaid-navy/5 border-transparent'}`}>
                                            <Heart size={18} color={isMust ? "#D4AF37" : "#12232E33"} />
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={() => toggleAvoid(item.id)} className={`p-4 rounded-2xl border-2 ${isAvoid ? 'bg-plaid-rose/20 border-plaid-rose' : 'bg-plaid-navy/5 border-transparent'}`}>
                                            <Skull size={18} color={isAvoid ? "#E53E3E" : "#12232E33"} />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                                {isExpanded && (
                                    <View className="px-6 pb-8 bg-plaid-navy/5 border-t border-plaid-gold/5 pt-4">
                                        <Text className="text-plaid-navy/60 font-body text-xs italic mb-4 leading-relaxed">{item.intel}</Text>
                                        <View className="flex-row flex-wrap gap-2">
                                            {item.sensory?.map(s => (
                                                <View key={s} className="bg-white/80 px-3 py-1 rounded-full border border-plaid-gold/20 mr-1">
                                                    <Text className="text-plaid-navy/80 font-header text-[8px] uppercase tracking-widest">{s}</Text>
                                                </View>
                                            ))}
                                            <View className="bg-plaid-navy px-3 py-1 rounded-full"><Text className="text-white font-header text-[8px] uppercase tracking-widest">{item.intensity} Intensity</Text></View>
                                        </View>
                                    </View>
                                )}
                            </View>
                        );
                    })}
                </View>

                {/* Footer Action */}
                <View className="mb-20">
                    <TouchableOpacity
                        onPress={() => onComplete({ tripStyle, mustDos, avoids })}
                        className="bg-plaid-gold py-6 rounded-3xl flex-row justify-center items-center shadow-2xl border-b-4 border-plaid-gold/50"
                        style={{
                            shadowColor: '#D4AF37',
                            shadowOffset: { width: 0, height: 10 },
                            shadowOpacity: 0.3,
                            shadowRadius: 15,
                        }}
                    >
                        <Text className="text-plaid-navy font-header text-sm tracking-widest uppercase mr-3">Finalize {memberName}'s Intent</Text>
                        <ArrowRight size={18} color="#12232E" />
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    );
}

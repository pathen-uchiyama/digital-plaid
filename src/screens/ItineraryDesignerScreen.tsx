import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, LayoutAnimation, Platform } from 'react-native';
import { THEME } from '../utils/DesignSystem';
import {
    Clock,
    Zap,
    Utensils,
    User,
    Coffee,
    Info,
    ChevronDown,
    ChevronUp,
    MapPin,
    Star,
    AlertTriangle,
    ArrowRight,
    Compass,
    Accessibility,
    Moon,
    Volume2,
    ZapOff,
    Wind,
    Wand2
} from 'lucide-react-native';

interface ItineraryItem {
    id: string;
    time: string;
    title: string;
    type: 'ride' | 'food' | 'break' | 'character' | 'show';
    location: string;
    travelTime: string;
    isUpcharge: boolean;
    upchargeLabel?: string;
    why: string;
    intel: {
        description: string;
        sensory: string[];
        thrills: string[];
        foodType?: string;
        spicy?: boolean;
        yelpRating?: string;
        seating?: 'Indoor' | 'Outdoor' | 'Both';
    };
}

const MOCK_ITINERARY: ItineraryItem[] = [
    {
        id: '1',
        time: '9:00 AM',
        title: 'Space Mountain',
        type: 'ride',
        location: 'Tomorrowland',
        travelTime: '5 min',
        isUpcharge: true,
        upchargeLabel: 'LL Multi',
        why: 'Highest demand attraction; short window before 10 AM peak.',
        intel: {
            description: 'A high-speed roller coaster journey through the dark.',
            sensory: ['Dark', 'Loud Sounds', 'Strobe Effects'],
            thrills: ['Major Drops', 'Sudden Turns'],
        }
    },
    {
        id: '2',
        time: '10:15 AM',
        title: 'Meet Mickey at Town Square',
        type: 'character',
        location: 'Main Street, U.S.A.',
        travelTime: '12 min',
        isUpcharge: false,
        why: 'Low wait time during morning parade prep.',
        intel: {
            description: 'Meet the Mouse himself in his rehearsal room.',
            sensory: ['Indoors', 'Photography'],
            thrills: ['None'],
        }
    },
    {
        id: '3',
        time: '11:45 AM',
        title: 'Pecos Bill Tall Tale Inn',
        type: 'food',
        location: 'Frontierland',
        travelTime: '15 min',
        isUpcharge: false,
        why: 'Strategic placement before Adventureland loop.',
        intel: {
            description: 'Southwestern-style quick service fare.',
            foodType: 'Mexican/Southwestern',
            spicy: true,
            yelpRating: '4.2',
            seating: 'Indoor',
            sensory: ['Themed Ambient Music'],
            thrills: ['None'],
        }
    },
    {
        id: '4',
        time: '1:00 PM',
        title: 'Refined Park Break',
        type: 'break',
        location: 'Hall of Presidents (A/C)',
        travelTime: '5 min',
        isUpcharge: false,
        why: 'Avoid peak heat and UV index (1PM-3PM).',
        intel: {
            description: 'Relax in a high-capacity, climate-controlled theater.',
            sensory: ['Cooling', 'Low Light'],
            thrills: ['None'],
        }
    },
];

export default function ItineraryDesignerScreen({ onComplete }: { onComplete: () => void }) {
    const [itinerary, setItinerary] = useState(MOCK_ITINERARY);
    const [expandedId, setExpandedId] = useState<string | null>(null);

    const toggleExpand = (id: string) => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setExpandedId(expandedId === id ? null : id);
    };

    const moveItem = (index: number, direction: 'up' | 'down') => {
        const newItinerary = [...itinerary];
        const targetIndex = direction === 'up' ? index - 1 : index + 1;
        if (targetIndex >= 0 && targetIndex < itinerary.length) {
            const temp = newItinerary[index];
            newItinerary[index] = newItinerary[targetIndex];
            newItinerary[targetIndex] = temp;
            setItinerary(newItinerary);
        }
    };

    const renderIntelTag = (label: string, icon: any, color: string) => (
        <View className="flex-row items-center bg-white/10 px-3 py-1.5 rounded-full mr-2 mb-2 border border-white/10">
            {React.createElement(icon, { size: 10, color })}
            <Text className="text-white/80 font-header text-[8px] uppercase tracking-widest ml-2">{label}</Text>
        </View>
    );

    return (
        <View className="flex-1 bg-plaid-alabaster">
            {/* Header */}
            <View className="bg-plaid-navy pt-16 pb-12 px-8 rounded-b-[60px] shadow-2xl">
                <View className="flex-row items-center mb-4">
                    <Compass size={16} color="#D4AF37" />
                    <Text className="text-plaid-gold font-header text-xs uppercase tracking-[3px] ml-3">Mission Topology</Text>
                </View>
                <Text className="text-white font-header text-4xl leading-tight">Boutique Itinerary</Text>
                <Text className="text-white/40 font-body text-sm mt-2 font-light">Customizing the flow of your expedition.</Text>
            </View>

            <ScrollView className="px-6 mt-[-30px]" showsVerticalScrollIndicator={false}>
                {itinerary.length > 0 ? (
                    itinerary.map((item, index) => {
                        const isExpanded = expandedId === item.id;
                        return (
                            <View key={item.id} className="mb-4">
                                {/* Travel Indicator */}
                                {index > 0 && (
                                    <View className="flex-row items-center ml-12 py-2">
                                        <View className="w-0.5 h-8 bg-plaid-gold/20" />
                                        <View className="bg-plaid-gold/10 px-3 py-1 rounded-full ml-4 flex-row items-center">
                                            <MapPin size={10} color="#D4AF37" />
                                            <Text className="text-plaid-gold font-header text-[8px] uppercase ml-2">{item.travelTime} Travel</Text>
                                        </View>
                                    </View>
                                )}

                                {/* Itinerary Tile */}
                                <View
                                    className={`bg-white rounded-[35px] shadow-xl border overflow-hidden ${isExpanded ? 'border-plaid-gold' : 'border-plaid-gold/10'}`}
                                >
                                    <View className="p-6 flex-row items-center">
                                        {/* Move Controls */}
                                        <View className="mr-4 space-y-2">
                                            <TouchableOpacity onPress={() => moveItem(index, 'up')} disabled={index === 0}>
                                                <ChevronUp size={20} color={index === 0 ? "#12232E22" : "#D4AF37"} />
                                            </TouchableOpacity>
                                            <TouchableOpacity onPress={() => moveItem(index, 'down')} disabled={index === itinerary.length - 1}>
                                                <ChevronDown size={20} color={index === itinerary.length - 1 ? "#12232E22" : "#D4AF37"} />
                                            </TouchableOpacity>
                                        </View>

                                        <View className="flex-1">
                                            <Text className="text-plaid-gold font-header text-[10px] uppercase tracking-widest mb-1">{item.time}</Text>
                                            <Text className="text-plaid-navy font-header text-lg leading-tight">{item.title}</Text>
                                            <View className="flex-row items-center mt-2">
                                                <MapPin size={10} color="#12232E44" />
                                                <Text className="text-plaid-navy/40 font-body text-[10px] ml-1">{item.location}</Text>
                                                {item.isUpcharge && (
                                                    <View className="bg-plaid-amber/10 px-2 py-0.5 rounded-full border border-plaid-amber/30 ml-3">
                                                        <Text className="text-plaid-amber font-header text-[7px] uppercase">{item.upchargeLabel}</Text>
                                                    </View>
                                                )}
                                            </View>
                                        </View>

                                        <TouchableOpacity
                                            onPress={() => toggleExpand(item.id)}
                                            className={`w-12 h-12 rounded-2xl items-center justify-center ${isExpanded ? 'bg-plaid-navy' : 'bg-plaid-navy/5'}`}
                                        >
                                            <Info size={20} color={isExpanded ? "#D4AF37" : "#12232E44"} />
                                        </TouchableOpacity>
                                    </View>

                                    {isExpanded && (
                                        <View className="bg-plaid-navy p-8 border-t border-plaid-gold/20">
                                            {/* The Why */}
                                            <View className="mb-6">
                                                <Text className="text-plaid-gold font-header text-[9px] uppercase tracking-widest mb-2">The Strategic Why</Text>
                                                <Text className="text-white/80 font-body text-xs italic leading-relaxed">"{item.why}"</Text>
                                            </View>

                                            {/* The Intel */}
                                            <View>
                                                <Text className="text-plaid-gold font-header text-[9px] uppercase tracking-widest mb-4">First-Time Advisor</Text>
                                                <Text className="text-white/60 font-body text-[11px] mb-4">{item.intel.description}</Text>

                                                <View className="flex-row flex-wrap">
                                                    {item.intel.sensory.map(s => renderIntelTag(s, s.includes('Loud') ? Volume2 : Moon, '#D4AF37'))}
                                                    {item.intel.thrills.map(t => renderIntelTag(t, Zap, '#E8A838'))}
                                                    {item.intel.foodType && renderIntelTag(item.intel.foodType, Utensils, '#FFF')}
                                                    {item.intel.yelpRating && renderIntelTag(`Yelp: ${item.intel.yelpRating}/5`, Star, '#FFF')}
                                                    {item.intel.seating && renderIntelTag(`${item.intel.seating} Seated`, Accessibility, '#FFF')}
                                                    {item.intel.spicy && renderIntelTag('Spicy', Wind, '#B33951')}
                                                </View>
                                            </View>

                                            <TouchableOpacity className="mt-8 bg-white/10 p-4 rounded-xl border border-white/5 items-center">
                                                <Text className="text-white font-header text-[10px] uppercase tracking-[2px]">Remove From Itinerary</Text>
                                            </TouchableOpacity>
                                        </View>
                                    )}
                                </View>
                            </View>
                        );
                    })
                ) : (
                    <View className="items-center justify-center py-20 px-4">
                        <View className="w-24 h-24 bg-plaid-gold/10 rounded-full items-center justify-center mb-6">
                            <Wand2 size={40} color="#D4AF37" className="opacity-80" />
                        </View>
                        <Text className="text-plaid-navy font-header text-2xl mb-4 text-center">A Blank Canvas</Text>
                        <Text className="text-plaid-navy/50 font-body text-sm text-center leading-relaxed">
                            Your itinerary is currently empty. Our Strategist AI is ready to craft a bespoke day tailored to your unique tastes.
                        </Text>
                        <TouchableOpacity className="mt-8 bg-white px-8 py-4 rounded-full border border-plaid-gold/30 shadow-sm flex-row items-center">
                            <Star size={16} color="#D4AF37" className="mr-2" />
                            <Text className="text-plaid-navy font-header text-[10px] uppercase tracking-widest">Auto-Generate Magic</Text>
                        </TouchableOpacity>
                    </View>
                )}

                <TouchableOpacity
                    onPress={onComplete}
                    className="bg-plaid-gold p-8 rounded-[40px] items-center shadow-2xl border-b-4 border-plaid-gold/50 mb-20 mt-8"
                    style={{ shadowColor: '#D4AF37', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.3, shadowRadius: 20 }}
                >
                    <Text className="text-plaid-navy font-header text-[10px] uppercase tracking-[4px] mb-2 opacity-60">Ready for Deployment</Text>
                    <View className="flex-row items-center">
                        <Text className="text-plaid-navy font-header text-xl uppercase tracking-[2px] mr-3">Initialize Daily Intent</Text>
                        <ArrowRight size={20} color="#12232E" />
                    </View>
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
}

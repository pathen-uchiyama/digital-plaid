import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { THEME } from '../utils/DesignSystem';
import { Heart, Star, Ban, Utensils, Users } from 'lucide-react-native';

export default function SurveyScreen({ route }: any) {
    const tripId = route?.params?.tripId;
    const [selections, setSelections] = useState<Record<string, string>>({});

    const items = [
        { id: 'space_mtn', name: 'Space Mountain', type: 'ride' },
        { id: 'mickey', name: 'Mickey Mouse', type: 'character' },
        { id: 'churros', name: 'Churros', type: 'food' },
    ];

    const renderOption = (itemId: string, rank: string, label: string, icon: any) => {
        const isSelected = selections[itemId] === rank;
        return (
            <TouchableOpacity
                onPress={() => setSelections(prev => ({ ...prev, [itemId]: rank }))}
                className={`flex-1 p-3 rounded-lg border-2 items-center justify-center ${isSelected ? 'bg-plaid-gold border-plaid-green' : 'bg-white border-plaid-cream'}`}
            >
                {icon}
                <Text className={`text-[10px] font-bold mt-1 ${isSelected ? 'text-plaid-green' : 'text-plaid-green opacity-50'}`}>
                    {label}
                </Text>
            </TouchableOpacity>
        );
    };

    return (
        <ScrollView className="flex-1 bg-plaid-cream">
            <View className="bg-plaid-green p-6 pt-12">
                <Text className="text-plaid-cream text-2xl font-bold uppercase">Personalize Your Mission</Text>
                <Text className="text-plaid-gold opacity-80">Rank your must-dos for trip {tripId?.slice(0, 8)}</Text>
            </View>

            <View className="p-6">
                {items.map(item => (
                    <View key={item.id} className="mb-8">
                        <Text className="text-plaid-green font-bold text-lg mb-3 uppercase tracking-wider">{item.name}</Text>
                        <View className="flex-row gap-2">
                            {renderOption(item.id, 'must-do', 'Must-Do', <Heart size={20} color="#1B3022" />)}
                            {renderOption(item.id, 'like-to-do', 'Like-to-Do', <Star size={20} color="#1B3022" />)}
                            {renderOption(item.id, 'avoid', 'Avoid', <Ban size={20} color="#1B3022" />)}
                        </View>
                    </View>
                ))}

                <TouchableOpacity
                    className="bg-plaid-green p-5 rounded-lg items-center mt-4 shadow-lg"
                    style={{ minHeight: 48 }}
                >
                    <Text className="text-plaid-cream font-bold text-lg uppercase">Submit Intel</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}

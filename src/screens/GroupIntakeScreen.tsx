import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { THEME } from '../utils/DesignSystem';
import { useGuestManager } from '../hooks/useGuestManager';
import SelectionProcessScreen from './SelectionProcessScreen';
import { User, ShieldCheck } from 'lucide-react-native';

export default function GroupIntakeScreen() {
    const [step, setStep] = useState(1);
    const [guests, setGuests] = useState([]);
    const [currentGuestName, setCurrentGuestName] = useState('');
    const [currentGuestAge, setCurrentGuestAge] = useState('');
    const [currentGuestHeight, setCurrentGuestHeight] = useState('');
    const [currentGuestMembership, setCurrentGuestMembership] = useState<'Regular' | 'AP' | 'DVC'>('Regular');
    const { addGuest } = useGuestManager();

    const renderHeader = () => (
        <View className="bg-plaid-navy p-8 pt-16 border-b border-plaid-gold/20">
            <View className="flex-row items-center mb-4">
                <View className="bg-plaid-gold/20 p-2 rounded-full mr-3">
                    <ShieldCheck size={16} color="#D4AF37" />
                </View>
                <Text className="text-plaid-gold font-header text-xs uppercase tracking-[4px]">
                    Party Management
                </Text>
            </View>
            <Text className="text-white font-header text-4xl leading-tight">
                Manage Adventurers
            </Text>
        </View>
    );

    const renderGuestForm = () => (
        <View className="p-8">
            <Text className="text-plaid-navy font-header text-2xl mb-8">
                New Adventurer
            </Text>

            <View className="mb-8">
                <Text className="text-plaid-navy/40 font-header text-[10px] uppercase tracking-widest mb-3">Full Identity</Text>
                <TextInput
                    placeholder="e.g. John Smith"
                    placeholderTextColor="#12232E44"
                    value={currentGuestName}
                    onChangeText={setCurrentGuestName}
                    className="bg-white border-2 border-plaid-gold/10 p-6 rounded-[25px] text-xl font-header text-plaid-navy shadow-sm"
                />
            </View>

            <View className="flex-row gap-6 mb-10">
                <View className="flex-1">
                    <Text className="text-plaid-navy/40 font-header text-[10px] uppercase tracking-widest mb-3">Age</Text>
                    <TextInput
                        keyboardType="numeric"
                        placeholder="--"
                        placeholderTextColor="#12232E44"
                        value={currentGuestAge}
                        onChangeText={setCurrentGuestAge}
                        className="bg-white border-2 border-plaid-gold/10 p-6 rounded-[25px] text-xl font-header text-plaid-navy shadow-sm"
                    />
                </View>
                <View className="flex-1">
                    <Text className="text-plaid-navy/40 font-header text-[10px] uppercase tracking-widest mb-3">Height (cm)</Text>
                    <TextInput
                        keyboardType="numeric"
                        placeholder="--"
                        placeholderTextColor="#12232E44"
                        value={currentGuestHeight}
                        onChangeText={setCurrentGuestHeight}
                        className="bg-white border-2 border-plaid-gold/10 p-6 rounded-[25px] text-xl font-header text-plaid-navy shadow-sm"
                    />
                </View>
            </View>

            <View className="mb-10">
                <Text className="text-plaid-navy/40 font-header text-[10px] uppercase tracking-widest mb-4">Membership Status</Text>
                <View className="flex-row gap-2">
                    {['Regular', 'AP', 'DVC'].map((type) => (
                        <TouchableOpacity
                            key={type}
                            onPress={() => setCurrentGuestMembership(type as any)}
                            className={`flex-1 py-4 items-center rounded-2xl border ${currentGuestMembership === type ? 'bg-plaid-navy border-plaid-navy' : 'bg-white border-plaid-gold/10 shadow-sm'}`}
                        >
                            <Text className={`font-header text-[10px] uppercase tracking-[1px] ${currentGuestMembership === type ? 'text-plaid-gold' : 'text-plaid-navy/40'}`}>
                                {type}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>

            <TouchableOpacity
                onPress={() => setStep(2)}
                disabled={!currentGuestName}
                className={`py-6 rounded-[25px] items-center shadow-xl mt-8 border-2 ${currentGuestName ? 'bg-plaid-gold border-plaid-gold shadow-plaid-gold/30' : 'bg-plaid-navy/5 border-plaid-navy/10'}`}
            >
                <Text className={`font-header text-sm tracking-widest uppercase ${currentGuestName ? 'text-plaid-navy' : 'text-plaid-navy/20'}`}>
                    Next Step: Strategic Intent →
                </Text>
            </TouchableOpacity>
        </View>
    );

    if (step === 2) {
        return (
            <SelectionProcessScreen
                memberName={currentGuestName || 'Adventurer'}
                onComplete={(selections) => {
                    console.log('Selections:', selections);
                    // Handle completion
                }}
            />
        );
    }

    return (
        <ScrollView className="flex-1 bg-plaid-alabaster">
            {renderHeader()}
            {renderGuestForm()}
        </ScrollView>
    );
}

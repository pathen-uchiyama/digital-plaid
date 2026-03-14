import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { THEME } from '../utils/DesignSystem';
import { User, Ruler, Heart, Users, Sparkles } from 'lucide-react-native';

const RELATIONSHIPS = ['Self', 'Spouse', 'Child', 'Parent', 'Friend', 'Relative'];

interface GuestProfileScreenProps {
    onComplete: (guests: any[]) => void;
}

export default function GuestProfileScreen({ onComplete }: GuestProfileScreenProps) {
    const [guests, setGuests] = useState([
        { id: 1, name: '', age: '', height: '', relationship: 'Self', isFirstTimer: false, preference: 'balanced' }
    ]);

    const addGuest = () => {
        setGuests([...guests, {
            id: guests.length + 1,
            name: '',
            age: '',
            height: '',
            relationship: 'Friend',
            isFirstTimer: false,
            preference: 'balanced'
        }]);
    };

    const updateGuest = (id: number, field: string, value: any) => {
        setGuests(guests.map(g => g.id === id ? { ...g, [field]: value } : g));
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            className="flex-1 bg-plaid-alabaster"
        >
            <ScrollView className="p-8">
                <View className="mt-12 mb-8 items-center">
                    <Text className="font-header text-plaid-navy text-4xl text-center">Assemble Adverturers</Text>
                    <Text className="font-body text-plaid-navy/60 text-lg mt-2 text-center px-4">
                        Define each member to optimize ride eligibility and refined placement.
                    </Text>
                </View>

                {guests.map((guest, index) => (
                    <View key={guest.id} className="bg-white rounded-[40px] p-8 shadow-2xl border border-plaid-gold/20 mb-8">
                        <View className="flex-row items-center justify-between mb-6">
                            <View className="flex-row items-center">
                                <View className="bg-plaid-navy p-3 rounded-2xl border border-plaid-gold/30">
                                    <User size={20} color="#D4AF37" />
                                </View>
                                <Text className="font-header text-plaid-navy text-xl ml-4">
                                    {guest.name || `Adventurer ${index + 1}`}
                                </Text>
                            </View>
                            {guest.isFirstTimer && (
                                <View className="bg-plaid-gold/20 px-3 py-1 rounded-full border border-plaid-gold/40">
                                    <Text className="text-plaid-gold font-header text-[8px] uppercase tracking-[1px]">1ST TIMER</Text>
                                </View>
                            )}
                        </View>

                        <View className="mb-6">
                            <Text className="text-plaid-gold font-header text-xs uppercase tracking-[3px] mb-2">Member Identity</Text>
                            <TextInput
                                value={guest.name}
                                onChangeText={(v) => updateGuest(guest.id, 'name', v)}
                                placeholder="Full Name"
                                placeholderTextColor="#12232E44"
                                className="bg-plaid-alabaster/30 border border-plaid-navy/10 p-5 rounded-2xl text-lg font-header text-plaid-navy"
                            />
                        </View>

                        <View className="flex-row gap-4 mb-6">
                            <View className="flex-1">
                                <Text className="text-plaid-gold font-header text-xs uppercase tracking-[3px] mb-2">Age</Text>
                                <TextInput
                                    value={guest.age}
                                    onChangeText={(v) => updateGuest(guest.id, 'age', v)}
                                    placeholder="Age"
                                    keyboardType="numeric"
                                    placeholderTextColor="#12232E44"
                                    className="bg-plaid-alabaster/30 border border-plaid-navy/10 p-5 rounded-2xl text-lg font-header text-plaid-navy"
                                />
                            </View>
                            <View className="flex-1">
                                <View className="flex-row items-center mb-2">
                                    <Ruler size={10} color="#D4AF37" className="mr-1" />
                                    <Text className="text-plaid-gold font-header text-xs uppercase tracking-[3px]">Height (in)</Text>
                                </View>
                                <TextInput
                                    value={guest.height}
                                    onChangeText={(v) => updateGuest(guest.id, 'height', v)}
                                    placeholder="Inches"
                                    keyboardType="numeric"
                                    placeholderTextColor="#12232E44"
                                    className="bg-plaid-alabaster/30 border border-plaid-navy/10 p-5 rounded-2xl text-lg font-header text-plaid-navy"
                                />
                            </View>
                        </View>

                        <View className="mb-8">
                            <Text className="text-plaid-gold font-header text-xs uppercase tracking-[3px] mb-3">Relationship to Lead</Text>
                            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row gap-2">
                                {RELATIONSHIPS.map(rel => (
                                    <TouchableOpacity
                                        key={rel}
                                        onPress={() => updateGuest(guest.id, 'relationship', rel)}
                                        className={`px-5 py-3 rounded-2xl border ${guest.relationship === rel ? 'bg-plaid-navy border-plaid-gold' : 'bg-transparent border-plaid-navy/10'} mr-2`}
                                    >
                                        <Text className={`font-header text-[10px] uppercase tracking-[1px] ${guest.relationship === rel ? 'text-white' : 'text-plaid-navy/40'}`}>{rel}</Text>
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>
                        </View>

                        <TouchableOpacity
                            onPress={() => updateGuest(guest.id, 'isFirstTimer', !guest.isFirstTimer)}
                            className={`flex-row items-center p-5 rounded-2xl border-2 mb-2 ${guest.isFirstTimer ? 'bg-plaid-gold/10 border-plaid-gold' : 'border-dashed border-plaid-navy/10'}`}
                        >
                            <Sparkles size={18} color="#D4AF37" className="mr-3" />
                            <View className="flex-1">
                                <Text className="text-plaid-navy font-header text-sm">Is this a First Adventure?</Text>
                                <Text className="text-plaid-navy/40 font-body text-[10px]">Strategic pacing will be adjusted for discovery.</Text>
                            </View>
                            <View className={`w-5 h-5 rounded-full border-2 items-center justify-center ${guest.isFirstTimer ? 'bg-plaid-navy border-plaid-navy' : 'border-plaid-navy/10'}`}>
                                {guest.isFirstTimer && <View className="w-2 h-2 bg-plaid-gold rounded-full" />}
                            </View>
                        </TouchableOpacity>
                    </View>
                ))}

                <TouchableOpacity
                    onPress={addGuest}
                    className="flex-row items-center justify-center p-6 border-2 border-dashed border-plaid-navy/20 rounded-[30px] mb-12 bg-white/50"
                >
                    <Users size={20} color="#12232E" opacity={0.3} className="mr-3" />
                    <Text className="font-header text-plaid-navy/40 text-lg uppercase tracking-[2px]">Add Team Member</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => onComplete(guests)}
                    className="bg-plaid-gold p-6 rounded-3xl items-center shadow-xl border-b-4 border-plaid-gold/50 mb-16"
                    style={{
                        shadowColor: '#D4AF37',
                        shadowOffset: { width: 0, height: 10 },
                        shadowOpacity: 0.3,
                        shadowRadius: 15,
                    }}
                >
                    <Text className="text-plaid-navy font-header text-xl uppercase tracking-[2px]">Enter Strategic Intent</Text>
                </TouchableOpacity>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

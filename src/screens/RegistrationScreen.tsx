import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { THEME } from '../utils/DesignSystem';
import { PenTool, ShieldCheck, Sparkles } from 'lucide-react-native';

interface RegistrationScreenProps {
    onComplete: (data: { adventureName: string; signature: string }) => void;
}

export default function RegistrationScreen({ onComplete }: RegistrationScreenProps) {
    const [adventureName, setAdventureName] = useState('');
    const [signature, setSignature] = useState('');

    const handleBegin = () => {
        if (adventureName && signature) {
            onComplete({ adventureName, signature });
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            className="flex-1 bg-plaid-alabaster"
        >
            <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="p-8">
                <View className="items-center mt-12 mb-12">
                    <View className="bg-plaid-navy p-6 rounded-full shadow-xl mb-4">
                        <ShieldCheck size={48} color="#D4AF37" strokeWidth={1.2} />
                    </View>
                    <Text className="font-header text-plaid-navy text-4xl text-center">Your Magical Journey</Text>
                    <Text className="font-body text-plaid-navy/60 text-lg text-center mt-2 px-6">
                        Every great adventure begins with a name and a vision.
                    </Text>
                </View>

                <View className="bg-white rounded-[30px] p-8 shadow-2xl border border-plaid-gold/20 mb-8">
                    <View className="mb-8">
                        <Text className="text-plaid-gold font-header text-xs uppercase tracking-[3px] mb-3">Adventure Name</Text>
                        <TextInput
                            value={adventureName}
                            onChangeText={setAdventureName}
                            placeholder="e.g. The Smith Enchangement"
                            placeholderTextColor="#12232E44"
                            className="bg-plaid-alabaster/50 border border-plaid-navy/10 p-5 rounded-2xl text-xl font-header text-plaid-navy"
                        />
                    </View>

                    <View className="mb-4">
                        <View className="flex-row items-center mb-3">
                            <PenTool size={16} color="#D4AF37" className="mr-2" />
                            <Text className="text-plaid-gold font-header text-xs uppercase tracking-[3px]">Guardian Signature</Text>
                        </View>
                        <Sparkles size={32} color="#D4AF37" className="mb-4" />
                        <Text className="text-plaid-cream font-header text-3xl uppercase tracking-widest text-center">
                            Personalize Your Adventure
                        </Text>
                        <TextInput
                            value={signature}
                            onChangeText={setSignature}
                            placeholder="Type your full name"
                            placeholderTextColor="#12232E44"
                            style={{ fontStyle: 'italic' }}
                            className="bg-plaid-alabaster/50 border border-plaid-navy/10 p-5 rounded-2xl text-2xl font-body text-plaid-navy"
                        />
                        <Text className="text-plaid-navy/40 text-xs mt-3 italic">
                            By signing, you invite the magic to begin and agree to guide your group through this adventure.
                        </Text>
                    </View>
                </View>

                <View className="flex-1" />

                <TouchableOpacity
                    onPress={handleBegin}
                    disabled={!adventureName || !signature}
                    className={`p-6 rounded-2xl items-center shadow-lg border-b-4 ${(!adventureName || !signature) ? 'bg-plaid-navy/20 border-plaid-navy/10' : 'bg-plaid-navy border-plaid-gold'}`}
                >
                    <Text className="text-white font-header text-xl uppercase tracking-[2px]">Begin the Adventure</Text>
                </TouchableOpacity>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

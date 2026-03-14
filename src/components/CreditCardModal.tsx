import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, TextInput, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { X, CreditCard, ShieldCheck, Lock } from 'lucide-react-native';

interface CreditCardModalProps {
    isVisible: boolean;
    onClose: () => void;
    onSave: (card: string) => void;
}

export default function CreditCardModal({ isVisible, onClose, onSave }: CreditCardModalProps) {
    const [cardNumber, setCardNumber] = useState('');
    const [expiry, setExpiry] = useState('');
    const [cvv, setCvv] = useState('');
    const [nameOnCard, setNameOnCard] = useState('');

    const handleSave = () => {
        // In a real app, we'd validate and tokenize here
        const lastFour = cardNumber.slice(-4) || '4242';
        onSave(`Visa ending in ${lastFour}`);
        onClose();
    };

    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={isVisible}
            onRequestClose={onClose}
        >
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                className="flex-1 justify-center bg-plaid-navy/80 p-6"
            >
                <View className="bg-white rounded-[40px] p-8 shadow-2xl">
                    <View className="flex-row justify-between items-center mb-8">
                        <View className="flex-row items-center">
                            <CreditCard size={24} color="#D4AF37" className="mr-3" />
                            <Text className="text-plaid-navy font-header text-xl uppercase tracking-[2px]">Vault Secure Entry</Text>
                        </View>
                        <TouchableOpacity onPress={onClose} className="w-10 h-10 bg-plaid-navy/5 rounded-full items-center justify-center">
                            <X size={20} color="#12232E" />
                        </TouchableOpacity>
                    </View>

                    <ScrollView showsVerticalScrollIndicator={false}>
                        <View className="mb-6">
                            <Text className="text-plaid-gold font-header text-[9px] uppercase tracking-[2px] mb-3">Cardholder Name</Text>
                            <TextInput
                                value={nameOnCard}
                                onChangeText={setNameOnCard}
                                placeholder="AS WRITTEN ON ARTIFACT"
                                placeholderTextColor="#12232E33"
                                className="bg-plaid-navy/5 px-6 py-4 rounded-2xl font-header text-sm text-plaid-navy border border-plaid-navy/5"
                            />
                        </View>

                        <View className="mb-6">
                            <Text className="text-plaid-gold font-header text-[9px] uppercase tracking-[2px] mb-3">Card Number</Text>
                            <View className="bg-plaid-navy/5 flex-row items-center px-6 py-4 rounded-2xl border border-plaid-navy/5">
                                <Lock size={16} color="#12232E44" className="mr-3" />
                                <TextInput
                                    value={cardNumber}
                                    onChangeText={setCardNumber}
                                    placeholder="XXXX XXXX XXXX XXXX"
                                    placeholderTextColor="#12232E33"
                                    keyboardType="numeric"
                                    maxLength={19}
                                    className="flex-1 font-header text-sm text-plaid-navy"
                                />
                            </View>
                        </View>

                        <View className="flex-row gap-4 mb-8">
                            <View className="flex-1">
                                <Text className="text-plaid-gold font-header text-[9px] uppercase tracking-[2px] mb-3">Expiry</Text>
                                <TextInput
                                    value={expiry}
                                    onChangeText={setExpiry}
                                    placeholder="MM/YY"
                                    placeholderTextColor="#12232E33"
                                    keyboardType="numeric"
                                    maxLength={5}
                                    className="bg-plaid-navy/5 px-6 py-4 rounded-2xl font-header text-sm text-plaid-navy border border-plaid-navy/5"
                                />
                            </View>
                            <View className="flex-1">
                                <Text className="text-plaid-gold font-header text-[9px] uppercase tracking-[2px] mb-3">CVV</Text>
                                <TextInput
                                    value={cvv}
                                    onChangeText={setCvv}
                                    placeholder="XXX"
                                    placeholderTextColor="#12232E33"
                                    keyboardType="numeric"
                                    maxLength={4}
                                    secureTextEntry
                                    className="bg-plaid-navy/5 px-6 py-4 rounded-2xl font-header text-sm text-plaid-navy border border-plaid-navy/5"
                                />
                            </View>
                        </View>

                        <View className="bg-plaid-navy p-6 rounded-[30px] border border-plaid-gold/20 mb-8 flex-row items-center">
                            <ShieldCheck size={24} color="#D4AF37" className="mr-4" />
                            <View className="flex-1">
                                <Text className="text-plaid-gold font-header text-[8px] uppercase tracking-[2px] mb-1">Aegis Vault Protection</Text>
                                <Text className="text-white/60 font-body text-[9px] leading-relaxed">
                                    Your payment artifacts are encrypted and stored locally. Castle Companion only uses this data for secure dining reservation handshakes.
                                </Text>
                            </View>
                        </View>

                        <TouchableOpacity
                            onPress={handleSave}
                            className="bg-plaid-gold py-5 rounded-[20px] items-center justify-center shadow-lg"
                        >
                            <Text className="text-plaid-navy font-header text-xs uppercase tracking-[2px]">Secure Artifact</Text>
                        </TouchableOpacity>
                    </ScrollView>
                </View>
            </KeyboardAvoidingView>
        </Modal>
    );
}

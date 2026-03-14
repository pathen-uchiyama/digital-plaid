import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert, Vibration } from 'react-native';
import { Shield, ChevronLeft, Fingerprint, Delete } from 'lucide-react-native';
import { AdminOpsManager } from '../utils/AdminOpsManager';
import { SecurityEngine } from '../utils/SecurityEngine';
import { THEME } from '../utils/DesignSystem';

interface AdminLoginScreenProps {
    onBack: () => void;
    onSuccess: () => void;
}

export default function AdminLoginScreen({ onBack, onSuccess }: AdminLoginScreenProps) {
    const [pin, setPin] = useState('');
    const MAX_PIN_LENGTH = 6;

    const handlePressNumber = (num: string) => {
        if (pin.length < MAX_PIN_LENGTH) {
            const newPin = pin + num;
            setPin(newPin);

            if (newPin.length === MAX_PIN_LENGTH) {
                if (AdminOpsManager.verifyAdminPin(newPin)) {
                    onSuccess();
                } else {
                    Vibration.vibrate(500);
                    Alert.alert('Access Denied', 'Invalid Administrative PIN.');
                    setPin('');
                }
            }
        }
    };

    const handleDelete = () => {
        setPin(pin.slice(0, -1));
    };

    const handleBiometric = async () => {
        const success = await SecurityEngine.authenticateBiometric();
        if (success) {
            onSuccess();
        }
    };

    const renderPinDot = (index: number) => {
        const isActive = pin.length > index;
        return (
            <View
                key={index}
                className={`w-3 h-3 rounded-full mx-2 border ${isActive ? 'bg-plaid-gold border-plaid-gold shadow-lg' : 'border-plaid-navy/20'}`}
            />
        );
    };

    const renderKey = (val: string, icon?: any) => (
        <TouchableOpacity
            onPress={() => val === 'delete' ? handleDelete() : val === 'bio' ? handleBiometric() : handlePressNumber(val)}
            className="w-20 h-20 items-center justify-center rounded-full bg-white/50 border border-plaid-navy/5 shadow-sm m-3"
            activeOpacity={0.6}
        >
            {icon ? (
                React.createElement(icon, { size: 24, color: "#12232E" })
            ) : (
                <Text className="text-plaid-navy font-header text-2xl">{val}</Text>
            )}
        </TouchableOpacity>
    );

    return (
        <View className="flex-1 bg-plaid-alabaster px-8 pt-16">
            <TouchableOpacity onPress={onBack} className="flex-row items-center mb-12">
                <ChevronLeft size={20} color="#12232E44" />
                <Text className="text-plaid-navy/40 font-header text-xs uppercase tracking-widest ml-2">Back</Text>
            </TouchableOpacity>

            <View className="items-center mb-16">
                <View className="w-16 h-16 bg-plaid-navy rounded-[20px] items-center justify-center mb-6 shadow-2xl">
                    <Shield size={32} color="#D4AF37" />
                </View>
                <Text className="text-plaid-navy font-header text-2xl tracking-tight">Administrative Vault</Text>
                <Text className="text-plaid-navy/40 font-body text-xs mt-2 uppercase tracking-widest">Aegis Protocol Active</Text>
            </View>

            <View className="flex-row justify-center mb-20">
                {[...Array(MAX_PIN_LENGTH)].map((_, i) => renderPinDot(i))}
            </View>

            <View className="items-center">
                <View className="flex-row flex-wrap justify-center max-w-[300px]">
                    {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map(n => renderKey(n))}
                    {renderKey('bio', Fingerprint)}
                    {renderKey('0')}
                    {renderKey('delete', Delete)}
                </View>
            </View>

            <View className="absolute bottom-16 left-0 right-0 items-center">
                <Text className="text-plaid-navy/20 font-body text-[8px] uppercase tracking-[4px]">Castle Companion Operational Authority</Text>
            </View>
        </View>
    );
}

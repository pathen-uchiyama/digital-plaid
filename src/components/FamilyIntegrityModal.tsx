import React from 'react';
import { View, Text, TouchableOpacity, Modal } from 'react-native';
import { THEME } from '../utils/DesignSystem';
import { AlertTriangle, Users, Check, X } from 'lucide-react-native';

interface FamilyIntegrityModalProps {
    visible: boolean;
    onClose: () => void;
    onHold: () => void;
    onConfirmSplit: () => void;
    rideName: string;
    totalGuests: number;
    slotsFound: number;
    reason?: string;
}

export default function FamilyIntegrityModal({
    visible,
    onClose,
    onHold,
    onConfirmSplit,
    rideName,
    totalGuests,
    slotsFound,
    reason
}: FamilyIntegrityModalProps) {
    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <View className="flex-1 justify-center items-center bg-black/80 px-6">
                <View className="bg-plaid-alabaster w-full rounded-[40px] p-8 border border-plaid-gold/40 shadow-2xl">
                    <View className="items-center mb-6">
                        <View className="bg-plaid-rose/10 p-4 rounded-full border border-plaid-rose/30 mb-4">
                            <AlertTriangle size={36} color="#B33951" />
                        </View>
                        <Text className="text-plaid-navy font-header text-[10px] uppercase tracking-[4px] mb-2 font-bold">Party Integrity Alert</Text>
                        <Text className="text-plaid-navy font-header text-2xl text-center leading-tight">Partial Slots Found for {rideName}</Text>
                    </View>

                    <View className="bg-white/50 p-6 rounded-3xl border border-plaid-navy/5 mb-8 flex-row items-center justify-center">
                        <Users size={24} color="#12232E" className="mr-4" />
                        <Text className="text-plaid-navy font-body text-lg">
                            <Text className="font-header text-plaid-rose">{slotsFound}</Text> / <Text className="font-header">{totalGuests}</Text> Slots Available
                        </Text>
                    </View>

                    <Text className="text-plaid-navy/60 font-body text-sm text-center mb-10 leading-6">
                        In accordance with the <Text className="text-plaid-navy font-bold italic">Sovereign Family Protocol</Text>, Castle Companion has paused the booking to prevent a split-party experience. How would you like to proceed?
                    </Text>

                    <View className="gap-y-4">
                        <TouchableOpacity
                            onPress={onHold}
                            className="bg-plaid-navy py-6 rounded-2xl flex-row justify-center items-center border border-plaid-gold/30"
                        >
                            <Check size={18} color="#D4AF37" className="mr-3" />
                            <Text className="text-white font-header text-xs uppercase tracking-[2px]">Hold & Alert Crew</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={onConfirmSplit}
                            className="bg-white py-6 rounded-2xl flex-row justify-center items-center border border-plaid-rose/30"
                        >
                            <AlertTriangle size={18} color="#B33951" className="mr-3" />
                            <Text className="text-plaid-rose font-header text-xs uppercase tracking-[2px]">Proceed with Partial</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={onClose}
                            className="py-4 items-center"
                        >
                            <Text className="text-plaid-navy/40 font-header text-[10px] uppercase tracking-[1px]">Decline Entire Hunt</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
}

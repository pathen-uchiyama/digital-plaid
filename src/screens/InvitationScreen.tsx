import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Share } from 'react-native';
import { THEME } from '../utils/DesignSystem';
import { QrCode, Share2, Users, CheckCircle2 } from 'lucide-react-native';

interface InvitationScreenProps {
    adventureName: string;
    onComplete: () => void;
}

export default function InvitationScreen({ adventureName, onComplete }: InvitationScreenProps) {
    const inviteLink = `https://digitalplaid.app/join/${adventureName.replace(/\s+/g, '-').toLowerCase()}`;

    const handleShare = async () => {
        try {
            await Share.share({
                message: `Join our Castle Companion adventure: ${adventureName}! Click here to sync your itinerary: ${inviteLink}`,
            });
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <ScrollView className="flex-1 bg-plaid-alabaster p-8">
            <View className="mt-12 mb-12 items-center">
                <View className="bg-plaid-gold/10 p-6 rounded-full border border-plaid-gold/30 mb-6">
                    <Users size={48} color="#12232E" strokeWidth={1.2} />
                </View>
                <Text className="font-header text-plaid-navy text-3xl text-center">Share the Magic</Text>
                <Text className="font-body text-plaid-navy/60 text-lg text-center mt-2 px-4">
                    Invite family and friends to join **{adventureName}**. Everyone will sync to your Magical Horizon.
                </Text>
            </View>

            <View className="bg-white rounded-[30px] p-10 shadow-2xl border border-plaid-gold/20 items-center mb-8">
                <View className="bg-plaid-alabaster p-8 rounded-3xl border border-plaid-navy/5 mb-8">
                    {/* Mock QR Code */}
                    <QrCode size={180} color="#12232E" strokeWidth={1} />
                </View>

                <Text className="text-plaid-gold font-header text-xs uppercase tracking-[3px] mb-4">Adventure Access Code</Text>

                <TouchableOpacity
                    onPress={handleShare}
                    className="flex-row items-center bg-plaid-navy px-8 py-4 rounded-2xl shadow-lg border-b-4 border-plaid-gold"
                >
                    <Share2 size={20} color="white" className="mr-3" />
                    <Text className="text-white font-header text-lg uppercase tracking-[1px]">Share Invite Link</Text>
                </TouchableOpacity>
            </View>

            <View className="bg-plaid-gold/5 border border-plaid-gold/20 rounded-2xl p-6 mb-12">
                <View className="flex-row items-center mb-3">
                    <CheckCircle2 size={16} color="#006A71" />
                    <Text className="text-plaid-teal font-header text-xs uppercase tracking-[2px] ml-2">Verified</Text>
                </View>
                <Text className="font-body text-plaid-navy/70 text-sm">
                    Once they join, you'll see their status in the **Lead Adventurer** panel. You can then segment groups for different adventure paths.
                </Text>
            </View>

            <TouchableOpacity
                onPress={onComplete}
                className="bg-transparent border-2 border-plaid-navy/20 p-6 rounded-2xl items-center mb-16"
            >
                <Text className="text-plaid-navy font-header text-xl uppercase tracking-[2px]">Enter Dashboard</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}

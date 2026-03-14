import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Modal, Animated } from 'react-native';
import { THEME } from '../utils/DesignSystem';
import { Users, CheckCircle2, XCircle, Sparkles, Zap } from 'lucide-react-native';

interface FamilyVoteModalProps {
    visible: boolean;
    onClose: () => void;
    optionA: { name: string; icon: any; type: string };
    optionB: { name: string; icon: any; type: string };
    onSelect: (option: string) => void;
}

export default function FamilyVoteModal({ visible, onClose, optionA, optionB, onSelect }: FamilyVoteModalProps) {
    const [votes, setVotes] = useState({ a: 0, b: 0, total: 4 });
    const [userVote, setUserVote] = useState<string | null>(null);

    // Simulate incoming votes for demo purposes
    useEffect(() => {
        if (visible) {
            const timer = setTimeout(() => {
                setVotes({ a: 1, b: 2, total: 4 });
            }, 1500);
            return () => clearTimeout(timer);
        } else {
            setVotes({ a: 0, b: 0, total: 4 });
            setUserVote(null);
        }
    }, [visible]);

    const handleVote = (option: string) => {
        setUserVote(option);
        if (option === 'a') setVotes(v => ({ ...v, a: v.a + 1 }));
        if (option === 'b') setVotes(v => ({ ...v, b: v.b + 1 }));

        // Final selection after a brief delay
        setTimeout(() => {
            onSelect(option);
        }, 1000);
    };

    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <View className="flex-1 justify-center items-center bg-plaid-navy/60 p-6">
                <View className="bg-plaid-alabaster w-full rounded-[40px] p-8 shadow-2xl border border-plaid-gold/30">
                    <View className="items-center mb-8">
                        <View className="bg-plaid-gold/20 p-4 rounded-full mb-4">
                            <Users size={32} color="#D4AF37" strokeWidth={1.5} />
                        </View>
                        <Text className="font-header text-2xl text-plaid-navy text-center">Group Consensus Needed</Text>
                        <Text className="font-body text-plaid-navy/60 text-center mt-2">
                            The Lead Adventurer is requesting a concierge pivot.
                        </Text>
                    </View>

                    <View className="flex-row gap-4 mb-8">
                        {/* Option A */}
                        <TouchableOpacity
                            onPress={() => handleVote('a')}
                            disabled={!!userVote}
                            className={`flex-1 p-6 rounded-3xl border-2 items-center transition-all ${userVote === 'a' ? 'bg-plaid-navy border-plaid-gold shadow-lg' : 'bg-white border-plaid-gold/10'}`}
                        >
                            <View className={`p-3 rounded-xl mb-3 ${userVote === 'a' ? 'bg-plaid-gold/20' : 'bg-plaid-amber/5'}`}>
                                <optionA.icon size={24} color={userVote === 'a' ? '#FFF' : '#D4AF37'} />
                            </View>
                            <Text className={`font-header text-sm text-center mb-4 ${userVote === 'a' ? 'text-white' : 'text-plaid-navy'}`}>{optionA.name}</Text>

                            {/* Vote Indicator */}
                            <View className="flex-row gap-1">
                                {Array.from({ length: votes.a }).map((_, i) => (
                                    <View key={i} className="w-2 h-2 rounded-full bg-plaid-gold" />
                                ))}
                            </View>
                        </TouchableOpacity>

                        {/* Option B */}
                        <TouchableOpacity
                            onPress={() => handleVote('b')}
                            disabled={!!userVote}
                            className={`flex-1 p-6 rounded-3xl border-2 items-center transition-all ${userVote === 'b' ? 'bg-plaid-navy border-plaid-gold shadow-lg' : 'bg-white border-plaid-gold/10'}`}
                        >
                            <View className={`p-3 rounded-xl mb-3 ${userVote === 'b' ? 'bg-plaid-gold/20' : 'bg-plaid-amber/5'}`}>
                                <optionB.icon size={24} color={userVote === 'b' ? '#FFF' : '#D4AF37'} />
                            </View>
                            <Text className={`font-header text-sm text-center mb-4 ${userVote === 'b' ? 'text-white' : 'text-plaid-navy'}`}>{optionB.name}</Text>

                            {/* Vote Indicator */}
                            <View className="flex-row gap-1">
                                {Array.from({ length: votes.b }).map((_, i) => (
                                    <View key={i} className="w-2 h-2 rounded-full bg-plaid-gold" />
                                ))}
                            </View>
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity
                        onPress={onClose}
                        className="py-4 items-center"
                    >
                        <Text className="text-plaid-navy/40 font-header text-xs uppercase tracking-widest">Maintain Current Path</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
}

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, Modal, LayoutAnimation } from 'react-native';
import { THEME } from '../utils/DesignSystem';
import { Star, X, AlertCircle, CheckCircle } from 'lucide-react-native';

interface RideReviewModalProps {
    visible: boolean;
    rideName: string;
    onClose: () => void;
    onSubmit: (rating: number, feedback: string) => void;
}

const NEGATIVE_REASONS = [
    'Too Loud',
    'Too Scary',
    'Motion Sickness',
    'Long Wait',
    'Mechanical Issue',
    'Sensory Overload'
];

export default function RideReviewModal({ visible, rideName, onClose, onSubmit }: RideReviewModalProps) {
    const [rating, setRating] = useState(0);
    const [feedback, setFeedback] = useState('');
    const [selectedReasons, setSelectedReasons] = useState<string[]>([]);

    const toggleReason = (reason: string) => {
        setSelectedReasons(prev =>
            prev.includes(reason) ? prev.filter(r => r !== reason) : [...prev, reason]
        );
    };

    const handleSubmit = () => {
        const fullFeedback = rating <= 3 ? [...selectedReasons, feedback].filter(Boolean).join('. ') : feedback;
        onSubmit(rating, fullFeedback);
        setRating(0);
        setFeedback('');
        setSelectedReasons([]);
    };

    return (
        <Modal visible={visible} transparent animationType="fade">
            <View className="flex-1 bg-plaid-navy/80 items-center justify-center p-6">
                <View className="bg-white w-full rounded-[45px] p-8 shadow-2xl border-4 border-plaid-gold/20">
                    <TouchableOpacity onPress={onClose} className="absolute right-6 top-6">
                        <X size={24} color="#12232E44" />
                    </TouchableOpacity>

                    <View className="items-center mt-4">
                        <View className="bg-plaid-gold/10 p-4 rounded-3xl mb-4">
                            <Star size={32} color="#D4AF37" fill={rating > 0 ? "#D4AF37" : "transparent"} />
                        </View>
                        <Text className="text-plaid-navy font-header text-2xl text-center">Debrief: {rideName}</Text>
                        <Text className="text-plaid-navy/40 font-body text-sm text-center mt-2">How was the experience for your group?</Text>
                    </View>

                    {/* Star Rating */}
                    <View className="flex-row justify-center gap-4 my-8">
                        {[1, 2, 3, 4, 5].map((s) => (
                            <TouchableOpacity key={s} onPress={() => {
                                LayoutAnimation.spring();
                                setRating(s);
                            }}>
                                <Star
                                    size={36}
                                    color={rating >= s ? "#D4AF37" : "#12232E11"}
                                    fill={rating >= s ? "#D4AF37" : "transparent"}
                                />
                            </TouchableOpacity>
                        ))}
                    </View>

                    {/* Low Rating Context */}
                    {rating > 0 && rating <= 3 && (
                        <View className="mb-6">
                            <Text className="text-plaid-gold font-header text-[9px] uppercase tracking-widest mb-4">Refined Discrepancy (Why?)</Text>
                            <View className="flex-row flex-wrap gap-2">
                                {NEGATIVE_REASONS.map(reason => (
                                    <TouchableOpacity
                                        key={reason}
                                        onPress={() => toggleReason(reason)}
                                        className={`px-4 py-2 rounded-xl border ${selectedReasons.includes(reason) ? 'bg-plaid-rose border-plaid-rose' : 'bg-transparent border-plaid-navy/10'}`}
                                    >
                                        <Text className={`font-header text-[8px] uppercase tracking-[1px] ${selectedReasons.includes(reason) ? 'text-white' : 'text-plaid-navy/40'}`}>{reason}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>
                    )}

                    <TextInput
                        placeholder="Additional boutique notes..."
                        multiline
                        numberOfLines={3}
                        value={feedback}
                        onChangeText={setFeedback}
                        className="bg-plaid-alabaster/50 border border-plaid-navy/10 p-5 rounded-2xl font-body text-sm text-plaid-navy mb-8"
                    />

                    <TouchableOpacity
                        onPress={handleSubmit}
                        disabled={rating === 0}
                        className={`p-6 rounded-3xl items-center shadow-lg border-b-4 ${rating === 0 ? 'bg-plaid-navy/10 border-transparent opacity-50' : 'bg-plaid-navy border-plaid-gold'}`}
                    >
                        <Text className="text-white font-header text-lg uppercase tracking-[2px]">Log debrief</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
}

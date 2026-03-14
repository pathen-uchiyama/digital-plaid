import React from 'react';
import { View, Text, Modal, TouchableOpacity, ScrollView } from 'react-native';
import { Info, X, Shield, Battery, Zap, AlertTriangle } from 'lucide-react-native';

interface InsightData {
    title: string;
    description: string;
    pro: string;
    con: string;
    security?: string;
    isLegalRequirement?: boolean;
}

interface StrategicInsightModalProps {
    isVisible: boolean;
    onClose: () => void;
    data: InsightData | null;
}

const StrategicInsightModal: React.FC<StrategicInsightModalProps> = ({ isVisible, onClose, data }) => {
    if (!data) return null;

    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={isVisible}
            onRequestClose={onClose}
        >
            <View className="flex-1 justify-center items-center bg-plaid-navy/80 px-6">
                <View className="bg-white rounded-[40px] w-full max-h-[80%] overflow-hidden shadow-2xl border border-plaid-gold/20">
                    <View className="bg-plaid-navy p-6 flex-row justify-between items-center">
                        <View className="flex-row items-center">
                            <Info size={18} color="#D4AF37" className="mr-3" />
                            <Text className="text-plaid-gold font-header text-sm uppercase tracking-[2px]">Helpful Tip</Text>
                        </View>
                        <TouchableOpacity onPress={onClose} className="bg-white/10 p-2 rounded-full">
                            <X size={16} color="white" />
                        </TouchableOpacity>
                    </View>

                    <ScrollView className="p-8">
                        <Text className="text-plaid-navy font-header text-xl mb-4">{data.title}</Text>
                        <Text className="text-plaid-navy/60 font-body text-sm leading-relaxed mb-8">
                            {data.description}
                        </Text>

                        <View className="flex-row mb-6">
                            <View className="w-1 bg-plaid-teal rounded-full mr-4" />
                            <View className="flex-1">
                                <Text className="text-plaid-teal font-header text-[10px] uppercase tracking-[1px] mb-1">Advantage</Text>
                                <Text className="text-plaid-navy/80 font-body text-xs italic">{data.pro}</Text>
                            </View>
                        </View>

                        <View className="flex-row mb-6">
                            <View className="w-1 bg-plaid-rose rounded-full mr-4" />
                            <View className="flex-1">
                                <Text className="text-plaid-rose font-header text-[10px] uppercase tracking-[1px] mb-1">Trade-off</Text>
                                <Text className="text-plaid-navy/80 font-body text-xs italic">{data.con}</Text>
                            </View>
                        </View>

                        {data.security && (
                            <View className="bg-plaid-navy/5 p-4 rounded-2xl border border-plaid-gold/10 mt-2">
                                <View className="flex-row items-center mb-2">
                                    <Shield size={14} color="#12232E" className="mr-2" />
                                    <Text className="text-plaid-navy font-header text-[9px] uppercase tracking-[1px]">Secure Vault Information</Text>
                                </View>
                                <Text className="text-plaid-navy/60 font-body text-[10px] leading-relaxed">
                                    {data.security}
                                </Text>
                            </View>
                        )}

                        <TouchableOpacity
                            onPress={onClose}
                            className={`${data.isLegalRequirement ? 'bg-plaid-navy' : 'bg-plaid-navy/10'} py-4 rounded-2xl items-center mt-8 mb-4 border border-plaid-gold/20`}
                        >
                            <Text className={`${data.isLegalRequirement ? 'text-white' : 'text-plaid-navy'} font-header text-[10px] uppercase tracking-[2px]`}>
                                {data.isLegalRequirement ? 'Acknowledge Insight' : 'Close'}
                            </Text>
                        </TouchableOpacity>
                    </ScrollView>
                </View>
            </View>
        </Modal>
    );
};

export default StrategicInsightModal;

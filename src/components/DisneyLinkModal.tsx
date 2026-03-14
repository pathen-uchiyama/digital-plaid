import React from 'react';
import { View, Text, TouchableOpacity, Modal, ScrollView, Alert } from 'react-native';
import { X, ExternalLink, Package, ShieldCheck } from 'lucide-react-native';

interface DisneyLinkModalProps {
    isVisible: boolean;
    onClose: () => void;
}

export default function DisneyLinkModal({ isVisible, onClose }: DisneyLinkModalProps) {
    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={isVisible}
            onRequestClose={onClose}
        >
            <View className="flex-1 justify-end bg-plaid-navy/60">
                <View className="bg-plaid-alabaster rounded-t-[50px] p-8 shadow-2xl h-[70%]">
                    <View className="flex-row justify-between items-center mb-10">
                        <View className="flex-row items-center">
                            <Package size={24} color="#D4AF37" className="mr-3" />
                            <Text className="text-plaid-navy font-header text-xl uppercase tracking-[2px]">MDE Linking Protocol</Text>
                        </View>
                        <TouchableOpacity onPress={onClose} className="w-10 h-10 bg-white shadow-sm rounded-full items-center justify-center border border-plaid-navy/5">
                            <X size={20} color="#12232E" />
                        </TouchableOpacity>
                    </View>

                    <ScrollView showsVerticalScrollIndicator={false}>
                        <View className="bg-white p-6 rounded-[30px] border border-plaid-gold/10 mb-8">
                            <Text className="text-plaid-navy font-body text-sm leading-relaxed">
                                To synchronize your Castle Companion strategy with actual park reservations, you must link your Disney Account via the official My Disney Experience (MDE) utility.
                            </Text>
                        </View>

                        <Text className="text-plaid-gold font-header text-[10px] uppercase tracking-[3px] mb-6">Linking Procedure</Text>

                        {[
                            { step: 1, title: 'Open MDE', desc: 'Launch the My Disney Experience app on your mobile device.' },
                            { step: 2, title: 'Navigate to Profile', desc: 'Tap the menu icon (☰) and select "My Profile".' },
                            { step: 3, title: 'Account Settings', desc: 'Select "Account Settings" to reveal your Disney ID and linked services.' },
                            { step: 4, title: 'Castle Companion Authorization', desc: 'Ensure your Disney ID matches the email used in this portfolio for automatic sync.' }
                        ].map((item) => (
                            <View key={item.step} className="flex-row mb-8">
                                <View className="w-8 h-8 bg-plaid-navy rounded-full items-center justify-center mr-4 mt-1">
                                    <Text className="text-plaid-gold font-header text-xs">{item.step}</Text>
                                </View>
                                <View className="flex-1">
                                    <Text className="text-plaid-navy font-header text-sm mb-1 uppercase tracking-tight">{item.title}</Text>
                                    <Text className="text-plaid-navy/60 font-body text-xs leading-relaxed">{item.desc}</Text>
                                </View>
                            </View>
                        ))}

                        <View className="bg-plaid-teal/10 p-6 rounded-[30px] border border-plaid-teal/20 mb-10">
                            <View className="flex-row items-center mb-3">
                                <ShieldCheck size={20} color="#0E4D4A" className="mr-2" />
                                <Text className="text-plaid-teal font-header text-[10px] uppercase tracking-[2px]">Aegis Synchronization</Text>
                            </View>
                            <Text className="text-plaid-teal/80 font-body text-[10px] leading-relaxed">
                                Once linked in MDE, Castle Companion will automatically ingest dining reservations and lightning lane windows during your strategic sessions.
                            </Text>
                        </View>

                        <TouchableOpacity
                            onPress={() => Alert.alert("Launch MDE", "Launching external My Disney Experience app component...")}
                            className="bg-plaid-navy py-5 rounded-[20px] items-center justify-center border border-plaid-gold flex-row"
                        >
                            <ExternalLink size={18} color="#D4AF37" className="mr-3" />
                            <Text className="text-white font-header text-xs uppercase tracking-[2px]">Launch Disney MDE</Text>
                        </TouchableOpacity>

                        <View className="h-20" />
                    </ScrollView>
                </View>
            </View>
        </Modal>
    );
}


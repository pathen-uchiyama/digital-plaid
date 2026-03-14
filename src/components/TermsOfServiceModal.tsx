import React from 'react';
import { View, Text, Modal, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { X, ShieldAlert, Scale, ShieldCheck } from 'lucide-react-native';

interface TermsOfServiceModalProps {
    isVisible: boolean;
    onClose: () => void;
}

export default function TermsOfServiceModal({ isVisible, onClose }: TermsOfServiceModalProps) {
    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={isVisible}
            onRequestClose={onClose}
        >
            <View className="flex-1 bg-plaid-navy/60 justify-end">
                <SafeAreaView className="bg-plaid-alabaster h-[90%] rounded-t-[50px] shadow-2xl overflow-hidden border-t-4 border-plaid-gold/30">
                    <View className="p-8 pb-4 flex-row justify-between items-center border-b border-plaid-navy/5">
                        <View className="flex-row items-center">
                            <Scale size={20} color="#12232E" className="mr-3" />
                            <Text className="font-header text-plaid-navy text-2xl">The Covenant</Text>
                        </View>
                        <TouchableOpacity onPress={onClose} className="p-2 bg-plaid-navy/5 rounded-full">
                            <X size={24} color="#12232E" />
                        </TouchableOpacity>
                    </View>

                    <ScrollView className="px-8 pt-6">
                        <View className="bg-plaid-rose/5 border border-plaid-rose/20 p-6 rounded-3xl mb-8">
                            <View className="flex-row items-center mb-3">
                                <ShieldAlert size={18} color="#B33951" className="mr-3" />
                                <Text className="font-header text-plaid-rose text-sm uppercase tracking-widest">High-Risk Operations Alert</Text>
                            </View>
                            <Text className="font-body text-plaid-rose/80 text-xs leading-relaxed">
                                Castle Companion is not affiliated with, endorsed by, or sanctioned by any theme park operator. Use of this service may violate park Terms & Conditions.
                            </Text>
                        </View>

                        <LegalSection
                            title="1. Assumption of Risk"
                            content="The Lead Adventurer acknowledges that Castle Companion operates as an autonomous personal assistant. Any automation performed on your behalf (e.g., Lightning Lane bookings, Virtual Queue entries) is done at the user's explicit request. You accept all responsibility for any resulting account limitations or suspensions imposed by the resort operator."
                        />

                        <LegalSection
                            title="2. Plausible Deniability"
                            content="The service uses 'Sovereign' evasion signatures to protect user privacy and account integrity. However, perfect evasion is not guaranteed. Success rates are based on current algorithmic conditions and may shift without notice."
                        />

                        <LegalSection
                            title="3. Data Ethics"
                            content="Credentials provided for MDX synchronization are encrypted via hardware-backed SecureStore. Castle Companion does not 'sell' your information; location data is used exclusively for Geo-Clustering and spatial optimization."
                        />

                        <LegalSection
                            title="4. Liability Shield"
                            content="In no event shall Castle Companion or its operators be liable for any missed reservations, transport delays, or park-entry issues arising from the use of 'Strategic Advice' or 'Autonomous Churning'."
                        />

                        <View className="bg-plaid-teal/5 border border-plaid-teal/20 p-6 rounded-3xl mb-12">
                            <View className="flex-row items-center mb-3">
                                <ShieldCheck size={18} color="#489B9E" className="mr-3" />
                                <Text className="font-header text-plaid-teal text-sm uppercase tracking-widest">The Sovereign Promise</Text>
                            </View>
                            <Text className="font-body text-plaid-teal/80 text-xs leading-relaxed">
                                By agreeing, you join an elite tier of adventurers committed to strategic park optimization and data sovereignty.
                            </Text>
                        </View>
                    </ScrollView>

                    <View className="p-8 pt-4 bg-white border-t border-plaid-navy/5">
                        <TouchableOpacity
                            onPress={onClose}
                            className="bg-plaid-navy p-6 rounded-3xl items-center"
                        >
                            <Text className="text-white font-header text-lg uppercase tracking-widest">I Acknowledge & Accept</Text>
                        </TouchableOpacity>
                    </View>
                </SafeAreaView>
            </View>
        </Modal>
    );
}

function LegalSection({ title, content }: { title: string, content: string }) {
    return (
        <View className="mb-8">
            <Text className="font-header text-plaid-gold text-xs uppercase tracking-[3px] mb-3">{title}</Text>
            <Text className="font-body text-plaid-navy/60 text-sm leading-relaxed">{content}</Text>
        </View>
    );
}

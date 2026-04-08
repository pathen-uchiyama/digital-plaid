import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Check, Crown, Zap, Shield, Sparkles } from 'lucide-react-native';

export default function PaywallScreen({ onClose, currentTier }: { onClose: () => void, currentTier: string }) {

    const renderFeature = (text: string, isMagic: boolean = false) => (
        <View style={{ flexDirection: 'row', alignItems: 'flex-start', marginBottom: 16 }}>
            <View style={{ marginTop: 2, marginRight: 12 }}>
                {isMagic ?
                    <Sparkles size={16} color="#D4AF37" /> :
                    <Check size={16} color="#12232E66" />
                }
            </View>
            <Text style={{ flex: 1, fontFamily: 'Georgia', fontSize: 13, color: isMagic ? '#D4AF37' : '#12232E', lineHeight: 20 }}>
                {text}
            </Text>
        </View>
    );

    return (
        <View style={{ flex: 1, backgroundColor: '#FAF9F6' }}>
            <View style={{ backgroundColor: '#12232E', paddingTop: 60, paddingBottom: 40, paddingHorizontal: 30, borderBottomLeftRadius: 60, borderBottomRightRadius: 60, shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.3, shadowRadius: 20, elevation: 15, zIndex: 10 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                    <Text style={{ color: '#D4AF37', fontSize: 10, fontWeight: '800', letterSpacing: 4, textTransform: 'uppercase' }}>
                        Elevate Your Mission
                    </Text>
                    <TouchableOpacity onPress={onClose} style={{ backgroundColor: 'rgba(255,255,255,0.1)', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)' }}>
                        <Text style={{ color: '#FFF', fontSize: 8, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 1 }}>Close</Text>
                    </TouchableOpacity>
                </View>

                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                    <Crown size={28} color="#D4AF37" style={{ marginRight: 15 }} />
                    <Text style={{ color: '#FFF', fontSize: 28, fontWeight: '400', fontFamily: 'Georgia' }}>
                        The Active Automation
                    </Text>
                </View>
                <Text style={{ color: '#D4AF37', fontSize: 13, fontFamily: 'Georgia', fontStyle: 'italic', marginBottom: 20, opacity: 0.9 }}>
                    Let the AI watch the park for you. Stop scrolling, start experiencing.
                </Text>
            </View>

            <ScrollView style={{ paddingHorizontal: 30, marginTop: -20, paddingTop: 40 }} showsVerticalScrollIndicator={false}>

                {currentTier === 'voyage' && (
                    <View style={{ backgroundColor: '#FFF', borderRadius: 30, padding: 24, marginBottom: 24, shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.05, shadowRadius: 20, elevation: 5, borderWidth: 1, borderColor: 'rgba(212, 175, 55, 0.2)' }}>
                        <Text style={{ color: '#12232E', fontSize: 18, fontFamily: 'Georgia', marginBottom: 8 }}>The Intelligent Blueprint</Text>
                        <Text style={{ color: '#12232E', fontSize: 24, fontWeight: '800', marginBottom: 4 }}>$29.95 <Text style={{ fontSize: 12, fontWeight: '400', color: '#12232E66' }}>/ Year</Text></Text>
                        <Text style={{ color: '#12232E88', fontSize: 11, marginBottom: 20 }}>The definitive digital heirloom. Unlocks the Ghost Vault, persistent strategic memory, and real-time itinerary recalibration for all your journeys.</Text>

                        {renderFeature('The Ghost Vault (10-bit Editorial Grid)')}
                        {renderFeature('Persistent Strategic Memory')}
                        {renderFeature('Full Strategic Intel & Projections')}
                        {renderFeature('6:45 AM Daily "Sitrep"')}
                        {renderFeature('Unlimited Circle Invitations')}

                        <TouchableOpacity style={{ backgroundColor: '#12232E', paddingVertical: 14, borderRadius: 15, alignItems: 'center', marginTop: 10 }}>
                            <Text style={{ color: '#FFF', fontSize: 12, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 2 }}>Secure Your Blueprint</Text>
                        </TouchableOpacity>
                    </View>
                )}

                <View style={{ backgroundColor: '#12232E', borderRadius: 30, padding: 24, marginBottom: 100, shadowColor: '#D4AF37', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.2, shadowRadius: 20, elevation: 10, borderWidth: 2, borderColor: '#D4AF37' }}>
                    <View style={{ position: 'absolute', top: -12, right: 24, backgroundColor: '#D4AF37', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 10 }}>
                        <Text style={{ color: '#12232E', fontSize: 9, fontWeight: '900', textTransform: 'uppercase', letterSpacing: 2 }}>Trip-Based Magic</Text>
                    </View>

                    <Text style={{ color: '#FFF', fontSize: 18, fontFamily: 'Georgia', marginBottom: 8, marginTop: 10 }}>The Sniper Automation</Text>

                    <View style={{ flexDirection: 'row', gap: 12, marginBottom: 16, justifyContent: 'space-between', marginTop: 8 }}>
                        <View style={{ flex: 1, backgroundColor: 'rgba(255,255,255,0.05)', padding: 12, borderRadius: 15, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' }}>
                            <Text style={{ color: '#FFF', fontSize: 18, fontWeight: '800' }}>$39.00</Text>
                            <Text style={{ color: 'rgba(255,255,255,0.4)', fontSize: 7, textTransform: 'uppercase', marginTop: 4 }}>Pixie Dust Trip Pass</Text>
                            <TouchableOpacity style={{ backgroundColor: '#FFF', paddingVertical: 10, borderRadius: 10, alignItems: 'center', marginTop: 12 }}>
                                <Text style={{ color: '#12232E', fontSize: 10, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 1 }}>Add Pixie Dust</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={{ flex: 1, backgroundColor: 'rgba(212,175,55,0.1)', padding: 12, borderRadius: 15, borderWidth: 1, borderColor: 'rgba(212,175,55,0.3)' }}>
                            <View style={{ position: 'absolute', top: -8, right: 8, backgroundColor: '#D4AF37', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6 }}>
                                <Text style={{ color: '#12232E', fontSize: 7, fontWeight: '900', textTransform: 'uppercase' }}>Ultimate</Text>
                            </View>
                            <Text style={{ color: '#D4AF37', fontSize: 18, fontWeight: '800' }}>$149.00</Text>
                            <Text style={{ color: '#D4AF3788', fontSize: 7, textTransform: 'uppercase', marginTop: 4 }}>Glass Slipper Pass</Text>
                            <TouchableOpacity style={{ backgroundColor: '#D4AF37', paddingVertical: 10, borderRadius: 10, alignItems: 'center', marginTop: 12 }}>
                                <Text style={{ color: '#12232E', fontSize: 10, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 1 }}>Upgrade Tier</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <TouchableOpacity style={{ marginBottom: 24, alignItems: 'center' }}>
                        <Text style={{ color: '#D4AF37', fontSize: 10, fontFamily: 'Georgia', fontStyle: 'italic', textAlign: 'center' }}>
                            Looking for your Member Portal discount? Log in at castlecompanion.com to apply existing credits.
                        </Text>
                    </TouchableOpacity>

                    <Text style={{ color: '#FFF', opacity: 0.7, fontSize: 11, marginBottom: 24, lineHeight: 16 }}>The elite expert concierge. Deploys a personal booking system to handle reservations while your Guide performs real-time updates.</Text>

                    {renderFeature('Pro Strategy + Flash Execution', true)}
                    {renderFeature('Real-Time "In-Park" AI Pivots', true)}
                    {renderFeature('Auto-Execution of the Morning Reset', true)}
                    {renderFeature('Auto-Booking Dining (The "Sniffer")', true)}
                    {renderFeature('Full Bot Lightning Lane Sniping', true)}
                    {renderFeature('Dynamic Group Selection Support', true)}
                </View>

            </ScrollView>
        </View>
    );
}

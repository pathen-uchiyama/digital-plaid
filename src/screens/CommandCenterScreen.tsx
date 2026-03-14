import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { THEME } from '../utils/DesignSystem';
import { Activity, Shield, Zap, Server, Users, AlertTriangle, RefreshCcw, Power } from 'lucide-react-native';
import { TelemetryEngine, SystemMetric } from '../utils/TelemetryEngine';

export default function CommandCenterScreen() {
    const [metrics, setMetrics] = useState<SystemMetric>(TelemetryEngine.getLatestMetrics());
    const [health, setHealth] = useState(TelemetryEngine.getHealthStatus());
    const [isKillSwitchArmed, setIsKillSwitchArmed] = useState(false);

    useEffect(() => {
        const interval = setInterval(() => {
            // Mock dynamic updates
            TelemetryEngine.logMetric({
                activeUsers: Math.floor(Math.random() * 500) + 1200,
                activeBots: Math.floor(Math.random() * 50) + 200,
                apiLatency: Math.floor(Math.random() * 100) + 80,
                errorCount: Math.random() > 0.95 ? 1 : 0
            });
            setMetrics(TelemetryEngine.getLatestMetrics());
            setHealth(TelemetryEngine.getHealthStatus());
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    const handleKillSwitch = () => {
        if (!isKillSwitchArmed) {
            setIsKillSwitchArmed(true);
            Alert.alert('KILL SWITCH ARMED', 'This will immediately terminate all active bot instances and autonomous booking sessions. Press again to confirm.', [{ text: 'Cancel', onPress: () => setIsKillSwitchArmed(false) }, { text: 'Confirm' }]);
        } else {
            Alert.alert('SYSTEM TERMINATED', 'All global operations halted. Manual override required.');
            setIsKillSwitchArmed(false);
        }
    };

    return (
        <ScrollView className="flex-1 bg-plaid-navy p-8 pt-20">
            <View className="flex-row justify-between items-center mb-12">
                <View>
                    <Text className="text-plaid-gold font-header text-xs uppercase tracking-[4px] mb-2">Elite Operations</Text>
                    <Text className="text-white font-header text-4xl">Command Center</Text>
                </View>
                <View className={`px-4 py-2 rounded-full border ${health === 'Nominal' ? 'bg-plaid-teal/20 border-plaid-teal' : 'bg-plaid-rose/20 border-plaid-rose'}`}>
                    <Text className={`font-header text-[10px] uppercase ${health === 'Nominal' ? 'text-plaid-teal' : 'text-plaid-rose'}`}>{health}</Text>
                </View>
            </View>

            {/* Core Metrics Grid */}
            <View className="flex-row flex-wrap gap-4 mb-12">
                <MetricCard icon={Users} label="Active Crews" value={metrics.activeUsers.toString()} />
                <MetricCard icon={Zap} label="Bot Instances" value={metrics.activeBots.toString()} />
                <MetricCard icon={Activity} label="API Latency" value={`${metrics.apiLatency}ms`} />
                <MetricCard icon={Shield} label="Success Rate" value="99.4%" />
                <MetricCard icon={Shield} label="Attestation" value={metrics.attestationStatus || 'Verified'} />
                <MetricCard icon={Server} label="JA3 Signature" value={metrics.evasionSignature?.substring(0, 10) + '...'} />
            </View>

            {/* Infrastructure Controls */}
            <Text className="text-white/40 font-header text-[10px] uppercase tracking-[3px] mb-6">Orchestration controls</Text>

            <View className="gap-y-4 mb-20">
                <ControlRow
                    icon={Server}
                    label="Scale Infrastructure"
                    description="Provision 50 extra bot instances for 7:00 AM VQ window"
                    actionLabel="Scale Now"
                    onPress={() => Alert.alert('Orchestrator Busy', 'Autoscale policy already active for 7:00 AM.')}
                />

                <ControlRow
                    icon={RefreshCcw}
                    label="Flush API Cache"
                    description="Clear all cached real-time wait times for MK/HS"
                    actionLabel="Flush"
                    onPress={() => Alert.alert('Cache Flush', 'System cache purged successfully.')}
                />

                <TouchableOpacity
                    onPress={handleKillSwitch}
                    className={`p-6 rounded-[30px] border-2 flex-row items-center ${isKillSwitchArmed ? 'bg-plaid-rose border-white shadow-2xl' : 'bg-plaid-rose/10 border-plaid-rose/40'}`}
                >
                    <Power size={24} color={isKillSwitchArmed ? "white" : "#B33951"} className="mr-4" />
                    <View className="flex-1">
                        <Text className={`font-header text-lg ${isKillSwitchArmed ? 'text-white' : 'text-plaid-rose'}`}>Global Kill-Switch</Text>
                        <Text className={`font-body text-xs ${isKillSwitchArmed ? 'text-white/80' : 'text-plaid-rose/60'}`}>Terminate all autonomous service agents</Text>
                    </View>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}

function MetricCard({ icon: Icon, label, value }: any) {
    return (
        <View className="w-[47%] bg-white/5 border border-white/10 p-6 rounded-[35px]">
            <Icon size={20} color="#D4AF37" className="mb-4" />
            <Text className="text-white/40 font-header text-[8px] uppercase tracking-[2px] mb-1">{label}</Text>
            <Text className="text-white font-header text-2xl">{value}</Text>
        </View>
    );
}

function ControlRow({ icon: Icon, label, description, actionLabel, onPress }: any) {
    return (
        <View className="bg-white/5 border border-white/10 p-6 rounded-[35px] flex-row items-center">
            <View className="bg-white/10 p-4 rounded-2xl mr-4">
                <Icon size={24} color="white" />
            </View>
            <View className="flex-1">
                <Text className="text-white font-header text-base mb-1">{label}</Text>
                <Text className="text-white/40 font-body text-[10px] leading-tight">{description}</Text>
            </View>
            <TouchableOpacity onPress={onPress} className="bg-plaid-gold px-4 py-2 rounded-xl">
                <Text className="text-plaid-navy font-header text-[8px] uppercase tracking-[1px]">{actionLabel}</Text>
            </TouchableOpacity>
        </View>
    );
}

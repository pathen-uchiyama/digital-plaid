import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Dimensions, Alert } from 'react-native';
import { THEME } from '../utils/DesignSystem';
import { Map, Layers, History, TrendingUp, DollarSign, Clock, ShieldCheck, Zap } from 'lucide-react-native';
import { TelemetryEngine, SystemMetric } from '../utils/TelemetryEngine';
import { ShadowTestingEngine, ShadowTestResult } from '../utils/ShadowTestingEngine';
import { useParkStatus } from '../hooks/useParkStatus';

const { width } = Dimensions.get('window');

export default function OperationsDashboard() {
    const [metrics, setMetrics] = useState<SystemMetric>(TelemetryEngine.getLatestMetrics());
    const [shadowTests, setShadowTests] = useState<ShadowTestResult[]>(ShadowTestingEngine.getRecentTests());
    const [activeTab, setActiveTab] = useState<'spatial' | 'shadow' | 'finance' | 'rose'>('spatial');

    useEffect(() => {
        const interval = setInterval(() => {
            setMetrics(TelemetryEngine.getLatestMetrics());
            setShadowTests([...ShadowTestingEngine.getRecentTests()]);
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    return (
        <View className="flex-1 bg-plaid-navy">
            {/* Admin Header */}
            <View className="pt-20 pb-10 px-8 bg-white/5 border-b border-white/10">
                <Text className="text-plaid-gold font-header text-xs uppercase tracking-[5px] mb-2">Elite Operations Suite</Text>
                <Text className="text-white font-header text-4xl">Global Intelligence</Text>

                {/* Tab Switcher */}
                <View className="flex-row mt-10 bg-white/5 p-1 rounded-2xl">
                    <TabButton active={activeTab === 'spatial'} label="Spatial" icon={Map} onPress={() => setActiveTab('spatial')} />
                    <TabButton active={activeTab === 'shadow'} label="Shadow" icon={Layers} onPress={() => setActiveTab('shadow')} />
                    <TabButton active={activeTab === 'finance'} label="Finance" icon={DollarSign} onPress={() => setActiveTab('finance')} />
                    <TabButton active={activeTab === 'rose'} label="Rose" icon={Zap} onPress={() => setActiveTab('rose')} />
                </View>
            </View>

            <ScrollView className="flex-1 p-8">
                {activeTab === 'spatial' && <SpatialHeatMap parkId="MK" />}
                {activeTab === 'shadow' && <ShadowModeView results={shadowTests} />}
                {activeTab === 'finance' && <FinanceView metrics={metrics} />}
                {activeTab === 'rose' && <RoseInjectionView />}
            </ScrollView>
        </View>
    );
}

function TabButton({ active, label, icon: Icon, onPress }: any) {
    return (
        <TouchableOpacity
            onPress={onPress}
            className={`flex-1 flex-row items-center justify-center py-3 rounded-xl ${active ? 'bg-plaid-gold shadow-lg' : ''}`}
        >
            <Icon size={16} color={active ? THEME.colors.navy : 'white'} className="mr-2" />
            <Text className={`font-header text-[10px] uppercase tracking-[1px] ${active ? 'text-plaid-navy' : 'text-white/40'}`}>
                {label}
            </Text>
        </TouchableOpacity>
    );
}

function SpatialHeatMap({ parkId = 'MK' }: { parkId: string }) {
    const { statuses: liveStatuses } = useParkStatus(parkId);

    const zones = [
        { 
            name: 'Space Mountain', 
            load: liveStatuses.find(s => s.name.includes('Space Mountain'))?.currentWaitMins || 75,
            status: liveStatuses.find(s => s.name.includes('Space Mountain'))?.status || 'Nominal'
        },
        { 
            name: 'Pirates', 
            load: liveStatuses.find(s => s.name.includes('Pirates of the Caribbean'))?.currentWaitMins || 25,
            status: liveStatuses.find(s => s.name.includes('Pirates of the Caribbean'))?.status || 'Nominal'
        },
        { 
            name: 'Haunted Mansion', 
            load: liveStatuses.find(s => s.name.includes('Haunted Mansion'))?.currentWaitMins || 45,
            status: liveStatuses.find(s => s.name.includes('Haunted Mansion'))?.status || 'Nominal'
        },
        { 
            name: 'Big Thunder', 
            load: liveStatuses.find(s => s.name.includes('Big Thunder Mountain'))?.currentWaitMins || 35,
            status: liveStatuses.find(s => s.name.includes('Big Thunder Mountain'))?.status || 'Nominal'
        },
        { 
            name: 'Peter Pan', 
            load: liveStatuses.find(s => s.name.includes("Peter Pan's Flight"))?.currentWaitMins || 85,
            status: liveStatuses.find(s => s.name.includes("Peter Pan's Flight"))?.status || 'Nominal'
        },
    ];

    return (
        <View>
            <Text className="text-white/40 font-header text-[10px] uppercase tracking-[3px] mb-6">Park Attraction Real-Time</Text>
            {zones.map(zone => (
                <View key={zone.name} className="bg-white/5 border border-white/10 p-6 rounded-[30px] mb-4 flex-row items-center">
                    <View className="flex-1">
                        <Text className="text-white font-header text-lg mb-1">{zone.name}</Text>
                        <View className="w-full h-2 bg-white/10 rounded-full mt-2">
                            <View
                                style={{ width: `${Math.min(zone.load, 100)}%` }}
                                className={`h-full rounded-full ${zone.load > 60 ? 'bg-plaid-rose' : zone.load > 30 ? 'bg-plaid-gold' : 'bg-plaid-teal'}`}
                            />
                        </View>
                    </View>
                    <View className="ml-6 items-end">
                        <Text className="text-white font-header text-2xl">{zone.load}m</Text>
                        <Text className={`font-header text-[8px] uppercase tracking-[1px] ${zone.load > 60 ? 'text-plaid-rose' : 'text-white/40'}`}>{zone.status}</Text>
                    </View>
                </View>
            ))}
        </View>
    );
}


function ShadowModeView({ results }: { results: ShadowTestResult[] }) {
    const metrics = ShadowTestingEngine.getComparisonMetrics();

    return (
        <View>
            <View className="flex-row gap-4 mb-8">
                <View className="flex-1 bg-white/5 border border-white/10 p-6 rounded-[30px] items-center">
                    <TrendingUp size={20} color="#D4AF37" className="mb-2" />
                    <Text className="text-white font-header text-2xl">{metrics.winRate.toFixed(1)}%</Text>
                    <Text className="text-white/40 font-header text-[8px] uppercase tracking-[1px]">Shadow Win Rate</Text>
                </View>
                <View className="flex-1 bg-white/5 border border-white/10 p-6 rounded-[30px] items-center">
                    <Clock size={20} color="#489B9E" className="mb-2" />
                    <Text className="text-white font-header text-2xl">-{metrics.avgDrift.toFixed(1)}m</Text>
                    <Text className="text-white/40 font-header text-[8px] uppercase tracking-[1px]">Avg. Time saved</Text>
                </View>
            </View>

            <Text className="text-white/40 font-header text-[10px] uppercase tracking-[3px] mb-6">Live Scenario Replay</Text>
            {results.reverse().map((res, i) => (
                <View key={i} className="bg-white/5 border border-white/10 p-6 rounded-[30px] mb-4">
                    <View className="flex-row justify-between items-center mb-4">
                        <Text className="text-white/60 font-header text-[10px] uppercase">Req: {res.requestId}</Text>
                        <View className={`px-3 py-1 rounded-full ${res.shadowSuccess ? 'bg-plaid-teal/20' : 'bg-plaid-rose/20'}`}>
                            <Text className={`font-header text-[8px] uppercase ${res.shadowSuccess ? 'text-plaid-teal' : 'text-plaid-rose'}`}>
                                {res.shadowSuccess ? 'Optimization Found' : 'Wait Parity'}
                            </Text>
                        </View>
                    </View>
                    <View className="flex-row items-center">
                        <View className="flex-1">
                            <Text className="text-white/40 font-body text-[10px] mb-1">Production</Text>
                            <Text className="text-white font-header text-xl">{res.productionWaitTime}m</Text>
                        </View>
                        <Zap size={16} color="#D4AF37" className="mx-4" />
                        <View className="flex-1 items-end">
                            <Text className="text-white/40 font-body text-[10px] mb-1">Shadow Alg.</Text>
                            <Text className="text-plaid-gold font-header text-xl">{res.shadowWaitTime}m</Text>
                        </View>
                    </View>
                </View>
            ))}
        </View>
    );
}

function FinanceView({ metrics }: { metrics: SystemMetric }) {
    return (
        <View>
            <View className="bg-plaid-teal/10 border border-plaid-teal/30 p-8 rounded-[40px] mb-8 items-center">
                <DollarSign size={40} color="#489B9E" className="mb-4" />
                <Text className="text-white/60 font-header text-xs uppercase tracking-[4px] mb-2">Total Managed Revenue</Text>
                <Text className="text-white font-header text-5xl">${(metrics.revenue || 12450.50).toLocaleString()}</Text>
            </View>

            <View className="gap-y-4">
                <FinanceStat label="Avg. Order Value" value="$84.20" icon={TrendingUp} />
                <FinanceStat label="Revenue per Saved Minute" value="$1.12" icon={Clock} />
                <FinanceStat label="Trip Pass Velocity" value="Nominal" icon={ShieldCheck} />
            </View>
        </View>
    );
}

function FinanceStat({ label, value, icon: Icon }: any) {
    return (
        <View className="bg-white/5 border border-white/10 p-6 rounded-[30px] flex-row items-center">
            <View className="bg-white/10 p-4 rounded-2xl mr-4">
                <Icon size={20} color="white" />
            </View>
            <View className="flex-1">
                <Text className="text-white/60 font-body text-xs">{label}</Text>
                <Text className="text-white font-header text-xl mt-1">{value}</Text>
            </View>
        </View>
    );
}

function RoseInjectionView() {
    const broadcast = () => {
        Alert.alert('Broadcast Success', 'Global Rose "Rare Character: Figment spotted near Journey into Imagination" pushed to 1,240 active users.');
    };

    return (
        <View>
            <Text className="text-white/40 font-header text-[10px] uppercase tracking-[3px] mb-6">Global Tip Injection</Text>
            <View className="bg-white/5 border border-white/10 p-8 rounded-[40px] items-center">
                <Text className="text-plaid-gold font-header text-xl mb-4">Push Manual "Rose"</Text>
                <Text className="text-white/60 font-body text-center mb-8 px-4">
                    Send a time-sensitive discoverable tip to all active "Lead Adventurers" in the park.
                </Text>

                <TouchableOpacity
                    onPress={broadcast}
                    className="bg-plaid-gold w-full py-5 rounded-[25px] items-center flex-row justify-center"
                >
                    <Zap size={20} color={THEME.colors.navy} className="mr-3" />
                    <Text className="text-plaid-navy font-header text-base uppercase tracking-[1px]">Broadcast Global Tip</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

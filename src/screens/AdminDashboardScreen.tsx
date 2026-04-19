import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Switch, FlatList, Alert } from 'react-native';
import {
    Activity,
    Users,
    CreditCard,
    ShieldAlert,
    ChevronLeft,
    RefreshCcw,
    Power,
    Search,
    AlertCircle,
    CheckCircle2,
    Clock,
    DollarSign,
    Zap,
    Cpu,
    Globe,
    Lock,
    Beaker,
    ClipboardList,
    AlertTriangle,
    Navigation2
} from 'lucide-react-native';
import { TelemetryEngine, SystemMetric } from '../utils/TelemetryEngine';
import { AdminOpsManager, AdminUser, Transaction, ReasoningAudit } from '../utils/AdminOpsManager';
import { autoBookingEngine } from '../utils/AutoBookingManager';
import { THEME } from '../utils/DesignSystem';
import { Config } from '../config/Config';

interface AdminDashboardScreenProps {
    onBack: () => void;
}

export default function AdminDashboardScreen({ onBack }: AdminDashboardScreenProps) {
    const [metrics, setMetrics] = useState<SystemMetric>(TelemetryEngine.getLatestMetrics());
    const [healthStatus, setHealthStatus] = useState(TelemetryEngine.getHealthStatus());
    const [users, setUsers] = useState<AdminUser[]>(AdminOpsManager.getUsers());
    const [transactions, setTransactions] = useState<Transaction[]>(AdminOpsManager.getTransactions());
    const [killSwitches, setKillSwitches] = useState(AdminOpsManager.getKillSwitches());
    const [fleetConfig, setFleetConfig] = useState(AdminOpsManager.getFleetConfig());
    const [audits, setAudits] = useState<ReasoningAudit[]>(AdminOpsManager.getReasoningAudits());
    const [activeTab, setActiveTab] = useState<'health' | 'lab' | 'fleet' | 'efficiency' | 'outcomes' | 'tactical' | 'users' | 'billing'>('health');
    const [stats, setStats] = useState({ acceptanceRate: 0.88, timeSaved: 42 });
    const [simScenario, setSimScenario] = useState('Space Mountain Down');
    const [simProfile, setSimProfile] = useState('The Commando');
    const [simResult, setSimResult] = useState<string | null>(null);
    const [isSimulating, setIsSimulating] = useState(false);

    useEffect(() => {
        const interval = setInterval(() => {
            setMetrics(TelemetryEngine.getLatestMetrics());
            setHealthStatus(TelemetryEngine.getHealthStatus());
            setFleetConfig({ ...AdminOpsManager.getFleetConfig() });
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    const handleUpdateFleet = (update: Partial<typeof fleetConfig>) => {
        AdminOpsManager.updateFleetConfig(update);
        setFleetConfig({ ...AdminOpsManager.getFleetConfig() });
    };

    const handleToggleKillSwitch = (key: keyof typeof killSwitches) => {
        AdminOpsManager.toggleKillSwitch(key);
        setKillSwitches({ ...AdminOpsManager.getKillSwitches() });
    };

    const handleRefund = (txId: string) => {
        Alert.alert(
            'Process Refund',
            `Are you sure you want to refund transaction ${txId}?`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Refund',
                    style: 'destructive',
                    onPress: () => {
                        if (AdminOpsManager.processRefund(txId)) {
                            setTransactions([...AdminOpsManager.getTransactions()]);
                            Alert.alert('Refund Processed', 'The transaction has been marked as refunded.');
                        }
                    }
                }
            ]
        );
    };

    const runSimulation = async () => {
        setIsSimulating(true);
        setSimResult(null);
        try {
            const result = await AdminOpsManager.simulateReasoning('Magic Kingdom', simScenario, simProfile);
            setSimResult(result);
            setAudits(AdminOpsManager.getReasoningAudits());
        } finally {
            setIsSimulating(false);
        }
    };

    const renderHealthTab = () => (
        <ScrollView className="flex-1 px-8" showsVerticalScrollIndicator={false}>
            {/* Health Status Banner */}
            <View className={`p-6 rounded-[30px] mb-8 flex-row items-center border ${healthStatus === 'Nominal' ? 'bg-plaid-teal/10 border-plaid-teal/30' :
                healthStatus === 'Warning' ? 'bg-plaid-gold/10 border-plaid-gold/30' : 'bg-plaid-rose/10 border-plaid-rose/30'
                }`}>
                <View className={`w-12 h-12 rounded-full items-center justify-center mr-6 ${healthStatus === 'Nominal' ? 'bg-plaid-teal/20' :
                    healthStatus === 'Warning' ? 'bg-plaid-gold/20' : 'bg-plaid-rose/20'
                    }`}>
                    {healthStatus === 'Nominal' ? <CheckCircle2 color={THEME.colors.teal} /> :
                        healthStatus === 'Warning' ? <AlertCircle color={THEME.colors.gold} /> : <ShieldAlert color={THEME.colors.rose} />}
                </View>
                <View>
                    <Text className="text-plaid-navy font-header text-lg">System Status: {healthStatus}</Text>
                    <Text className="text-plaid-navy/40 font-body text-xs">All primary logic cores are operating within parameters.</Text>
                </View>
            </View>

            {/* Metrics Grid */}
            <View className="flex-row flex-wrap justify-between mb-8">
                {[
                    { label: 'API Latency', value: `${metrics.apiLatency}ms`, icon: Activity, color: THEME.colors.gold },
                    { label: 'Success Rate', value: `${(metrics.successRate * 100).toFixed(1)}%`, icon: CheckCircle2, color: THEME.colors.teal },
                    { label: 'Active Snipers', value: metrics.activeBots, icon: RefreshCcw, color: THEME.colors.navy },
                    { label: 'System Errors', value: metrics.errorCount, icon: AlertCircle, color: THEME.colors.rose },
                ].map((m, i) => (
                    <View key={i} className="w-[47%] bg-white p-5 rounded-[25px] shadow-sm mb-4 border border-plaid-navy/5">
                        <View className="flex-row items-center mb-3">
                            <m.icon size={16} color={m.color} />
                            <Text className="text-plaid-navy/40 font-header text-[8px] uppercase tracking-widest ml-2">{m.label}</Text>
                        </View>
                        <Text className="text-plaid-navy font-header text-xl">{m.value}</Text>
                    </View>
                ))}
            </View>

            {/* Kill Switches */}
            <Text className="text-plaid-gold font-header text-[10px] uppercase tracking-[3px] mb-6">Strategic Overrides</Text>
            <View className="bg-white rounded-[30px] p-6 mb-20 border border-plaid-navy/5">
                {[
                    { key: 'vqSniper', label: 'VQ Sniper', desc: 'Auto-joins virtual queues.' },
                    { key: 'llSniper', label: 'LL Sniper', desc: 'Invisible availability churn.' },
                    { key: 'autoBooking', label: 'Auto-Booking', desc: 'Itinerary execution gate.' },
                ].map((s, i) => (
                    <View key={i} className={`flex-row items-center justify-between py-4 ${i !== 2 ? 'border-b border-plaid-navy/5' : ''}`}>
                        <View className="flex-1 mr-4">
                            <Text className="text-plaid-navy font-header text-sm">{s.label}</Text>
                            <Text className="text-plaid-navy/40 font-body text-[8px] uppercase">{s.desc}</Text>
                        </View>
                        <Switch
                            value={killSwitches[s.key as keyof typeof killSwitches]}
                            onValueChange={() => handleToggleKillSwitch(s.key as keyof typeof killSwitches)}
                            trackColor={{ false: '#12232E11', true: '#B33951' }}
                        />
                    </View>
                ))}
            </View>
        </ScrollView>
    );

    const [fleetHealth, setFleetHealth] = useState<any>(null);
    const [fleetLoading, setFleetLoading] = useState(false);

    // Fetch live fleet health from backend
    const fetchFleetHealth = async () => {
        setFleetLoading(true);
        try {
            const response = await fetch(`${Config.API_BASE_URL}/admin/fleet/health`);
            if (response.ok) {
                const data = await response.json();
                setFleetHealth(data);
            }
        } catch (err) {
            console.warn('Fleet health fetch failed:', err);
        }
        setFleetLoading(false);
    };

    useEffect(() => {
        if (activeTab === 'fleet') fetchFleetHealth();
    }, [activeTab]);

    const renderFleetTab = () => {
        const fh = fleetHealth;
        const pool = fh?.poolStats;
        const attrition = fh?.registrationAttrition;
        const breakdown = fh?.categoryBreakdown || [];

        return (
        <ScrollView className="flex-1 px-8" showsVerticalScrollIndicator={false}>
            {/* Refresh Button */}
            <View className="flex-row justify-between items-center mb-6">
                <Text className="text-plaid-gold font-header text-[10px] uppercase tracking-[3px]">Fleet Capacity Overview</Text>
                <TouchableOpacity onPress={fetchFleetHealth} className="flex-row items-center bg-plaid-navy/5 px-3 py-2 rounded-xl">
                    <RefreshCcw size={12} color={THEME.colors.navy} />
                    <Text className="text-plaid-navy font-header text-[8px] uppercase tracking-widest ml-1.5">
                        {fleetLoading ? 'Loading...' : 'Refresh'}
                    </Text>
                </TouchableOpacity>
            </View>

            {!fh ? (
                <View className="bg-white rounded-[30px] p-8 items-center border border-plaid-navy/5 mb-8">
                    <Text className="text-plaid-navy/40 font-body text-sm">
                        {fleetLoading ? 'Fetching fleet health...' : 'Tap Refresh to load live fleet data'}
                    </Text>
                </View>
            ) : (
                <>
                    {/* Total Capacity Header */}
                    <View className="bg-white rounded-[30px] p-8 shadow-sm mb-6 border border-plaid-navy/5">
                        <View className="flex-row justify-between items-center mb-4">
                            <View>
                                <Text className="text-plaid-navy font-header text-sm">Total Booking Agents</Text>
                                <Text className="text-plaid-navy/40 font-body text-[10px]">All categories sum to this total</Text>
                            </View>
                            <Text className="text-plaid-navy font-header text-3xl">{pool?.total || 0}</Text>
                        </View>

                        {/* Stacked Capacity Bar */}
                        <View className="h-4 bg-plaid-navy/5 rounded-full overflow-hidden flex-row mb-4">
                            {breakdown.map((cat: any, i: number) => (
                                <View
                                    key={cat.category}
                                    style={{
                                        width: `${cat.percent}%`,
                                        backgroundColor: cat.color,
                                        borderLeftWidth: i > 0 ? 1 : 0,
                                        borderLeftColor: 'white',
                                    }}
                                    className="h-full"
                                />
                            ))}
                        </View>

                        {/* Category Legend */}
                        <View className="flex-row flex-wrap">
                            {breakdown.map((cat: any) => (
                                <View key={cat.category} className="flex-row items-center mr-4 mb-2">
                                    <View style={{ backgroundColor: cat.color }} className="w-2.5 h-2.5 rounded-full mr-1.5" />
                                    <Text className="text-plaid-navy/60 font-header text-[8px] uppercase tracking-wide">
                                        {cat.category}: {cat.count} ({cat.percent}%)
                                    </Text>
                                </View>
                            ))}
                        </View>
                    </View>

                    {/* Individual Category Cards */}
                    <View className="flex-row flex-wrap justify-between mb-6">
                        {[
                            { label: 'Active', value: pool?.active, desc: 'Assigned to trips', color: '#489B9E' },
                            { label: 'Available', value: pool?.available, desc: 'Ready for assignment', color: '#D4AF37' },
                            { label: 'Incubating', value: pool?.incubating, desc: 'Warming up', color: '#6B7FD7' },
                            { label: 'Unregistered', value: pool?.unregistered, desc: 'Not yet registered', color: '#95A5A6' },
                            { label: 'Pending', value: pool?.pending, desc: 'In registration flow', color: '#E8A87C' },
                            { label: 'Banned', value: pool?.banned, desc: 'Detected & deactivated', color: '#B33951' },
                        ].map((stat) => (
                            <View key={stat.label} className="w-[31%] bg-white p-4 rounded-[20px] mb-3 border border-plaid-navy/5">
                                <View className="flex-row items-center mb-2">
                                    <View style={{ backgroundColor: stat.color }} className="w-2 h-2 rounded-full mr-1.5" />
                                    <Text className="text-plaid-navy/40 font-header text-[7px] uppercase tracking-widest">{stat.label}</Text>
                                </View>
                                <Text className="text-plaid-navy font-header text-lg">{stat.value ?? 0}</Text>
                                <Text className="text-plaid-navy/30 font-body text-[7px]">{stat.desc}</Text>
                            </View>
                        ))}
                    </View>

                    {/* Registration Attrition — the key metric */}
                    <Text className="text-plaid-gold font-header text-[10px] uppercase tracking-[3px] mb-4">Registration Attrition</Text>
                    <View className="bg-white rounded-[30px] p-6 mb-6 border border-plaid-navy/5">
                        <View className="flex-row justify-between mb-4">
                            <View className="flex-1 mr-3">
                                <Text className="text-plaid-navy/40 font-header text-[8px] uppercase tracking-widest mb-1">Attempted Registrations</Text>
                                <Text className="text-plaid-navy font-header text-xl">{attrition?.attempted ?? 0}</Text>
                                <Text className="text-plaid-navy/30 font-body text-[7px]">Accounts that entered the registration pipeline</Text>
                            </View>
                            <View className="flex-1 ml-3">
                                <Text className="text-plaid-navy/40 font-header text-[8px] uppercase tracking-widest mb-1">Banned from Attempted</Text>
                                <Text className={`font-header text-xl ${(attrition?.attritionPercent ?? 0) > 50 ? 'text-plaid-rose' : (attrition?.attritionPercent ?? 0) > 25 ? 'text-plaid-gold' : 'text-plaid-teal'}`}>
                                    {attrition?.bannedFromAttempted ?? 0} ({attrition?.attritionPercent ?? 0}%)
                                </Text>
                                <Text className="text-plaid-navy/30 font-body text-[7px]">True failure rate of registration attempts</Text>
                            </View>
                        </View>

                        {/* Attrition vs Overall comparison */}
                        <View className="bg-plaid-navy/5 p-4 rounded-2xl">
                            <View className="flex-row justify-between items-center">
                                <View>
                                    <Text className="text-plaid-navy/50 font-header text-[8px] uppercase">Attrition Rate (of attempted)</Text>
                                    <Text className={`font-header text-lg ${(attrition?.attritionPercent ?? 0) > 50 ? 'text-plaid-rose' : 'text-plaid-navy'}`}>
                                        {attrition?.attritionPercent ?? 0}%
                                    </Text>
                                </View>
                                <View className="w-[1px] h-10 bg-plaid-navy/10" />
                                <View>
                                    <Text className="text-plaid-navy/50 font-header text-[8px] uppercase">Banned % (of total fleet)</Text>
                                    <Text className="text-plaid-navy/40 font-header text-lg">
                                        {attrition?.bannedOverallPercent ?? 0}%
                                    </Text>
                                </View>
                            </View>
                            <Text className="text-plaid-navy/30 font-body text-[7px] mt-2 italic">
                                Attrition rate shows actual failure rate of registration attempts. Overall % is diluted by unregistered accounts.
                            </Text>
                        </View>
                    </View>

                    {/* Recent Bans & Domain Info */}
                    <View className="flex-row justify-between mb-6">
                        <View className="w-[48%] bg-white p-5 rounded-[25px] border border-plaid-navy/5">
                            <Text className="text-plaid-navy/40 font-header text-[8px] uppercase tracking-widest mb-2">Bans (24h)</Text>
                            <Text className={`text-plaid-navy font-header text-2xl ${(fh?.recentBans24h ?? 0) > 3 ? 'text-plaid-rose' : ''}`}>
                                {fh?.recentBans24h ?? 0}
                            </Text>
                        </View>
                        <View className="w-[48%] bg-white p-5 rounded-[25px] border border-plaid-navy/5">
                            <Text className="text-plaid-navy/40 font-header text-[8px] uppercase tracking-widest mb-2">Active Domains</Text>
                            <Text className="text-plaid-navy font-header text-2xl">
                                {fh?.activeDomains ?? 0} / {fh?.totalDomains ?? 0}
                            </Text>
                        </View>
                    </View>

                    {/* Warm Reserve & Incubation */}
                    <View className="flex-row justify-between mb-6">
                        <View className="w-[48%] bg-white p-5 rounded-[25px] border border-plaid-navy/5">
                            <Text className="text-plaid-navy/40 font-header text-[8px] uppercase tracking-widest mb-2">Warm Reserve</Text>
                            <Text className="text-plaid-navy font-header text-2xl">{fh?.warmReservePercent ?? 0}%</Text>
                        </View>
                        <View className="w-[48%] bg-white p-5 rounded-[25px] border border-plaid-navy/5">
                            <Text className="text-plaid-navy/40 font-header text-[8px] uppercase tracking-widest mb-2">Incubation Ready</Text>
                            <Text className="text-plaid-navy font-header text-2xl">
                                {fh?.incubationPipeline?.readyWithin24h ?? 0} / {fh?.incubationPipeline?.total ?? 0}
                            </Text>
                        </View>
                    </View>

                    {/* Friend Capacity */}
                    <Text className="text-plaid-gold font-header text-[10px] uppercase tracking-[3px] mb-4">Friend Capacity Utilization</Text>
                    <View className="bg-white rounded-[30px] p-6 mb-20 border border-plaid-navy/5">
                        <View className="h-3 bg-plaid-navy/5 rounded-full overflow-hidden mb-3">
                            <View
                                style={{ width: `${Math.round((pool?.friendCapUtilization ?? 0) * 100)}%` }}
                                className={`h-full rounded-full ${(pool?.friendCapUtilization ?? 0) > 0.8 ? 'bg-plaid-rose' : 'bg-plaid-teal'}`}
                            />
                        </View>
                        <Text className="text-plaid-navy/40 font-body text-[8px] uppercase">
                            {Math.round((pool?.friendCapUtilization ?? 0) * 100)}% of friend slots used across all active agents
                        </Text>
                    </View>
                </>
            )}
        </ScrollView>
    ); const renderEfficiencyTab = () => (
        <ScrollView className="flex-1 px-8" showsVerticalScrollIndicator={false}>
            <Text className="text-plaid-gold font-header text-[10px] uppercase tracking-[3px] mb-6">Unit Economics & Leakage</Text>

            {/* AI Token Efficiency */}
            <View className="bg-white rounded-[30px] p-8 shadow-sm mb-6 border border-plaid-navy/5">
                <View className="flex-row justify-between items-center mb-4">
                    <View className="flex-row items-center">
                        <Cpu size={16} color={THEME.colors.gold} />
                        <Text className="text-plaid-navy font-header text-sm ml-2">Token Burn Analysis</Text>
                    </View>
                    <Text className="text-plaid-teal font-header text-xs">MARGIN: 82%</Text>
                </View>
                <Text className="text-plaid-navy font-header text-2xl mb-2">{metrics.tokenBurn.toLocaleString()} <Text className="text-plaid-navy/30 text-xs">/ {fleetConfig.tokenCap.toLocaleString()}</Text></Text>
                <View className="h-1 bg-plaid-navy/5 rounded-full overflow-hidden mb-4">
                    <View style={{ width: `${(metrics.tokenBurn / fleetConfig.tokenCap) * 100}%` }} className="h-full bg-plaid-gold" />
                </View>
                <View className="flex-row justify-between">
                    <Text className="text-plaid-navy/40 font-body text-[8px] uppercase">GPT-4o usage: 12%</Text>
                    <Text className="text-plaid-navy/40 font-body text-[8px] uppercase">GPT-4o-mini: 88%</Text>
                </View>
            </View>

            {/* Proxy & Bot Health */}
            <View className="bg-white rounded-[30px] p-8 shadow-sm mb-6 border border-plaid-navy/5">
                <View className="flex-row justify-between mb-6">
                    <View className="w-[45%]">
                        <View className="flex-row items-center mb-2">
                            <Globe size={14} color={THEME.colors.navy} />
                            <Text className="text-plaid-navy/40 font-header text-[8px] uppercase tracking-widest ml-2">Proxy Data</Text>
                        </View>
                        <Text className="text-plaid-navy font-header text-lg">{metrics.proxyDataGB.toFixed(2)} GB</Text>
                    </View>
                    <View className="w-[45%]">
                        <View className="flex-row items-center mb-2">
                            <Lock size={14} color={THEME.colors.rose} />
                            <Text className="text-plaid-navy/40 font-header text-[8px] uppercase tracking-widest ml-2">Captcha RR</Text>
                        </View>
                        <Text className={`font-header text-lg ${metrics.captchaSuccessRate < 0.9 ? 'text-plaid-rose' : 'text-plaid-teal'}`}>
                            {(metrics.captchaSuccessRate * 100).toFixed(1)}%
                        </Text>
                    </View>
                </View>

                {metrics.zombieCount > 0 && (
                    <View className="bg-plaid-rose/10 p-3 rounded-xl flex-row items-center mt-2 border border-plaid-rose/20">
                        <AlertCircle size={14} color={THEME.colors.rose} />
                        <Text className="text-plaid-rose font-header text-[10px] ml-2">CRITICAL: {metrics.zombieCount} Zombie Headless Sessions Detected</Text>
                    </View>
                )}
            </View>

            <Text className="text-plaid-gold font-header text-[10px] uppercase tracking-[3px] mb-6">Infrastructure Safety Toggles</Text>
            <View className="bg-white rounded-[30px] p-6 mb-20 border border-plaid-navy/5">
                {[
                    { label: 'Pivot Debouncing', desc: 'Ignore < 30m attraction closures.', toggle: true },
                    { label: 'Bot Heartbeat Check', desc: 'Auto-kill unresponsive headless sessions.', toggle: true },
                    { label: 'Proxy IP Rotation', desc: 'Automatic rotation on 10% challenge spike.', toggle: true },
                    { label: 'Dormancy Protocol', desc: 'Pause long-term bots after 14d inactivity.', toggle: false },
                ].map((item, i) => (
                    <View key={i} className={`flex-row items-center justify-between py-4 ${i !== 3 ? 'border-b border-plaid-navy/5' : ''}`}>
                        <View className="flex-1 mr-4">
                            <Text className="text-plaid-navy font-header text-sm">{item.label}</Text>
                            <Text className="text-plaid-navy/40 font-body text-[8px] uppercase">{item.desc}</Text>
                        </View>
                        <Switch
                            value={item.toggle}
                            trackColor={{ false: '#12232E11', true: '#12232E' }}
                        />
                    </View>
                ))}
            </View>
        </ScrollView>
    );

    const renderLabTab = () => (
        <ScrollView className="flex-1 px-8" showsVerticalScrollIndicator={false}>
            <Text className="text-plaid-gold font-header text-[10px] uppercase tracking-[3px] mb-6">Strategy Prototyping Lab</Text>

            {/* Scenario Simulator */}
            <View className="bg-white rounded-[30px] p-8 shadow-sm mb-8 border border-plaid-navy/5">
                <View className="flex-row items-center mb-6">
                    <Beaker size={20} color={THEME.colors.gold} />
                    <Text className="text-plaid-navy font-header text-lg ml-3">Scenario Simulator</Text>
                </View>

                <View className="mb-6">
                    <Text className="text-plaid-navy/40 font-header text-[8px] uppercase tracking-widest mb-2">Park Event Disruption</Text>
                    <View className="bg-plaid-navy/5 p-4 rounded-2xl border border-plaid-navy/5">
                        <Text className="text-plaid-navy font-body text-sm">{simScenario}</Text>
                    </View>
                </View>

                <View className="mb-8">
                    <Text className="text-plaid-navy/40 font-header text-[8px] uppercase tracking-widest mb-2">Testing Profile Tier</Text>
                    <View className="flex-row space-x-2">
                        {['The Commando', 'The Chill Splurger', 'Magic Skipper'].map(p => (
                            <TouchableOpacity
                                key={p}
                                onPress={() => setSimProfile(p)}
                                className={`px-4 py-2 rounded-xl border ${simProfile === p ? 'bg-plaid-navy border-plaid-navy' : 'bg-transparent border-plaid-navy/10'}`}
                            >
                                <Text className={`font-header text-[8px] uppercase ${simProfile === p ? 'text-white' : 'text-plaid-navy/60'}`}>{p}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                <TouchableOpacity
                    onPress={runSimulation}
                    disabled={isSimulating}
                    className="bg-plaid-gold p-4 rounded-2xl items-center shadow-lg"
                >
                    <Text className="text-white font-header text-sm uppercase tracking-widest">
                        {isSimulating ? 'Calibrating Reasoning...' : 'Run Simulation'}
                    </Text>
                </TouchableOpacity>

                {simResult && (
                    <View className="mt-8 bg-plaid-gold/10 p-5 rounded-[25px] border border-plaid-gold/20">
                        <Text className="text-plaid-gold font-header text-[10px] uppercase tracking-widest mb-3">AI Reasoning Trace (Rationale)</Text>
                        <Text className="text-plaid-navy font-body text-xs italic leading-5">"{simResult}"</Text>
                    </View>
                )}
            </View>

            {/* Audit Log */}
            <Text className="text-plaid-gold font-header text-[10px] uppercase tracking-[3px] mb-6">Booking Audit & Pivot Log</Text>
            {audits.map((a, i) => (
                <View key={i} className="bg-white p-6 rounded-[30px] mb-4 border border-plaid-navy/5">
                    <View className="flex-row justify-between items-start mb-4">
                        <View>
                            <Text className="text-plaid-navy font-header text-sm">{a.scenario}</Text>
                            <Text className="text-plaid-navy/40 font-body text-[8px] uppercase">{a.profile} Preset</Text>
                        </View>
                        <View className="bg-plaid-teal/10 px-2 py-1 rounded-lg">
                            <Text className="text-plaid-teal font-header text-[8px] uppercase">Verified</Text>
                        </View>
                    </View>
                    <Text className="text-plaid-navy/60 font-body text-[10px] leading-4 mb-4">{a.reasoning}</Text>
                    <View className="flex-row items-center justify-between opacity-40">
                        <View className="flex-row items-center">
                            <ClipboardList size={10} color={THEME.colors.navy} />
                            <Text className="text-[7px] font-header uppercase ml-1.5">Trace-ID: {a.id}</Text>
                        </View>
                        <Text className="text-[7px] font-header uppercase">Checked: {new Date(a.timestamp).toLocaleTimeString()}</Text>
                    </View>
                </View>
            ))}

            <View style={{ height: 100 }} />
        </ScrollView>
    );

    const renderOutcomesTab = () => (
        <ScrollView className="flex-1 px-8" showsVerticalScrollIndicator={false}>
            <Text className="text-plaid-gold font-header text-[10px] uppercase tracking-[3px] mb-6">User Outcome Metrics</Text>
            
            <View className="flex-row justify-between mb-8">
                <View className="bg-white p-6 rounded-[30px] w-[48%] border border-plaid-navy/5 shadow-sm">
                    <Text className="text-plaid-navy/40 font-header text-[8px] uppercase tracking-[2px] mb-2">Acceptance Rate</Text>
                    <Text className="text-plaid-teal font-header text-2xl">{(stats.acceptanceRate * 100).toFixed(0)}%</Text>
                    <Text className="text-plaid-navy/40 font-body text-[8px] mt-1">Nudges Acted On</Text>
                </View>
                <View className="bg-white p-6 rounded-[30px] w-[48%] border border-plaid-navy/5 shadow-sm">
                    <Text className="text-plaid-navy/40 font-header text-[8px] uppercase tracking-[2px] mb-2">Avg Time Saved</Text>
                    <Text className="text-plaid-gold font-header text-2xl">{stats.timeSaved}m</Text>
                    <Text className="text-plaid-navy/40 font-body text-[8px] mt-1">Per Active Session</Text>
                </View>
            </View>

            {/* Satisfaction Ticker */}
            <Text className="text-plaid-gold font-header text-[10px] uppercase tracking-[3px] mb-6">Real-Time Satisfaction</Text>
            {[
                { user: 'Sarah L.', trip: 'Magic Kingdom Day 2', comment: 'Magic Pivot saved our fireworks spot!', score: 5 },
                { user: 'Mike T.', trip: 'Epcot Strategy', comment: 'Genie+ auto-booking was seamless.', score: 5 },
                { user: 'Jess R.', trip: 'Hollywood Studios', comment: 'Alert for Slinky Dog was 3m late.', score: -1 }
            ].map((feedback, i) => (
                <View key={i} className="bg-white p-6 rounded-[30px] mb-4 border border-plaid-navy/5">
                    <View className="flex-row justify-between items-center mb-2">
                        <Text className="text-plaid-navy font-header text-xs">{feedback.user}</Text>
                        <View className={`px-2 py-[2px] rounded-lg ${feedback.score > 0 ? 'bg-plaid-teal/10' : 'bg-plaid-rose/10'}`}>
                            <Text className={`font-header text-[8px] ${feedback.score > 0 ? 'text-plaid-teal' : 'text-plaid-rose'}`}>
                                {feedback.score > 0 ? '👍 Positive' : '👎 Friction'}
                            </Text>
                        </View>
                    </View>
                    <Text className="text-plaid-navy/60 font-body text-[10px] mb-1">"{feedback.comment}"</Text>
                    <Text className="text-plaid-navy/30 font-header text-[7px] uppercase">{feedback.trip}</Text>
                </View>
            ))}
            <View style={{ height: 100 }} />
        </ScrollView>
    );

    const renderTacticalTab = () => (
        <ScrollView className="flex-1 px-8" showsVerticalScrollIndicator={false}>
            <Text className="text-plaid-gold font-header text-[10px] uppercase tracking-[3px] mb-6">Tactical Overrides</Text>
            
            <TouchableOpacity 
                onPress={() => alert('Global Identity Flush: 45 Bot Sessions Purged')}
                className="bg-plaid-rose p-8 rounded-[35px] items-center mb-8 shadow-xl"
            >
                <AlertTriangle size={32} color="white" />
                <Text className="text-white font-header text-lg mt-4 uppercase tracking-[2px]">Global Identity Flush</Text>
                <Text className="text-white/60 font-body text-[10px] mt-2 text-center px-4">PURGE ALL BOT SESSIONS. Force fresh residential IP allocation and identity rotation.</Text>
            </TouchableOpacity>

            <View className="bg-white p-8 rounded-[35px] border border-plaid-navy/5 shadow-sm mb-8">
                <Text className="text-plaid-navy font-header text-sm mb-6">High-Priority Guardian Hijack</Text>
                {[
                    { user: 'VIP #428 (Annual)', task: 'Slinky Dog Dash Hunt', status: 'Failed 2x' },
                    { user: 'New Trip #901', task: 'Magic Pivot Calibration', status: 'Conflict' }
                ].map((item, i) => (
                    <View key={i} className={`flex-row items-center justify-between py-4 ${i !== 1 ? 'border-b border-plaid-navy/5' : ''}`}>
                        <View>
                            <Text className="text-plaid-navy font-header text-xs">{item.user}</Text>
                            <Text className="text-plaid-navy/40 font-body text-[8px] uppercase">{item.task}</Text>
                        </View>
                        <TouchableOpacity className="bg-plaid-gold/10 px-4 py-2 rounded-xl">
                            <Text className="text-plaid-gold font-header text-[8px] uppercase tracking-widest">Hijack Bot</Text>
                        </TouchableOpacity>
                    </View>
                ))}
            </View>

            <View style={{ height: 100 }} />
        </ScrollView>
    );

    const renderUsersTab = () => (
        <View className="flex-1 px-8">
            <View className="bg-white rounded-2xl flex-row items-center px-4 py-3 mb-6 border border-plaid-navy/5">
                <Search size={18} color="#12232E44" />
                <Text className="text-plaid-navy/20 font-body text-sm ml-3">Search users by name or email...</Text>
            </View>
            <FlatList
                data={users}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View className="bg-white p-5 rounded-[25px] mb-4 border border-plaid-navy/5 flex-row items-center justify-between">
                        <View>
                            <Text className="text-plaid-navy font-header text-sm">{item.name}</Text>
                            <Text className="text-plaid-navy/40 font-body text-[10px]">{item.email}</Text>
                            <View className="flex-row items-center mt-2">
                                <View className={`px-2 py-[2px] rounded-full mr-2 ${item.status === 'Active' ? 'bg-plaid-teal/10' : 'bg-plaid-rose/10'}`}>
                                    <Text className={`text-[8px] font-header uppercase ${item.status === 'Active' ? 'text-plaid-teal' : 'text-plaid-rose'}`}>{item.status}</Text>
                                </View>
                                <Text className="text-plaid-navy/40 font-body text-[8px] uppercase tracking-tighter">Plan: {item.membership}</Text>
                            </View>
                        </View>
                        <TouchableOpacity className="bg-plaid-navy/5 px-4 py-2 rounded-xl">
                            <Text className="text-plaid-navy font-header text-[10px] uppercase tracking-widest">Manage</Text>
                        </TouchableOpacity>
                    </View>
                )}
                showsVerticalScrollIndicator={false}
                ListFooterComponent={<View style={{ height: 100 }} />}
            />
        </View>
    );

    const renderBillingTab = () => (
        <View className="flex-1 px-8">
            <View className="bg-plaid-navy p-6 rounded-[30px] mb-8 shadow-xl">
                <Text className="text-plaid-gold font-header text-[10px] uppercase tracking-[4px] mb-2">Total Monthly Revenue</Text>
                <View className="flex-row items-center">
                    <DollarSign size={24} color="#D4AF37" />
                    <Text className="text-white font-header text-3xl ml-1">14,284.50</Text>
                </View>
                <View className="h-[2px] bg-white/10 my-4" />
                <View className="flex-row justify-between">
                    <View>
                        <Text className="text-white/40 font-body text-[8px] uppercase">Active Subs</Text>
                        <Text className="text-white font-header text-lg">1,242</Text>
                    </View>
                    <View>
                        <Text className="text-white/40 font-body text-[8px] uppercase">Avg Trip Value</Text>
                        <Text className="text-white font-header text-lg">$22.40</Text>
                    </View>
                </View>
            </View>

            <Text className="text-plaid-gold font-header text-[10px] uppercase tracking-[3px] mb-6">Recent Transactions</Text>
            <FlatList
                data={transactions}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View className="bg-white p-5 rounded-[25px] mb-4 border border-plaid-navy/5 flex-row items-center justify-between">
                        <View className="flex-1">
                            <Text className="text-plaid-navy font-header text-sm">{item.userName}</Text>
                            <Text className="text-plaid-navy/40 font-body text-[8px] uppercase">{item.id} • {new Date(item.timestamp).toLocaleDateString()}</Text>
                            <View className="flex-row items-center mt-2">
                                <Text className={`text-[10px] font-header ${item.status === 'Refunded' ? 'text-plaid-rose decoration-line-through' : 'text-plaid-navy'}`}>${item.amount.toFixed(2)}</Text>
                                <View className={`ml-3 px-2 py-[2px] rounded-full ${item.status === 'Successful' ? 'bg-plaid-teal/10' : item.status === 'Pending' ? 'bg-plaid-gold/10' : 'bg-plaid-rose/10'}`}>
                                    <Text className={`text-[8px] font-header uppercase ${item.status === 'Successful' ? 'text-plaid-teal' : item.status === 'Pending' ? 'text-plaid-gold' : 'text-plaid-rose'}`}>{item.status}</Text>
                                </View>
                            </View>
                        </View>
                        {item.status === 'Successful' && (
                            <TouchableOpacity onPress={() => handleRefund(item.id)} className="bg-plaid-rose/5 px-4 py-2 rounded-xl border border-plaid-rose/20">
                                <Text className="text-plaid-rose font-header text-[10px] uppercase tracking-widest">Refund</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                )}
                showsVerticalScrollIndicator={false}
                ListFooterComponent={<View style={{ height: 100 }} />}
            />
        </View>
    );

    return (
        <View className="flex-1 bg-plaid-alabaster">
            {/* Header */}
            <View className="bg-white pt-16 pb-8 px-8 border-b border-plaid-navy/5 shadow-sm">
                <View className="flex-row justify-between items-center mb-8">
                    <TouchableOpacity onPress={onBack}>
                        <ChevronLeft size={24} color="#12232E" />
                    </TouchableOpacity>
                    <Text className="text-plaid-navy font-header text-lg tracking-tight">Command Center</Text>
                    <View className="w-10" /> {/* Spacer */}
                </View>

                <View className="flex-row bg-plaid-navy/5 rounded-2xl p-1">
                    {[
                        { id: 'health', icon: Activity, label: 'Health' },
                        { id: 'outcomes', icon: Navigation2, label: 'Impact' },
                        { id: 'tactical', icon: AlertTriangle, label: 'Tact' },
                        { id: 'lab', icon: Beaker, label: 'Lab' },
                        { id: 'fleet', icon: RefreshCcw, label: 'Fleet' },
                    ].map(tab => (
                        <TouchableOpacity
                            key={tab.id}
                            onPress={() => setActiveTab(tab.id as any)}
                            className={`flex-1 flex-row items-center justify-center py-3 rounded-xl ${activeTab === tab.id ? 'bg-white shadow-md' : ''}`}
                        >
                            <tab.icon size={11} color={activeTab === tab.id ? THEME.colors.gold : THEME.colors.navy + '44'} />
                            <Text className={`ml-1 font-header text-[6px] uppercase tracking-[1px] ${activeTab === tab.id ? 'text-plaid-navy' : 'text-plaid-navy/40'}`}>{tab.label}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>

            {activeTab === 'health' && renderHealthTab()}
            {activeTab === 'outcomes' && renderOutcomesTab()}
            {activeTab === 'tactical' && renderTacticalTab()}
            {activeTab === 'lab' && renderLabTab()}
            {activeTab === 'fleet' && renderFleetTab()}
        </View>
    );
}

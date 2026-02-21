import React, { useState, useEffect } from 'react';
import {
    Zap, Gauge, Leaf, TrendingUp, TrendingDown, Sparkles,
    Truck, Battery, Atom, Fuel, Wrench, Wind,
    BarChart3, Shield, Globe, RefreshCw, ChevronRight
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend } from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import { AnimatedCard, AnimatedNumber, StaggerContainer, StaggerItem, AnimatedButton } from '../components/AnimatedComponents';

const neonCard = {
    background: 'linear-gradient(135deg, rgba(0,255,200,0.03), rgba(0,229,255,0.02), rgba(124,58,237,0.03))',
    borderRadius: '16px', padding: '24px',
    border: '1px solid rgba(0,255,200,0.15)',
    position: 'relative', overflow: 'hidden',
    backdropFilter: 'blur(10px)'
};

const ENERGY_RATES = { road: 8.5, electric: 3.2, antigravity: 1.8 };
const GRAVITY_FACTORS = { road: 1.0, electric: 0.85, antigravity: 0.25 };
const SPEEDS = { road: 60, electric: 75, antigravity: 140 };
const MAINTENANCE_COST_PER_KM = { road: 2.5, electric: 1.5, antigravity: 0.4 };
const CO2_PER_KM = { road: 0.21, electric: 0.05, antigravity: 0 };

const calcEnergyCost = (distance, type) => distance * ENERGY_RATES[type] * GRAVITY_FACTORS[type];
const calcTotalCost = (distance, type) => calcEnergyCost(distance, type) + (distance * MAINTENANCE_COST_PER_KM[type]);
const calcTime = (distance, type) => (distance / SPEEDS[type]).toFixed(1);
const calcCO2 = (distance, type) => (distance * CO2_PER_KM[type]).toFixed(1);

const visionStatements = [
    "By integrating anti-gravity transport systems, fleet operational costs could decrease by 65% while increasing delivery efficiency by 2.3x. This positions the company as a pioneer in sustainable logistics.",
    "Anti-gravity fleet deployment enables 140 km/h cargo transit with zero road infrastructure dependency, reducing last-mile delivery time by 58% and eliminating road maintenance overhead entirely.",
    "Our simulations project that a 50-vehicle anti-gravity fleet would save ₹4.2 crore annually, reduce carbon emissions by 94%, and improve delivery reliability to 99.7% — setting a new industry benchmark.",
    "The transition from diesel to anti-gravity propulsion represents a paradigm shift: zero friction, zero emissions, 2.3x speed increase. Early adopters will capture a projected 340% ROI within 18 months.",
    "Combining AI route optimization with anti-gravity vehicles creates a logistics network that is 73% more efficient, 100% carbon-neutral, and capable of serving previously inaccessible terrain at full speed."
];

const radarData = [
    { metric: 'Speed', road: 40, electric: 55, antigravity: 95 },
    { metric: 'Efficiency', road: 35, electric: 65, antigravity: 92 },
    { metric: 'Sustainability', road: 20, electric: 60, antigravity: 98 },
    { metric: 'Cost', road: 30, electric: 55, antigravity: 88 },
    { metric: 'Reliability', road: 65, electric: 70, antigravity: 90 },
    { metric: 'Innovation', road: 15, electric: 45, antigravity: 99 },
];

const AntiGravity = () => {
    const [distance, setDistance] = useState(500);
    const [fleetSize, setFleetSize] = useState(10);
    const [vision, setVision] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);

    const generateVision = () => {
        setIsGenerating(true);
        setVision('');
        setTimeout(() => {
            const stmt = visionStatements[Math.floor(Math.random() * visionStatements.length)];
            setVision(stmt);
            setIsGenerating(false);
        }, 1500);
    };

    const roadCost = calcTotalCost(distance, 'road');
    const agCost = calcTotalCost(distance, 'antigravity');
    const savings = ((1 - agCost / roadCost) * 100).toFixed(0);
    const annualSavings = (roadCost - agCost) * 365 * fleetSize;
    const carbonSaved = (distance * CO2_PER_KM.road * 365 * fleetSize / 1000).toFixed(1);
    const esgScore = Math.min(98, 45 + Math.round(fleetSize * 2.5 + (distance / 100) * 3));
    const sustainIndex = Math.min(99, 30 + Math.round(fleetSize * 3 + (distance / 50)));

    const comparisonBarData = [
        { metric: 'Energy Cost', road: Math.round(calcEnergyCost(distance, 'road')), electric: Math.round(calcEnergyCost(distance, 'electric')), antigravity: Math.round(calcEnergyCost(distance, 'antigravity')) },
        { metric: 'Maint. Cost', road: Math.round(distance * MAINTENANCE_COST_PER_KM.road), electric: Math.round(distance * MAINTENANCE_COST_PER_KM.electric), antigravity: Math.round(distance * MAINTENANCE_COST_PER_KM.antigravity) },
        { metric: 'Time (min)', road: Math.round(distance / SPEEDS.road * 60), electric: Math.round(distance / SPEEDS.electric * 60), antigravity: Math.round(distance / SPEEDS.antigravity * 60) },
    ];

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                style={{
                    ...neonCard, padding: '32px',
                    background: 'linear-gradient(135deg, rgba(0,255,200,0.1) 0%, rgba(0,0,0,0) 40%, rgba(124,58,237,0.1) 100%)'
                }}
            >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                        <motion.div
                            animate={{ y: [0, -8, 0], rotate: [0, 5, -5, 0] }}
                            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                            style={{
                                width: '56px', height: '56px', borderRadius: '18px',
                                background: 'rgba(0,255,200,0.15)', border: '1px solid rgba(0,255,200,0.3)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                boxShadow: '0 0 20px rgba(0,255,200,0.2)'
                            }}
                        >
                            <Atom size={28} color="#00ffc8" />
                        </motion.div>
                        <div>
                            <h1 style={{ fontSize: '32px', fontWeight: 900, margin: 0, color: '#fff', letterSpacing: '-0.5px' }}>
                                EcoFlux <span style={{ color: '#00ffc8' }}>Quantum</span>
                            </h1>
                            <p style={{ fontSize: '14px', color: '#666', fontWeight: 600, margin: '4px 0 0' }}>Propulsion & Logistics Simulator v4.0</p>
                        </div>
                    </div>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        style={{
                            fontSize: '11px', fontWeight: 800, padding: '8px 16px',
                            borderRadius: '20px', color: '#00ffc8',
                            background: 'rgba(0,255,200,0.1)', border: '1px solid rgba(0,255,200,0.3)',
                            letterSpacing: '1px'
                        }}
                    >
                        ⚡ EXPERIMENTAL ENGINE
                    </motion.div>
                </div>
            </motion.div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                <AnimatedCard style={{ padding: '28px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
                        <Gauge size={20} color="#00ffc8" />
                        <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#fff', margin: 0, textTransform: 'uppercase', letterSpacing: '1px' }}>Simulation Parameters</h3>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                                <label style={{ fontSize: '14px', fontWeight: 700, color: '#aaa' }}>Distance (KM)</label>
                                <span style={{ fontSize: '16px', fontWeight: 800, color: '#00ffc8' }}>{distance} km</span>
                            </div>
                            <input type="range" min="50" max="2000" step="50" value={distance}
                                onChange={e => setDistance(Number(e.target.value))}
                                style={{ width: '100%', accentColor: '#00ffc8', cursor: 'pointer' }} />
                        </div>
                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                                <label style={{ fontSize: '14px', fontWeight: 700, color: '#aaa' }}>Fleet Scale</label>
                                <span style={{ fontSize: '16px', fontWeight: 800, color: '#00ffc8' }}>{fleetSize} units</span>
                            </div>
                            <input type="range" min="1" max="100" step="1" value={fleetSize}
                                onChange={e => setFleetSize(Number(e.target.value))}
                                style={{ width: '100%', accentColor: '#00ffc8', cursor: 'pointer' }} />
                        </div>
                    </div>
                    <div style={{ marginTop: '24px', padding: '16px', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px solid #222' }}>
                        <p style={{ fontSize: '11px', fontWeight: 800, color: '#444', textTransform: 'uppercase', marginBottom: '8px' }}>Quantum Efficiency Formula</p>
                        <code style={{ fontSize: '13px', color: '#00ffc8', fontFamily: 'monospace', fontWeight: 700 }}>
                            Σ (D × R × Gᶠ) / T
                        </code>
                    </div>
                </AnimatedCard>

                <StaggerContainer className="grid grid-cols-2 gap-4" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    {[
                        { label: 'Energy Savings', value: parseInt(savings), suffix: '%', icon: TrendingDown, color: '#00ffc8' },
                        { label: 'Quantum Velocity', value: 140, suffix: ' km/h', icon: Zap, color: '#00e5ff' },
                        { label: 'CO₂ Footprint', value: 0, suffix: ' kg', icon: Leaf, color: '#4ade80' },
                        { label: 'Infrastructure', value: 0, prefix: '₹', icon: Globe, color: '#c084fc' },
                    ].map((s, i) => (
                        <StaggerItem key={i}>
                            <AnimatedCard style={{ padding: '20px', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                <div style={{
                                    width: '36px', height: '36px', borderRadius: '10px',
                                    background: `${s.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    marginBottom: '12px'
                                }}>
                                    <s.icon size={18} color={s.color} />
                                </div>
                                <p style={{ fontSize: '11px', fontWeight: 700, color: '#666', textTransform: 'uppercase', margin: '0 0 4px' }}>{s.label}</p>
                                <h3 style={{ fontSize: '24px', fontWeight: 800, color: s.color, margin: 0 }}>
                                    {s.prefix}<AnimatedNumber value={s.value} />{s.suffix}
                                </h3>
                            </AnimatedCard>
                        </StaggerItem>
                    ))}
                </StaggerContainer>
            </div>

            <AnimatedCard style={{ padding: '32px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
                    {[
                        { label: 'Carbon Saved', value: parseFloat(carbonSaved), suffix: ' t', icon: Wind, color: '#4ade80' },
                        { label: 'Efficiency Index', value: sustainIndex, icon: RefreshCw, color: '#818cf8' },
                        { label: 'Quantum ROI', value: esgScore, suffix: '%', icon: TrendingUp, color: '#00ffc8' },
                        { label: 'Annual Savings', value: annualSavings / 100000, prefix: '₹', suffix: 'L', icon: DollarSign, color: '#fbbf24' },
                    ].map((m, i) => (
                        <div key={i} style={{ textAlign: 'center' }}>
                            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '12px' }}>
                                <div style={{
                                    width: '40px', height: '40px', borderRadius: '50%',
                                    background: `${m.color}10`, border: `1px solid ${m.color}20`,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                                }}>
                                    <m.icon size={20} color={m.color} />
                                </div>
                            </div>
                            <p style={{ fontSize: '11px', fontWeight: 700, color: '#555', textTransform: 'uppercase', marginBottom: '4px' }}>{m.label}</p>
                            <h4 style={{ fontSize: '22px', fontWeight: 900, color: '#fff', margin: 0 }}>
                                {m.prefix}<AnimatedNumber value={m.value} />{m.suffix}
                            </h4>
                        </div>
                    ))}
                </div>
            </AnimatedCard>

            <div style={neonCard}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                    <div>
                        <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#fff', margin: 0 }}>Future Logistics AI Vision</h3>
                        <p style={{ fontSize: '13px', color: '#666', marginTop: '4px' }}>Synthesized from {fleetSize} quantum-linked units</p>
                    </div>
                    <AnimatedButton onClick={generateVision} disabled={isGenerating} variant="primary" style={{ background: 'linear-gradient(135deg, #00ffc8, #00e5ff)', color: '#000', fontWeight: 800 }}>
                        {isGenerating ? <RefreshCw className="animate-spin" size={18} /> : <Sparkles size={18} />}
                        {isGenerating ? 'Synthesizing...' : 'Generate AI Vision'}
                    </AnimatedButton>
                </div>

                <AnimatePresence mode="wait">
                    {vision ? (
                        <motion.div
                            key="vision"
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.98 }}
                            style={{
                                padding: '24px 30px', borderRadius: '14px',
                                background: 'rgba(0,255,200,0.03)', border: '1px solid rgba(0,255,200,0.1)',
                                position: 'relative'
                            }}
                        >
                            <p style={{ fontSize: '17px', lineHeight: 1.8, color: '#eee', fontWeight: 500, fontStyle: 'italic', margin: 0 }}>
                                "{vision}"
                            </p>
                            <div style={{ marginTop: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#00ffc8' }} />
                                <span style={{ fontSize: '12px', color: '#555', fontWeight: 700 }}>ECOFLUX QUANTUM AI</span>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="placeholder"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            style={{
                                padding: '40px', textAlign: 'center', borderRadius: '14px',
                                border: '1px dashed #222', background: 'rgba(255,255,255,0.01)'
                            }}
                        >
                            <p style={{ fontSize: '14px', color: '#444', fontWeight: 600 }}>Click generate to initiate quantum vision synthesis</p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
                {[
                    { type: 'Internal Combustion', icon: Truck, color: '#f87171', efficiency: 15 },
                    { type: 'Electric Platform', icon: Battery, color: '#818cf8', efficiency: 45 },
                    { type: 'Quantum Anti-Gravity', icon: Atom, color: '#00ffc8', efficiency: 98 },
                ].map((t, i) => (
                    <AnimatedCard key={i} style={{ padding: '24px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                            <div style={{
                                width: '40px', height: '40px', borderRadius: '12px',
                                background: `${t.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center'
                            }}>
                                <t.icon size={20} color={t.color} />
                            </div>
                            <h4 style={{ fontSize: '15px', fontWeight: 800, color: '#fff', margin: 0 }}>{t.type}</h4>
                        </div>
                        <div style={{ marginBottom: '16px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                <span style={{ fontSize: '11px', fontWeight: 700, color: '#555' }}>Efficiency Index</span>
                                <span style={{ fontSize: '11px', fontWeight: 800, color: t.color }}>{t.efficiency}%</span>
                            </div>
                            <div style={{ width: '100%', height: '4px', background: '#1a1a1a', borderRadius: '2px', overflow: 'hidden' }}>
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${t.efficiency}%` }}
                                    transition={{ duration: 1.5, delay: 0.5 + (i * 0.2) }}
                                    style={{ height: '100%', background: t.color }}
                                />
                            </div>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            {['Zero Road Wear', 'Frictionless', 'AI Linked'].map((feat, idx) => (
                                <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <ChevronRight size={12} color={t.color} />
                                    <span style={{ fontSize: '12px', color: '#666', fontWeight: 600 }}>{feat}</span>
                                </div>
                            ))}
                        </div>
                    </AnimatedCard>
                ))}
            </div>
        </div>
    );
};

export default AntiGravity;

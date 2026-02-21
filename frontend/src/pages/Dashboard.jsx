import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { LayoutDashboard, Truck, Users, Route, Wrench, BarChart3, Receipt, TrendingUp, AlertTriangle } from 'lucide-react';
import { AnimatedCard, AnimatedNumber, StaggerContainer, StaggerItem } from '../components/AnimatedComponents';
import { motion } from 'framer-motion';

const Dashboard = () => {
    const [stats, setStats] = useState({
        totalVehicles: 0,
        activeDrivers: 0,
        totalTrips: 0,
        totalExpenses: 0,
        monthlyMaintenance: 0
    });
    const [loading, setLoading] = useState(true);

    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const [v, d, t, e] = await Promise.all([
                    axios.get('http://localhost:5000/api/vehicles', { headers }),
                    axios.get('http://localhost:5000/api/drivers', { headers }),
                    axios.get('http://localhost:5000/api/trips', { headers }),
                    axios.get('http://localhost:5000/api/expenses', { headers })
                ]);

                setStats({
                    totalVehicles: v.data.length,
                    activeDrivers: d.data.filter(dr => dr.status === 'On Duty').length,
                    totalTrips: t.data.length,
                    totalExpenses: e.data.reduce((acc, curr) => acc + curr.amount, 0),
                    monthlyMaintenance: e.data.filter(exp => exp.type === 'Maintenance').reduce((acc, curr) => acc + curr.amount, 0)
                });
            } catch (err) { console.error(err); }
            finally { setLoading(false); }
        };
        fetchStats();
    }, []);

    const StatCard = ({ label, value, icon: Icon, color, sub, prefix = '' }) => (
        <AnimatedCard>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <div style={{
                    width: '44px', height: '44px', borderRadius: '12px',
                    background: `${color}10`, display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                    <Icon size={22} color={color} />
                </div>
                <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    style={{ fontSize: '11px', fontWeight: 700, color: '#4ade80' }}
                >+12%</motion.span>
            </div>
            <p style={{ fontSize: '11px', fontWeight: 700, color: '#666', textTransform: 'uppercase', marginBottom: '4px' }}>{label}</p>
            <h3 style={{ fontSize: '28px', fontWeight: 800, color: '#fff', margin: 0 }}>
                {prefix}<AnimatedNumber value={value} />
            </h3>
            <p style={{ fontSize: '12px', color: '#444', marginTop: '6px' }}>{sub}</p>
        </AnimatedCard>
    );

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
            >
                <h1 style={{ fontSize: '26px', fontWeight: 800, color: '#fff', margin: '0 0 6px' }}>Fleet Overview</h1>
                <p style={{ fontSize: '14px', color: '#666', margin: 0 }}>Projected performance for {new Date().toLocaleString('en-US', { month: 'long' })}</p>
            </motion.div>

            <StaggerContainer>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(1, 1fr) md:repeat(2, 1fr) lg:repeat(4, 1fr)', gridAutoFlow: 'column', gap: '20px' }}>
                    <StaggerItem><StatCard label="Total Vehicles" value={stats.totalVehicles} icon={Truck} color="#4f46e5" sub="Units in fleet" /></StaggerItem>
                    <StaggerItem><StatCard label="Active Drivers" value={stats.activeDrivers} icon={Users} color="#4ade80" sub="Currently on duty" /></StaggerItem>
                    <StaggerItem><StatCard label="Monthly Trips" value={stats.totalTrips} icon={Route} color="#fbbf24" sub="Deliveries completed" /></StaggerItem>
                    <StaggerItem><StatCard label="Monthly Spend" value={(stats.totalExpenses / 1000).toFixed(1)} prefix="₹" icon={Receipt} color="#f87171" sub="Operations cost" /></StaggerItem>
                </div>
            </StaggerContainer>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
                <AnimatedCard style={{ padding: '32px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
                        <div>
                            <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#fff' }}>Fuel Consumption</h3>
                            <p style={{ fontSize: '13px', color: '#555' }}>Avg liters per km across fleet</p>
                        </div>
                        <TrendingUp color="#4ade80" size={20} />
                    </div>
                    <div style={{ height: '200px', background: 'linear-gradient(to top, rgba(79,70,229,0.05), transparent)', borderRadius: '12px', border: '1px dashed #222', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <p style={{ fontSize: '14px', color: '#333' }}>Visual analytics under construction</p>
                    </div>
                </AnimatedCard>

                <AnimatedCard style={{ padding: '32px' }}>
                    <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#fff', marginBottom: '16px' }}>Alerts</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <motion.div
                            whileHover={{ x: 5 }}
                            style={{ display: 'flex', gap: '12px', padding: '16px', background: 'rgba(251,191,36,0.05)', borderRadius: '12px', border: '1px solid rgba(251,191,36,0.1)' }}
                        >
                            <AlertTriangle size={18} color="#fbbf24" />
                            <div>
                                <p style={{ fontSize: '13px', fontWeight: 700, color: '#fbbf24', margin: '0 0 2px' }}>Service Due</p>
                                <p style={{ fontSize: '12px', color: '#888', margin: 0 }}>Vehicle UP65-AH-2009 requires oil change</p>
                            </div>
                        </motion.div>
                        <motion.div
                            whileHover={{ x: 5 }}
                            style={{ display: 'flex', gap: '12px', padding: '16px', background: 'rgba(248,113,113,0.05)', borderRadius: '12px', border: '1px solid rgba(248,113,113,0.1)' }}
                        >
                            <AlertTriangle size={18} color="#f87171" />
                            <div>
                                <p style={{ fontSize: '13px', fontWeight: 700, color: '#f87171', margin: '0 0 2px' }}>Overdue Trip</p>
                                <p style={{ fontSize: '12px', color: '#888', margin: 0 }}>TR-1002 is delayed by 4 hours</p>
                            </div>
                        </motion.div>
                    </div>
                </AnimatedCard>
            </div>
        </div>
    );
};

export default Dashboard;

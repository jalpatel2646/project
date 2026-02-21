import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Truck, Search, Plus, MapPin, Gauge, X, Bus, Car, CarFront, Container, Caravan, Trash2 } from 'lucide-react';
import { useConfirm, useToast } from '../context/ConfirmContext';
import { AnimatedCard, StaggerContainer, StaggerItem, AnimatedButton } from '../components/AnimatedComponents';
import { motion, AnimatePresence } from 'framer-motion';

const Vehicles = () => {
    const [vehicles, setVehicles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [form, setForm] = useState({ licensePlate: '', model: '', transportType: 'Road (Diesel)', type: 'Truck', maxLoadCapacity: '', odometer: '0', status: 'Available', region: '' });

    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };
    const confirm = useConfirm();
    const toast = useToast();

    const fetchVehicles = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/vehicles', { headers });
            setVehicles(res.data);
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
    };

    useEffect(() => { fetchVehicles(); }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/api/vehicles', { ...form, maxLoadCapacity: Number(form.maxLoadCapacity), odometer: Number(form.odometer) }, { headers });
            setShowModal(false);
            setForm({ licensePlate: '', model: '', transportType: 'Road (Diesel)', type: 'Truck', maxLoadCapacity: '', odometer: '0', status: 'Available', region: '' });
            fetchVehicles();
            toast('Vehicle added successfully', 'success');
        } catch (e) { toast(e.response?.data?.error || 'Failed to add vehicle', 'error'); }
    };

    const statusColors = {
        'Available': { bg: 'rgba(74,222,128,0.1)', color: '#4ade80', border: 'rgba(74,222,128,0.2)' },
        'On Trip': { bg: 'rgba(129,140,248,0.1)', color: '#818cf8', border: 'rgba(129,140,248,0.2)' },
        'In Shop': { bg: 'rgba(251,191,36,0.1)', color: '#fbbf24', border: 'rgba(251,191,36,0.2)' },
        'Out of Service': { bg: 'rgba(248,113,113,0.1)', color: '#f87171', border: 'rgba(248,113,113,0.2)' },
    };

    const getTypeIcon = (type) => {
        switch (type) {
            case 'Bus': return Bus;
            case 'Car': return Car;
            case 'Van': return CarFront;
            case 'Trailer': return Caravan;
            case 'Container': return Container;
            default: return Truck;
        }
    };

    const filtered = vehicles.filter(v => {
        const matchSearch = v.licensePlate.toLowerCase().includes(filter.toLowerCase()) || v.model.toLowerCase().includes(filter.toLowerCase());
        return matchSearch;
    });

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                    <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#fff', margin: '0 0 4px' }}>Vehicle Fleet</h1>
                    <p style={{ fontSize: '14px', color: '#666', margin: 0 }}>{vehicles.length} units active</p>
                </motion.div>
                <AnimatedButton onClick={() => setShowModal(true)} variant="primary">
                    <Plus size={16} /> Add Vehicle
                </AnimatedButton>
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
                <div style={{ position: 'relative', flex: 1, maxWidth: '360px' }}>
                    <Search size={18} color="#555" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                    <input type="text" placeholder="Search license plate, model..." value={filter} onChange={e => setFilter(e.target.value)}
                        style={{ width: '100%', padding: '10px 14px 10px 44px', fontSize: '14px', border: '2px solid #222', borderRadius: '12px', outline: 'none', background: '#141414', color: '#eee' }} />
                </div>
            </div>

            <StaggerContainer>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
                    <AnimatePresence>
                        {filtered.map(v => {
                            const st = statusColors[v.status] || statusColors.Available;
                            return (
                                <StaggerItem key={v._id}>
                                    <AnimatedCard>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '18px' }}>
                                            <motion.img
                                                whileHover={{ scale: 1.1, rotate: 5 }}
                                                src={`https://api.dicebear.com/7.x/shapes/svg?seed=${encodeURIComponent(v.licensePlate)}`}
                                                alt={v.licensePlate}
                                                style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(79,70,229,0.15)', padding: '6px' }}
                                            />
                                            <span style={{
                                                fontSize: '11px', fontWeight: 700, padding: '4px 10px', borderRadius: '8px',
                                                textTransform: 'uppercase', background: st.bg, color: st.color, border: `1px solid ${st.border}`
                                            }}>{v.status}</span>
                                        </div>

                                        <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#fff', margin: '0 0 4px', letterSpacing: '1px' }}>{v.licensePlate}</h3>
                                        <p style={{ fontSize: '13px', color: '#777', margin: '0 0 18px' }}>{v.model} • {v.type}</p>

                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', paddingTop: '16px', borderTop: '1px solid #1e1e1e' }}>
                                            <div>
                                                <p style={{ fontSize: '10px', color: '#666', margin: 0, fontWeight: 600 }}>CAPACITY</p>
                                                <p style={{ fontSize: '13px', color: '#ddd', margin: 0, fontWeight: 700 }}>{v.maxLoadCapacity}kg</p>
                                            </div>
                                            <div>
                                                <p style={{ fontSize: '10px', color: '#666', margin: 0, fontWeight: 600 }}>REGION</p>
                                                <p style={{ fontSize: '13px', color: '#ddd', margin: 0, fontWeight: 700 }}>{v.region || 'National'}</p>
                                            </div>
                                        </div>

                                        <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '16px' }}>
                                            <motion.button
                                                whileHover={{ scale: 1.1, background: 'rgba(239,68,68,0.2)' }}
                                                whileTap={{ scale: 0.9 }}
                                                onClick={async () => {
                                                    const ok = await confirm({ title: 'Delete Vehicle', message: `Are you sure you want to delete ${v.licensePlate}?` });
                                                    if (!ok) return;
                                                    try {
                                                        await axios.delete(`http://localhost:5000/api/vehicles/${v._id}`, { headers });
                                                        toast('Vehicle deleted', 'success');
                                                        fetchVehicles();
                                                    } catch (e) { toast('Failed to delete', 'error'); }
                                                }} style={{
                                                    background: 'rgba(239,68,68,0.1)', color: '#f87171', border: '1px solid rgba(239,68,68,0.2)',
                                                    borderRadius: '8px', padding: '6px 12px', fontSize: '12px', cursor: 'pointer', transition: 'all 0.2s'
                                                }}><Trash2 size={14} /></motion.button>
                                        </div>
                                    </AnimatedCard>
                                </StaggerItem>
                            );
                        })}
                    </AnimatePresence>
                </div>
            </StaggerContainer>

            {showModal && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, backdropFilter: 'blur(4px)' }}>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        style={{ background: '#141414', borderRadius: '16px', border: '1px solid #1e1e1e', padding: '32px', width: '100%', maxWidth: '500px' }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                            <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#fff' }}>Add Vehicle</h3>
                            <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={20} color="#666" /></button>
                        </div>
                        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <input type="text" placeholder="License Plate" value={form.licensePlate} onChange={e => setForm({ ...form, licensePlate: e.target.value })} required
                                style={{ width: '100%', padding: '12px', background: '#1c1c1c', border: '1px solid #333', borderRadius: '10px', color: '#fff' }} />
                            <input type="text" placeholder="Model" value={form.model} onChange={e => setForm({ ...form, model: e.target.value })} required
                                style={{ width: '100%', padding: '12px', background: '#1c1c1c', border: '1px solid #333', borderRadius: '10px', color: '#fff' }} />
                            <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}
                                style={{ width: '100%', padding: '12px', background: '#1c1c1c', border: '1px solid #333', borderRadius: '10px', color: '#fff', colorScheme: 'dark' }}>
                                {['Truck', 'Bus', 'Car', 'Van', 'Trailer', 'Container'].map(t => <option key={t} value={t}>{t}</option>)}
                            </select>
                            <input type="number" placeholder="Max Load Capacity (kg)" value={form.maxLoadCapacity} onChange={e => setForm({ ...form, maxLoadCapacity: e.target.value })} required
                                style={{ width: '100%', padding: '12px', background: '#1c1c1c', border: '1px solid #333', borderRadius: '10px', color: '#fff' }} />
                            <input type="text" placeholder="Region" value={form.region} onChange={e => setForm({ ...form, region: e.target.value })}
                                style={{ width: '100%', padding: '12px', background: '#1c1c1c', border: '1px solid #333', borderRadius: '10px', color: '#fff' }} />
                            <AnimatedButton type="submit" variant="primary" style={{ width: '100%', padding: '14px' }}>Add Vehicle</AnimatedButton>
                        </form>
                    </motion.div>
                </div>
            )}
        </div>
    );
};

export default Vehicles;

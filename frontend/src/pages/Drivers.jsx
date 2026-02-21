import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, Plus, Phone, Calendar, X, Trash2 } from 'lucide-react';
import { useConfirm, useToast } from '../context/ConfirmContext';
import { AnimatedCard, StaggerContainer, StaggerItem, AnimatedButton } from '../components/AnimatedComponents';
import { motion, AnimatePresence } from 'framer-motion';

const Drivers = () => {
    const [drivers, setDrivers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [form, setForm] = useState({ name: '', licenseNumber: '', licenseExpiryDate: '', phone: '', status: 'Off Duty' });

    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };
    const confirm = useConfirm();
    const toast = useToast();

    const fetchDrivers = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/drivers', { headers });
            setDrivers(res.data);
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
    };

    useEffect(() => { fetchDrivers(); }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/api/drivers', form, { headers });
            setShowModal(false);
            setForm({ name: '', licenseNumber: '', licenseExpiryDate: '', phone: '', status: 'Off Duty' });
            fetchDrivers();
            toast('Driver added successfully', 'success');
        } catch (e) { toast('Failed to add driver', 'error'); }
    };

    const filtered = drivers.filter(d => d.name.toLowerCase().includes(filter.toLowerCase()));

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                    <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#fff' }}>Driver Directory</h1>
                    <p style={{ fontSize: '14px', color: '#666' }}>{drivers.length} operators assigned</p>
                </motion.div>
                <AnimatedButton onClick={() => setShowModal(true)} variant="primary">
                    <Plus size={16} /> Add Driver
                </AnimatedButton>
            </div>

            <div style={{ position: 'relative', maxWidth: '360px' }}>
                <Search size={18} color="#555" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                <input type="text" placeholder="Search by name..." value={filter} onChange={e => setFilter(e.target.value)}
                    style={{ width: '100%', padding: '10px 14px 10px 44px', fontSize: '14px', border: '2px solid #222', borderRadius: '12px', outline: 'none', background: '#141414', color: '#eee' }} />
            </div>

            <StaggerContainer>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
                    <AnimatePresence>
                        {filtered.map(d => (
                            <StaggerItem key={d._id}>
                                <AnimatedCard>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '20px' }}>
                                        <motion.img
                                            whileHover={{ scale: 1.1 }}
                                            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(d.name)}`}
                                            alt={d.name}
                                            style={{ width: '48px', height: '48px', borderRadius: '12px', border: '2px solid #7c3aed' }}
                                        />
                                        <div>
                                            <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#fff', margin: 0 }}>{d.name}</h3>
                                            <p style={{ fontSize: '12px', color: '#555' }}>ID: {d.licenseNumber}</p>
                                        </div>
                                    </div>

                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            <Phone size={14} color="#555" />
                                            <span style={{ fontSize: '13px', color: '#888' }}>{d.phone}</span>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            <Calendar size={14} color="#555" />
                                            <span style={{ fontSize: '13px', color: '#888' }}>Exp: {new Date(d.licenseExpiryDate).toLocaleDateString()}</span>
                                        </div>
                                    </div>

                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px', paddingTop: '16px', borderTop: '1px solid #1e1e1e' }}>
                                        <span style={{
                                            fontSize: '10px', fontWeight: 700, padding: '4px 8px', borderRadius: '6px',
                                            background: d.status === 'On Duty' ? 'rgba(74,222,128,0.1)' : 'rgba(102,102,102,0.1)',
                                            color: d.status === 'On Duty' ? '#4ade80' : '#666'
                                        }}>{d.status}</span>
                                        <motion.button
                                            whileHover={{ scale: 1.1, color: '#ef4444' }}
                                            whileTap={{ scale: 0.9 }}
                                            onClick={async () => {
                                                const ok = await confirm({ title: 'Delete Driver', message: `Delete ${d.name}?` });
                                                if (ok) {
                                                    try {
                                                        await axios.delete(`http://localhost:5000/api/drivers/${d._id}`, { headers });
                                                        toast('Driver removed', 'success');
                                                        fetchDrivers();
                                                    } catch (e) { toast('Failed to delete', 'error'); }
                                                }
                                            }}
                                            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#f87171', transition: 'color 0.2s' }}
                                        >
                                            <Trash2 size={16} />
                                        </motion.button>
                                    </div>
                                </AnimatedCard>
                            </StaggerItem>
                        ))}
                    </AnimatePresence>
                </div>
            </StaggerContainer>

            {showModal && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, backdropFilter: 'blur(8px)' }}>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        style={{ background: '#141414', borderRadius: '16px', border: '1px solid #1e1e1e', padding: '32px', width: '100%', maxWidth: '450px' }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                            <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#fff' }}>Add Driver</h3>
                            <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={20} color="#666" /></button>
                        </div>
                        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <input type="text" placeholder="Full Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required
                                style={{ width: '100%', padding: '12px', background: '#1c1c1c', border: '1px solid #333', borderRadius: '10px', color: '#fff' }} />
                            <input type="text" placeholder="License Number" value={form.licenseNumber} onChange={e => setForm({ ...form, licenseNumber: e.target.value })} required
                                style={{ width: '100%', padding: '12px', background: '#1c1c1c', border: '1px solid #333', borderRadius: '10px', color: '#fff' }} />
                            <input type="date" placeholder="Expiry Date" value={form.licenseExpiryDate} onChange={e => setForm({ ...form, licenseExpiryDate: e.target.value })} required
                                style={{ width: '100%', padding: '12px', background: '#1c1c1c', border: '1px solid #333', borderRadius: '10px', color: '#fff', colorScheme: 'dark' }} />
                            <input type="text" placeholder="Phone" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} required
                                style={{ width: '100%', padding: '12px', background: '#1c1c1c', border: '1px solid #333', borderRadius: '10px', color: '#fff' }} />
                            <AnimatedButton type="submit" variant="primary" style={{ width: '100%', padding: '14px' }}>Add Driver</AnimatedButton>
                        </form>
                    </motion.div>
                </div>
            )}
        </div>
    );
};

export default Drivers;

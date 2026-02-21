import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Route as RouteIcon, Plus, Search, MapPin, Truck, Trash2, X, Clock } from 'lucide-react';
import { useConfirm, useToast } from '../context/ConfirmContext';
import { AnimatedTable, AnimatedButton, StaggerContainer, StaggerItem } from '../components/AnimatedComponents';
import { motion, AnimatePresence } from 'framer-motion';

const Trips = () => {
    const [trips, setTrips] = useState([]);
    const [vehicles, setVehicles] = useState([]);
    const [drivers, setDrivers] = useState([]);
    const [search, setSearch] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [form, setForm] = useState({ tripId: '', vehicle: '', driver: '', origin: '', destination: '', cargoWeight: '', status: 'Draft' });

    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };
    const confirm = useConfirm();
    const toast = useToast();

    const loadData = async () => {
        try {
            const [t, v, d] = await Promise.all([
                axios.get('http://localhost:5000/api/trips', { headers }),
                axios.get('http://localhost:5000/api/vehicles', { headers }),
                axios.get('http://localhost:5000/api/drivers', { headers })
            ]);
            setTrips(t.data);
            setVehicles(v.data);
            setDrivers(d.data);
        } catch (e) { console.error(e); }
    };

    useEffect(() => { loadData(); }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/api/trips', { ...form, cargoWeight: Number(form.cargoWeight), dispatchDate: new Date() }, { headers });
            setShowModal(false);
            setForm({ tripId: '', vehicle: '', driver: '', origin: '', destination: '', cargoWeight: '', status: 'Draft' });
            loadData();
            toast('Trip created successfully', 'success');
        } catch (e) { toast('Failed to create trip', 'error'); }
    };

    const filtered = trips.filter(t => t.tripId.toLowerCase().includes(search.toLowerCase()) || t.origin.toLowerCase().includes(search.toLowerCase()));

    const columns = [
        { header: 'Trip ID', accessor: 'tripId', render: (val) => <span style={{ fontWeight: 700, color: '#818cf8' }}>{val}</span> },
        {
            header: 'Vehicle', accessor: 'vehicle', render: (val) => (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Truck size={14} color="#555" />
                    <span style={{ fontSize: '13px', color: '#eee' }}>{val?.licensePlate || 'N/A'}</span>
                </div>
            )
        },
        {
            header: 'Route', accessor: 'route', render: (_, t) => (
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <MapPin size={13} color="#4ade80" />
                    <span style={{ fontSize: '12px', color: '#aaa' }}>{t.origin} → {t.destination}</span>
                </div>
            )
        },
        {
            header: 'Status', accessor: 'status', render: (val) => (
                <span style={{
                    fontSize: '10px', fontWeight: 700, padding: '4px 10px', borderRadius: '8px',
                    background: val === 'Completed' ? 'rgba(74,222,128,0.1)' : 'rgba(251,191,36,0.1)',
                    color: val === 'Completed' ? '#4ade80' : '#fbbf24'
                }}>{val}</span>
            )
        },
        {
            header: 'Date', accessor: 'dispatchDate', render: (val) => (
                <span style={{ fontSize: '12px', color: '#555' }}>{new Date(val).toLocaleDateString()}</span>
            )
        },
        {
            header: '', accessor: 'actions', render: (_, t) => (
                <motion.button
                    whileHover={{ scale: 1.1, color: '#ef4444' }}
                    whileTap={{ scale: 0.9 }}
                    onClick={async () => {
                        const ok = await confirm({ title: 'Delete Trip', message: `Delete ${t.tripId}?` });
                        if (ok) {
                            try {
                                await axios.delete(`http://localhost:5000/api/trips/${t._id}`, { headers });
                                toast('Trip deleted', 'success');
                                loadData();
                            } catch (e) { toast('Failed to delete', 'error'); }
                        }
                    }}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#f87171' }}
                >
                    <Trash2 size={16} />
                </motion.button>
            )
        }
    ];

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                    <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#fff' }}>Trip Logistics</h1>
                    <p style={{ fontSize: '14px', color: '#666' }}>{trips.length} movements in log</p>
                </motion.div>
                <AnimatedButton onClick={() => setShowModal(true)} variant="primary">
                    <Plus size={16} /> New Trip
                </AnimatedButton>
            </div>

            <div style={{ background: '#141414', borderRadius: '16px', border: '1px solid #1e1e1e', overflow: 'hidden' }}>
                <div style={{ padding: '24px', borderBottom: '1px solid #1e1e1e', display: 'flex', justifyContent: 'space-between' }}>
                    <div style={{ position: 'relative', width: '100%', maxWidth: '300px' }}>
                        <Search size={16} color="#555" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                        <input type="text" placeholder="Search trips..." value={search} onChange={e => setSearch(e.target.value)}
                            style={{ width: '100%', padding: '8px 12px 8px 36px', background: '#0a0a0a', border: '1px solid #222', borderRadius: '10px', color: '#eee', fontSize: '13px', outline: 'none' }} />
                    </div>
                </div>
                <AnimatedTable columns={columns} data={filtered} />
            </div>

            <AnimatePresence>
                {showModal && (
                    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, backdropFilter: 'blur(8px)' }}>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            style={{ background: '#141414', border: '1px solid #1e1e1e', padding: '32px', width: '100%', maxWidth: '500px', borderRadius: '16px' }}
                        >
                            <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#fff', marginBottom: '24px' }}>New Trip</h3>
                            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                <input type="text" placeholder="Trip ID (e.g. TR-100)" value={form.tripId} onChange={e => setForm({ ...form, tripId: e.target.value })} required
                                    style={{ width: '100%', padding: '12px', background: '#0a0a0a', border: '1px solid #333', borderRadius: '10px', color: '#fff' }} />
                                <select value={form.vehicle} onChange={e => setForm({ ...form, vehicle: e.target.value })} required
                                    style={{ width: '100%', padding: '12px', background: '#0a0a0a', border: '1px solid #333', borderRadius: '10px', color: '#fff', colorScheme: 'dark' }}>
                                    <option value="">Select Vehicle</option>
                                    {vehicles.map(v => <option key={v._id} value={v._id}>{v.licensePlate}</option>)}
                                </select>
                                <select value={form.driver} onChange={e => setForm({ ...form, driver: e.target.value })} required
                                    style={{ width: '100%', padding: '12px', background: '#0a0a0a', border: '1px solid #333', borderRadius: '10px', color: '#fff', colorScheme: 'dark' }}>
                                    <option value="">Select Driver</option>
                                    {drivers.map(d => <option key={d._id} value={d._id}>{d.name}</option>)}
                                </select>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                    <input type="text" placeholder="Origin" value={form.origin} onChange={e => setForm({ ...form, origin: e.target.value })} required
                                        style={{ width: '100%', padding: '12px', background: '#0a0a0a', border: '1px solid #333', borderRadius: '10px', color: '#fff' }} />
                                    <input type="text" placeholder="Destination" value={form.destination} onChange={e => setForm({ ...form, destination: e.target.value })} required
                                        style={{ width: '100%', padding: '12px', background: '#0a0a0a', border: '1px solid #333', borderRadius: '10px', color: '#fff' }} />
                                </div>
                                <input type="number" placeholder="Cargo Weight (kg)" value={form.cargoWeight} onChange={e => setForm({ ...form, cargoWeight: e.target.value })} required
                                    style={{ width: '100%', padding: '12px', background: '#0a0a0a', border: '1px solid #333', borderRadius: '10px', color: '#fff' }} />
                                <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                                    <button type="button" onClick={() => setShowModal(false)} style={{ flex: 1, padding: '12px', background: '#1a1a1a', color: '#eee', border: '1px solid #333', borderRadius: '12px', cursor: 'pointer' }}>Cancel</button>
                                    <AnimatedButton type="submit" variant="primary" style={{ flex: 1, padding: '12px' }}>Create Trip</AnimatedButton>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Trips;

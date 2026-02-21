import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Wrench, Plus, Trash2, X, Calendar, DollarSign } from 'lucide-react';
import { useConfirm, useToast } from '../context/ConfirmContext';
import { AnimatedCard, AnimatedNumber, AnimatedTable, StaggerContainer, StaggerItem, AnimatedButton } from '../components/AnimatedComponents';
import { motion, AnimatePresence } from 'framer-motion';

const SERVICE_TYPES = ['Oil Change', 'Brake Service', 'Tire Rotation', 'Engine Repair', 'Transmission', 'Battery', 'AC Service', 'General Inspection'];

const Maintenance = () => {
    const [records, setRecords] = useState([]);
    const [vehicles, setVehicles] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [form, setForm] = useState({ vehicle: '', serviceType: '', description: '', date: '', cost: '' });

    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };
    const confirm = useConfirm();
    const toast = useToast();

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const vRes = await axios.get('http://localhost:5000/api/vehicles', { headers });
            setVehicles(vRes.data);
        } catch (e) { console.error('vehicles error:', e); }

        try {
            const mRes = await axios.get('http://localhost:5000/api/maintenance', { headers });
            setRecords(mRes.data);
        } catch (e) { console.error('maintenance error:', e); }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/api/maintenance', { ...form, cost: Number(form.cost) }, { headers });
            setShowModal(false);
            setForm({ vehicle: '', serviceType: '', description: '', date: '', cost: '' });
            loadData();
            toast('Maintenance record added', 'success');
        } catch (e) { console.error(e); toast('Failed to add record', 'error'); }
    };

    const handleDelete = async (id) => {
        const ok = await confirm({ title: 'Delete Maintenance Record', message: 'Are you sure you want to delete this maintenance log? This action cannot be undone.' });
        if (!ok) return;
        try {
            await axios.delete(`http://localhost:5000/api/maintenance/${id}`, { headers });
            toast('Maintenance record deleted successfully', 'success');
            loadData();
        } catch (e) { toast(e.response?.data?.error || 'Failed to delete record', 'error'); }
    };

    const totalCost = records.reduce((s, r) => s + r.cost, 0);

    const columns = [
        {
            header: 'Vehicle', accessor: 'vehicle', render: (val) => (
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{
                        width: '32px', height: '32px', borderRadius: '8px',
                        background: 'rgba(251,191,36,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>
                        <Wrench size={15} color="#fbbf24" />
                    </div>
                    <span style={{ fontSize: '14px', fontWeight: 700, color: '#eee' }}>
                        {val?.licensePlate || 'N/A'}
                    </span>
                </div>
            )
        },
        {
            header: 'Service Type', accessor: 'serviceType', render: (val) => (
                <span style={{ fontSize: '13px', fontWeight: 600, color: '#bbb' }}>{val}</span>
            )
        },
        {
            header: 'Description', accessor: 'description', render: (val) => (
                <span style={{ fontSize: '13px', color: '#888', maxWidth: '280px', display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {val}
                </span>
            )
        },
        {
            header: 'Date', accessor: 'date', render: (val) => (
                <span style={{ fontSize: '13px', fontWeight: 600, color: '#bbb' }}>
                    {new Date(val).toLocaleDateString('en-CA')}
                </span>
            )
        },
        {
            header: 'Cost', accessor: 'cost', align: 'right', render: (val) => (
                <span style={{ fontSize: '14px', fontWeight: 800, color: '#4ade80' }}>
                    ₹{val.toLocaleString()}
                </span>
            )
        },
        {
            header: 'Actions', accessor: 'actions', align: 'center', render: (_, r) => (
                <motion.button
                    whileHover={{ scale: 1.2, color: '#ef4444' }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleDelete(r._id)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '6px' }}
                >
                    <Trash2 size={16} color="#666" />
                </motion.button>
            )
        }
    ];

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                    <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#fff', margin: '0 0 4px' }}>Maintenance Logs</h1>
                    <p style={{ fontSize: '14px', color: '#666', margin: 0 }}>{records.length} service records</p>
                </motion.div>
                <AnimatedButton onClick={() => setShowModal(true)} variant="primary">
                    <Plus size={16} /> Log Service
                </AnimatedButton>
            </div>

            <StaggerContainer>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
                    {[
                        { label: 'Total Records', value: records.length, icon: Wrench, color: '#818cf8' },
                        { label: 'Total Spend', value: totalCost, prefix: '₹', icon: DollarSign, color: '#f87171' },
                        { label: 'Avg Cost', value: records.length > 0 ? totalCost / records.length : 0, prefix: '₹', icon: Calendar, color: '#4ade80' },
                    ].map((s, i) => (
                        <StaggerItem key={i}>
                            <div style={{ background: '#141414', borderRadius: '16px', border: '1px solid #1e1e1e', padding: '20px', display: 'flex', alignItems: 'center', gap: '14px' }}>
                                <div style={{
                                    width: '42px', height: '42px', borderRadius: '12px',
                                    background: `${s.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center'
                                }}>
                                    <s.icon size={20} color={s.color} />
                                </div>
                                <div>
                                    <p style={{ fontSize: '11px', color: '#666', fontWeight: 600, textTransform: 'uppercase', margin: '0 0 2px' }}>{s.label}</p>
                                    <p style={{ fontSize: '20px', fontWeight: 800, color: '#fff', margin: 0 }}>
                                        {s.prefix}<AnimatedNumber value={s.value} />
                                    </p>
                                </div>
                            </div>
                        </StaggerItem>
                    ))}
                </div>
            </StaggerContainer>

            <div style={{ background: '#141414', borderRadius: '16px', border: '1px solid #1e1e1e', overflow: 'hidden' }}>
                <AnimatedTable columns={columns} data={records} />
            </div>

            <AnimatePresence>
                {showModal && (
                    <div style={{
                        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                        background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center',
                        justifyContent: 'center', zIndex: 1000, backdropFilter: 'blur(4px)'
                    }}>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            style={{ background: '#141414', borderRadius: '16px', border: '1px solid #1e1e1e', padding: '32px', width: '100%', maxWidth: '480px' }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                                <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#fff', margin: 0 }}>Log Service</h3>
                                <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                                    <X size={20} color="#666" />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#aaa', marginBottom: '6px' }}>Vehicle</label>
                                    <select value={form.vehicle} onChange={(e) => setForm({ ...form, vehicle: e.target.value })} required
                                        style={{
                                            width: '100%', padding: '11px 14px', fontSize: '14px', color: '#eee',
                                            background: '#1c1c1c', border: '2px solid #2a2a2a', borderRadius: '10px',
                                            outline: 'none', fontFamily: 'inherit', appearance: 'auto', colorScheme: 'dark'
                                        }}>
                                        <option value="" style={{ background: '#1c1c1c', color: '#888' }}>Select vehicle</option>
                                        {vehicles.map(v => <option key={v._id} value={v._id} style={{ background: '#1c1c1c', color: '#eee' }}>{v.licensePlate} — {v.model}</option>)}
                                    </select>
                                </div>

                                <div>
                                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#aaa', marginBottom: '6px' }}>Service Type</label>
                                    <select value={form.serviceType} onChange={(e) => setForm({ ...form, serviceType: e.target.value })} required
                                        style={{
                                            width: '100%', padding: '11px 14px', fontSize: '14px', color: '#eee',
                                            background: '#1c1c1c', border: '2px solid #2a2a2a', borderRadius: '10px',
                                            outline: 'none', fontFamily: 'inherit', appearance: 'auto', colorScheme: 'dark'
                                        }}>
                                        <option value="" style={{ background: '#1c1c1c', color: '#888' }}>Select type</option>
                                        {SERVICE_TYPES.map(t => <option key={t} value={t} style={{ background: '#1c1c1c', color: '#eee' }}>{t}</option>)}
                                    </select>
                                </div>

                                <div>
                                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#aaa', marginBottom: '6px' }}>Description</label>
                                    <input type="text" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required
                                        placeholder="Describe the service"
                                        style={{
                                            width: '100%', padding: '11px 14px', fontSize: '14px', color: '#eee',
                                            background: '#1c1c1c', border: '2px solid #2a2a2a', borderRadius: '10px',
                                            outline: 'none', fontFamily: 'inherit'
                                        }} />
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#aaa', marginBottom: '6px' }}>Date</label>
                                        <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} required
                                            style={{
                                                width: '100%', padding: '11px 14px', fontSize: '14px', color: '#eee',
                                                background: '#1c1c1c', border: '2px solid #2a2a2a', borderRadius: '10px',
                                                outline: 'none', fontFamily: 'inherit', colorScheme: 'dark'
                                            }} />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#aaa', marginBottom: '6px' }}>Cost (₹)</label>
                                        <input type="number" value={form.cost} onChange={(e) => setForm({ ...form, cost: e.target.value })} required
                                            placeholder="0"
                                            style={{
                                                width: '100%', padding: '11px 14px', fontSize: '14px', color: '#eee',
                                                background: '#1c1c1c', border: '2px solid #2a2a2a', borderRadius: '10px',
                                                outline: 'none', fontFamily: 'inherit'
                                            }} />
                                    </div>
                                </div>

                                <AnimatedButton type="submit" variant="primary" style={{ width: '100%', padding: '13px', marginTop: '4px' }}>
                                    Save Record
                                </AnimatedButton>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Maintenance;

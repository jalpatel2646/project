import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Fuel, Wrench, Plus, Search, Trash2, X, DollarSign, TrendingUp, Download, Filter } from 'lucide-react';
import { useConfirm, useToast } from '../context/ConfirmContext';
import { AnimatedCard, AnimatedNumber, AnimatedTable, StaggerContainer, StaggerItem, AnimatedButton } from '../components/AnimatedComponents';
import { motion, AnimatePresence } from 'framer-motion';

const inputStyle = {
    width: '100%', padding: '11px 14px', fontSize: '14px', color: '#eee',
    background: '#1c1c1c', border: '2px solid #2a2a2a', borderRadius: '10px',
    outline: 'none', fontFamily: 'inherit'
};
const labelStyle = { display: 'block', fontSize: '12px', fontWeight: 600, color: '#aaa', marginBottom: '6px' };

const Expenses = () => {
    const [expenses, setExpenses] = useState([]);
    const [vehicles, setVehicles] = useState([]);
    const [search, setSearch] = useState('');
    const [typeFilter, setTypeFilter] = useState('All');
    const [showModal, setShowModal] = useState(false);
    const [form, setForm] = useState({ vehicle: '', type: 'Fuel', amount: '', details: { liters: '', serviceType: '', description: '' } });

    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };
    const confirm = useConfirm();
    const toast = useToast();

    useEffect(() => { loadData(); }, []);

    const loadData = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/expenses', { headers });
            setExpenses(res.data);
        } catch (e) { console.error(e); }
        try {
            const res = await axios.get('http://localhost:5000/api/vehicles', { headers });
            setVehicles(res.data);
        } catch (e) { console.error(e); }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/api/expenses', {
                ...form,
                amount: Number(form.amount),
                details: {
                    ...form.details,
                    liters: form.details.liters ? Number(form.details.liters) : undefined
                }
            }, { headers });
            setShowModal(false);
            setForm({ vehicle: '', type: 'Fuel', amount: '', details: { liters: '', serviceType: '', description: '' } });
            loadData();
            toast('Expense added successfully', 'success');
        } catch (e) {
            toast(e.response?.data?.error || 'Failed to add expense', 'error');
        }
    };

    const handleDelete = async (id) => {
        const ok = await confirm({ title: 'Delete Expense', message: 'Are you sure you want to delete this expense record? This action cannot be undone.' });
        if (!ok) return;
        try {
            await axios.delete(`http://localhost:5000/api/expenses/${id}`, { headers });
            toast('Expense deleted successfully', 'success');
            loadData();
        } catch (e) { toast(e.response?.data?.error || 'Failed to delete expense', 'error'); }
    };

    const exportCSV = () => {
        const rows = [['Vehicle', 'Type', 'Amount', 'Date', 'Description', 'Liters', 'Service Type']];
        expenses.forEach(ex => {
            rows.push([
                ex.vehicle?.licensePlate || 'N/A', ex.type, ex.amount,
                new Date(ex.date).toLocaleDateString('en-CA'),
                ex.details?.description || '', ex.details?.liters || '', ex.details?.serviceType || ''
            ]);
        });
        const csv = rows.map(r => r.join(',')).join('\n');
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a'); a.href = url; a.download = 'expenses.csv'; a.click();
    };

    const totalAmount = expenses.reduce((s, e) => s + e.amount, 0);
    const fuelExpenses = expenses.filter(e => e.type === 'Fuel');
    const maintExpenses = expenses.filter(e => e.type === 'Maintenance');
    const totalFuel = fuelExpenses.reduce((s, e) => s + e.amount, 0);
    const totalMaint = maintExpenses.reduce((s, e) => s + e.amount, 0);
    const totalLiters = fuelExpenses.reduce((s, e) => s + (e.details?.liters || 0), 0);
    const avgPerLiter = totalLiters > 0 ? (totalFuel / totalLiters).toFixed(2) : '0.00';

    const filtered = expenses.filter(ex => {
        const matchSearch = (ex.vehicle?.licensePlate || '').toLowerCase().includes(search.toLowerCase()) ||
            (ex.details?.description || '').toLowerCase().includes(search.toLowerCase()) ||
            (ex.details?.serviceType || '').toLowerCase().includes(search.toLowerCase());
        const matchType = typeFilter === 'All' || ex.type === typeFilter;
        return matchSearch && matchType;
    });

    const typeCounts = { All: expenses.length, Fuel: fuelExpenses.length, Maintenance: maintExpenses.length };

    const columns = [
        {
            header: 'Vehicle', accessor: 'vehicle', render: (val, ex) => (
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{
                        width: '32px', height: '32px', borderRadius: '8px',
                        background: ex.type === 'Fuel' ? 'rgba(251,191,36,0.15)' : 'rgba(129,140,248,0.15)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>
                        {ex.type === 'Fuel' ? <Fuel size={15} color="#fbbf24" /> : <Wrench size={15} color="#818cf8" />}
                    </div>
                    <span style={{ fontSize: '13px', fontWeight: 700, color: '#eee' }}>
                        {val?.licensePlate || 'N/A'}
                    </span>
                </div>
            )
        },
        {
            header: 'Type', accessor: 'type', render: (val) => (
                <span style={{
                    fontSize: '11px', fontWeight: 700, padding: '3px 10px', borderRadius: '6px',
                    background: val === 'Fuel' ? 'rgba(251,191,36,0.1)' : 'rgba(129,140,248,0.1)',
                    color: val === 'Fuel' ? '#fbbf24' : '#818cf8',
                    border: `1px solid ${val === 'Fuel' ? 'rgba(251,191,36,0.2)' : 'rgba(129,140,248,0.2)'}`
                }}>{val}</span>
            )
        },
        {
            header: 'Description', accessor: 'details', render: (val) => (
                <span style={{ fontSize: '13px', color: '#999', maxWidth: '220px', display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {val?.description || val?.serviceType || '—'}
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
            header: 'Liters', accessor: 'details.liters', render: (val) => (
                <span style={{ fontSize: '13px', fontWeight: 600, color: '#bbb' }}>
                    {val ? `${val}L` : '—'}
                </span>
            )
        },
        {
            header: 'Cost', accessor: 'amount', align: 'right', render: (val) => (
                <span style={{ fontSize: '14px', fontWeight: 800, color: '#f87171' }}>
                    ₹{val.toLocaleString()}
                </span>
            )
        },
        {
            header: 'Actions', accessor: 'actions', align: 'center', render: (_, ex) => (
                <motion.button
                    whileHover={{ scale: 1.2, color: '#ef4444' }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleDelete(ex._id)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '6px' }}
                >
                    <Trash2 size={15} color="#555" />
                </motion.button>
            )
        }
    ];

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                    <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#fff', margin: '0 0 4px' }}>Fuel & Expenses</h1>
                    <p style={{ fontSize: '14px', color: '#666', margin: 0 }}>{expenses.length} entries • ₹{totalAmount.toLocaleString()} total</p>
                </motion.div>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <AnimatedButton onClick={exportCSV} variant="secondary">
                        <Download size={16} /> Export
                    </AnimatedButton>
                    <AnimatedButton onClick={() => setShowModal(true)} variant="primary">
                        <Plus size={16} /> Add Entry
                    </AnimatedButton>
                </div>
            </div>

            <StaggerContainer>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '14px' }}>
                    {[
                        { label: 'Total Spent', value: totalAmount, prefix: '₹', icon: DollarSign, color: '#f87171' },
                        { label: 'Fuel Cost', value: totalFuel, prefix: '₹', icon: Fuel, color: '#fbbf24' },
                        { label: 'Maintenance', value: totalMaint, prefix: '₹', icon: Wrench, color: '#818cf8' },
                        { label: 'Total Liters', value: totalLiters, icon: TrendingUp, color: '#4ade80' },
                        { label: 'Avg ₹/Liter', value: parseFloat(avgPerLiter), prefix: '₹', icon: Filter, color: '#c084fc' },
                    ].map((s, i) => (
                        <StaggerItem key={i}>
                            <div style={{ ...card, padding: '18px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <div style={{
                                    width: '40px', height: '40px', borderRadius: '12px',
                                    background: `${s.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center'
                                }}>
                                    <s.icon size={18} color={s.color} />
                                </div>
                                <div>
                                    <p style={{ fontSize: '10px', color: '#666', fontWeight: 600, textTransform: 'uppercase', margin: '0 0 2px' }}>{s.label}</p>
                                    <p style={{ fontSize: '18px', fontWeight: 800, color: '#fff', margin: 0 }}>
                                        {s.prefix}<AnimatedNumber value={s.value} />
                                    </p>
                                </div>
                            </div>
                        </StaggerItem>
                    ))}
                </div>
            </StaggerContainer>

            <AnimatedCard style={{ padding: '20px' }}>
                <p style={{ fontSize: '11px', fontWeight: 700, color: '#666', textTransform: 'uppercase', marginBottom: '12px' }}>Cost Breakdown</p>
                <div style={{ display: 'flex', borderRadius: '8px', overflow: 'hidden', height: '12px' }}>
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: totalAmount > 0 ? `${(totalFuel / totalAmount) * 100}%` : '50%' }}
                        style={{ background: '#fbbf24' }}
                    />
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: totalAmount > 0 ? `${(totalMaint / totalAmount) * 100}%` : '50%' }}
                        style={{ background: '#818cf8' }}
                    />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <div style={{ width: '10px', height: '10px', borderRadius: '3px', background: '#fbbf24' }} />
                        <span style={{ fontSize: '12px', color: '#888' }}>Fuel ({totalAmount > 0 ? ((totalFuel / totalAmount) * 100).toFixed(0) : 0}%)</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <div style={{ width: '10px', height: '10px', borderRadius: '3px', background: '#818cf8' }} />
                        <span style={{ fontSize: '12px', color: '#888' }}>Maintenance ({totalAmount > 0 ? ((totalMaint / totalAmount) * 100).toFixed(0) : 0}%)</span>
                    </div>
                </div>
            </AnimatedCard>

            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <div style={{ position: 'relative', flex: 1, maxWidth: '360px' }}>
                    <Search size={18} color="#555" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                    <input type="text" placeholder="Search by vehicle, description..." value={search} onChange={e => setSearch(e.target.value)}
                        style={{
                            width: '100%', padding: '10px 14px 10px 44px', fontSize: '14px',
                            border: '2px solid #222', borderRadius: '12px', outline: 'none',
                            background: '#141414', fontFamily: 'inherit', color: '#eee'
                        }} />
                </div>
                <div style={{ display: 'flex', gap: '4px', background: '#141414', border: '1px solid #1e1e1e', borderRadius: '12px', padding: '3px' }}>
                    {['All', 'Fuel', 'Maintenance'].map(t => (
                        <motion.button
                            key={t}
                            onClick={() => setTypeFilter(t)}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            style={{
                                padding: '6px 14px', fontSize: '12px', fontWeight: 600, borderRadius: '10px',
                                border: 'none', cursor: 'pointer',
                                background: typeFilter === t ? '#4f46e5' : 'transparent',
                                color: typeFilter === t ? '#fff' : '#666', transition: 'all 0.2s'
                            }}
                        >
                            {t} ({typeCounts[t] || 0})
                        </motion.button>
                    ))}
                </div>
            </div>

            <div style={{ ...card, overflow: 'hidden' }}>
                <AnimatedTable columns={columns} data={filtered} />
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
                            style={{ background: '#141414', borderRadius: '16px', border: '1px solid #1e1e1e', padding: '32px', width: '100%', maxWidth: '500px' }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                                <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#fff', margin: 0 }}>Add Expense</h3>
                                <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                                    <X size={20} color="#666" />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                    <div>
                                        <label style={labelStyle}>Vehicle</label>
                                        <select value={form.vehicle} onChange={e => setForm({ ...form, vehicle: e.target.value })} required
                                            style={{ ...inputStyle, colorScheme: 'dark' }}>
                                            <option value="" style={{ background: '#1c1c1c', color: '#888' }}>Select vehicle</option>
                                            {vehicles.map(v => <option key={v._id} value={v._id} style={{ background: '#1c1c1c', color: '#eee' }}>{v.licensePlate}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label style={labelStyle}>Type</label>
                                        <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}
                                            style={{ ...inputStyle, colorScheme: 'dark' }}>
                                            {['Fuel', 'Maintenance'].map(t =>
                                                <option key={t} value={t} style={{ background: '#1c1c1c', color: '#eee' }}>{t}</option>
                                            )}
                                        </select>
                                    </div>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                    <div>
                                        <label style={labelStyle}>Amount (₹)</label>
                                        <input type="number" value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} required
                                            placeholder="0" style={inputStyle} />
                                    </div>
                                    {form.type === 'Fuel' && (
                                        <div>
                                            <label style={labelStyle}>Liters</label>
                                            <input type="number" value={form.details.liters} onChange={e => setForm({ ...form, details: { ...form.details, liters: e.target.value } })}
                                                placeholder="0" style={inputStyle} />
                                        </div>
                                    )}
                                    {form.type === 'Maintenance' && (
                                        <div>
                                            <label style={labelStyle}>Service Type</label>
                                            <input type="text" value={form.details.serviceType} onChange={e => setForm({ ...form, details: { ...form.details, serviceType: e.target.value } })}
                                                placeholder="e.g. Brake Service" style={inputStyle} />
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <label style={labelStyle}>Description</label>
                                    <input type="text" value={form.details.description} onChange={e => setForm({ ...form, details: { ...form.details, description: e.target.value } })}
                                        placeholder="Brief description of the expense" style={inputStyle} />
                                </div>

                                <AnimatedButton type="submit" variant="primary" style={{ width: '100%', padding: '14px', marginTop: '4px' }}>
                                    Save Expense
                                </AnimatedButton>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Expenses;

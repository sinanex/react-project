import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import {
    Search, Plus, Filter, MoreVertical, Trash2, Edit3,
    User, Mail, Phone, MapPin, Lock, Shield, X,
    Loader2, CheckCircle2, AlertCircle, AlertTriangle, RefreshCw
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Users = () => {
    const { token } = useSelector(state => state.auth);
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [categories, setCategories] = useState([]);
    const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

    const [formData, setFormData] = useState({
        name: '', email: '', phone: '', place: '', password: '',
        usertype: '', role_type: ''
    });

    const API_URL = '/api/users';

    const showToast = (message, type = 'success') => {
        setToast({ show: true, message, type });
        setTimeout(() => setToast(prev => ({ ...prev, show: false })), 4000);
    };

    const openCreate = () => {
        resetForm();
        setIsModalOpen(true);
    };

    const fetchUsers = async () => {
        const activeToken = token || localStorage.getItem('token');
        if (!activeToken) return;
        setIsLoading(true);
        try {
            const response = await fetch(API_URL, {
                headers: { 'Authorization': `Bearer ${activeToken}` }
            });
            if (!response.ok) throw new Error('Failed to fetch users');
            const data = await response.json();
            setUsers(Array.isArray(data) ? data : []);
            setError(null);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchCategories = async () => {
        const activeToken = token || localStorage.getItem('token');
        if (!activeToken) return;
        try {
            const response = await fetch('/api/boy-categories', {
                headers: { 'Authorization': `Bearer ${activeToken}` }
            });
            if (response.ok) {
                const data = await response.json();
                setCategories(Array.isArray(data) ? data : []);
            }
        } catch (err) {
            console.error('Failed to fetch categories:', err);
        }
    };

    useEffect(() => {
        fetchUsers();
        fetchCategories();
    }, [token]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const resetForm = () => {
        setFormData({
            name: '', email: '', phone: '', place: '', password: '',
            usertype: '', role_type: ''
        });
        setEditingUser(null);
        setIsModalOpen(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const method = editingUser ? 'PUT' : 'POST';
        const url = editingUser ? `${API_URL}/${editingUser._id || editingUser.id}` : API_URL;
        const payload = { ...formData, createdat: editingUser ? editingUser.createdat : new Date() };

        try {
            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify(payload)
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.error || data.message || 'Failed to save user');
            showToast(editingUser ? 'User updated successfully!' : 'User created successfully!');
            fetchUsers();
            resetForm();
        } catch (err) {
            showToast(err.message, 'error');
        }
    };

    const handleEdit = (user) => {
        setEditingUser(user);
        setFormData({
            name: user.name, email: user.email, phone: user.phone,
            place: user.place, password: '',
            usertype: user.usertype || '',
            role_type: user.role_type || user.usertype || ''
        });
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this user?')) return;
        try {
            const response = await fetch(`${API_URL}/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!response.ok) throw new Error('Failed to delete user');
            showToast('User deleted successfully!');
            fetchUsers();
        } catch (err) {
            showToast(err.message, 'error');
        }
    };

    const filteredUsers = users.filter(user =>
        user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.phone?.includes(searchTerm)
    );

    return (
        <div className="space-y-6">
            {/* Toast */}
            <AnimatePresence>
                {toast.show && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, x: '-50%' }}
                        animate={{ opacity: 1, scale: 1, x: '-50%' }}
                        exit={{ opacity: 0, scale: 0.9, x: '-50%' }}
                        className={`fixed top-6 left-1/2 z-[100] px-6 py-4 rounded-2xl shadow-2xl glass flex items-center gap-3 border transition-all
                            ${toast.type === 'success' ? 'border-emerald-500/30' : 'border-rose-500/30'}`}
                    >
                        {toast.type === 'success' ? <CheckCircle2 size={20} className="text-emerald-500" /> : <AlertCircle size={20} className="text-rose-500" />}
                        <p className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>{toast.message}</p>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>User Management</h1>
                    <p className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>Manage and monitor all users registered in the system.</p>
                </div>
                <button onClick={openCreate} className="btn-primary flex items-center gap-2">
                    <Plus size={18} />
                    Add New User
                </button>
            </div>

            {/* Filters */}
            <div className="card p-4 flex flex-col md:flex-row gap-4 items-center">
                <div className="relative flex-1 w-full">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} size={18} />
                    <input
                        type="text"
                        placeholder="Search by name, email or phone…"
                        className="w-full pl-11 pr-4 py-3 rounded-xl text-sm font-medium outline-none transition-all"
                        style={{ background: 'var(--bg-main)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <button
                    onClick={fetchUsers}
                    className="p-3 rounded-xl transition-all"
                    style={{ background: 'var(--bg-main)', border: '1px solid var(--border-color)', color: 'var(--text-muted)' }}
                >
                    <RefreshCw size={20} className={isLoading ? 'animate-spin' : ''} />
                </button>
            </div>

            {/* Table */}
            <div className="card overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left" style={{ borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ background: 'var(--bg-sidebar)', borderBottom: '1px solid var(--border-color)' }}>
                                <th className="px-6 py-5 text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>User Info</th>
                                <th className="px-6 py-5 text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>Contact</th>
                                <th className="px-6 py-5 text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>Location</th>
                                <th className="px-6 py-5 text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>Role</th>
                                <th className="px-6 py-5 text-xs font-bold uppercase tracking-widest text-right" style={{ color: 'var(--text-muted)' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-20 text-center">
                                        <Loader2 size={32} className="animate-spin mx-auto mb-4" style={{ color: 'var(--color-primary)' }} />
                                        <span style={{ color: 'var(--text-muted)' }}>Loading users list…</span>
                                    </td>
                                </tr>
                            ) : filteredUsers.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-20 text-center" style={{ color: 'var(--text-muted)' }}>
                                        No users match your current filters.
                                    </td>
                                </tr>
                            ) : (
                                filteredUsers.map((user) => (
                                    <tr key={user._id || user.id} className="hover:bg-slate-400/5 group transition-colors">
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-4">
                                                <div style={{
                                                    width: 44, height: 44, borderRadius: 12,
                                                    background: 'linear-gradient(135deg, #3b82f6, #6366f1)',
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                    color: '#fff', fontWeight: 800, fontSize: '1.1rem',
                                                    boxShadow: '0 4px 12px rgba(99,102,241,0.25)'
                                                }}>
                                                    {user.name?.charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold capitalize" style={{ color: 'var(--text-primary)' }}>{user.name}</p>
                                                    <p className="text-xs font-medium mt-0.5" style={{ color: 'var(--text-muted)' }}>@{user.email?.split('@')[0]}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex flex-col gap-1 text-xs">
                                                <span className="flex items-center gap-1.5" style={{ color: 'var(--text-primary)' }}>
                                                    <Phone size={12} style={{ color: 'var(--text-muted)' }} /> {user.phone}
                                                </span>
                                                <span className="flex items-center gap-1.5" style={{ color: 'var(--text-muted)' }}>
                                                    <Mail size={12} /> {user.email}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-1.5 text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                                                <MapPin size={14} style={{ color: 'var(--color-primary)', opacity: 0.6 }} />
                                                {user.place}
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <span className={`inline-flex px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider
                                                ${user.usertype === 'Admin'
                                                    ? 'bg-rose-500/10 text-rose-500 border border-rose-500/20'
                                                    : 'bg-blue-500/10 text-blue-500 border border-blue-500/20'
                                                }`}>
                                                {user.role_type || user.usertype}
                                            </span>
                                        </td>
                                        <td className="px-6 py-5 text-right">
                                            <div className="flex items-center justify-end gap-1">
                                                <button onClick={() => handleEdit(user)} className="p-2 rounded-lg text-slate-400 hover:text-blue-400 hover:bg-blue-400/10 transition-all">
                                                    <Edit3 size={16} />
                                                </button>
                                                <button onClick={() => handleDelete(user._id || user.id)} className="p-2 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-400/10 transition-all">
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 glass-heavy"
                        style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)' }}
                        onClick={(e) => e.target === e.currentTarget && resetForm()}
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="bg-surface border border-border rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden"
                            style={{ background: 'var(--bg-surface)' }}
                        >
                            <div className="px-8 py-6 border-b border-border flex items-center justify-between">
                                <div>
                                    <h2 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
                                        {editingUser ? 'Edit Account' : 'New User Account'}
                                    </h2>
                                    <p className="text-xs font-medium mt-0.5" style={{ color: 'var(--text-muted)' }}>
                                        {editingUser ? 'Update the details for this member' : 'Register a new member to the system'}
                                    </p>
                                </div>
                                <button onClick={resetForm} className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-700 transition-all">
                                    <X size={20} />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="p-8 space-y-5">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>Full Name</label>
                                        <input required name="name" placeholder="e.g. John Doe" value={formData.name} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl border border-border bg-main text-sm outline-none" style={{ background: 'var(--bg-main)', color: 'var(--text-primary)' }} />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>Email Address</label>
                                        <input required type="email" name="email" placeholder="e.g. user@example.com" value={formData.email} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl border border-border bg-main text-sm outline-none" style={{ background: 'var(--bg-main)', color: 'var(--text-primary)' }} />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>Phone Number</label>
                                        <input required name="phone" placeholder="e.g. +91 9876543210" value={formData.phone} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl border border-border bg-main text-sm outline-none" style={{ background: 'var(--bg-main)', color: 'var(--text-primary)' }} />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>Location</label>
                                        <input required name="place" placeholder="e.g. Malappuram, KL" value={formData.place} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl border border-border bg-main text-sm outline-none" style={{ background: 'var(--bg-main)', color: 'var(--text-primary)' }} />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>Password</label>
                                        <input required={!editingUser} type="password" name="password" placeholder={editingUser ? "•••••••• (Leave blank to keep)" : "Enter a secure password"} value={formData.password} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl border border-border bg-main text-sm outline-none" style={{ background: 'var(--bg-main)', color: 'var(--text-primary)' }} />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>Account Role</label>
                                        <select
                                            required
                                            name="role_type"
                                            value={formData.role_type || formData.usertype}
                                            onChange={(e) => {
                                                const val = e.target.value;
                                                if (val === 'Admin') {
                                                    setFormData(prev => ({ ...prev, usertype: 'Admin', role_type: 'Admin' }));
                                                } else {
                                                    setFormData(prev => ({ ...prev, usertype: 'user', role_type: val }));
                                                }
                                            }}
                                            className="w-full px-4 py-3 rounded-xl border border-border bg-main text-sm outline-none appearance-none"
                                            style={{ background: 'var(--bg-main)', color: 'var(--text-primary)' }}
                                        >
                                            <option value="" disabled>Select Role...</option>
                                            <option value="Admin">Admin</option>
                                            {categories.map(cat => (
                                                <option key={cat._id || cat.id} value={cat.name}>{cat.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                <div className="flex gap-4 pt-4">
                                    <button type="button" onClick={resetForm} className="flex-1 py-3.5 border border-border rounded-xl font-bold text-slate-400 hover:bg-slate-700 transition-all text-sm">Cancel</button>
                                    <button type="submit" className="flex-1 btn-primary py-3.5 text-sm font-bold shadow-xl">
                                        {editingUser ? 'Update Account' : 'Create Account'}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Users;

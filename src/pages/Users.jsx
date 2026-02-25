import React, { useState, useEffect } from 'react';
import {
    Search,
    Plus,
    Filter,
    MoreVertical,
    Trash2,
    Edit3,
    User,
    Mail,
    Phone,
    MapPin,
    Lock,
    Shield,
    X,
    Loader2,
    CheckCircle2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Users = () => {
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState(null);

    // Form state
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        place: '',
        password: '',
        usertype: 'user'
    });

    const API_URL = '/api/users';

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(API_URL);
            if (!response.ok) throw new Error('Failed to fetch users');
            const data = await response.json();
            setUsers(Array.isArray(data) ? data : []);
            setError(null);
        } catch (err) {
            setError(err.message);
            // Fallback for testing if API is not up
            // setUsers([{ id: 1, name: 'Sample User', email: 'sample@example.com', phone: '1234567890', place: 'Mumbai', usertype: 'admin', createdat: new Date() }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const resetForm = () => {
        setFormData({
            name: '',
            email: '',
            phone: '',
            place: '',
            password: '',
            usertype: 'user'
        });
        setEditingUser(null);
        setIsModalOpen(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const method = editingUser ? 'PUT' : 'POST';
        const url = editingUser ? `${API_URL}/${editingUser._id || editingUser.id}` : API_URL;

        const payload = {
            ...formData,
            createdat: editingUser ? editingUser.createdat : new Date()
        };

        try {
            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!response.ok) throw new Error('Failed to save user');

            await fetchUsers();
            resetForm();
        } catch (err) {
            alert(err.message);
        }
    };

    const handleEdit = (user) => {
        setEditingUser(user);
        setFormData({
            name: user.name,
            email: user.email,
            phone: user.phone,
            place: user.place,
            password: '', // Don't show password for security, let them update if they want
            usertype: user.usertype || 'user'
        });
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this user?')) return;

        try {
            const response = await fetch(`${API_URL}/${id}`, {
                method: 'DELETE'
            });
            if (!response.ok) throw new Error('Failed to delete user');
            await fetchUsers();
        } catch (err) {
            alert(err.message);
        }
    };

    const filteredUsers = users.filter(user =>
        user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">User Management</h1>
                    <p className="text-slate-500 mt-1">Manage and monitor all users registered in the system.</p>
                </div>
                <button
                    onClick={() => { resetForm(); setIsModalOpen(true); }}
                    className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl transition-all font-bold shadow-lg shadow-blue-500/25 active:scale-95"
                >
                    <Plus size={18} />
                    Add New User
                </button>
            </div>

            {/* Filters & Search */}
            <div className="bg-surface p-4 rounded-2xl border border-border flex flex-col md:flex-row gap-4 items-center glass-effect">
                <div className="relative flex-1 w-full">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
                    <input
                        type="text"
                        placeholder="Search users by name or email..."
                        className="w-full bg-background border border-border rounded-xl pl-12 pr-4 py-3 focus:ring-2 focus:ring-blue-500 transition-all outline-none"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-3 w-full md:w-auto">
                    <button
                        onClick={fetchUsers}
                        className="p-3 bg-background border border-border rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    >
                        <Loader2 size={20} className={isLoading ? 'animate-spin' : ''} />
                    </button>
                </div>
            </div>

            {/* Users Table */}
            <div className="bg-surface rounded-2xl border border-border overflow-hidden shadow-sm glass-effect">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50/50 dark:bg-slate-800/40 text-slate-500 font-bold text-xs uppercase tracking-widest border-b border-border">
                                <th className="px-6 py-5">User Info</th>
                                <th className="px-6 py-5">Contact</th>
                                <th className="px-6 py-5">Location</th>
                                <th className="px-6 py-5">Role</th>
                                <th className="px-6 py-5">Created</th>
                                <th className="px-6 py-5 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {isLoading ? (
                                <tr>
                                    <td colSpan="6" className="px-6 py-12 text-center text-slate-500">
                                        <Loader2 size={32} className="animate-spin mx-auto mb-4 text-blue-500" />
                                        <span>Loading your users...</span>
                                    </td>
                                </tr>
                            ) : error ? (
                                <tr>
                                    <td colSpan="6" className="px-6 py-12 text-center text-rose-500">
                                        <p className="font-bold">Error loading users</p>
                                        <p className="text-sm opacity-80">{error}</p>
                                        <button onClick={fetchUsers} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg">Retry</button>
                                    </td>
                                </tr>
                            ) : filteredUsers.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="px-6 py-12 text-center text-slate-500">
                                        No users found matches your search.
                                    </td>
                                </tr>
                            ) : (
                                <AnimatePresence>
                                    {filteredUsers.map((user) => (
                                        <motion.tr
                                            key={user._id || user.id}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, scale: 0.95 }}
                                            className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-all group"
                                        >
                                            <td className="px-6 py-5">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform">
                                                        {user.name?.charAt(0).toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-bold text-slate-900 dark:text-white capitalize">{user.name}</p>
                                                        <p className="text-xs text-slate-500 mt-0.5">{user.email}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <div className="flex flex-col gap-1">
                                                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                                                        <Phone size={12} className="text-slate-400" /> {user.phone}
                                                    </span>
                                                    <span className="text-xs text-slate-500 flex items-center gap-1.5">
                                                        <Mail size={12} className="text-slate-400" /> {user.email}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <div className="flex items-center gap-1.5 text-sm text-slate-600 dark:text-slate-400">
                                                    <MapPin size={14} className="text-rose-500/70" />
                                                    {user.place}
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wider ${user.usertype === 'Admin'
                                                    ? 'bg-rose-500/10 text-rose-500 border border-rose-500/20'
                                                    : user.usertype === 'Boy A'
                                                        ? 'bg-blue-500/10 text-blue-500 border border-blue-500/20'
                                                        : user.usertype === 'Boy B'
                                                            ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                                                            : 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                                                    }`}>
                                                    {user.usertype}
                                                </span>
                                            </td>
                                            <td className="px-6 py-5">
                                                <div className="text-sm text-slate-500 font-medium">
                                                    {user.createdat ? new Date(user.createdat).toLocaleDateString() : 'N/A'}
                                                </div>
                                            </td>
                                            <td className="px-6 py-5 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        onClick={() => handleEdit(user)}
                                                        className="p-2.5 text-slate-400 hover:text-blue-500 hover:bg-blue-500/10 rounded-xl transition-all"
                                                        title="Edit User"
                                                    >
                                                        <Edit3 size={18} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(user._id || user.id)}
                                                        className="p-2.5 text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 rounded-xl transition-all"
                                                        title="Delete User"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                </div>
                                            </td>
                                        </motion.tr>
                                    ))}
                                </AnimatePresence>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Form Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={resetForm}
                            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="relative w-full max-w-lg bg-surface border border-border rounded-3xl shadow-2xl overflow-hidden glass-effect-heavy"
                        >
                            <div className="p-6 border-b border-border flex items-center justify-between bg-white/50 dark:bg-slate-800/50">
                                <div>
                                    <h2 className="text-xl font-bold">{editingUser ? 'Edit User' : 'Add New User'}</h2>
                                    <p className="text-sm text-slate-500">{editingUser ? 'Update account details' : 'Create a new user account'}</p>
                                </div>
                                <button onClick={resetForm} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
                                    <X size={20} />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="p-6 space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold uppercase tracking-wider text-slate-500 ml-1">Full Name</label>
                                        <div className="relative">
                                            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                            <input
                                                required
                                                type="text"
                                                name="name"
                                                placeholder="John Doe"
                                                className="w-full bg-background border border-border rounded-xl pl-10 pr-4 py-2.5 focus:ring-2 focus:ring-blue-500 transition-all outline-none"
                                                value={formData.name}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold uppercase tracking-wider text-slate-500 ml-1">Email Address</label>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                            <input
                                                required
                                                type="email"
                                                name="email"
                                                placeholder="john@example.com"
                                                className="w-full bg-background border border-border rounded-xl pl-10 pr-4 py-2.5 focus:ring-2 focus:ring-blue-500 transition-all outline-none"
                                                value={formData.email}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold uppercase tracking-wider text-slate-500 ml-1">Phone Number</label>
                                        <div className="relative">
                                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                            <input
                                                required
                                                type="tel"
                                                name="phone"
                                                placeholder="10-digit number"
                                                className="w-full bg-background border border-border rounded-xl pl-10 pr-4 py-2.5 focus:ring-2 focus:ring-blue-500 transition-all outline-none"
                                                value={formData.phone}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold uppercase tracking-wider text-slate-500 ml-1">Location</label>
                                        <div className="relative">
                                            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                            <input
                                                required
                                                type="text"
                                                name="place"
                                                placeholder="City, State"
                                                className="w-full bg-background border border-border rounded-xl pl-10 pr-4 py-2.5 focus:ring-2 focus:ring-blue-500 transition-all outline-none"
                                                value={formData.place}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold uppercase tracking-wider text-slate-500 ml-1">Password</label>
                                        <div className="relative">
                                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                            <input
                                                required={!editingUser}
                                                type="password"
                                                name="password"
                                                placeholder={editingUser ? "•••••••• (Leave blank to keep)" : "••••••••"}
                                                className="w-full bg-background border border-border rounded-xl pl-10 pr-4 py-2.5 focus:ring-2 focus:ring-blue-500 transition-all outline-none"
                                                value={formData.password}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold uppercase tracking-wider text-slate-500 ml-1">User Role</label>
                                        <div className="relative">
                                            <Shield className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                            <select
                                                name="usertype"
                                                className="w-full bg-background border border-border rounded-xl pl-10 pr-4 py-2.5 focus:ring-2 focus:ring-blue-500 transition-all outline-none appearance-none"
                                                value={formData.usertype}
                                                onChange={handleInputChange}
                                            >
                                                <option value="Boy A">Boy A</option>
                                                <option value="Boy B">Boy B</option>
                                                <option value="Boy C">Boy C</option>
                                                <option value="Admin">Admin</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-4 flex items-center gap-3">
                                    <button
                                        type="button"
                                        onClick={resetForm}
                                        className="flex-1 px-6 py-3 border border-border rounded-xl font-bold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold shadow-lg shadow-blue-500/25 active:scale-95 transition-all flex items-center justify-center gap-2"
                                    >
                                        {editingUser ? <CheckCircle2 size={18} /> : <Plus size={18} />}
                                        {editingUser ? 'Update User' : 'Save User'}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Users;

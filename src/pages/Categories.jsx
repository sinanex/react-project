import React, { useState, useEffect, useCallback } from 'react';
import {
    Shield, Plus, Edit3, Trash2, CheckCircle2,
    ToggleLeft, ToggleRight, Tag, DollarSign, List,
    Save, Loader2, AlertCircle, RefreshCw, X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const API_BASE = '/api/boy-categories';

const CARD_COLORS = [
    { icon: 'bg-blue-500/10 text-blue-500', glow: 'bg-blue-500' },
    { icon: 'bg-violet-500/10 text-violet-500', glow: 'bg-violet-500' },
    { icon: 'bg-amber-500/10 text-amber-500', glow: 'bg-amber-500' },
    { icon: 'bg-rose-500/10 text-rose-500', glow: 'bg-rose-500' },
    { icon: 'bg-cyan-500/10 text-cyan-500', glow: 'bg-cyan-500' },
    { icon: 'bg-indigo-500/10 text-indigo-500', glow: 'bg-indigo-500' },
];

const EMPTY_FORM = { name: '', label: '', default_wage: '', privileges: '', status: 'active' };

// ─── helpers ────────────────────────────────────────────────────────────────

async function apiFetch(path, options = {}) {
    const token = localStorage.getItem('token');
    const res = await fetch(`${API_BASE}${path}`, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            ...(options.headers || {}),
        },
    });
    if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.message || `Request failed (${res.status})`);
    }
    return res.json();
}

function normalise(cat) {
    // Accept both snake_case (API) and camelCase (legacy) shapes
    return {
        ...cat,
        id: cat._id || cat.id,
        label: cat.label || cat.name,
        defaultWage: cat.default_wage ?? cat.defaultWage ?? 0,
        privileges: Array.isArray(cat.privileges) ? cat.privileges : [],
        status: cat.status || 'active',
    };
}

// ─── component ───────────────────────────────────────────────────────────────

const Categories = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [fetchError, setFetchError] = useState('');

    // Modal state
    const [showModal, setShowModal] = useState(false);
    const [editTarget, setEditTarget] = useState(null);
    const [form, setForm] = useState(EMPTY_FORM);
    const [saving, setSaving] = useState(false);
    const [formError, setFormError] = useState('');

    // Inline action states
    const [togglingId, setTogglingId] = useState(null);
    const [deletingId, setDeletingId] = useState(null);
    const [confirmDeleteId, setConfirmDeleteId] = useState(null);

    // ── fetch all ─────────────────────────────────────────────────────────
    const fetchCategories = useCallback(async () => {
        setLoading(true);
        setFetchError('');
        try {
            const data = await apiFetch('');
            // API may return array directly or { data: [...] }
            const list = Array.isArray(data) ? data : (data.data || data.categories || []);
            setCategories(list.map(normalise));
        } catch (err) {
            setFetchError(err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchCategories(); }, [fetchCategories]);

    // ── modal helpers ─────────────────────────────────────────────────────
    const openCreate = () => {
        setEditTarget(null);
        setForm(EMPTY_FORM);
        setFormError('');
        setShowModal(true);
    };

    const openEdit = (cat) => {
        setEditTarget(cat);
        setForm({
            name: cat.name,
            label: cat.label,
            default_wage: cat.defaultWage,
            privileges: cat.privileges.join(', '),
            status: cat.status,
        });
        setFormError('');
        setShowModal(true);
    };

    const closeModal = () => { setShowModal(false); setEditTarget(null); setFormError(''); };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    // ── submit (create / edit) ────────────────────────────────────────────
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.name.trim() || !form.label.trim() || form.default_wage === '') {
            setFormError('Name, Label, and Default Wage are required.');
            return;
        }

        const payload = {
            name: form.name.trim(),
            label: form.label.trim(),
            default_wage: Number(form.default_wage),
            privileges: form.privileges.split(',').map(p => p.trim()).filter(Boolean),
            status: form.status,
        };

        setSaving(true);
        setFormError('');
        try {
            if (editTarget) {
                const res = await apiFetch(`/${editTarget.id}`, { method: 'PUT', body: JSON.stringify(payload) });
                const updated = normalise(res.data || res);
                setCategories(prev => prev.map(c => c.id === editTarget.id ? updated : c));
            } else {
                const res = await apiFetch('', { method: 'POST', body: JSON.stringify(payload) });
                const created = normalise(res.data || res);
                setCategories(prev => [...prev, created]);
            }
            closeModal();
        } catch (err) {
            setFormError(err.message);
        } finally {
            setSaving(false);
        }
    };

    // ── delete (optimistic) ───────────────────────────────────────────────
    const handleDelete = async (id) => {
        // Optimistically remove from UI right away
        const snapshot = categories;
        setCategories(prev => prev.filter(c => c.id !== id));
        setConfirmDeleteId(null);
        setDeletingId(id);
        try {
            await apiFetch(`/${id}`, { method: 'DELETE' });
        } catch (err) {
            // Revert on failure
            setCategories(snapshot);
            console.error('Delete failed:', err.message);
        } finally {
            setDeletingId(null);
        }
    };

    // ── status toggle (optimistic) ─────────────────────────────────────────
    const handleToggleStatus = async (cat) => {
        const newStatus = cat.status === 'active' ? 'inactive' : 'active';

        // Optimistically flip the status in UI right away
        const snapshot = categories;
        setCategories(prev =>
            prev.map(c => c.id === cat.id ? { ...c, status: newStatus } : c)
        );
        setTogglingId(cat.id);

        try {
            await apiFetch(`/${cat.id}`, {
                method: 'PUT',
                body: JSON.stringify({
                    name: cat.name,
                    label: cat.label,
                    default_wage: cat.defaultWage,
                    privileges: cat.privileges,
                    status: newStatus,
                }),
            });
        } catch (err) {
            // Revert on failure
            setCategories(snapshot);
            console.error('Status update failed:', err.message);
        } finally {
            setTogglingId(null);
        }
    };

    // ── render ────────────────────────────────────────────────────────────
    return (
        <div className="space-y-6">

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Boy Categories</h1>
                    <p className="text-slate-500 mt-1">Define roles, set default wages, and manage staff privileges.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={fetchCategories}
                        disabled={loading}
                        className="p-3 rounded-xl border border-border text-slate-400 hover:text-white hover:bg-slate-700 transition-all"
                        title="Refresh"
                    >
                        <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
                    </button>
                    <button
                        onClick={openCreate}
                        className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold shadow-lg shadow-blue-500/25 transition-all"
                    >
                        <Plus size={20} />
                        Create Category
                    </button>
                </div>
            </div>

            {/* Loading */}
            {loading && (
                <div className="flex items-center justify-center py-24 gap-3 text-slate-400">
                    <Loader2 size={28} className="animate-spin text-blue-500" />
                    <span className="font-medium">Loading categories…</span>
                </div>
            )}

            {/* Fetch error */}
            {!loading && fetchError && (
                <div className="flex flex-col items-center justify-center py-20 gap-4">
                    <div className="p-5 rounded-2xl bg-rose-500/10 text-rose-400">
                        <AlertCircle size={40} />
                    </div>
                    <p className="text-rose-400 font-bold text-lg">Failed to load categories</p>
                    <p className="text-slate-500 text-sm max-w-md text-center">{fetchError}</p>
                    <button
                        onClick={fetchCategories}
                        className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold transition-all flex items-center gap-2"
                    >
                        <RefreshCw size={16} /> Retry
                    </button>
                </div>
            )}

            {/* Empty state */}
            {!loading && !fetchError && categories.length === 0 && (
                <div className="flex flex-col items-center justify-center py-24 gap-4">
                    <div className="p-6 rounded-3xl bg-slate-800/50 border border-border">
                        <Shield size={48} className="text-slate-500" />
                    </div>
                    <p className="text-xl font-bold text-slate-400">No categories yet</p>
                    <p className="text-slate-500 text-sm">Create your first boy category to get started.</p>
                    <button
                        onClick={openCreate}
                        className="mt-2 flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold transition-all"
                    >
                        <Plus size={18} /> Create Category
                    </button>
                </div>
            )}

            {/* Cards Grid */}
            {!loading && !fetchError && categories.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {categories.map((cat, idx) => {
                        const colors = CARD_COLORS[idx % CARD_COLORS.length];
                        const isActive = cat.status === 'active';

                        return (
                            <motion.div
                                key={cat.id}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ delay: idx * 0.06 }}
                                className="bg-surface rounded-3xl border border-border p-8 flex flex-col relative overflow-hidden hover:shadow-xl transition-all group"
                            >
                                {/* Glow */}
                                <div className={`absolute -top-12 -right-12 w-32 h-32 blur-3xl opacity-10 rounded-full ${colors.glow}`} />

                                {/* Top row */}
                                <div className="flex items-start justify-between mb-6">
                                    <div className={`p-4 rounded-2xl ${colors.icon}`}>
                                        <Shield size={26} />
                                    </div>
                                    <div className="flex items-center gap-1 relative z-10">
                                        <span className={`px-3 py-1 text-xs font-bold rounded-full border ${isActive
                                            ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30'
                                            : 'bg-slate-400/10 text-slate-400 border-slate-400/20'}`}>
                                            {isActive ? 'Active' : 'Inactive'}
                                        </span>
                                        <button
                                            onClick={() => openEdit(cat)}
                                            className="p-2 rounded-lg text-slate-400 hover:text-blue-400 hover:bg-blue-500/10 transition-all cursor-pointer"
                                            title="Edit"
                                        >
                                            <Edit3 size={18} />
                                        </button>
                                        <button
                                            onClick={() => {
                                                console.log('Opening delete confirm for:', cat.id);
                                                setConfirmDeleteId(cat.id);
                                            }}
                                            className="p-2 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-all cursor-pointer"
                                            title="Delete"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>

                                {/* Name & Label */}
                                <div className="mb-5">
                                    <h3 className="text-2xl font-bold mb-1 tracking-tight">{cat.name}</h3>
                                    <p className="text-slate-500 font-medium text-sm">{cat.label}</p>
                                </div>

                                {/* Default Wage */}
                                <div className="bg-background p-5 rounded-2xl border border-border mb-6">
                                    <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mb-1">Default Wage</p>
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-3xl font-black text-emerald-600 dark:text-emerald-400">₹{cat.defaultWage}</span>
                                        <span className="text-sm text-slate-500 font-medium">/ per event</span>
                                    </div>
                                </div>

                                {/* Privileges */}
                                <div className="flex-1 mb-6">
                                    <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mb-3">Privileges</p>
                                    {cat.privileges.length === 0 ? (
                                        <p className="text-slate-600 text-sm italic">No privileges defined</p>
                                    ) : (
                                        <div className="space-y-2">
                                            {cat.privileges.map((priv, i) => (
                                                <div key={i} className="flex items-center gap-3">
                                                    <div className="w-5 h-5 rounded-full bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                                                        <CheckCircle2 size={12} className="text-blue-500" />
                                                    </div>
                                                    <span className="text-sm text-slate-400 font-medium">{priv}</span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Toggle Status */}
                                <button
                                    onClick={() => handleToggleStatus(cat)}
                                    disabled={togglingId === cat.id}
                                    className={`w-full py-3 flex items-center justify-center gap-2 font-bold rounded-2xl transition-all border text-sm
                                        ${isActive
                                            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-500 hover:bg-emerald-500/20'
                                            : 'bg-slate-500/10 border-slate-500/20 text-slate-400 hover:bg-slate-500/20'}`}
                                >
                                    {togglingId === cat.id
                                        ? <Loader2 size={16} className="animate-spin" />
                                        : isActive ? <ToggleRight size={18} /> : <ToggleLeft size={18} />}
                                    {togglingId === cat.id ? 'Updating…' : isActive ? 'Set Inactive' : 'Set Active'}
                                </button>
                            </motion.div>
                        );
                    })}
                </div>
            )}

            {/* ═══ Create / Edit Modal ═══════════════════════════════════════════ */}
            <AnimatePresence>
                {showModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4"
                        style={{ backdropFilter: 'blur(8px)', background: 'rgba(0,0,0,0.6)' }}
                        onClick={(e) => e.target === e.currentTarget && closeModal()}
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 24 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 24 }}
                            transition={{ type: 'spring', stiffness: 300, damping: 26 }}
                            className="bg-surface border border-border rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden"
                        >
                            {/* Modal Header */}
                            <div className="flex items-center justify-between px-8 py-6 border-b border-border">
                                <div className="flex items-center gap-3">
                                    <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-500">
                                        <Shield size={20} />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold">
                                            {editTarget ? 'Edit Category' : 'Create Category'}
                                        </h2>
                                        <p className="text-xs text-slate-500 mt-0.5">
                                            {editTarget ? `Updating: ${editTarget.name}` : 'POST /api/boy-categories'}
                                        </p>
                                    </div>
                                </div>
                                <button onClick={closeModal} className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-700 transition-all">
                                    <X size={20} />
                                </button>
                            </div>

                            {/* Form */}
                            <form onSubmit={handleSubmit} className="px-8 py-6 space-y-5 max-h-[75vh] overflow-y-auto">
                                {formError && (
                                    <div className="flex items-start gap-3 bg-rose-500/10 border border-rose-500/30 text-rose-400 rounded-xl px-4 py-3 text-sm font-medium">
                                        <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
                                        {formError}
                                    </div>
                                )}

                                {/* Name */}
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Name *</label>
                                    <div className="relative">
                                        <Tag size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                                        <input
                                            type="text"
                                            name="name"
                                            value={form.name}
                                            onChange={handleChange}
                                            placeholder="e.g. Boy A"
                                            className="w-full pl-10 pr-4 py-3 bg-background border border-border rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Label */}
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Label *</label>
                                    <div className="relative">
                                        <Tag size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                                        <input
                                            type="text"
                                            name="label"
                                            value={form.label}
                                            onChange={handleChange}
                                            placeholder="e.g. Skilled Worker"
                                            className="w-full pl-10 pr-4 py-3 bg-background border border-border rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Default Wage */}
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Default Wage (₹) *</label>
                                    <div className="relative">
                                        <DollarSign size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                                        <input
                                            type="number"
                                            name="default_wage"
                                            value={form.default_wage}
                                            onChange={handleChange}
                                            placeholder="e.g. 1200"
                                            min="0"
                                            className="w-full pl-10 pr-4 py-3 bg-background border border-border rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Privileges */}
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">
                                        Privileges
                                        <span className="ml-1 normal-case font-normal text-slate-500">(comma-separated)</span>
                                    </label>
                                    <div className="relative">
                                        <List size={15} className="absolute left-4 top-3.5 text-slate-400 pointer-events-none" />
                                        <textarea
                                            name="privileges"
                                            value={form.privileges}
                                            onChange={handleChange}
                                            placeholder="e.g. serve_food, manage_tables"
                                            rows={2}
                                            className="w-full pl-10 pr-4 py-3 bg-background border border-border rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all resize-none"
                                        />
                                    </div>
                                </div>

                                {/* Status */}
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Status</label>
                                    <div className="flex gap-3">
                                        {[
                                            { value: 'active', label: '✓ Active', activeClass: 'bg-emerald-500 border-emerald-500 text-white shadow-lg shadow-emerald-500/25' },
                                            { value: 'inactive', label: '⏸ Inactive', activeClass: 'bg-slate-600 border-slate-600 text-white' },
                                        ].map(opt => (
                                            <button
                                                key={opt.value}
                                                type="button"
                                                onClick={() => setForm(prev => ({ ...prev, status: opt.value }))}
                                                className={`flex-1 py-3 rounded-xl font-bold text-sm border transition-all
                                                    ${form.status === opt.value
                                                        ? opt.activeClass
                                                        : 'bg-background border-border text-slate-400 hover:border-slate-500'}`}
                                            >
                                                {opt.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex gap-3 pt-2">
                                    <button
                                        type="button"
                                        onClick={closeModal}
                                        className="flex-1 py-3 border border-border rounded-xl font-bold text-slate-400 hover:bg-slate-700 transition-all text-sm"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={saving}
                                        className="flex-1 py-3 bg-blue-600 hover:bg-blue-500 disabled:opacity-60 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-all text-sm shadow-lg shadow-blue-500/20"
                                    >
                                        {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                                        {saving ? 'Saving…' : editTarget ? 'Update Category' : 'Create Category'}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ═══ Delete Confirmation Modal ════════════════════════════════════ */}
            <AnimatePresence>
                {confirmDeleteId !== null && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4"
                        style={{ backdropFilter: 'blur(8px)', background: 'rgba(0,0,0,0.6)' }}
                        onClick={(e) => e.target === e.currentTarget && setConfirmDeleteId(null)}
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.85, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.85, y: 20 }}
                            transition={{ type: 'spring', stiffness: 320, damping: 28 }}
                            className="bg-surface border border-border rounded-3xl shadow-2xl w-full max-w-sm p-8 flex flex-col items-center text-center gap-5"
                        >
                            <div className="p-5 rounded-2xl bg-rose-500/10">
                                <Trash2 size={32} className="text-rose-500" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold mb-2">Delete Category?</h3>
                                <p className="text-slate-500 text-sm">
                                    This will permanently delete the category.
                                    This action cannot be undone.
                                </p>
                            </div>
                            <div className="flex gap-3 w-full">
                                <button
                                    onClick={() => setConfirmDeleteId(null)}
                                    className="flex-1 py-3 border border-border rounded-xl font-bold text-slate-400 hover:bg-slate-700 transition-all text-sm"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => handleDelete(confirmDeleteId)}
                                    disabled={deletingId === confirmDeleteId}
                                    className="flex-1 py-3 bg-rose-600 hover:bg-rose-500 disabled:opacity-60 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-all text-sm shadow-lg shadow-rose-500/25"
                                >
                                    {deletingId === confirmDeleteId
                                        ? <Loader2 size={16} className="animate-spin" />
                                        : <Trash2 size={16} />}
                                    {deletingId === confirmDeleteId ? 'Deleting…' : 'Yes, Delete'}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Categories;

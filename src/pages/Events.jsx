import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import {
    Calendar,
    MapPin,
    Clock,
    Plus,
    ArrowRight,
    Search,
    Loader2,
    X,
    CheckCircle2,
    AlertCircle,
    AlertTriangle,
    FileText,
    User,
    Edit
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
    return twMerge(clsx(inputs));
}

const Events = () => {
    const { token, user: currentUser } = useSelector(state => state.auth);
    const [events, setEvents] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingEventId, setEditingEventId] = useState(null);
    const [viewingEvent, setViewingEvent] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

    // Form state
    const [formData, setFormData] = useState({
        title: '',
        date: '',
        time: '',
        place: '',
        location: '',
        description: '',
        status: 'active',
        slots: [
            { name: 'Boy A', total: 0 },
            { name: 'Boy B', total: 0 },
            { name: 'Boy C', total: 0 }
        ]
    });

    const API_URL = '/api/events';

    const showToast = (message, type = 'success') => {
        setToast({ show: true, message, type });
        setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 4000);
    };

    useEffect(() => {
        fetchEvents();
    }, [token]);

    const fetchEvents = async () => {
        if (!token) return;
        setIsLoading(true);
        try {
            let response = await fetch(API_URL, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.status === 404 && API_URL === '/api/events') {
                response = await fetch('/api/event', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
            }

            if (!response.ok) throw new Error(`Server Error: ${response.status}`);

            const data = await response.json();
            const eventList = Array.isArray(data) ? data :
                (data && Array.isArray(data.events)) ? data.events :
                    (data && Array.isArray(data.data)) ? data.data : [];

            setEvents(eventList);
            setError(null);
        } catch (err) {
            setError(err.message);
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
            title: '',
            date: '',
            time: '',
            place: '',
            location: '',
            description: '',
            status: 'active',
            slots: [
                { name: 'Boy A', total: 0 },
                { name: 'Boy B', total: 0 },
                { name: 'Boy C', total: 0 }
            ]
        });
        setEditingEventId(null);
        setIsModalOpen(false);
    };

    const handleEdit = (event) => {
        setEditingEventId(event._id || event.id);
        setFormData({
            title: event.title || event.name || '',
            date: event.date ? new Date(event.date).toISOString().split('T')[0] : '',
            time: event.time || '',
            place: event.place || '',
            location: event.location || '',
            description: event.description || '',
            status: event.status || 'active',
            slots: event.slots || [
                { name: 'Boy A', total: 0 },
                { name: 'Boy B', total: 0 },
                { name: 'Boy C', total: 0 }
            ]
        });
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this event?')) return;
        try {
            let response = await fetch(`${API_URL}/delete/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.status === 404 && API_URL === '/api/events') {
                response = await fetch(`/api/event/delete/${id}`, {
                    method: 'DELETE',
                    headers: { 'Authorization': `Bearer ${token}` }
                });
            }

            if (!response.ok) throw new Error('Failed to delete event');
            showToast('Event deleted successfully!', 'success');
            await fetchEvents();
        } catch (err) {
            showToast(err.message, 'error');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const method = editingEventId ? 'PUT' : 'POST';
            const endpoint = editingEventId
                ? `${API_URL}/update/${editingEventId}`
                : `${API_URL}/create`;

            let response = await fetch(endpoint, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    ...formData,
                    created_by: currentUser?.name || 'Unknown'
                })
            });

            if (response.status === 404 && API_URL === '/api/events') {
                const altUrl = editingEventId ? `/api/event/update/${editingEventId}` : '/api/event/create';
                response = await fetch(altUrl, {
                    method,
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({ ...formData, created_by: currentUser?.name || 'Unknown' })
                });
            }

            if (!response.ok) {
                const data = await response.json().catch(() => ({}));
                throw new Error(data.error || data.message || `Server Error: ${response.status}`);
            }

            showToast(editingEventId ? 'Event updated!' : 'Event created!', 'success');
            await fetchEvents();
            resetForm();
        } catch (err) {
            showToast(err.message, 'error');
        }
    };

    return (
        <div className="space-y-6 relative pb-10">
            {/* Toast Notification */}
            <AnimatePresence>
                {toast.show && (
                    <motion.div
                        initial={{ opacity: 0, y: -20, x: '-50%' }}
                        animate={{ opacity: 1, y: 20, x: '-50%' }}
                        exit={{ opacity: 0, y: -20, x: '-50%' }}
                        className={cn(
                            "fixed top-4 left-1/2 z-[100] px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border min-w-[320px] backdrop-blur-md",
                            toast.type === 'success' ? "bg-emerald-500 text-white" : "bg-rose-500 text-white shadow-rose-500/20"
                        )}
                    >
                        {toast.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
                        <p className="font-bold text-sm tracking-wide">{toast.message}</p>
                        <button onClick={() => setToast({ ...toast, show: false })} className="ml-auto opacity-70 hover:opacity-100 transition-opacity">
                            <X size={16} />
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Header Section */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">Event Management</h1>
                    <p className="text-slate-500 font-medium">Coordinate catering staff and schedule events.</p>
                </div>
                <div className="flex items-center gap-3 w-full lg:w-auto">
                    <div className="relative flex-1 lg:w-72">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search by title or place..."
                            className="w-full pl-12 pr-4 py-3 bg-surface border border-border rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm font-medium"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button
                        onClick={() => { resetForm(); setIsModalOpen(true); }}
                        className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl transition-all font-bold shadow-lg shadow-blue-500/25 active:scale-95 whitespace-nowrap"
                    >
                        <Plus size={20} />
                        New Event
                    </button>
                </div>
            </div>

            {/* Main Content */}
            {isLoading ? (
                <div className="flex flex-col items-center justify-center py-20 bg-surface rounded-3xl border border-border glass-effect">
                    <Loader2 size={40} className="animate-spin text-blue-500 mb-4" />
                    <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Loading data...</p>
                </div>
            ) : error ? (
                <div className="p-8 text-center bg-rose-500/5 border border-rose-500/20 rounded-3xl text-rose-500 glass-effect">
                    <AlertTriangle size={40} className="mx-auto mb-4" />
                    <p className="font-black uppercase tracking-widest mb-2">Error</p>
                    <p className="text-sm opacity-80 mb-6">{error}</p>
                    <button onClick={fetchEvents} className="px-8 py-3 bg-rose-500 text-white rounded-xl font-bold">Retry connection</button>
                </div>
            ) : events.length === 0 ? (
                <div className="py-20 text-center bg-surface rounded-3xl border border-border glass-effect">
                    <Calendar size={48} className="mx-auto text-slate-300 mb-4" />
                    <p className="text-slate-500 font-bold uppercase tracking-widest mb-1 text-sm">No events scheduled</p>
                    <p className="text-slate-400 text-xs">Start by creating your first event.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                    {events.filter(e =>
                        (e.title || e.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                        (e.place || '').toLowerCase().includes(searchTerm.toLowerCase())
                    ).map((event) => (
                        <motion.div
                            key={event._id || event.id}
                            whileHover={{ y: -4 }}
                            className="bg-surface rounded-3xl border border-border p-6 flex flex-col hover:shadow-xl transition-all group glass-effect relative"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex-1">
                                    <h3 className="text-xl font-black group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors uppercase tracking-tight">
                                        {event.title || event.name || 'Untitled Event'}
                                    </h3>
                                    <div className="flex flex-wrap items-center gap-4 mt-3">
                                        <div className="flex items-center gap-1.5 text-slate-500 text-xs font-bold uppercase">
                                            <Calendar size={14} className="text-blue-500" />
                                            {event.date ? (isNaN(new Date(event.date).getTime()) ? event.date : new Date(event.date).toLocaleDateString()) : 'N/A'}
                                        </div>
                                        <div className="flex items-center gap-1.5 text-slate-500 text-xs font-bold uppercase">
                                            <Clock size={14} className="text-blue-500" />
                                            {event.time || 'N/A'}
                                        </div>
                                    </div>
                                </div>
                                <div className={cn(
                                    "px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest border",
                                    event.status === 'active' ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" : "bg-slate-500/10 text-slate-500 border-slate-500/20"
                                )}>
                                    {event.status}
                                </div>
                            </div>

                            <div className="space-y-3 mb-6 bg-slate-50/50 dark:bg-slate-800/20 p-4 rounded-2xl border border-border/50">
                                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300 text-sm font-bold uppercase tracking-tight">
                                    <MapPin size={16} className="text-rose-500 shrink-0" />
                                    <span>{event.place}</span>
                                </div>
                                <p className="text-slate-500 text-[10px] uppercase font-medium ml-6 opacity-70">{event.location}</p>
                            </div>

                            {/* Slots Snapshot */}
                            <div className="grid grid-cols-3 gap-3 mb-6">
                                {(event.slots || []).map((slot, index) => (
                                    <div key={index} className="bg-white dark:bg-slate-800/50 p-3 rounded-2xl border border-border flex flex-col items-center">
                                        <p className="text-[9px] text-slate-400 font-black uppercase tracking-tighter mb-1">{slot.name}</p>
                                        <span className="text-lg font-black text-slate-900 dark:text-white leading-none">{slot.total || 0}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-auto flex flex-col gap-3">
                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={() => handleDelete(event._id || event.id)}
                                        className="flex-1 py-2.5 bg-rose-500/10 hover:bg-rose-600 text-rose-600 hover:text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all"
                                    >
                                        Delete
                                    </button>
                                    <button
                                        onClick={() => handleEdit(event)}
                                        className="flex-1 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-600 dark:text-slate-300 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all"
                                    >
                                        Edit
                                    </button>
                                </div>
                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={() => handleEdit(event)}
                                        className="flex-1 py-3 bg-blue-600/5 border border-blue-500/10 hover:bg-blue-600 text-blue-600 hover:text-white text-xs font-black uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-2"
                                    >
                                        <Edit size={14} />
                                        Slots
                                    </button>
                                    <button
                                        onClick={() => setViewingEvent(event)}
                                        className="flex-1 py-3 bg-blue-600 text-white hover:bg-blue-500 text-xs font-black uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20"
                                    >
                                        Details
                                        <ArrowRight size={14} />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}

            {/* View Details Modal */}
            <AnimatePresence>
                {viewingEvent && (
                    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setViewingEvent(null)}
                            className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative w-full max-w-2xl bg-surface border border-border rounded-[2rem] shadow-2xl overflow-hidden glass-effect-heavy"
                        >
                            <div className="p-8 border-b border-border bg-white/50 dark:bg-slate-800/50">
                                <div className="flex justify-between items-start mb-6">
                                    <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${viewingEvent.status === 'active' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-slate-500/10 text-slate-500 border-slate-500/20'
                                        }`}>
                                        {viewingEvent.status}
                                    </div>
                                    <button onClick={() => setViewingEvent(null)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
                                        <X size={24} />
                                    </button>
                                </div>
                                <h2 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tighter leading-none mb-4">
                                    {viewingEvent.title || viewingEvent.name}
                                </h2>
                                <div className="flex flex-wrap gap-4 text-slate-500 font-bold text-[10px] uppercase tracking-widest">
                                    <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 rounded-lg">
                                        <Calendar size={14} className="text-blue-500" />
                                        {new Date(viewingEvent.date).toLocaleDateString()}
                                    </div>
                                    <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 rounded-lg">
                                        <Clock size={14} className="text-blue-500" />
                                        {viewingEvent.time}
                                    </div>
                                    <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 rounded-lg">
                                        <User size={14} className="text-blue-500" />
                                        By {viewingEvent.created_by}
                                    </div>
                                </div>
                            </div>

                            <div className="p-8 space-y-8 max-h-[60vh] overflow-y-auto">
                                <div className="space-y-4">
                                    <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Position</h4>
                                    <div className="bg-slate-50 dark:bg-slate-800/30 p-6 rounded-2xl border border-border space-y-2">
                                        <div className="flex items-center gap-3 text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight">
                                            <MapPin size={20} className="text-rose-500 shrink-0" />
                                            {viewingEvent.place}
                                        </div>
                                        <p className="text-slate-500 text-sm font-medium ml-8">{viewingEvent.location}</p>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Slots Breakdown</h4>
                                    <div className="grid grid-cols-3 gap-4">
                                        {(viewingEvent.slots || []).map((slot, idx) => (
                                            <div key={idx} className="bg-white dark:bg-slate-800/50 p-6 rounded-[2rem] border border-border flex flex-col items-center">
                                                <span className="text-[10px] font-black uppercase tracking-tighter text-slate-400 mb-2">{slot.name}</span>
                                                <span className="text-3xl font-black text-blue-600 dark:text-blue-400 leading-none">{slot.total}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {viewingEvent.description && (
                                    <div className="space-y-4">
                                        <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Instructions</h4>
                                        <div className="bg-blue-600/5 p-6 rounded-2xl border border-blue-500/10 italic text-slate-600 dark:text-slate-400 font-medium text-sm">
                                            "{viewingEvent.description}"
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="p-8 bg-slate-50 dark:bg-slate-800/50 border-t border-border flex gap-4">
                                <button
                                    onClick={() => { setViewingEvent(null); handleEdit(viewingEvent); }}
                                    className="flex-1 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-lg active:scale-95"
                                >
                                    Update Operational Data
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Create/Edit Modal */}
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
                            className="relative w-full max-w-lg bg-surface border border-border rounded-[2rem] shadow-2xl overflow-hidden glass-effect-heavy text-slate-900 dark:text-white"
                        >
                            <div className="p-6 border-b border-border flex items-center justify-between bg-white dark:bg-slate-800/50">
                                <div>
                                    <h2 className="text-2xl font-black uppercase tracking-tighter">{editingEventId ? 'Update Event' : 'Launch Event'}</h2>
                                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">Operational configuration</p>
                                </div>
                                <button onClick={resetForm} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                                    <X size={20} />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Event Master Title</label>
                                    <input
                                        required
                                        type="text"
                                        name="title"
                                        className="w-full bg-background border border-border rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 transition-all outline-none font-bold uppercase"
                                        value={formData.title}
                                        onChange={handleInputChange}
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Date</label>
                                        <input
                                            required
                                            type="date"
                                            name="date"
                                            className="w-full bg-background border border-border rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 transition-all outline-none font-bold"
                                            value={formData.date}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Time</label>
                                        <input
                                            required
                                            type="time"
                                            name="time"
                                            className="w-full bg-background border border-border rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 transition-all outline-none font-bold"
                                            value={formData.time}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Venue Name</label>
                                    <input
                                        required
                                        type="text"
                                        name="place"
                                        className="w-full bg-background border border-border rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 transition-all outline-none font-bold uppercase text-xs"
                                        value={formData.place}
                                        onChange={handleInputChange}
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Precise Location</label>
                                    <input
                                        required
                                        type="text"
                                        name="location"
                                        className="w-full bg-background border border-border rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 transition-all outline-none font-bold uppercase text-[10px]"
                                        value={formData.location}
                                        onChange={handleInputChange}
                                    />
                                </div>

                                <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Staff Slots Distribution</label>
                                    <div className="grid grid-cols-3 gap-3">
                                        {(formData.slots || []).map((slot, index) => (
                                            <div key={index} className="space-y-1.5">
                                                <label className="text-[9px] font-black uppercase tracking-tighter text-slate-400 ml-1 text-center block">{slot.name}</label>
                                                <input
                                                    type="number"
                                                    min="0"
                                                    className="w-full bg-background border border-border rounded-xl px-2 py-2.5 focus:ring-2 focus:ring-blue-500 transition-all outline-none text-center font-black text-blue-600 dark:text-blue-400"
                                                    value={slot.total}
                                                    onChange={(e) => {
                                                        const newSlots = [...formData.slots];
                                                        newSlots[index] = { ...newSlots[index], total: parseInt(e.target.value) || 0 };
                                                        setFormData({ ...formData, slots: newSlots });
                                                    }}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Strategic Instructions</label>
                                    <textarea
                                        name="description"
                                        rows="2"
                                        className="w-full bg-background border border-border rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 transition-all outline-none font-medium uppercase text-xs resize-none"
                                        value={formData.description}
                                        onChange={handleInputChange}
                                    />
                                </div>

                                <div className="pt-4 flex gap-4">
                                    <button
                                        type="button"
                                        onClick={resetForm}
                                        className="flex-1 py-4 border border-border rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                                    >
                                        Abort
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-lg shadow-blue-500/25 active:scale-95 transition-all"
                                    >
                                        {editingEventId ? 'Commit' : 'Deploy'}
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

export default Events;

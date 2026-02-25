import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import {
    Calendar,
    MapPin,
    Clock,
    Plus,
    ArrowRight
} from 'lucide-react';
import { motion } from 'framer-motion';

const Events = () => {
    const { events } = useSelector(state => state.app);

    const calculateProgress = (booked, required) => {
        const totalBooked = Object.values(booked).reduce((a, b) => a + b, 0);
        const totalRequired = Object.values(required).reduce((a, b) => a + b, 0);
        return (totalBooked / totalRequired) * 100;
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Event Management</h1>
                    <p className="text-slate-500 mt-1">Schedule, manage slots, and monitor catering staff bookings.</p>
                </div>
                <button className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl transition-all font-bold shadow-lg shadow-blue-500/25">
                    <Plus size={20} />
                    Create New Event
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {events.map((event) => {
                    const progress = calculateProgress(event.booked, event.required);
                    return (
                        <motion.div
                            key={event.id}
                            whileHover={{ y: -4 }}
                            className="bg-surface rounded-2xl border border-border p-6 flex flex-col hover:shadow-xl transition-all group"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex-1">
                                    <h3 className="text-xl font-bold group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors uppercase tracking-tight">{event.title}</h3>
                                    <div className="flex items-center gap-4 mt-2">
                                        <div className="flex items-center gap-1.5 text-slate-500 text-sm">
                                            <Calendar size={14} className="text-blue-500" />
                                            {event.date}
                                        </div>
                                        <div className="flex items-center gap-1.5 text-slate-500 text-sm">
                                            <Clock size={14} className="text-blue-500" />
                                            {event.time}
                                        </div>
                                    </div>
                                </div>
                                <div className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider ${event.status === 'Full' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 'bg-blue-500/10 text-blue-500 border border-blue-500/20'
                                    }`}>
                                    {event.status}
                                </div>
                            </div>

                            <div className="flex items-center gap-2 text-slate-500 text-sm mb-6">
                                <MapPin size={16} className="text-rose-500" />
                                {event.location}
                            </div>

                            <div className="mt-auto space-y-4">
                                <div className="space-y-2">
                                    <div className="flex justify-between text-xs font-bold uppercase tracking-widest">
                                        <span className="text-slate-400">Slots Booking Progress</span>
                                        <span className={progress === 100 ? 'text-emerald-500' : 'text-blue-500'}>{Math.round(progress)}%</span>
                                    </div>
                                    <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${progress}%` }}
                                            className={`h-full ${progress === 100 ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 'bg-blue-600 shadow-[0_0_10px_rgba(59,130,246,0.5)]'}`}
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-3 gap-4">
                                    {['A', 'B', 'C'].map((cat) => (
                                        <div key={cat} className="bg-background p-3 rounded-xl border border-border">
                                            <p className="text-[10px] text-slate-500 font-bold uppercase mb-1">Boy {cat}</p>
                                            <div className="flex items-baseline gap-1">
                                                <span className="text-lg font-bold">{event.booked[cat]}</span>
                                                <span className="text-xs text-slate-500">/ {event.required[cat]}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="flex items-center gap-3 pt-4">
                                    <button className="flex-1 py-2.5 bg-background border border-border hover:bg-slate-100 dark:hover:bg-slate-800 text-sm font-bold rounded-xl transition-all">
                                        Manage Slots
                                    </button>
                                    <button className="flex-1 py-2.5 bg-blue-600/10 hover:bg-blue-600 text-blue-600 dark:text-blue-400 hover:text-white text-sm font-bold rounded-xl transition-all flex items-center justify-center gap-2 group/btn">
                                        View Details
                                        <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
};

export default Events;

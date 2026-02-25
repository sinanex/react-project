import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toggleTheme } from '../store/store';
import {
    User,
    Bell,
    Shield,
    Sliders,
    Database,
    Globe,
    Moon,
    Sun,
    Monitor
} from 'lucide-react';
import { motion } from 'framer-motion';

const Settings = () => {
    const dispatch = useDispatch();
    const currentTheme = useSelector(state => state.app.ui.theme);

    const settingsSections = [
        { title: 'Account Settings', icon: User, desc: 'Manage your profile and personal information.' },
        { title: 'Notifications', icon: Bell, desc: 'Configure how you receive alerts and updates.' },
        { title: 'Security', icon: Shield, desc: 'Update passwords and security preferences.' },
        { title: 'System Configuration', icon: Sliders, desc: 'Adjust platform-wide constants.' },
        { title: 'Data Management', icon: Database, desc: 'Export or purge historical system data.' },
        { title: 'Localization', icon: Globe, desc: 'Regional settings and currency formats.' },
    ];

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">System Settings</h1>
                <p className="text-slate-500 mt-1">Global configuration for the Catering SaaS Platform.</p>
            </div>

            {/* Appearance Section */}
            <section className="bg-surface rounded-3xl border border-border overflow-hidden">
                <div className="p-8 border-b border-border">
                    <h2 className="text-xl font-bold mb-1">Appearance</h2>
                    <p className="text-sm text-slate-500">Customize how the platform looks on your device.</p>
                </div>
                <div className="p-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <button
                            onClick={() => currentTheme !== 'light' && dispatch(toggleTheme())}
                            className={`p-6 rounded-2xl border-2 transition-all flex flex-col items-center gap-4 ${currentTheme === 'light' ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-500/10' : 'border-border bg-transparent hover:border-slate-400'
                                }`}
                        >
                            <div className={`p-4 rounded-xl ${currentTheme === 'light' ? 'bg-blue-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}`}>
                                <Sun size={24} />
                            </div>
                            <div className="text-center">
                                <p className="font-bold">Light Mode</p>
                                <p className="text-xs text-slate-500 mt-1">Clean and sharp</p>
                            </div>
                        </button>

                        <button
                            onClick={() => currentTheme !== 'dark' && dispatch(toggleTheme())}
                            className={`p-6 rounded-2xl border-2 transition-all flex flex-col items-center gap-4 ${currentTheme === 'dark' ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-500/10' : 'border-border bg-transparent hover:border-slate-400'
                                }`}
                        >
                            <div className={`p-4 rounded-xl ${currentTheme === 'dark' ? 'bg-blue-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}`}>
                                <Moon size={24} />
                            </div>
                            <div className="text-center">
                                <p className="font-bold">Dark Mode</p>
                                <p className="text-xs text-slate-500 mt-1">Easy on the eyes</p>
                            </div>
                        </button>

                        <button className="p-6 rounded-2xl border-2 border-border bg-transparent opacity-50 cursor-not-allowed flex flex-col items-center gap-4">
                            <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500">
                                <Monitor size={24} />
                            </div>
                            <div className="text-center">
                                <p className="font-bold">System Default</p>
                                <p className="text-xs text-slate-500 mt-1">Auto-sync with OS</p>
                            </div>
                        </button>
                    </div>
                </div>
            </section>

            {/* Other Sections Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {settingsSections.map((section) => (
                    <button key={section.title} className="flex gap-4 p-6 bg-surface rounded-2xl border border-border hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all text-left group">
                        <div className="p-3 bg-blue-500/10 rounded-xl text-blue-500 h-fit group-hover:scale-110 transition-transform">
                            <section.icon size={24} />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold">{section.title}</h3>
                            <p className="text-slate-500 text-sm mt-1">{section.desc}</p>
                        </div>
                    </button>
                ))}
            </div>

            <div className="bg-rose-500/10 p-8 rounded-3xl border border-rose-500/20 mt-12">
                <h3 className="text-rose-500 font-bold mb-2">Danger Zone</h3>
                <p className="text-slate-500 text-sm mb-6">Actions here are permanent and cannot be undone. Please be certain.</p>
                <button className="px-8 py-3 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-rose-500/20">
                    Deactivate Platform
                </button>
            </div>
        </div>
    );
};

export default Settings;

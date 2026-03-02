import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import {
    Users, Calendar, CheckCircle2, Clock, IndianRupee,
    TrendingUp, TrendingDown, ArrowUpRight, Loader2, MapPin
} from 'lucide-react';
import {
    XAxis, YAxis, CartesianGrid, Tooltip,
    ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell
} from 'recharts';
import { motion } from 'framer-motion';

const StatCard = ({ title, value, icon: Icon, trend, trendValue, loading }) => (
    <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="card p-6 flex flex-col justify-between group relative overflow-hidden transition-all hover:translate-y-[-2px]"
    >
        <div className="flex justify-between items-start z-10">
            <div>
                <p className="text-sm font-semibold mb-1" style={{ color: 'var(--text-muted)' }}>{title}</p>
                {loading ? (
                    <div className="h-8 w-20 bg-slate-200 dark:bg-slate-700 animate-pulse rounded-lg mt-1" />
                ) : (
                    <h3 className="text-2xl font-black mb-2" style={{ color: 'var(--text-primary)' }}>{value}</h3>
                )}
                <div className="flex items-center gap-1.5 mt-2">
                    <div className={`px-2 py-0.5 rounded-lg text-xs font-bold flex items-center gap-1
                        ${trend === 'up' ? 'badge-active' : 'badge-inactive'}`}>
                        {trend === 'up' ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                        {trendValue}
                    </div>
                </div>
            </div>
            <div className={`p-3 rounded-2xl bg-primary/10 text-primary shadow-lg shadow-primary/10 transition-transform group-hover:scale-110`}>
                <Icon size={24} />
            </div>
        </div>
        <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-primary/5 blur-3xl rounded-full" />
    </motion.div>
);

const Dashboard = () => {
    const { token } = useSelector(state => state.auth);
    const [isLoading, setIsLoading] = useState(true);
    const [dashboardData, setDashboardData] = useState({
        events: [],
        users: [],
        categories: [],
        counts: { staff: 0, events: 0 }
    });

    const COLORS = ['#3b82f6', '#818cf8', '#6366f1', '#4f46e5', '#ec4899', '#f59e0b'];

    useEffect(() => {
        if (token) {
            fetchDashboardData();
        }
    }, [token]);

    const fetchDashboardData = async () => {
        setIsLoading(true);
        try {
            const headers = { 'Authorization': `Bearer ${token}` };

            // Fetch all required data in parallel
            const [eventsRes, usersRes, catsRes] = await Promise.all([
                fetch('/api/events', { headers }),
                fetch('/api/users', { headers }),
                fetch('/api/boy-categories', { headers })
            ]);

            const eventsData = await eventsRes.json();
            const usersData = await usersRes.json();
            const catsData = await catsRes.json();

            const events = Array.isArray(eventsData) ? eventsData : (eventsData.data || []);
            const users = Array.isArray(usersData) ? usersData : (usersData.data || []);
            const categories = Array.isArray(catsData) ? catsData : (catsData.data || []);

            setDashboardData({
                events,
                users,
                categories,
                counts: {
                    staff: users.length,
                    events: events.filter(e => e.status === 'active').length
                }
            });
        } catch (err) {
            console.error('Dashboard fetch error:', err);
        } finally {
            setIsLoading(false);
        }
    };

    // Process Pie Data from live users and categories
    const getPieData = () => {
        if (dashboardData.categories.length === 0) return [];

        const distribution = dashboardData.categories.map(cat => {
            const count = dashboardData.users.filter(u => u.role_type === cat.name || u.usertype === cat.name).length;
            return { name: cat.name, value: count };
        }).filter(d => d.value > 0);

        // Add Admin if present
        const adminCount = dashboardData.users.filter(u => u.usertype === 'Admin').length;
        if (adminCount > 0) distribution.push({ name: 'Admin', value: adminCount });

        const total = distribution.reduce((sum, d) => sum + d.value, 0);
        return distribution.map(d => ({
            ...d,
            percent: total > 0 ? Math.round((d.value / total) * 100) : 0
        }));
    };

    const pieData = getPieData();
    const upcomingEvents = dashboardData.events.filter(e => e.status === 'active').slice(0, 5);
    const recentActivity = dashboardData.users.slice(-4).reverse();

    const revenueMock = [
        { month: 'Jan', revenue: 45000 },
        { month: 'Feb', revenue: 52000 },
        { month: 'Mar', revenue: 48000 },
        { month: 'Apr', revenue: 61000 },
        { month: 'May', revenue: 55000 },
        { month: 'Jun', revenue: 67000 },
    ];

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-black tracking-tight uppercase" style={{ color: 'var(--text-primary)' }}>
                        Analytics Overview
                    </h1>
                    <p className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>
                        Live monitoring of your mission operations.
                    </p>
                </div>
                {isLoading && <Loader2 className="animate-spin text-primary mb-2" size={20} />}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Total Staff" value={dashboardData.counts.staff} icon={Users} trend="up" trendValue="+12.5%" loading={isLoading} />
                <StatCard title="Active Events" value={dashboardData.counts.events} icon={Calendar} trend="up" trendValue="Syncing" loading={isLoading} />
                <StatCard title="Total Revenue" value="₹3,28,000" icon={IndianRupee} trend="up" trendValue="+8.2%" />
                <StatCard title="Health Score" value="98.2%" icon={CheckCircle2} trend="up" trendValue="+0.4%" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 card p-8">
                    <div className="flex justify-between items-center mb-10">
                        <div>
                            <h3 className="font-bold text-lg" style={{ color: 'var(--text-primary)' }}>Performance Trace</h3>
                            <p className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Revenue and activity consistency</p>
                        </div>
                    </div>
                    <div className="h-80 w-full pr-4">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={revenueMock}>
                                <defs>
                                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.4} />
                                        <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" opacity={0.5} />
                                <XAxis dataKey="month" stroke="var(--text-muted)" axisLine={false} tickLine={false} tick={{ fontSize: 11, fontWeight: 600 }} dy={10} />
                                <YAxis stroke="var(--text-muted)" axisLine={false} tickLine={false} tick={{ fontSize: 11, fontWeight: 600 }} />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: 'var(--bg-surface)',
                                        border: '1px solid var(--border-color)',
                                        borderRadius: '16px',
                                        boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
                                        color: 'var(--text-primary)',
                                        fontSize: '12px',
                                        fontWeight: 'bold'
                                    }}
                                    itemStyle={{ color: 'var(--color-primary)' }}
                                />
                                <Area type="monotone" dataKey="revenue" stroke="var(--color-primary)" strokeWidth={4} fillOpacity={1} fill="url(#colorRev)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="card p-8 flex flex-col">
                    <h3 className="font-bold text-lg mb-1" style={{ color: 'var(--text-primary)' }}>Workforce</h3>
                    <p className="text-xs font-medium mb-8" style={{ color: 'var(--text-muted)' }}>Skill category distribution</p>

                    <div className="flex-1 flex items-center justify-center relative min-h-[220px]">
                        {isLoading ? (
                            <Loader2 size={30} className="animate-spin text-slate-300" />
                        ) : pieData.length > 0 ? (
                            <>
                                <ResponsiveContainer width="100%" height={220}>
                                    <PieChart>
                                        <Pie
                                            data={pieData}
                                            cx="50%" cy="50%"
                                            innerRadius={65} outerRadius={85}
                                            paddingAngle={8} dataKey="value"
                                            stroke="none"
                                        >
                                            {pieData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} cornerRadius={6} />
                                            ))}
                                        </Pie>
                                        <Tooltip
                                            contentStyle={{
                                                backgroundColor: 'var(--bg-surface)',
                                                border: '1px solid var(--border-color)',
                                                borderRadius: '12px'
                                            }}
                                        />
                                    </PieChart>
                                </ResponsiveContainer>
                                <div className="absolute flex flex-col items-center">
                                    <span className="text-2xl font-black" style={{ color: 'var(--text-primary)' }}>100%</span>
                                    <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>Total</span>
                                </div>
                            </>
                        ) : (
                            <p className="text-xs text-slate-400 italic">Data unavailable</p>
                        )}
                    </div>

                    <div className="mt-8 space-y-3">
                        {pieData.map((item, i) => (
                            <div key={item.name} className="flex items-center justify-between p-2 rounded-xl hover:bg-white/5 transition-colors text-slate-900 dark:text-white">
                                <div className="flex items-center gap-3">
                                    <div className="w-2.5 h-2.5 rounded-full shadow-lg" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                                    <span className="text-xs font-bold uppercase tracking-tight opacity-70">{item.name}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-[10px] font-bold px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 rounded opacity-60">{item.value}</span>
                                    <span className="text-sm font-black">{item.percent}%</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="card overflow-hidden">
                    <div className="p-6 border-b border-border flex justify-between items-center bg-sidebar/30">
                        <h3 className="font-bold text-lg" style={{ color: 'var(--text-primary)' }}>Upcoming Ops</h3>
                        <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/10 text-emerald-500 rounded-full">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="text-[10px] font-black uppercase tracking-widest">{upcomingEvents.length} Active</span>
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr style={{ background: 'var(--bg-sidebar)', borderBottom: '1px solid var(--border-color)' }}>
                                    <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-500">Event</th>
                                    <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-500">Location</th>
                                    <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-500">Scale</th>
                                    <th className="px-6 py-4" />
                                </tr>
                            </thead>
                            <tbody className="divide-y borderless" style={{ borderColor: 'var(--divider-color)' }}>
                                {upcomingEvents.length === 0 && !isLoading ? (
                                    <tr>
                                        <td colSpan="4" className="px-6 py-10 text-center text-xs text-slate-400 italic">No scheduled events</td>
                                    </tr>
                                ) : upcomingEvents.map((event) => (
                                    <tr key={event._id || event.id} className="hover:bg-slate-400/5 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div>
                                                <p className="text-sm font-black group-hover:text-primary transition-colors text-slate-900 dark:text-white uppercase tracking-tight">{event.title || event.name}</p>
                                                <p className="text-[10px] font-bold mt-0.5 flex items-center gap-1.5 text-slate-400">
                                                    <Calendar size={10} /> {new Date(event.date).toLocaleDateString()}
                                                </p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500">
                                                <MapPin size={12} className="text-rose-500 opacity-60" />
                                                {event.place}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex gap-1.5">
                                                {(event.slots || []).slice(0, 2).map((s, i) => (
                                                    <span key={i} className="px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-500 text-[9px] font-black border border-blue-500/20">
                                                        {s.total}
                                                    </span>
                                                ))}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-slate-100 dark:bg-slate-800 group-hover:bg-primary group-hover:text-white transition-all shadow-sm">
                                                <ArrowUpRight size={14} />
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="card p-8">
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h3 className="font-bold text-lg" style={{ color: 'var(--text-primary)' }}>Terminal Hook</h3>
                            <p className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Latest system registration & activity</p>
                        </div>
                        <div className="p-3 rounded-2xl text-primary bg-primary/10">
                            <Clock size={16} />
                        </div>
                    </div>
                    <div className="space-y-8 relative">
                        <div className="absolute left-[19px] top-2 bottom-2 w-px bg-border/40" />

                        {recentActivity.length === 0 && !isLoading ? (
                            <p className="text-xs text-slate-400 italic py-4">Waiting for incoming logs...</p>
                        ) : recentActivity.map((user, idx) => (
                            <div key={user._id || user.id} className="flex gap-5 relative z-10 transition-all hover:translate-x-1">
                                <div className="w-10 h-10 rounded-full flex items-center justify-center border border-border shadow-md shrink-0 bg-surface">
                                    <div className={`w-2 h-2 rounded-full ${idx === 0 ? 'bg-emerald-500 animate-pulse' : 'bg-primary'}`} />
                                </div>
                                <div className="pt-1.5">
                                    <p className="text-sm font-bold leading-tight text-slate-900 dark:text-white">
                                        <span className="text-blue-500 font-black">{user.name}</span> registered as <span className="opacity-50 text-[10px] uppercase font-black">{user.role_type || user.usertype}</span>
                                    </p>
                                    <p className="text-[10px] font-black uppercase tracking-widest mt-1 text-slate-400">
                                        Origin: {user.place || 'Field HQ'}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;

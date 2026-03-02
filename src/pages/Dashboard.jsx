import React from 'react';
import { useSelector } from 'react-redux';
import {
    Users, Calendar, CheckCircle2, Clock, IndianRupee,
    TrendingUp, TrendingDown, ArrowUpRight
} from 'lucide-react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
    ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell
} from 'recharts';
import { motion } from 'framer-motion';

const StatCard = ({ title, value, icon: Icon, trend, trendValue, colorClass }) => (
    <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="card p-6 flex flex-col justify-between group relative overflow-hidden transition-all hover:translate-y-[-2px]"
    >
        <div className="flex justify-between items-start z-10">
            <div>
                <p className="text-sm font-semibold mb-1" style={{ color: 'var(--text-muted)' }}>{title}</p>
                <h3 className="text-2xl font-black mb-2" style={{ color: 'var(--text-primary)' }}>{value}</h3>
                <div className="flex items-center gap-1.5">
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
        {/* Subtle background glow */}
        <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-primary/5 blur-3xl rounded-full" />
    </motion.div>
);

const Dashboard = () => {
    const { boys, events, revenue } = useSelector(state => state.app);

    const COLORS = ['#3b82f6', '#818cf8', '#6366f1', '#4f46e5'];

    const pieData = [
        { name: 'Boy A', value: 15 },
        { name: 'Boy B', value: 25 },
        { name: 'Boy C', value: 30 },
        { name: 'Admin', value: 5 },
    ];

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-black tracking-tight" style={{ color: 'var(--text-primary)' }}>
                    Analytics Overview
                </h1>
                <p className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>
                    Insights and performance monitoring for your event workforce.
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Total Staff" value={boys.length} icon={Users} trend="up" trendValue="+12.5%" />
                <StatCard title="Active Events" value={events.length} icon={Calendar} trend="up" trendValue="+2 new" />
                <StatCard title="Monthly Revenue" value={`₹${revenue.totalRevenue.toLocaleString()}`} icon={IndianRupee} trend="up" trendValue="+8.2%" />
                <StatCard title="Completion Rate" value="98.2%" icon={CheckCircle2} trend="up" trendValue="+0.4%" />
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Revenue Area Chart */}
                <div className="lg:col-span-2 card p-8">
                    <div className="flex justify-between items-center mb-10">
                        <div>
                            <h3 className="font-bold text-lg" style={{ color: 'var(--text-primary)' }}>Revenue Stream</h3>
                            <p className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Monthly financial performance overview</p>
                        </div>
                        <select
                            className="text-xs font-bold rounded-xl px-4 py-2 outline-none transition-all"
                            style={{ background: 'var(--bg-sidebar)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}
                        >
                            <option>Last 6 Months</option>
                            <option>Last Year</option>
                        </select>
                    </div>
                    <div className="h-80 w-full pr-4">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={revenue.monthly}>
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

                {/* Categories Pie Chart */}
                <div className="card p-8 flex flex-col">
                    <h3 className="font-bold text-lg mb-1" style={{ color: 'var(--text-primary)' }}>Workforce</h3>
                    <p className="text-xs font-medium mb-8" style={{ color: 'var(--text-muted)' }}>Distribution by staff category</p>

                    <div className="flex-1 flex items-center justify-center relative">
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
                        {/* Middle Text */}
                        <div className="absolute flex flex-col items-center">
                            <span className="text-2xl font-black" style={{ color: 'var(--text-primary)' }}>100%</span>
                            <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>Total</span>
                        </div>
                    </div>

                    <div className="mt-8 space-y-3">
                        {pieData.map((item, i) => (
                            <div key={item.name} className="flex items-center justify-between p-2 rounded-xl hover:bg-white/5 transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className="w-2.5 h-2.5 rounded-full shadow-lg" style={{ backgroundColor: COLORS[i], boxShadow: `0 0 10px ${COLORS[i]}44` }} />
                                    <span className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>{item.name}</span>
                                </div>
                                <span className="text-sm font-black" style={{ color: 'var(--text-primary)' }}>{item.value}%</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Bottom Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="card overflow-hidden">
                    <div className="p-6 border-b border-border flex justify-between items-center bg-sidebar/30">
                        <h3 className="font-bold text-lg" style={{ color: 'var(--text-primary)' }}>Upcoming Events</h3>
                        <button className="text-xs font-bold uppercase tracking-widest hover:text-primary transition-colors" style={{ color: 'var(--color-primary)' }}>View Schedule</button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr style={{ background: 'var(--bg-sidebar)', borderBottom: '1px solid var(--border-color)' }}>
                                    <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>Event Detail</th>
                                    <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>Location</th>
                                    <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>Status</th>
                                    <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-right" style={{ color: 'var(--text-muted)' }}>Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y" style={{ borderColor: 'var(--divider-color)' }}>
                                {events.map((event) => (
                                    <tr key={event.id} className="hover:bg-slate-400/5 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div>
                                                <p className="text-sm font-bold group-hover:text-primary transition-colors" style={{ color: 'var(--text-primary)' }}>{event.title}</p>
                                                <p className="text-[10px] font-semibold mt-0.5" style={{ color: 'var(--text-muted)' }}>{event.date}</p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-xs font-medium" style={{ color: 'var(--text-muted)' }}>{event.location}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2.5 py-1 rounded-lg text-[9px] font-bold uppercase tracking-tighter ${event.status === 'Upcoming' ? 'badge-active' : 'bg-indigo-500/10 text-indigo-400'}`}>
                                                {event.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button className="p-2 rounded-lg border border-border hover:border-primary transition-all" style={{ background: 'var(--bg-main)', color: 'var(--text-muted)' }}>
                                                <ArrowUpRight size={14} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="card p-8">
                    <div className="flex justify-between items-center mb-8">
                        <h3 className="font-bold text-lg" style={{ color: 'var(--text-primary)' }}>Recent Activity</h3>
                        <div className="p-2 rounded-lg text-primary bg-primary/10">
                            <Clock size={16} />
                        </div>
                    </div>
                    <div className="space-y-8 relative">
                        {/* Vertical Line */}
                        <div className="absolute left-[19px] top-2 bottom-2 w-px bg-border" />

                        {[1, 2, 3, 4].map((item) => (
                            <div key={item} className="flex gap-5 relative z-10">
                                <div className="w-10 h-10 rounded-full flex items-center justify-center border border-border shadow-sm shrink-0" style={{ background: 'var(--bg-surface)' }}>
                                    <div className="w-2 h-2 rounded-full bg-primary" />
                                </div>
                                <div className="pt-2">
                                    <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                                        <span className="font-black">Rahul Sharma</span> confirmed attendance for <span className="font-black text-primary">Wedding Function</span>
                                    </p>
                                    <p className="text-[10px] font-bold uppercase tracking-widest mt-1.5" style={{ color: 'var(--text-muted)' }}>2 hours ago</p>
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

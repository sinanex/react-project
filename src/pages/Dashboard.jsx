import React from 'react';
import { useSelector } from 'react-redux';
import {
    Users,
    Calendar,
    CheckCircle2,
    Clock,
    IndianRupee,
    TrendingUp,
    TrendingDown,
    ArrowUpRight
} from 'lucide-react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    AreaChart,
    Area,
    PieChart,
    Pie,
    Cell
} from 'recharts';
import { motion } from 'framer-motion';

const StatCard = ({ title, value, icon: Icon, trend, trendValue, color }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-surface p-6 rounded-2xl border border-border hover:border-primary/50 transition-all hover:shadow-lg group"
    >
        <div className="flex justify-between items-start">
            <div>
                <p className="text-slate-500 text-sm font-medium mb-1">{title}</p>
                <h3 className="text-2xl font-bold mb-2">{value}</h3>
                <div className="flex items-center gap-1">
                    {trend === 'up' ? (
                        <TrendingUp size={16} className="text-emerald-500" />
                    ) : (
                        <TrendingDown size={16} className="text-rose-500" />
                    )}
                    <span className={trend === 'up' ? 'text-emerald-500' : 'text-rose-500'} font-bold>
                        {trendValue}
                    </span>
                    <span className="text-slate-500 text-xs ml-1 font-medium">vs last month</span>
                </div>
            </div>
            <div className={`p-3 rounded-xl bg-primary/10 text-primary group-hover:scale-110 transition-transform`}>
                <Icon size={24} />
            </div>
        </div>
    </motion.div>
);

const Dashboard = () => {
    const { boys, events, revenue } = useSelector(state => state.app);

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

    const pieData = [
        { name: 'Admin', value: 2 },
        { name: 'Boy A', value: 15 },
        { name: 'Boy B', value: 25 },
        { name: 'Boy C', value: 30 },
    ];

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Overview</h1>
                <p className="text-slate-500 mt-1">Welcome back, here's what's happening with your events.</p>
            </div>

            {/* Stats Grid */}
            <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            >
                <StatCard title="Total Registered Boys" value={boys.length} icon={Users} trend="up" trendValue="+12%" color="blue" />
                <StatCard title="Active Events" value={events.length} icon={Calendar} trend="up" trendValue="+5%" color="purple" />
                <StatCard title="Monthly Revenue" value={`₹${revenue.totalRevenue.toLocaleString()}`} icon={IndianRupee} trend="up" trendValue="+18%" color="emerald" />
                <StatCard title="Completed Tasks" value="142" icon={CheckCircle2} trend="down" trendValue="-3%" color="amber" />
            </motion.div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Revenue Area Chart */}
                <div className="lg:col-span-2 bg-surface p-6 rounded-2xl border border-border">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold text-lg">Revenue Overview</h3>
                        <select className="bg-background border border-border text-xs rounded-lg px-3 py-1.5 focus:ring-1 focus:ring-primary outline-none">
                            <option>Last 6 Months</option>
                            <option>Last Year</option>
                        </select>
                    </div>
                    <div className="h-80 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={revenue.monthly}>
                                <defs>
                                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="currentColor" opacity={0.1} vertical={false} />
                                <XAxis dataKey="month" stroke="#64748b" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                                <YAxis stroke="#64748b" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: '12px' }}
                                />
                                <Area type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Categories Pie Chart */}
                <div className="bg-surface p-6 rounded-2xl border border-border">
                    <h3 className="font-bold text-lg mb-6">Staff Distribution</h3>
                    <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={pieData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={8}
                                    dataKey="value"
                                >
                                    {pieData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: '12px' }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="mt-4 space-y-3">
                        {pieData.map((item, i) => (
                            <div key={item.name} className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                                    <span className="text-slate-500 text-sm">{item.name}</span>
                                </div>
                                <span className="text-sm font-bold">{item.value}%</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Bottom Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-surface rounded-2xl border border-border overflow-hidden">
                    <div className="p-6 border-b border-border flex justify-between items-center">
                        <h3 className="font-bold text-lg">Upcoming Events</h3>
                        <button className="text-primary text-sm font-medium hover:underline">View All</button>
                    </div>
                    <div className="p-0 overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 font-medium text-xs uppercase tracking-wider">
                                    <th className="px-6 py-4">Event</th>
                                    <th className="px-6 py-4">Location</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {events.map((event) => (
                                    <tr key={event.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div>
                                                <p className="text-sm font-bold group-hover:text-primary transition-colors">{event.title}</p>
                                                <p className="text-xs text-slate-500 mt-0.5">{event.date}</p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-500">{event.location}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase ${event.status === 'Upcoming' ? 'bg-blue-500/10 text-blue-500' : 'bg-emerald-500/10 text-emerald-500'
                                                }`}>
                                                {event.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <button className="p-2 bg-background border border-border hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
                                                <ArrowUpRight size={16} className="text-slate-400" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="bg-surface p-6 rounded-2xl border border-border">
                    <h3 className="font-bold text-lg mb-6">Recent Activity</h3>
                    <div className="space-y-6">
                        {[1, 2, 3, 4].map((item) => (
                            <div key={item} className="flex gap-4">
                                <div className="relative">
                                    <div className="w-10 h-10 rounded-full bg-background flex items-center justify-center border border-border">
                                        <Clock size={18} className="text-primary" />
                                    </div>
                                    {item !== 4 && <div className="absolute top-10 left-5 w-px h-10 bg-border" />}
                                </div>
                                <div>
                                    <p className="text-sm">
                                        <span className="font-bold">Rahul Sharma</span> booked for <span className="font-bold text-primary">Grand Wedding Reception</span>
                                    </p>
                                    <p className="text-xs text-slate-500 mt-1">2 hours ago</p>
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

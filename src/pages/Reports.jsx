import React from 'react';
import { BarChart3, PieChart, TrendingUp, Download, Calendar } from 'lucide-react';

const Reports = () => {
    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black tracking-tight" style={{ color: 'var(--text-primary)' }}>Analytics & Reports</h1>
                    <p className="text-sm font-medium mt-1" style={{ color: 'var(--text-muted)' }}>Deep dive into event performance and staff efficiency.</p>
                </div>
                <div className="flex bg-main p-1 rounded-2xl border" style={{ background: 'var(--bg-main)', borderColor: 'var(--border-color)' }}>
                    <button className="px-6 py-2.5 rounded-xl text-sm font-bold transition-all shadow-sm bg-surface" style={{ background: 'var(--bg-surface)', color: 'var(--text-primary)' }}>Monthly</button>
                    <button className="px-6 py-2.5 rounded-xl text-sm font-bold transition-all hover:bg-surface/50" style={{ color: 'var(--text-muted)' }}>Annual</button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="card p-10 flex flex-col items-center justify-center min-h-[300px] text-center group cursor-pointer hover:border-primary transition-all">
                    <div className="w-20 h-20 rounded-3xl bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                        <BarChart3 size={36} style={{ color: 'var(--color-primary)' }} />
                    </div>
                    <h3 className="text-xl font-black mb-2" style={{ color: 'var(--text-primary)' }}>Performance Metrics</h3>
                    <p className="text-sm font-medium leading-relaxed max-w-xs" style={{ color: 'var(--text-muted)' }}>Generating real-time statistics for all active staff and ongoing events.</p>
                </div>
                <div className="card p-10 flex flex-col items-center justify-center min-h-[300px] text-center group cursor-pointer transition-all border-emerald-500/0 hover:border-emerald-500">
                    <div className="w-20 h-20 rounded-3xl bg-emerald-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                        <PieChart size={36} color="#10b981" />
                    </div>
                    <h3 className="text-xl font-black mb-2" style={{ color: 'var(--text-primary)' }}>Resource Allocation</h3>
                    <p className="text-sm font-medium leading-relaxed max-w-xs" style={{ color: 'var(--text-muted)' }}>Track how staff categories are distributed across different locations.</p>
                </div>
            </div>

            <div className="card p-8">
                <h3 className="font-bold text-lg mb-6" style={{ color: 'var(--text-primary)' }}>Available Reports</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {['Staff Attendance', 'Event Expenses', 'Category Wages', 'Booking Trends', 'Revenue Summary', 'Staff Ratings'].map((report, idx) => (
                        <button key={report} className="flex items-center justify-between p-5 rounded-2xl border transition-all hover:translate-y-[-2px] group"
                            style={{ background: 'var(--bg-main)', borderColor: 'var(--border-color)', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
                            <div className="text-left">
                                <p className="font-bold text-sm mb-1 group-hover:text-primary transition-colors" style={{ color: 'var(--text-primary)' }}>{report}</p>
                                <p className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>Last updated: 2 days ago</p>
                            </div>
                            <div className="p-2.5 rounded-xl bg-surface border transition-colors group-hover:border-primary group-hover:text-primary"
                                style={{ background: 'var(--bg-surface)', borderColor: 'var(--border-color)', color: 'var(--text-muted)' }}>
                                <Download size={16} />
                            </div>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Reports;

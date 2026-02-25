import React from 'react';
import { BarChart3, PieChart, TrendingUp, Download, Calendar } from 'lucide-react';

const Reports = () => {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">Analytics & Reports</h1>
                    <p className="text-slate-500 mt-1">Deep dive into event performance and staff efficiency.</p>
                </div>
                <div className="flex gap-3">
                    <button className="px-4 py-2 bg-slate-800 text-white rounded-xl border border-slate-700 font-medium">Monthly</button>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-xl font-bold">Annual</button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-slate-900/50 p-8 rounded-2xl border border-slate-800 flex flex-col items-center justify-center min-h-[300px] text-center">
                    <div className="w-16 h-16 rounded-2xl bg-blue-500/10 flex items-center justify-center mb-4">
                        <BarChart3 size={32} className="text-blue-500" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">Performance Metrics</h3>
                    <p className="text-slate-500 max-w-sm">Generating real-time statistics for all active staff and ongoing events.</p>
                </div>
                <div className="bg-slate-900/50 p-8 rounded-2xl border border-slate-800 flex flex-col items-center justify-center min-h-[300px] text-center">
                    <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 flex items-center justify-center mb-4">
                        <PieChart size={32} className="text-emerald-500" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">Resource Allocation</h3>
                    <p className="text-slate-500 max-w-sm">Track how staff categories are distributed across different locations.</p>
                </div>
            </div>

            <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800">
                <h3 className="font-bold text-white text-lg mb-6 uppercase tracking-tight">Available Reports</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {['Staff Attendance', 'Event Expenses', 'Category Wages', 'Booking Trends', 'Revenue Summary', 'Staff Ratings'].map((report) => (
                        <button key={report} className="flex items-center justify-between p-4 bg-slate-950/50 rounded-xl border border-slate-800 hover:border-blue-500 transition-all text-left">
                            <div>
                                <p className="text-white font-bold">{report}</p>
                                <p className="text-xs text-slate-500 mt-1">Last updated: 2 days ago</p>
                            </div>
                            <Download size={18} className="text-slate-500" />
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Reports;

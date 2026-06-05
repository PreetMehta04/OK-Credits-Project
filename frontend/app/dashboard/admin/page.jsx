'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart2, Package, AlertTriangle, Sparkles, TrendingUp, Users } from 'lucide-react';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useAdminStats } from '@/hooks/useRecommendations';

const MOCK_SALES_DATA = Array.from({ length: 30 }, (_, i) => ({
  date: `Jun ${i + 1}`,
  sales: Math.floor(Math.random() * 50000) + 10000,
  sessions: Math.floor(Math.random() * 200) + 50,
}));

const MOCK_CATEGORY_DATA = [
  { name: 'Silk', value: 38 },
  { name: 'Cotton', value: 25 },
  { name: 'Chiffon', value: 20 },
  { name: 'Georgette', value: 17 },
];

const PIE_COLORS = ['#D4AF37', '#FF6B35', '#4F46E5', '#10B981'];

const STAT_CARDS = [
  { label: 'Total Revenue', value: '₹4,28,500', change: '+12%', icon: <TrendingUp className="w-5 h-5" />, color: 'text-green-400' },
  { label: 'Active Products', value: '284', change: '+8', icon: <Package className="w-5 h-5" />, color: 'text-blue-400' },
  { label: 'AI Sessions Today', value: '1,247', change: '+34%', icon: <Sparkles className="w-5 h-5" />, color: 'text-yellow-400' },
  { label: 'Try-On Count', value: '342', change: '+22%', icon: <Users className="w-5 h-5" />, color: 'text-pink-400' },
];

export default function AdminDashboard() {
  const [dateRange, setDateRange] = useState('30');

  return (
    <div className="min-h-screen bg-slate-950 pt-20">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display text-3xl font-bold text-gradient-gold">Admin Dashboard</h1>
            <p className="text-slate-400 mt-1">Store analytics and management</p>
          </div>
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="glass px-4 py-2 rounded-xl text-sm text-white border border-white/10 outline-none"
          >
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="90">Last 90 days</option>
          </select>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {STAT_CARDS.map((stat, i) => (
            <motion.div
              key={stat.label}
              className="glass rounded-2xl p-5"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <div className={`mb-3 ${stat.color}`}>{stat.icon}</div>
              <p className="text-2xl font-bold text-white">{stat.value}</p>
              <p className="text-slate-500 text-sm mt-0.5">{stat.label}</p>
              <p className="text-green-400 text-xs mt-1">{stat.change} vs last period</p>
            </motion.div>
          ))}
        </div>

        {/* Charts row */}
        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          {/* Sales trend */}
          <div className="lg:col-span-2 glass rounded-2xl p-6">
            <h2 className="font-semibold text-white mb-4">Sales & AI Session Trend</h2>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={MOCK_SALES_DATA}>
                <defs>
                  <linearGradient id="salesGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#D4AF37" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" tick={{ fill: '#64748b', fontSize: 10 }} interval={6} />
                <YAxis tick={{ fill: '#64748b', fontSize: 10 }} />
                <Tooltip contentStyle={{ background: 'rgba(15,23,42,0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff' }} />
                <Area type="monotone" dataKey="sales" stroke="#D4AF37" fill="url(#salesGrad)" strokeWidth={2} name="Revenue (₹)" />
                <Area type="monotone" dataKey="sessions" stroke="#FF6B35" fill="none" strokeWidth={2} strokeDasharray="4 2" name="AI Sessions" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Category split */}
          <div className="glass rounded-2xl p-6">
            <h2 className="font-semibold text-white mb-4">By Category</h2>
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie data={MOCK_CATEGORY_DATA} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value">
                  {MOCK_CATEGORY_DATA.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: 'rgba(15,23,42,0.9)', borderRadius: '12px', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-wrap gap-2 mt-2">
              {MOCK_CATEGORY_DATA.map((c, i) => (
                <div key={c.name} className="flex items-center gap-1 text-xs text-slate-400">
                  <div className="w-2 h-2 rounded-full" style={{ background: PIE_COLORS[i] }} />
                  {c.name}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Low stock alerts */}
        <div className="glass rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="w-5 h-5 text-yellow-400" />
            <h2 className="font-semibold text-white">Low Stock Alerts</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-slate-500 border-b border-white/10">
                  <th className="text-left pb-2 font-medium">Product Code</th>
                  <th className="text-left pb-2 font-medium">Name</th>
                  <th className="text-left pb-2 font-medium">Fabric</th>
                  <th className="text-right pb-2 font-medium">Stock</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { code: 'KSK012', name: 'Kanjivaram Ruby Red', fabric: 'Silk', stock: 2 },
                  { code: 'BNR089', name: 'Banarasi Gold Zari', fabric: 'Banarasi', stock: 3 },
                  { code: 'CHF045', name: 'Chiffon Rose Pink', fabric: 'Chiffon', stock: 1 },
                ].map((row) => (
                  <tr key={row.code} className="border-b border-white/5 hover:bg-white/5">
                    <td className="py-3 font-mono text-yellow-400">{row.code}</td>
                    <td className="py-3 text-white">{row.name}</td>
                    <td className="py-3 text-slate-400">{row.fabric}</td>
                    <td className="py-3 text-right">
                      <span className="bg-red-500/20 text-red-400 px-2 py-0.5 rounded-full text-xs font-medium">
                        {row.stock} left
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

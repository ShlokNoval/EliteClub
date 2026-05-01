import { motion } from 'framer-motion';
import { Users, Crown, Building2, IndianRupee, ScanLine, TrendingUp, UserPlus, AlertTriangle, XCircle, ShieldAlert } from 'lucide-react';
import * as Icons from 'lucide-react';
import PageTransition from '../../components/layout/PageTransition';
import GlassCard from '../../components/common/GlassCard';
import Badge from '../../components/common/Badge';
import { adminStats, recentActivity, revenueChartData, scansChartData } from '../../data/mockData';
import { formatCurrency } from '../../utils/helpers';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const statCards = [
  { icon: Users, label: 'Total Users', value: adminStats.totalUsers, color: 'text-blue-400', bg: 'bg-blue-400/10' },
  { icon: Crown, label: 'Active Members', value: adminStats.activeMembers, color: 'text-green-400', bg: 'bg-green-400/10' },
  { icon: Building2, label: 'Verified Hotels', value: `${adminStats.verifiedHotels}/${adminStats.totalHotels}`, color: 'text-gold', bg: 'bg-gold/10' },
  { icon: IndianRupee, label: 'Monthly Revenue', value: formatCurrency(adminStats.monthlyRevenue), color: 'text-gold-light', bg: 'bg-gold-light/10' },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-strong rounded-lg px-4 py-3 text-xs">
        <p className="text-gold font-semibold">{label}</p>
        <p className="text-champagne">{payload[0].name}: {typeof payload[0].value === 'number' && payload[0].value > 1000 ? formatCurrency(payload[0].value) : payload[0].value}</p>
      </div>
    );
  }
  return null;
};

export default function AdminOverview() {
  return (
    <PageTransition>
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-playfair text-3xl font-bold text-champagne mb-1">
          Admin <span className="text-gold-gradient">Overview</span>
        </h1>
        <p className="text-smoke">Welcome back, Admin. Here's what's happening.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        {statCards.map((stat, i) => (
          <GlassCard key={i} delay={i * 0.1} className="p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-smoke text-xs font-medium uppercase tracking-wider">{stat.label}</p>
                <p className={`text-2xl font-bold mt-2 ${stat.color}`}>{stat.value}</p>
              </div>
              <div className={`w-12 h-12 rounded-xl ${stat.bg} flex items-center justify-center`}>
                <stat.icon size={22} className={stat.color} />
              </div>
            </div>
          </GlassCard>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Revenue Chart */}
        <GlassCard hover={false}>
          <h3 className="text-champagne font-semibold mb-6 flex items-center gap-2">
            <TrendingUp size={18} className="text-gold" />
            Revenue Trend
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueChartData}>
                <defs>
                  <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#C9A94E" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#C9A94E" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="month" stroke="#666" fontSize={12} />
                <YAxis stroke="#666" fontSize={12} tickFormatter={(v) => `₹${(v/1000).toFixed(0)}k`} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="revenue" stroke="#C9A94E" fill="url(#revenueGradient)" strokeWidth={2} name="Revenue" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        {/* Scans Chart */}
        <GlassCard hover={false}>
          <h3 className="text-champagne font-semibold mb-6 flex items-center gap-2">
            <ScanLine size={18} className="text-gold" />
            Weekly Scans
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={scansChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="day" stroke="#666" fontSize={12} />
                <YAxis stroke="#666" fontSize={12} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="scans" fill="#6B1D2A" radius={[6, 6, 0, 0]} name="Scans" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>
      </div>

      {/* Recent Activity */}
      <GlassCard hover={false}>
        <h3 className="text-champagne font-semibold mb-6">Recent Activity</h3>
        <div className="space-y-4">
          {recentActivity.map((activity, i) => {
            const Icon = Icons[activity.icon] || Icons.Activity;
            return (
              <motion.div
                key={activity.id}
                className="flex items-start gap-4 pb-4 border-b border-white/5 last:border-0 last:pb-0"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <div className="w-10 h-10 rounded-lg bg-gold/8 border border-gold/10 flex items-center justify-center shrink-0">
                  <Icon size={18} className="text-gold" />
                </div>
                <div className="flex-1">
                  <p className="text-champagne-dark text-sm">{activity.message}</p>
                  <p className="text-ash text-xs mt-1">{activity.time}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </GlassCard>
    </PageTransition>
  );
}

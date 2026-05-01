import { motion } from 'framer-motion';
import { ScanLine, CheckCircle2, XCircle, AlertTriangle, TrendingUp } from 'lucide-react';
import PageTransition from '../../components/layout/PageTransition';
import GlassCard from '../../components/common/GlassCard';
import Badge from '../../components/common/Badge';
import { hotelStats, currentHotel, mockScans } from '../../data/mockData';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const dailyData = [
  { hour: '6pm', scans: 2 }, { hour: '7pm', scans: 5 }, { hour: '8pm', scans: 8 },
  { hour: '9pm', scans: 12 }, { hour: '10pm', scans: 9 }, { hour: '11pm', scans: 4 },
];

export default function HotelOverview() {
  const hotelScans = mockScans.filter(s => s.hotelId === currentHotel.id).slice(0, 5);

  return (
    <PageTransition>
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-playfair text-3xl font-bold text-champagne mb-1">{currentHotel.name}</h1>
          <p className="text-smoke flex items-center gap-2">Hotel Dashboard <Badge status={currentHotel.status}/></p>
        </div>
        <Badge status={currentHotel.role} className="text-sm px-4 py-2"/>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { icon: ScanLine, label: 'Today', value: hotelStats.todayScans, color: 'text-blue-400', bg: 'bg-blue-400/10' },
          { icon: CheckCircle2, label: 'Valid', value: hotelStats.validScans, color: 'text-green-400', bg: 'bg-green-400/10' },
          { icon: XCircle, label: 'Invalid', value: hotelStats.invalidScans, color: 'text-red-400', bg: 'bg-red-400/10' },
          { icon: AlertTriangle, label: 'Expired', value: hotelStats.expiredScans, color: 'text-yellow-400', bg: 'bg-yellow-400/10' },
        ].map((s, i) => (
          <GlassCard key={i} delay={i * 0.1} className="p-5">
            <div className={`w-10 h-10 rounded-xl ${s.bg} flex items-center justify-center mb-3`}><s.icon size={20} className={s.color}/></div>
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-smoke text-xs">{s.label} Scans</p>
          </GlassCard>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GlassCard hover={false}>
          <h3 className="text-champagne font-semibold mb-6 flex items-center gap-2"><TrendingUp size={18} className="text-gold"/>Today's Activity</h3>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dailyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)"/>
                <XAxis dataKey="hour" stroke="#666" fontSize={12}/>
                <YAxis stroke="#666" fontSize={12}/>
                <Tooltip contentStyle={{ background: '#111', border: '1px solid rgba(201,169,78,0.2)', borderRadius: '8px', color: '#F5E6CC', fontSize: '12px' }}/>
                <Bar dataKey="scans" fill="#C9A94E" radius={[6,6,0,0]} name="Scans"/>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        <GlassCard hover={false}>
          <h3 className="text-champagne font-semibold mb-4">Recent Scans</h3>
          <div className="space-y-3">
            {hotelScans.map((scan, i) => (
              <motion.div key={scan.id} className="flex items-center justify-between pb-3 border-b border-white/5 last:border-0"
                initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}>
                <div>
                  <p className="text-champagne text-sm font-medium">{scan.userName}</p>
                  <p className="text-ash text-xs">{scan.plan} • {new Date(scan.timestamp).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</p>
                </div>
                <Badge status={scan.result}/>
              </motion.div>
            ))}
          </div>
        </GlassCard>
      </div>
    </PageTransition>
  );
}

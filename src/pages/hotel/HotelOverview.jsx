import { useState, useEffect } from 'react';
import { ScanLine, CheckCircle2, XCircle, AlertTriangle, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';
import PageTransition from '../../components/layout/PageTransition';
import GlassCard from '../../components/common/GlassCard';
import Badge from '../../components/common/Badge';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function HotelOverview() {
  const { hotel } = useAuth();
  const [stats, setStats] = useState({ today: 0, valid: 0, invalid: 0, expired: 0, total: 0 });
  const [recentScans, setRecentScans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { if (hotel) fetchData(); }, [hotel]);

  const fetchData = async () => {
    try {
      const todayStart = new Date(); todayStart.setHours(0, 0, 0, 0);

      const [scansRes, recentRes] = await Promise.all([
        supabase.from('scans').select('result, created_at').eq('hotel_id', hotel.id),
        supabase.from('scans').select('*, profiles:member_id(full_name)').eq('hotel_id', hotel.id).order('created_at', { ascending: false }).limit(10),
      ]);

      const scans = scansRes.data || [];
      const todayScans = scans.filter(s => new Date(s.created_at) >= todayStart);

      setStats({
        today: todayScans.length,
        valid: todayScans.filter(s => s.result === 'valid').length,
        invalid: todayScans.filter(s => s.result === 'invalid' || s.result === 'not_found').length,
        expired: todayScans.filter(s => s.result === 'expired').length,
        total: scans.length,
      });
      setRecentScans(recentRes.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!hotel) return null;

  return (
    <PageTransition>
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-playfair text-3xl font-bold text-champagne mb-1">{hotel.name}</h1>
          <p className="text-smoke flex items-center gap-2">Hotel Dashboard <Badge status={hotel.status} /></p>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { icon: ScanLine, label: "Today's Scans", value: stats.today, color: 'text-blue-400', bg: 'bg-blue-400/10' },
          { icon: CheckCircle2, label: 'Valid', value: stats.valid, color: 'text-green-400', bg: 'bg-green-400/10' },
          { icon: XCircle, label: 'Invalid', value: stats.invalid, color: 'text-red-400', bg: 'bg-red-400/10' },
          { icon: AlertTriangle, label: 'Expired', value: stats.expired, color: 'text-yellow-400', bg: 'bg-yellow-400/10' },
        ].map((s, i) => (
          <GlassCard key={i} delay={i * 0.1} className="p-5">
            <div className={`w-10 h-10 rounded-xl ${s.bg} flex items-center justify-center mb-3`}><s.icon size={20} className={s.color} /></div>
            <p className={`text-2xl font-bold ${s.color}`}>{loading ? '...' : s.value}</p>
            <p className="text-smoke text-xs">{s.label}</p>
          </GlassCard>
        ))}
      </div>

      {/* Recent Scans */}
      <GlassCard hover={false}>
        <h3 className="text-champagne font-semibold mb-4">Recent Scans</h3>
        {loading ? <p className="text-smoke text-center py-8">Loading...</p> : recentScans.length === 0 ? (
          <p className="text-smoke text-center py-8">No scans yet. Use the QR Scanner to verify members.</p>
        ) : (
          <div className="space-y-3">
            {recentScans.map((scan, i) => (
              <motion.div key={scan.id} className="flex items-center justify-between pb-3 border-b border-white/5 last:border-0"
                initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}>
                <div>
                  <p className="text-champagne text-sm font-medium">{scan.profiles?.full_name || scan.card_id}</p>
                  <p className="text-ash text-xs">{scan.scan_type.replace('_', ' ')} • {new Date(scan.created_at).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</p>
                </div>
                <Badge status={scan.result} />
              </motion.div>
            ))}
          </div>
        )}
      </GlassCard>
    </PageTransition>
  );
}

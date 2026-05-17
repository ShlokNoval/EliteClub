import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, XCircle, AlertTriangle, Clock, Search } from 'lucide-react';
import PageTransition from '../../components/layout/PageTransition';
import GlassCard from '../../components/common/GlassCard';
import Badge from '../../components/common/Badge';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';

export default function HotelScans() {
  const { hotel } = useAuth();
  const [scans, setScans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { if (hotel) fetchScans(); }, [hotel]);

  const fetchScans = async () => {
    const { data } = await supabase.from('scans')
      .select('*, profiles:member_id(full_name, plan)')
      .eq('hotel_id', hotel.id)
      .order('created_at', { ascending: false })
      .limit(100);
    setScans(data || []);
    setLoading(false);
  };

  const stats = {
    total: scans.length,
    valid: scans.filter(s => s.result === 'valid').length,
    failed: scans.filter(s => s.result !== 'valid').length,
  };

  return (
    <PageTransition>
      <div className="mb-8">
        <h1 className="font-playfair text-3xl font-bold text-champagne mb-1">Scan <span className="text-gold-gradient">History</span></h1>
        <p className="text-smoke">All QR scans at {hotel?.name}.</p>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: 'Total', value: stats.total, color: 'text-blue-400' },
          { label: 'Valid', value: stats.valid, color: 'text-green-400' },
          { label: 'Failed', value: stats.failed, color: 'text-red-400' },
        ].map((s, i) => (
          <GlassCard key={i} delay={i * 0.1} className="p-4 text-center">
            <p className={`text-2xl font-bold ${s.color}`}>{loading ? '...' : s.value}</p>
            <p className="text-smoke text-xs">{s.label}</p>
          </GlassCard>
        ))}
      </div>

      <GlassCard hover={false}>
        {loading ? <p className="text-smoke text-center py-12">Loading...</p> : scans.length === 0 ? (
          <p className="text-smoke text-center py-12">No scans recorded yet.</p>
        ) : (
          <div className="space-y-0">
            {scans.map((scan, i) => (
              <motion.div key={scan.id}
                className="flex items-center gap-4 p-4 border-b border-white/5 last:border-0 hover:bg-white/2 transition-colors"
                initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.03 }}>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${scan.result === 'valid' ? 'bg-green-400/10' : scan.result === 'expired' ? 'bg-yellow-400/10' : 'bg-red-400/10'}`}>
                  {scan.result === 'valid' ? <CheckCircle2 size={20} className="text-green-400" /> :
                   scan.result === 'expired' ? <AlertTriangle size={20} className="text-yellow-400" /> :
                   <XCircle size={20} className="text-red-400" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-champagne font-medium text-sm truncate">{scan.profiles?.full_name || scan.card_id}</p>
                  <p className="text-ash text-xs capitalize">{scan.scan_type?.replace('_', ' ')} {scan.card_id === 'MANUAL' && '(Forced)'} • {scan.profiles?.plan || 'Unknown'}</p>
                </div>
                <div className="text-right shrink-0">
                  <Badge status={scan.result} />
                  <p className="text-ash text-xs mt-1 flex items-center gap-1 justify-end">
                    <Clock size={10} />
                    {new Date(scan.created_at).toLocaleString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </GlassCard>
    </PageTransition>
  );
}

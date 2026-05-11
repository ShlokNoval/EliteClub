import { useState, useEffect } from 'react';
import { MapPin, Clock, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';
import PageTransition from '../../components/layout/PageTransition';
import GlassCard from '../../components/common/GlassCard';
import Badge from '../../components/common/Badge';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';

export default function HotelVisits() {
  const { hotel } = useAuth();
  const [visits, setVisits] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { if (hotel) fetchVisits(); }, [hotel]);

  const fetchVisits = async () => {
    const { data } = await supabase.from('visits')
      .select('*, profiles:member_id(full_name, member_id, plan)')
      .eq('hotel_id', hotel.id)
      .order('created_at', { ascending: false })
      .limit(100);
    setVisits(data || []);
    setLoading(false);
  };

  const openVisits = visits.filter(v => v.status === 'open');
  const closedVisits = visits.filter(v => v.status === 'closed');

  return (
    <PageTransition>
      <div className="mb-8">
        <h1 className="font-playfair text-3xl font-bold text-champagne mb-1">Visit <span className="text-gold-gradient">Management</span></h1>
        <p className="text-smoke">Active and completed visits at {hotel?.name}.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <GlassCard className="p-5 text-center">
          <p className="text-2xl font-bold text-yellow-400">{loading ? '...' : openVisits.length}</p>
          <p className="text-smoke text-xs">Active (Open)</p>
        </GlassCard>
        <GlassCard className="p-5 text-center">
          <p className="text-2xl font-bold text-green-400">{loading ? '...' : closedVisits.length}</p>
          <p className="text-smoke text-xs">Completed (Closed)</p>
        </GlassCard>
      </div>

      {/* Active Visits */}
      {openVisits.length > 0 && (
        <GlassCard hover={false} className="mb-6">
          <h3 className="text-champagne font-semibold mb-4 flex items-center gap-2">
            <Clock size={18} className="text-yellow-400" /> Active Visits
          </h3>
          <div className="space-y-3">
            {openVisits.map(v => (
              <div key={v.id} className="flex items-center justify-between p-3 rounded-xl bg-yellow-400/5 border border-yellow-400/10">
                <div>
                  <p className="text-champagne font-medium text-sm">{v.profiles?.full_name || '—'}</p>
                  <p className="text-ash text-xs">{v.profiles?.member_id} • Checked in at {new Date(v.check_in).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</p>
                </div>
                <Badge status="pending" />
              </div>
            ))}
          </div>
        </GlassCard>
      )}

      {/* Completed Visits */}
      <GlassCard hover={false}>
        <h3 className="text-champagne font-semibold mb-4 flex items-center gap-2">
          <CheckCircle2 size={18} className="text-green-400" /> Completed Visits
        </h3>
        {loading ? <p className="text-smoke text-center py-8">Loading...</p> : closedVisits.length === 0 ? (
          <p className="text-smoke text-center py-8">No completed visits yet.</p>
        ) : (
          <div className="space-y-0">
            {closedVisits.map((v, i) => (
              <motion.div key={v.id}
                className="flex items-center gap-4 p-4 border-b border-white/5 last:border-0"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}>
                <div className="w-10 h-10 rounded-xl bg-green-400/10 flex items-center justify-center shrink-0">
                  <MapPin size={18} className="text-green-400" />
                </div>
                <div className="flex-1">
                  <p className="text-champagne font-medium text-sm">{v.profiles?.full_name || '—'}</p>
                  <p className="text-ash text-xs capitalize">{v.profiles?.plan || '—'} • {v.profiles?.member_id}</p>
                </div>
                <div className="text-right text-xs">
                  <p className="text-champagne-dark">In: {new Date(v.check_in).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</p>
                  <p className="text-champagne-dark">Out: {v.check_out ? new Date(v.check_out).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) : '—'}</p>
                  <p className="text-ash mt-1">{new Date(v.check_in).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}</p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </GlassCard>
    </PageTransition>
  );
}

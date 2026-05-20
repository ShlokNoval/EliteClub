import { useState, useEffect } from 'react';
import { ScanLine, CheckCircle2, XCircle, AlertTriangle, History, Calendar, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import PageTransition from '../../components/layout/PageTransition';
import GlassCard from '../../components/common/GlassCard';
import Badge from '../../components/common/Badge';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';

export default function HotelOverview() {
  const { hotel } = useAuth();
  const [stats, setStats] = useState({ today: 0, valid: 0, invalid: 0, expired: 0, total: 0 });
  const [todayScans, setTodayScans] = useState([]);
  const [allScans, setAllScans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showHistory, setShowHistory] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(false);

  useEffect(() => { if (hotel) fetchData(); }, [hotel]);

  const fetchData = async () => {
    try {
      const todayStart = new Date(); todayStart.setHours(0, 0, 0, 0);

      const [todayScansRes, totalCountRes, visitsRes] = await Promise.all([
        // Today's scans only
        supabase.from('scans')
          .select('*, profiles:member_id(full_name)')
          .eq('hotel_id', hotel.id)
          .gte('created_at', todayStart.toISOString())
          .order('created_at', { ascending: false }),
        // Total scan count
        supabase.from('scans')
          .select('result, created_at')
          .eq('hotel_id', hotel.id),
        // Today's visits for unique visitors
        supabase.from('visits')
          .select('member_id, created_at')
          .eq('hotel_id', hotel.id)
          .gte('created_at', todayStart.toISOString())
      ]);

      const todayData = todayScansRes.data || [];
      const allScansData = totalCountRes.data || [];
      const visits = visitsRes.data || [];
      const uniqueVisitors = new Set(visits.map(v => v.member_id)).size;

      setStats({
        uniqueVisitors,
        valid: todayData.filter(s => s.result === 'valid').length,
        invalid: todayData.filter(s => s.result === 'invalid' || s.result === 'not_found').length,
        expired: todayData.filter(s => s.result === 'expired').length,
        total: allScansData.length,
      });
      setTodayScans(todayData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllHistory = async () => {
    if (allScans.length > 0) {
      setShowHistory(!showHistory);
      return;
    }
    setHistoryLoading(true);
    setShowHistory(true);
    try {
      const { data } = await supabase.from('scans')
        .select('*, profiles:member_id(full_name)')
        .eq('hotel_id', hotel.id)
        .order('created_at', { ascending: false })
        .limit(200);
      setAllScans(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setHistoryLoading(false);
    }
  };

  const formatDateTime = (dateStr) => {
    const d = new Date(dateStr);
    const today = new Date();
    const yesterday = new Date(); yesterday.setDate(yesterday.getDate() - 1);
    
    const time = d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
    
    if (d.toDateString() === today.toDateString()) return `Today, ${time}`;
    if (d.toDateString() === yesterday.toDateString()) return `Yesterday, ${time}`;
    return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) + `, ${time}`;
  };

  const formatDateOnly = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  // Group scans by date for history view
  const groupedHistory = allScans.reduce((groups, scan) => {
    const date = formatDateOnly(scan.created_at);
    if (!groups[date]) groups[date] = [];
    groups[date].push(scan);
    return groups;
  }, {});

  if (!hotel) return null;

  const ScanRow = ({ scan, i, showDate }) => (
    <motion.div key={scan.id} className="flex items-center justify-between pb-3 border-b border-white/5 last:border-0"
      initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.03 }}>
      <div className="min-w-0 flex-1">
        <p className="text-champagne text-sm font-medium truncate">{scan.profiles?.full_name || scan.card_id}</p>
        <p className="text-ash text-xs">
          {scan.scan_type.replace('_', ' ')} • {showDate ? formatDateTime(scan.created_at) : new Date(scan.created_at).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>
      <Badge status={scan.result} />
    </motion.div>
  );

  return (
    <PageTransition>
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-playfair text-3xl font-bold text-champagne mb-1">{hotel.name}</h1>
          <p className="text-smoke flex items-center gap-2">Hotel Dashboard <Badge status={hotel.status} /></p>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        {[
          { icon: ScanLine, label: "Unique Visitors (Today)", value: stats.uniqueVisitors, color: 'text-blue-400', bg: 'bg-blue-400/10' },
          { icon: CheckCircle2, label: 'Valid Scans (Today)', value: stats.valid, color: 'text-green-400', bg: 'bg-green-400/10' },
          { icon: XCircle, label: 'Invalid Scans (Today)', value: stats.invalid, color: 'text-red-400', bg: 'bg-red-400/10' },
          { icon: AlertTriangle, label: 'Expired Scans (Today)', value: stats.expired, color: 'text-yellow-400', bg: 'bg-yellow-400/10' },
          { icon: History, label: 'Total Scans (All Time)', value: stats.total, color: 'text-gold', bg: 'bg-gold/10' },
        ].map((s, i) => (
          <GlassCard key={i} delay={i * 0.1} className="p-5">
            <div className={`w-10 h-10 rounded-xl ${s.bg} flex items-center justify-center mb-3`}><s.icon size={20} className={s.color} /></div>
            <p className={`text-2xl font-bold ${s.color}`}>{loading ? '...' : s.value}</p>
            <p className="text-smoke text-xs">{s.label}</p>
          </GlassCard>
        ))}
      </div>

      {/* Today's Scans */}
      <GlassCard hover={false} className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-champagne font-semibold flex items-center gap-2">
            <Calendar size={16} className="text-gold" /> Today's Scans
            <span className="text-xs text-ash font-normal ml-1">({todayScans.length})</span>
          </h3>
          <p className="text-ash text-xs">{new Date().toLocaleDateString('en-IN', { weekday: 'long', day: '2-digit', month: 'short', year: 'numeric' })}</p>
        </div>
        {loading ? <p className="text-smoke text-center py-8">Loading...</p> : todayScans.length === 0 ? (
          <p className="text-smoke text-center py-8">No scans today. Use the QR Scanner to verify members.</p>
        ) : (
          <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
            {todayScans.map((scan, i) => (
              <ScanRow key={scan.id} scan={scan} i={i} showDate={false} />
            ))}
          </div>
        )}
      </GlassCard>

      {/* Full Scan History */}
      <GlassCard hover={false}>
        <button 
          onClick={fetchAllHistory}
          className="w-full flex items-center justify-between cursor-pointer"
        >
          <h3 className="text-champagne font-semibold flex items-center gap-2">
            <History size={16} className="text-gold" /> Full Scan History
            <span className="text-xs text-ash font-normal ml-1">({stats.total} total)</span>
          </h3>
          {showHistory ? <ChevronUp size={18} className="text-smoke" /> : <ChevronDown size={18} className="text-smoke" />}
        </button>

        <AnimatePresence>
          {showHistory && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              {historyLoading ? (
                <p className="text-smoke text-center py-8 mt-4">Loading scan history...</p>
              ) : allScans.length === 0 ? (
                <p className="text-smoke text-center py-8 mt-4">No scan history found.</p>
              ) : (
                <div className="mt-4 max-h-[500px] overflow-y-auto pr-1 space-y-6">
                  {Object.entries(groupedHistory).map(([date, scans]) => (
                    <div key={date}>
                      <div className="sticky top-0 z-10 bg-obsidian/80 backdrop-blur-sm py-1 mb-2">
                        <p className="text-xs font-semibold text-gold uppercase tracking-wider">{date}</p>
                      </div>
                      <div className="space-y-3">
                        {scans.map((scan, i) => (
                          <ScanRow key={scan.id} scan={scan} i={i} showDate={true} />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </GlassCard>
    </PageTransition>
  );
}

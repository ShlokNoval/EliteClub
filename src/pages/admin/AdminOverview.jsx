import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Crown, Building2, IndianRupee, ScanLine, TrendingUp, MapPin, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import PageTransition from '../../components/layout/PageTransition';
import GlassCard from '../../components/common/GlassCard';
import Modal from '../../components/common/Modal';
import { supabase } from '../../lib/supabase';
import { formatCurrency, formatDate } from '../../utils/helpers';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

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
  const navigate = useNavigate();
  const [stats, setStats] = useState({ totalUsers: 0, activeMembers: 0, totalHotels: 0, verifiedHotels: 0, totalScans: 0, totalRevenue: 0 });
  const [activity, setActivity] = useState([]);
  const [activeVisits, setActiveVisits] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [selectedHotel, setSelectedHotel] = useState(null);
  const [loading, setLoading] = useState(true);

  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [profilesRes, hotelsRes, scansRes, billsRes, visitsRes] = await Promise.all([
        supabase.from('profiles').select('id, role, status').eq('role', 'member'),
        supabase.from('hotels').select('id, name, location, status'),
        supabase.from('scans').select('id, created_at, result, card_id, scan_type, hotels(name)').order('created_at', { ascending: false }).limit(1000),
        supabase.from('bills').select('food_bev_cost, liquor_cost_billed, created_at'),
        supabase.from('visits').select('id, check_in, hotel_id, profiles(full_name, member_id), hotels(name)').eq('status', 'open').order('check_in', { ascending: false }),
      ]);


      if (profilesRes.error) throw profilesRes.error;
      if (hotelsRes.error) throw hotelsRes.error;
      if (scansRes.error) throw scansRes.error;
      if (billsRes.error) throw billsRes.error;

      const members = profilesRes.data || [];
      const hotels = hotelsRes.data || [];
      const scans = scansRes.data || [];
      const bills = billsRes.data || [];
      const activeVisitsData = visitsRes?.data || [];

      setActiveVisits(activeVisitsData);
      setHotels(hotels.filter(h => h.status === 'verified'));

      const totalRevenue = bills.reduce((sum, b) => sum + Number(b.food_bev_cost || 0) + Number(b.liquor_cost_billed || 0), 0);

      setStats({
        totalUsers: members.length,
        activeMembers: members.filter(m => m.status === 'active').length,
        totalHotels: hotels.length,
        verifiedHotels: hotels.filter(h => h.status === 'verified').length,
        totalScans: scans.length,
        totalRevenue,
      });

      // Build recent activity from scans
      setActivity(scans.map(s => ({
        id: s.id,
        message: s.card_id === 'MANUAL'
          ? `Admin Manual Override — ${(s.scan_type || 'unknown').replace('_', ' ')}`
          : `QR ${s.card_id} scanned at ${s.hotels?.name || 'Unknown Venue'} — ${s.result} (${(s.scan_type || 'unknown').replace('_', ' ')})`,
        time: new Date(s.created_at).toLocaleString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }),
      })));
    } catch (err) {
      console.error('Error loading admin data:', err);
      setErrorMsg(err.message || 'Unknown error');
    } finally {
      setLoading(false);
    }
  };


  const statCards = [
    { icon: Users, label: 'Total Members', value: stats.totalUsers, color: 'text-blue-400', bg: 'bg-blue-400/10', onClick: () => navigate('/admin/users') },
    { icon: Crown, label: 'Active Members', value: stats.activeMembers, color: 'text-green-400', bg: 'bg-green-400/10', onClick: () => navigate('/admin/users', { state: { filter: 'active' } }) },
    { icon: Building2, label: 'Hotels', value: `${stats.verifiedHotels}/${stats.totalHotels}`, color: 'text-gold', bg: 'bg-gold/10', onClick: () => navigate('/admin/hotels') },
    { icon: IndianRupee, label: 'Total Revenue', value: formatCurrency(stats.totalRevenue), color: 'text-gold-light', bg: 'bg-gold-light/10', onClick: () => navigate('/admin/bills') },
  ];

  return (
    <PageTransition>
      <div className="mb-8">
        <h1 className="font-playfair text-3xl font-bold text-champagne mb-1">
          Admin <span className="text-gold-gradient">Overview</span>
        </h1>
        <p className="text-smoke">Welcome back, Admin. Here's what's happening.</p>
        
        {errorMsg && (
          <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400">
            <strong>Error loading data:</strong> {errorMsg}
          </div>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        {statCards.map((stat, i) => (
          <GlassCard key={i} delay={i * 0.1} className={`p-5 ${stat.onClick ? 'cursor-pointer hover:bg-white/5 transition-colors' : ''}`}>
            <div className="flex items-start justify-between" onClick={stat.onClick}>
              <div>
                <p className="text-smoke text-xs font-medium uppercase tracking-wider">{stat.label}</p>
                <p className={`text-2xl font-bold mt-2 ${stat.color}`}>
                  {loading ? '...' : stat.value}
                </p>
              </div>
              <div className={`w-12 h-12 rounded-xl ${stat.bg} flex items-center justify-center`}>
                <stat.icon size={22} className={stat.color} />
              </div>
            </div>
          </GlassCard>
        ))}
      </div>

      {/* Recent Activity */}
      <GlassCard hover={false}>
        <h3 className="text-champagne font-semibold mb-6 flex items-center gap-2">
          <ScanLine size={18} className="text-gold" />
          Recent Scan Activity
        </h3>
        {loading ? (
          <p className="text-smoke text-sm py-8 text-center">Loading...</p>
        ) : activity.length === 0 ? (
          <p className="text-smoke text-sm py-8 text-center">No activity yet. Scans will appear here.</p>
        ) : (
          <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
            {activity.map((item, i) => (
              <motion.div
                key={item.id}
                className="flex items-start gap-4 pb-4 border-b border-white/5 last:border-0 last:pb-0"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <div className="w-10 h-10 rounded-lg bg-gold/8 border border-gold/10 flex items-center justify-center shrink-0">
                  <ScanLine size={18} className="text-gold" />
                </div>
                <div className="flex-1">
                  <p className="text-champagne-dark text-sm">{item.message}</p>
                  <p className="text-ash text-xs mt-1">{item.time}</p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </GlassCard>

      {/* Live Venue Status (Hotel Cards) */}
      <div className="mt-8 mb-6">
        <h3 className="text-champagne font-semibold mb-6 flex items-center gap-2">
          <Building2 size={18} className="text-gold" />
          Live Venue Status
        </h3>
        {loading ? (
          <p className="text-smoke text-sm">Loading venues...</p>
        ) : hotels.length === 0 ? (
          <p className="text-smoke text-sm">No verified partner venues found.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {hotels.map((hotel, i) => {
              const activeCount = activeVisits.filter(v => v.hotel_id === hotel.id).length;
              return (
                <GlassCard 
                  key={hotel.id} 
                  delay={i * 0.05} 
                  className="cursor-pointer hover:bg-white/5 transition-colors group"
                  onClick={() => setSelectedHotel(hotel)}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center shrink-0">
                        <Building2 size={20} className="text-gold" />
                      </div>
                      <div>
                        <h4 className="text-champagne font-medium text-sm group-hover:text-gold transition-colors">{hotel.name}</h4>
                        <p className="text-ash text-xs flex items-center gap-1 mt-1">
                          <MapPin size={12} /> {hotel.location || 'Unknown Location'}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between border-t border-white/5 pt-4">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${activeCount > 0 ? 'bg-green-400 animate-pulse' : 'bg-smoke/30'}`} />
                      <span className={`text-xs ${activeCount > 0 ? 'text-green-400 font-medium' : 'text-smoke'}`}>
                        {activeCount} Member{activeCount !== 1 && 's'} Active
                      </span>
                    </div>
                    <ChevronRight size={16} className="text-gold/50 group-hover:text-gold transition-colors" />
                  </div>
                </GlassCard>
              );
            })}
          </div>
        )}
      </div>

      {/* Active Visits Modal */}
      <Modal isOpen={!!selectedHotel} onClose={() => setSelectedHotel(null)} title={selectedHotel ? `Live Check-ins: ${selectedHotel.name}` : ''} size="lg">
        <div className="space-y-4">
          <p className="text-smoke text-sm">
            Elite Members currently verified and checked into this venue.
          </p>
          {selectedHotel && activeVisits.filter(v => v.hotel_id === selectedHotel.id).length === 0 ? (
            <div className="text-center py-8 border border-white/10 rounded-xl bg-black/20">
              <p className="text-smoke">No members are currently checked in here.</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2">
              {selectedHotel && activeVisits.filter(v => v.hotel_id === selectedHotel.id).map((visit) => (
                <div key={visit.id} className="p-4 rounded-xl border border-gold/15 bg-gold/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h4 className="text-champagne font-semibold">{visit.profiles?.full_name || 'Unknown Member'}</h4>
                    <p className="text-gold text-xs font-mono mt-0.5">{visit.profiles?.member_id || 'N/A'}</p>
                  </div>
                  <div className="sm:text-right">
                    <p className="text-smoke text-xs mt-1">Checked in: {formatDate(visit.check_in)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Modal>
    </PageTransition>
  );
}

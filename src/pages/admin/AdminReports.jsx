import { useState, useEffect } from 'react';
import { BarChart3, Download, Building2, Users, MapPin } from 'lucide-react';
import PageTransition from '../../components/layout/PageTransition';
import GlassCard from '../../components/common/GlassCard';
import Button from '../../components/common/Button';
import { supabase } from '../../lib/supabase';
import { formatCurrency, getTodayStart } from '../../utils/helpers';
import { exportToCSV } from '../../utils/csvExport';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function AdminReports() {
  const [hotelStats, setHotelStats] = useState([]);
  const [allMemberStats, setAllMemberStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeFilter, setTimeFilter] = useState('today'); // 'today', 'month', 'year', 'all'
  const [selectedHotelExport, setSelectedHotelExport] = useState('all');
  const [memberSearch, setMemberSearch] = useState('');
  const [showAllMembers, setShowAllMembers] = useState(false);

  useEffect(() => { fetchReports(); }, [timeFilter]);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const [hotelsRes, visitsRes, billsRes, membersRes] = await Promise.all([
        supabase.from('hotels').select('id, name, scan_count, status').eq('status', 'verified'),
        supabase.from('visits').select('hotel_id, member_id, status, check_in'),
        supabase.from('bills').select('hotel_id, member_id, food_bev_cost, liquor_cost_billed, savings, created_at'),
        supabase.from('profiles').select('id, full_name, member_id, status, plan').eq('role', 'member'),
      ]);

      const hotels = hotelsRes.data || [];
      const members = membersRes.data || [];
      let filteredVisits = visitsRes.data || [];
      let filteredBills = billsRes.data || [];

      if (timeFilter !== 'all') {
        const now = new Date();
        let startDate = new Date();
        
        if (timeFilter === 'today') {
          startDate = getTodayStart();
        } else if (timeFilter === 'month') {
          startDate.setDate(1);
          startDate.setHours(4, 0, 0, 0);
        } else if (timeFilter === 'year') {
          startDate.setMonth(0, 1);
          startDate.setHours(4, 0, 0, 0);
        }

        filteredVisits = filteredVisits.filter(v => new Date(v.check_in) >= startDate);
        filteredBills = filteredBills.filter(b => new Date(b.created_at) >= startDate);
      }

      // Hotel-wise stats
      const hStats = hotels.map(h => {
        const hVisits = filteredVisits.filter(v => v.hotel_id === h.id);
        const hBills = filteredBills.filter(b => b.hotel_id === h.id);
        const revenue = hBills.reduce((s, b) => s + Number(b.food_bev_cost || 0) + Number(b.liquor_cost_billed || 0), 0);
        const savings = hBills.reduce((s, b) => s + Number(b.savings || 0), 0);
        return { id: h.id, name: h.name, visits: hVisits.length, bills: hBills.length, revenue, savings, scans: h.scan_count };
      });

      // Member-wise stats
      const mStats = members.map(m => {
        const mVisits = filteredVisits.filter(v => v.member_id === m.id);
        const mBills = filteredBills.filter(b => b.member_id === m.id);
        const spent = mBills.reduce((s, b) => s + Number(b.food_bev_cost || 0) + Number(b.liquor_cost_billed || 0), 0);
        const saved = mBills.reduce((s, b) => s + Number(b.savings || 0), 0);
        return { name: m.full_name, member_id: m.member_id, visits: mVisits.length, spent, saved, plan: m.plan, status: m.status };
      });

      setHotelStats(hStats);
      setAllMemberStats(mStats.sort((a, b) => b.spent - a.spent));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageTransition>
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-playfair text-3xl font-bold text-champagne mb-1">Reports & <span className="text-gold-gradient">Analytics</span></h1>
          <p className="text-smoke">Hotel-wise activity, revenue tracking, and exportable reports.</p>
        </div>
        <select 
          value={timeFilter} 
          onChange={(e) => setTimeFilter(e.target.value)}
          className="elite-input rounded-xl px-4 py-2 text-sm bg-black border border-gold/20"
        >
          <option value="today">Today</option>
          <option value="month">This Month</option>
          <option value="year">This Year</option>
          <option value="all">All Time</option>
        </select>
      </div>

      {/* Hotel Revenue Chart */}
      {hotelStats.length > 0 && (
        <GlassCard hover={false} className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
            <h3 className="text-champagne font-semibold flex items-center gap-2"><Building2 size={18} className="text-gold" /> Hotel-wise Revenue</h3>
            <div className="flex items-center gap-3">
              <select 
                value={selectedHotelExport} 
                onChange={(e) => setSelectedHotelExport(e.target.value)}
                className="elite-input rounded-xl px-3 py-1.5 text-xs bg-black border border-gold/20"
              >
                <option value="all">All Hotels</option>
                {hotelStats.map(h => (
                  <option key={h.id} value={h.id}>{h.name}</option>
                ))}
              </select>
              <Button variant="ghost" size="sm" icon={Download} onClick={() => {
                const dataToExport = selectedHotelExport === 'all' ? hotelStats : hotelStats.filter(h => String(h.id) === String(selectedHotelExport));
                exportToCSV(dataToExport, 'hotel_report.csv');
              }}>Export</Button>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={hotelStats}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="name" stroke="#666" fontSize={10} angle={-20} textAnchor="end" height={60} />
                <YAxis stroke="#666" fontSize={12} tickFormatter={v => `₹${(v / 1000).toFixed(0)}k`} />
                <Tooltip contentStyle={{ background: '#111', border: '1px solid rgba(201,169,78,0.2)', borderRadius: '8px', color: '#F5E6CC', fontSize: '12px' }} />
                <Bar dataKey="revenue" fill="#C9A94E" radius={[6, 6, 0, 0]} name="Revenue" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>
      )}

      {/* Hotel Activity Table */}
      <GlassCard hover={false} className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-champagne font-semibold flex items-center gap-2"><MapPin size={18} className="text-gold" /> Hotel Activity</h3>
          <Button variant="ghost" size="sm" icon={Download} onClick={() => {
            const dataToExport = selectedHotelExport === 'all' ? hotelStats : hotelStats.filter(h => String(h.id) === String(selectedHotelExport));
            exportToCSV(dataToExport, 'hotel_activity.csv');
          }}>Export</Button>
        </div>
        {loading ? <p className="text-smoke text-center py-8">Loading...</p> : (
          <div className="overflow-x-auto">
            <table className="elite-table">
              <thead><tr><th>Hotel</th><th>Visits</th><th>Bills</th><th>Revenue</th><th>Member Savings</th><th>Scans</th></tr></thead>
              <tbody>
                {hotelStats.map((h, i) => (
                  <tr key={i}>
                    <td className="text-champagne font-medium">{h.name}</td>
                    <td className="text-champagne-dark">{h.visits}</td>
                    <td className="text-champagne-dark">{h.bills}</td>
                    <td className="text-gold font-mono">{formatCurrency(h.revenue)}</td>
                    <td className="text-green-400 font-mono">{formatCurrency(h.savings)}</td>
                    <td className="text-champagne-dark font-mono">{h.scans}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </GlassCard>

      {/* Member Activity Table */}
      <GlassCard hover={false}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-4">
          <div className="flex items-center gap-3">
            <h3 className="text-champagne font-semibold flex items-center gap-2"><Users size={18} className="text-gold" /> Member Activity</h3>
            <button 
              onClick={() => setShowAllMembers(!showAllMembers)}
              className="text-xs px-2 py-1 rounded bg-gold/10 text-gold border border-gold/20 hover:bg-gold/20 transition-colors"
            >
              {showAllMembers ? "Showing All" : "Showing Top 20"}
            </button>
          </div>
          <div className="flex items-center gap-3">
            <input 
              type="text" 
              placeholder="Search member..." 
              value={memberSearch}
              onChange={(e) => setMemberSearch(e.target.value)}
              className="elite-input rounded-xl px-3 py-1.5 text-xs bg-black border border-gold/20 w-40 sm:w-48"
            />
            <Button variant="ghost" size="sm" icon={Download} onClick={() => {
              const dataToExport = memberSearch ? allMemberStats.filter(m => m.name.toLowerCase().includes(memberSearch.toLowerCase()) || m.member_id?.toLowerCase().includes(memberSearch.toLowerCase()))
                : (showAllMembers ? allMemberStats : allMemberStats.slice(0, 20));
              exportToCSV(dataToExport, 'member_activity.csv');
            }}>Export</Button>
          </div>
        </div>
        {loading ? <p className="text-smoke text-center py-8">Loading...</p> : allMemberStats.length === 0 ? <p className="text-smoke text-center py-8">No member data yet.</p> : (
          <div className="overflow-x-auto max-h-[500px] overflow-y-auto pr-2">
            <table className="elite-table">
              <thead className="sticky top-0 bg-black-deep/95 backdrop-blur z-10"><tr><th>Member</th><th>ID</th><th>Plan</th><th>Visits</th><th>Spent</th><th>Saved</th></tr></thead>
              <tbody>
                {(memberSearch ? allMemberStats.filter(m => m.name.toLowerCase().includes(memberSearch.toLowerCase()) || m.member_id?.toLowerCase().includes(memberSearch.toLowerCase())) 
                : (showAllMembers ? allMemberStats : allMemberStats.slice(0, 20))).map((m, i) => (
                  <tr key={i}>
                    <td className="text-champagne font-medium">{m.name}</td>
                    <td className="text-gold font-mono text-xs">{m.member_id || '—'}</td>
                    <td className="text-champagne-dark capitalize text-xs">{m.plan || '—'}</td>
                    <td className="text-champagne-dark">{m.visits}</td>
                    <td className="text-gold font-mono">{formatCurrency(m.spent)}</td>
                    <td className="text-green-400 font-mono">{formatCurrency(m.saved)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </GlassCard>
    </PageTransition>
  );
}

import { useState, useEffect } from 'react';
import { Receipt, Search, Download, IndianRupee } from 'lucide-react';
import { motion } from 'framer-motion';
import PageTransition from '../../components/layout/PageTransition';
import GlassCard from '../../components/common/GlassCard';
import Button from '../../components/common/Button';
import { supabase } from '../../lib/supabase';
import { formatCurrency, formatDate } from '../../utils/helpers';
import { exportToCSV } from '../../utils/csvExport';

export default function AdminBills() {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => { fetchBills(); }, []);

  const fetchBills = async () => {
    const { data } = await supabase.from('bills')
      .select('*, profiles:member_id(full_name, member_id), hotels:hotel_id(name)')
      .order('created_at', { ascending: false });
    setBills(data || []);
    setLoading(false);
  };

  const filtered = bills.filter(b => {
    const name = b.profiles?.full_name || '';
    const hotel = b.hotels?.name || '';
    return name.toLowerCase().includes(search.toLowerCase()) || hotel.toLowerCase().includes(search.toLowerCase());
  });

  const totalSavings = filtered.reduce((s, b) => s + Number(b.savings || 0), 0);
  const totalRevenue = filtered.reduce((s, b) => s + Number(b.food_bev_cost || 0) + Number(b.liquor_cost_billed || 0), 0);

  const handleExport = () => {
    exportToCSV(filtered.map(b => ({
      Date: ' ' + new Date(b.created_at).toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
      Member: b.profiles?.full_name || '',
      Member_ID: b.profiles?.member_id || '',
      Hotel: b.hotels?.name || '',
      Food_Bev: b.food_bev_cost,
      Liquor_Original: b.liquor_cost_original,
      Liquor_Billed: b.liquor_cost_billed,
      Savings: b.savings,
    })), 'eliteclub_bills.csv');
  };

  return (
    <PageTransition>
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-playfair text-3xl font-bold text-champagne mb-1">Bill <span className="text-gold-gradient">Monitoring</span></h1>
          <p className="text-smoke">View all bills uploaded by hotel partners.</p>
        </div>
        <Button variant="gold" size="sm" icon={Download} onClick={handleExport}>Export CSV</Button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <GlassCard className="p-5 text-center">
          <p className="text-2xl font-bold text-gold">{filtered.length}</p>
          <p className="text-smoke text-xs">Total Bills</p>
        </GlassCard>
        <GlassCard className="p-5 text-center">
          <p className="text-2xl font-bold text-green-400">{formatCurrency(totalRevenue)}</p>
          <p className="text-smoke text-xs">Total Revenue</p>
        </GlassCard>
        <GlassCard className="p-5 text-center">
          <p className="text-2xl font-bold text-gold-light">{formatCurrency(totalSavings)}</p>
          <p className="text-smoke text-xs">Total Member Savings</p>
        </GlassCard>
      </div>

      {/* Search */}
      <GlassCard hover={false} className="mb-6">
        <div className="relative">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gold-muted" />
          <input type="text" placeholder="Search by member or hotel name..." value={search} onChange={e => setSearch(e.target.value)} className="w-full elite-input rounded-xl pl-11 pr-4 py-3 text-sm" />
        </div>
      </GlassCard>

      {/* Bills Table */}
      <GlassCard hover={false} className="overflow-x-auto">
        {loading ? (
          <p className="text-smoke text-center py-12">Loading bills...</p>
        ) : filtered.length === 0 ? (
          <p className="text-smoke text-center py-12">No bills found.</p>
        ) : (
          <table className="elite-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Member</th>
                <th>Hotel</th>
                <th>Food & Bev</th>
                <th>Liquor (Original)</th>
                <th>Liquor (Billed)</th>
                <th>Savings</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((b, i) => (
                <motion.tr key={b.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.02 }}>
                  <td className="text-smoke text-xs">{formatDate(b.created_at)}</td>
                  <td className="text-champagne text-sm">{b.profiles?.full_name || '—'}</td>
                  <td className="text-champagne-dark text-xs">{b.hotels?.name || '—'}</td>
                  <td className="text-champagne font-mono text-xs">{formatCurrency(b.food_bev_cost)}</td>
                  <td className="text-smoke font-mono text-xs">{formatCurrency(b.liquor_cost_original)}</td>
                  <td className="text-champagne font-mono text-xs">{formatCurrency(b.liquor_cost_billed)}</td>
                  <td className="text-green-400 font-mono text-xs font-semibold">{formatCurrency(b.savings)}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        )}
      </GlassCard>
    </PageTransition>
  );
}

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, CheckCircle2, XCircle, Clock, Building2, Lock, Eye } from 'lucide-react';
import PageTransition from '../../components/layout/PageTransition';
import GlassCard from '../../components/common/GlassCard';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import { supabase } from '../../lib/supabase';
import { useToast } from '../../components/common/Toast';
import { formatDate, getTodayStart } from '../../utils/helpers';

export default function AdminHotels() {
  const [hotels, setHotels] = useState([]);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [selected, setSelected] = useState(null);
  const [approveModal, setApproveModal] = useState(false);
  const [approveTarget, setApproveTarget] = useState(null);
  const [hotelPassword, setHotelPassword] = useState('');
  const [quotas, setQuotas] = useState({ nip_limit: 4, beer_limit: 8 });
  const [editModal, setEditModal] = useState(false);
  const [activeVisits, setActiveVisits] = useState([]);
  const [todayScans, setTodayScans] = useState([]);
  
  // New History States
  const [historyModal, setHistoryModal] = useState(false);
  const [selectedHotelHistory, setSelectedHotelHistory] = useState(null);
  const [historyTimeFilter, setHistoryTimeFilter] = useState('today');
  const [historyData, setHistoryData] = useState({ visits: [], scanCount: 0, loading: false });

  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  useEffect(() => {
    fetchHotels();

    // Subscribe to real-time changes
    const channel = supabase.channel('admin_hotels_realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'visits' }, () => fetchHotels())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'scans' }, () => fetchHotels())
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchHotelHistory = async (hotelId, filter) => {
    setHistoryData(prev => ({ ...prev, loading: true }));
    try {
      let startDate = new Date();
      if (filter === 'today') {
        startDate = getTodayStart();
      } else if (filter === 'month') {
        startDate.setDate(1); startDate.setHours(4, 0, 0, 0);
      } else if (filter === 'year') {
        startDate.setMonth(0, 1); startDate.setHours(4, 0, 0, 0);
      } else {
        startDate = new Date(0); // All time
      }

      const [visitsRes, scansRes] = await Promise.all([
        supabase.from('visits')
          .select('id, check_in, check_out, status, profiles(full_name, member_id)')
          .eq('hotel_id', hotelId)
          .gte('check_in', startDate.toISOString())
          .order('check_in', { ascending: false }),
        supabase.from('scans')
          .select('id', { count: 'exact', head: true })
          .eq('hotel_id', hotelId)
          .gte('created_at', startDate.toISOString())
      ]);

      setHistoryData({
        visits: visitsRes.data || [],
        scanCount: scansRes.count || 0,
        loading: false
      });
    } catch (err) {
      console.error(err);
      setHistoryData(prev => ({ ...prev, loading: false }));
    }
  };

  useEffect(() => {
    if (historyModal && selectedHotelHistory) {
      fetchHotelHistory(selectedHotelHistory.id, historyTimeFilter);
    }
  }, [historyTimeFilter, historyModal, selectedHotelHistory]);


  const fetchHotels = async () => {
    const todayStart = getTodayStart();

    const [{ data: hData }, { data: vData }, { data: sData }] = await Promise.all([
      supabase.from('hotels').select('*').order('created_at', { ascending: false }),
      supabase.from('visits').select('id, check_in, hotel_id, profiles(full_name, member_id)').eq('status', 'open').order('check_in', { ascending: false }),
      supabase.from('scans').select('hotel_id, id').gte('created_at', todayStart.toISOString())
    ]);
    setHotels(hData || []);
    setActiveVisits(vData || []);
    setTodayScans(sData || []);
    setLoading(false);
  };

  const list = hotels.filter(h => {
    const m1 = h.name.toLowerCase().includes(search.toLowerCase());
    const m2 = filter === 'all' || h.status === filter;
    return m1 && m2;
  });

  const counts = {
    verified: hotels.filter(h => h.status === 'verified').length,
    pending: hotels.filter(h => h.status === 'pending').length,
    rejected: hotels.filter(h => h.status === 'rejected').length,
  };

  const handleApprove = async () => {
    if (!hotelPassword || hotelPassword.length < 6) {
      toast.error('Password must be at least 6 characters.');
      return;
    }
    setSaving(true);
    try {
      // Create auth user via custom secure RPC to bypass email rate limits
      const { data: newUserId, error: rpcError } = await supabase.rpc('create_hotel_user', {
        p_email: approveTarget.email,
        p_password: hotelPassword
      });

      if (rpcError) throw rpcError;
      if (!newUserId) throw new Error('Failed to create hotel login.');

      // Update hotel record
      await supabase.from('hotels')
        .update({ status: 'verified', auth_user_id: newUserId, nip_limit: quotas.nip_limit, beer_limit: quotas.beer_limit })
        .eq('id', approveTarget.id);

      toast.success(`${approveTarget.name} approved! Login: ${approveTarget.email}`);
      setApproveModal(false);
      setHotelPassword('');
      fetchHotels();
    } catch (err) {
      console.error(err);
      toast.error(err.message || 'Error approving hotel.');
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateQuotas = async () => {
    setSaving(true);
    try {
      await supabase.from('hotels')
        .update({ nip_limit: quotas.nip_limit, beer_limit: quotas.beer_limit })
        .eq('id', selected.id);
      toast.success(`${selected.name} quotas updated.`);
      setEditModal(false);
      setSelected(null);
      fetchHotels();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleReject = async (hotel) => {
    try {
      await supabase.from('hotels').update({ status: 'rejected' }).eq('id', hotel.id);
      toast.success(`${hotel.name} rejected.`);
      fetchHotels();
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <PageTransition>
      <div className="mb-8">
        <h1 className="font-playfair text-3xl font-bold text-champagne mb-1">Hotel <span className="text-gold-gradient">Management</span></h1>
        <p className="text-smoke">Manage partner venues, approvals, and verification.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {[
          { icon: CheckCircle2, label: 'Verified', count: counts.verified, color: 'text-green-400', bg: 'bg-green-400/10' },
          { icon: Clock, label: 'Pending', count: counts.pending, color: 'text-yellow-400', bg: 'bg-yellow-400/10' },
          { icon: XCircle, label: 'Rejected', count: counts.rejected, color: 'text-red-400', bg: 'bg-red-400/10' },
        ].map((s, i) => (
          <GlassCard key={i} delay={i * 0.1} className="p-5">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl ${s.bg} flex items-center justify-center`}><s.icon size={22} className={s.color} /></div>
              <div><p className={`text-2xl font-bold ${s.color}`}>{loading ? '...' : s.count}</p><p className="text-smoke text-xs">{s.label}</p></div>
            </div>
          </GlassCard>
        ))}
      </div>

      {/* Filters */}
      <GlassCard hover={false} className="mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gold-muted" />
            <input type="text" placeholder="Search hotels..." value={search} onChange={e => setSearch(e.target.value)} className="w-full elite-input rounded-xl pl-11 pr-4 py-3 text-sm" />
          </div>
          <div className="flex items-center gap-2">
            {['all', 'verified', 'pending', 'rejected'].map(s => (
              <button key={s} onClick={() => setFilter(s)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all capitalize cursor-pointer ${filter === s ? 'bg-gold/15 text-gold border border-gold/25' : 'text-smoke hover:text-champagne border border-transparent'}`}>{s}</button>
            ))}
          </div>
        </div>
      </GlassCard>

      {/* Hotels Grid */}
      {loading ? (
        <p className="text-smoke text-center py-12">Loading hotels...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {list.map((h, i) => (
            <GlassCard key={h.id} delay={i * 0.05}>
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gold/8 border border-gold/15 flex items-center justify-center"><Building2 size={20} className="text-gold" /></div>
                  <div><h3 className="text-champagne font-semibold text-sm">{h.name}</h3><p className="text-ash text-xs">{h.email}</p></div>
                </div>
                <Badge status={h.status} />
              </div>
              <div className="space-y-2 text-xs mb-4">
                <div className="flex justify-between"><span className="text-smoke">Contact</span><span className="text-champagne-dark">{h.contact_person}</span></div>
                <div className="flex justify-between"><span className="text-smoke">Phone</span><span className="text-champagne-dark">{h.phone}</span></div>
                <div className="flex justify-between"><span className="text-smoke">Location</span><span className="text-champagne-dark">{h.location || '—'}</span></div>
                <div className="flex justify-between"><span className="text-smoke">Quotas</span><span className="text-champagne-dark">{h.nip_limit} Nips / {h.beer_limit} Beers</span></div>
                <div className="flex justify-between"><span className="text-smoke">Today's Scans</span><span className="text-champagne-dark font-mono">{todayScans.filter(s => s.hotel_id === h.id).length}</span></div>
                {h.status === 'verified' && (
                  <div className="flex justify-between"><span className="text-smoke">Live Check-ins</span><span className="text-green-400 font-mono font-bold">{activeVisits.filter(v => v.hotel_id === h.id).length} Active</span></div>
                )}
              </div>
              <div className="flex gap-2 pt-3 border-t border-white/5">
                {h.status === 'pending' && <>
                  <Button variant="gold" size="sm" className="flex-1" onClick={() => { setApproveTarget(h); setApproveModal(true); }}>Approve</Button>
                  <Button variant="danger" size="sm" className="flex-1" onClick={() => handleReject(h)}>Reject</Button>
                </>}
                {h.status === 'verified' && (
                  <>
                    <Button variant="ghost" size="sm" className="flex-1" onClick={() => { setSelected(h); setQuotas({ nip_limit: h.nip_limit || 4, beer_limit: h.beer_limit || 8 }); setEditModal(true); }}>Quotas</Button>
                    <Button variant="gold" size="sm" className="flex-1" onClick={() => { setSelectedHotelHistory(h); setHistoryModal(true); setHistoryTimeFilter('today'); }}>History & Scans</Button>
                  </>
                )}
                {h.status === 'rejected' && <Button variant="ghost" size="sm" className="flex-1" onClick={() => { setApproveTarget(h); setQuotas({ nip_limit: 4, beer_limit: 8 }); setApproveModal(true); }}>Review & Approve</Button>}
              </div>
            </GlassCard>
          ))}
        </div>
      )}
      {!loading && list.length === 0 && <p className="text-smoke text-center py-12">No hotels found.</p>}

      {/* Approve Modal */}
      <Modal isOpen={approveModal} onClose={() => { setApproveModal(false); setHotelPassword(''); }} title="Approve Hotel" size="md">
        {approveTarget && (
          <div className="space-y-4">
            <p className="text-champagne-dark text-sm">Set a login password for <strong className="text-gold">{approveTarget.name}</strong>.</p>
            <p className="text-smoke text-xs">The hotel will login with: <span className="text-champagne font-mono">{approveTarget.email}</span></p>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-champagne-dark flex items-center gap-2"><Lock size={14} className="text-gold" /> Hotel Password *</label>
              <input type="text" value={hotelPassword} onChange={e => setHotelPassword(e.target.value)} className="w-full elite-input rounded-xl px-4 py-3 text-sm" placeholder="Set password (min 6 chars)" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-champagne-dark">Nip Quota</label>
                <input type="number" value={quotas.nip_limit} onChange={e => setQuotas(p => ({ ...p, nip_limit: e.target.value }))} className="w-full elite-input rounded-xl px-4 py-3 text-sm" />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-champagne-dark">Beer Quota</label>
                <input type="number" value={quotas.beer_limit} onChange={e => setQuotas(p => ({ ...p, beer_limit: e.target.value }))} className="w-full elite-input rounded-xl px-4 py-3 text-sm" />
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <Button variant="gold" className="flex-1" onClick={handleApprove} disabled={saving}>{saving ? 'Approving...' : 'Approve & Set Password'}</Button>
              <Button variant="ghost" onClick={() => { setApproveModal(false); setHotelPassword(''); }}>Cancel</Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Detail/Edit Modal */}
      <Modal isOpen={editModal} onClose={() => { setEditModal(false); setSelected(null); }} title="Hotel Details & Quotas">
        {selected && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div><span className="text-smoke">Name:</span><p className="text-champagne">{selected.name}</p></div>
              <div><span className="text-smoke">Status:</span><div className="mt-1"><Badge status={selected.status} /></div></div>
              <div><span className="text-smoke">Contact:</span><p className="text-champagne">{selected.contact_person}</p></div>
              <div><span className="text-smoke">Phone:</span><p className="text-champagne">{selected.phone}</p></div>
            </div>
            <div className="border-t border-white/10 pt-4">
              <h4 className="text-champagne mb-3">Quota Limits</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-champagne-dark">Nips per User</label>
                  <input type="number" value={quotas.nip_limit} onChange={e => setQuotas(p => ({ ...p, nip_limit: parseInt(e.target.value) || 0 }))} className="w-full elite-input rounded-xl px-4 py-3 text-sm" />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-champagne-dark">Beers per User</label>
                  <input type="number" value={quotas.beer_limit} onChange={e => setQuotas(p => ({ ...p, beer_limit: parseInt(e.target.value) || 0 }))} className="w-full elite-input rounded-xl px-4 py-3 text-sm" />
                </div>
              </div>
              <div className="flex gap-3 pt-6">
                <Button variant="gold" className="flex-1" onClick={handleUpdateQuotas} disabled={saving}>{saving ? 'Saving...' : 'Save Quotas'}</Button>
                <Button variant="ghost" onClick={() => { setEditModal(false); setSelected(null); }}>Cancel</Button>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* History Modal */}
      <Modal isOpen={historyModal} onClose={() => { setHistoryModal(false); setSelectedHotelHistory(null); }} title={selectedHotelHistory ? `Activity History: ${selectedHotelHistory.name}` : ''} size="lg">
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <p className="text-smoke text-sm">
              Comprehensive scan and check-in history.
            </p>
            <select 
              value={historyTimeFilter} 
              onChange={(e) => setHistoryTimeFilter(e.target.value)}
              className="elite-input rounded-xl px-4 py-2 text-sm bg-black border border-gold/20"
            >
              <option value="today">Today</option>
              <option value="month">This Month</option>
              <option value="year">This Year</option>
              <option value="all">All Time</option>
            </select>
          </div>

          <div className="grid grid-cols-4 gap-2 mb-4">
            <div className="p-3 bg-black/40 border border-white/5 rounded-xl text-center">
              <p className="text-xl font-bold text-champagne">{historyData.loading ? '-' : historyData.scanCount}</p>
              <p className="text-xs text-smoke">Total Scans</p>
            </div>
            <div className="p-3 bg-black/40 border border-white/5 rounded-xl text-center">
              <p className="text-xl font-bold text-champagne">{historyData.loading ? '-' : historyData.visits.length}</p>
              <p className="text-xs text-smoke">Total Visits</p>
            </div>
            <div className="p-3 bg-black/40 border border-white/5 rounded-xl text-center">
              <p className="text-xl font-bold text-green-400">{historyData.loading ? '-' : historyData.visits.filter(v => v.status === 'open').length}</p>
              <p className="text-xs text-smoke">Active</p>
            </div>
            <div className="p-3 bg-black/40 border border-white/5 rounded-xl text-center">
              <p className="text-xl font-bold text-ash">{historyData.loading ? '-' : historyData.visits.filter(v => v.status === 'closed').length}</p>
              <p className="text-xs text-smoke">Completed</p>
            </div>
          </div>

          {historyData.loading ? (
             <div className="text-center py-8"><p className="text-smoke">Loading history...</p></div>
          ) : historyData.visits.length === 0 ? (
            <div className="text-center py-8 border border-white/10 rounded-xl bg-black/20">
              <p className="text-smoke">No visits found in this timeframe.</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-[50vh] overflow-y-auto pr-2">
              {historyData.visits.map((visit) => (
                <div key={visit.id} className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${visit.status === 'open' ? 'border-green-400/20 bg-green-400/5' : 'border-white/5 bg-black/40'}`}>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-champagne font-semibold">{visit.profiles?.full_name || 'Unknown Member'}</h4>
                      {visit.status === 'open' && <span className="text-[10px] bg-green-400/20 text-green-400 px-2 py-0.5 rounded-full border border-green-400/30">Active</span>}
                    </div>
                    <p className="text-gold text-xs font-mono mt-0.5">{visit.profiles?.member_id || 'N/A'}</p>
                  </div>
                  <div className="sm:text-right space-y-1">
                    <p className="text-smoke text-xs flex items-center gap-1.5 sm:justify-end">
                      <Clock size={12} className="text-gold" />
                      In: {formatDate(visit.check_in)}
                    </p>
                    {visit.status === 'closed' && visit.check_out && (
                      <p className="text-ash text-xs flex items-center gap-1.5 sm:justify-end">
                        <Clock size={12} className="text-ash" />
                        Out: {formatDate(visit.check_out)}
                      </p>
                    )}
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

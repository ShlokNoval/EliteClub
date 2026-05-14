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
import { formatDate } from '../../utils/helpers';

export default function AdminHotels() {
  const [hotels, setHotels] = useState([]);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [selected, setSelected] = useState(null);
  const [approveModal, setApproveModal] = useState(false);
  const [approveTarget, setApproveTarget] = useState(null);
  const [hotelPassword, setHotelPassword] = useState('');
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  useEffect(() => { fetchHotels(); }, []);

  const fetchHotels = async () => {
    const { data } = await supabase.from('hotels').select('*').order('created_at', { ascending: false });
    setHotels(data || []);
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
        .update({ status: 'verified', auth_user_id: newUserId })
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
                <div className="flex justify-between"><span className="text-smoke">Scans</span><span className="text-champagne-dark font-mono">{h.scan_count}</span></div>
                <div className="flex justify-between"><span className="text-smoke">Applied</span><span className="text-champagne-dark">{formatDate(h.created_at)}</span></div>
              </div>
              <div className="flex gap-2 pt-3 border-t border-white/5">
                {h.status === 'pending' && <>
                  <Button variant="gold" size="sm" className="flex-1" onClick={() => { setApproveTarget(h); setApproveModal(true); }}>Approve</Button>
                  <Button variant="danger" size="sm" className="flex-1" onClick={() => handleReject(h)}>Reject</Button>
                </>}
                {h.status === 'verified' && <Button variant="ghost" size="sm" className="flex-1" onClick={() => setSelected(h)}>View Details</Button>}
                {h.status === 'rejected' && <Button variant="ghost" size="sm" className="flex-1" onClick={() => { setApproveTarget(h); setApproveModal(true); }}>Review & Approve</Button>}
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
            <div className="flex gap-3 pt-2">
              <Button variant="gold" className="flex-1" onClick={handleApprove} disabled={saving}>{saving ? 'Approving...' : 'Approve & Set Password'}</Button>
              <Button variant="ghost" onClick={() => { setApproveModal(false); setHotelPassword(''); }}>Cancel</Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Detail Modal */}
      <Modal isOpen={!!selected} onClose={() => setSelected(null)} title="Hotel Details">
        {selected && (
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div><span className="text-smoke">Name:</span><p className="text-champagne">{selected.name}</p></div>
            <div><span className="text-smoke">Status:</span><div className="mt-1"><Badge status={selected.status} /></div></div>
            <div><span className="text-smoke">Contact:</span><p className="text-champagne">{selected.contact_person}</p></div>
            <div><span className="text-smoke">Phone:</span><p className="text-champagne">{selected.phone}</p></div>
            <div><span className="text-smoke">Email:</span><p className="text-champagne font-mono text-xs">{selected.email}</p></div>
            <div><span className="text-smoke">Location:</span><p className="text-champagne">{selected.location || '—'}</p></div>
            <div><span className="text-smoke">Scans:</span><p className="text-champagne font-mono">{selected.scan_count}</p></div>
            <div><span className="text-smoke">Joined:</span><p className="text-champagne">{formatDate(selected.created_at)}</p></div>
          </div>
        )}
      </Modal>
    </PageTransition>
  );
}

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { UserCheck, ShieldAlert, Search } from 'lucide-react';
import PageTransition from '../../components/layout/PageTransition';
import GlassCard from '../../components/common/GlassCard';
import Button from '../../components/common/Button';
import { supabase } from '../../lib/supabase';
import { useToast } from '../../components/common/Toast';

export default function AdminApprovals() {
  const [users, setUsers] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [selectedUser, setSelectedUser] = useState('');
  const [selectedHotel, setSelectedHotel] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [searchUser, setSearchUser] = useState('');
  const toast = useToast();

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const [uRes, hRes] = await Promise.all([
        supabase.from('profiles').select('id, full_name, member_id, phone, status').eq('role', 'member').eq('status', 'active'),
        supabase.from('hotels').select('id, name').eq('status', 'verified')
      ]);
      setUsers(uRes.data || []);
      setHotels(hRes.data || []);
    } catch (err) {
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(u => 
    u.full_name?.toLowerCase().includes(searchUser.toLowerCase()) || 
    u.member_id?.toLowerCase().includes(searchUser.toLowerCase()) ||
    u.phone?.includes(searchUser)
  ).slice(0, 50);

  const handleForceCheckIn = async () => {
    if (!selectedUser || !selectedHotel) {
      toast.error('Select both a User and a Hotel.');
      return;
    }
    if (!window.confirm('Are you sure you want to bypass QR and OTP to force check-in this user?')) return;
    
    setSaving(true);
    try {
      // Create open visit
      const { data: newVisit, error } = await supabase.from('visits').insert({
        member_id: selectedUser,
        hotel_id: parseInt(selectedHotel),
        status: 'open',
        is_manual: true,
      }).select().single();
      
      if (error) throw error;

      // Update hotel scan count (optional for manual, but let's do it)
      const hotel = hotels.find(h => h.id === parseInt(selectedHotel));
      const user = users.find(u => u.id === selectedUser);
      
      // Log manual scan
      await supabase.from('scans').insert({
        card_id: user.member_id || 'MANUAL',
        hotel_id: hotel.id,
        member_id: user.id,
        scan_type: 'check_in',
        result: 'valid',
      });

      toast.success(`Forced check-in successful for ${user.full_name} at ${hotel.name}!`);
      setSelectedUser('');
      setSelectedHotel('');
    } catch (err) {
      console.error(err);
      toast.error(err.message || 'Failed to force check-in.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <PageTransition>
      <div className="mb-8">
        <h1 className="font-playfair text-3xl font-bold text-champagne mb-1">
          Manual <span className="text-gold-gradient">Overrides</span>
        </h1>
        <p className="text-smoke">Bypass QR scanning and OTP for emergency member check-ins.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <GlassCard hover={false} className="border border-red-400/20">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-red-400/10 flex items-center justify-center">
              <ShieldAlert size={20} className="text-red-400" />
            </div>
            <div>
              <h3 className="text-champagne font-semibold">Force Check-In</h3>
              <p className="text-ash text-xs">Use only if member's OTP or QR fails.</p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-champagne-dark">1. Select Venue *</label>
              <select value={selectedHotel} onChange={e => setSelectedHotel(e.target.value)} className="w-full elite-input rounded-xl px-4 py-3 text-sm">
                <option value="">Choose hotel...</option>
                {hotels.map(h => <option key={h.id} value={h.id}>{h.name}</option>)}
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-champagne-dark">2. Search & Select Member *</label>
              <div className="relative mb-2">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gold-muted" />
                <input 
                  type="text" 
                  placeholder="Search name, phone, or ID..." 
                  value={searchUser} 
                  onChange={e => setSearchUser(e.target.value)} 
                  className="w-full elite-input rounded-xl pl-9 pr-4 py-2 text-sm" 
                />
              </div>
              <div className="max-h-48 overflow-y-auto rounded-xl border border-white/5 bg-black-deep/50 p-2 space-y-1">
                {loading ? <p className="text-xs text-smoke text-center py-4">Loading...</p> : 
                 filteredUsers.length === 0 ? <p className="text-xs text-smoke text-center py-4">No active members found.</p> :
                 filteredUsers.map(u => (
                  <div 
                    key={u.id} 
                    onClick={() => setSelectedUser(u.id)}
                    className={`p-2 rounded-lg text-sm cursor-pointer transition-colors ${selectedUser === u.id ? 'bg-gold/20 text-gold' : 'hover:bg-white/5 text-champagne-dark'}`}
                  >
                    <div className="flex justify-between items-center">
                      <span>{u.full_name}</span>
                      <span className="text-xs font-mono">{u.member_id}</span>
                    </div>
                    <div className="text-xs text-smoke mt-0.5">{u.phone || 'No phone'}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-red-400/10">
              <Button variant="danger" size="lg" className="w-full" icon={UserCheck} onClick={handleForceCheckIn} disabled={saving || !selectedUser || !selectedHotel}>
                {saving ? 'Processing...' : 'Authorize Check-In Bypass'}
              </Button>
            </div>
          </div>
        </GlassCard>

        <GlassCard hover={false}>
          <h3 className="text-champagne font-semibold mb-4">How it works</h3>
          <ul className="space-y-4 text-sm text-smoke">
            <li className="flex gap-3">
              <div className="w-6 h-6 rounded-full bg-white/5 flex items-center justify-center shrink-0">1</div>
              <p>Select the venue where the member is currently waiting.</p>
            </li>
            <li className="flex gap-3">
              <div className="w-6 h-6 rounded-full bg-white/5 flex items-center justify-center shrink-0">2</div>
              <p>Search and select the member's profile. Only <span className="text-green-400">active</span> members are shown.</p>
            </li>
            <li className="flex gap-3">
              <div className="w-6 h-6 rounded-full bg-white/5 flex items-center justify-center shrink-0">3</div>
              <p>Click Authorize. This creates an open visit for the venue, bypassing all daily limits, QR scans, and OTPs.</p>
            </li>
          </ul>
        </GlassCard>
      </div>
    </PageTransition>
  );
}

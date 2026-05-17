import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Filter, Edit3, UserPlus, Eye, EyeOff, CreditCard, Lock } from 'lucide-react';
import PageTransition from '../../components/layout/PageTransition';
import GlassCard from '../../components/common/GlassCard';
import Badge from '../../components/common/Badge';
import Modal from '../../components/common/Modal';
import Button from '../../components/common/Button';
import { supabase } from '../../lib/supabase';
import { useToast } from '../../components/common/Toast';
import { formatDate, maskPhone, maskEmail } from '../../utils/helpers';

export default function AdminUsers() {
  const location = useLocation();
  const [users, setUsers] = useState([]);
  const [cards, setCards] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState(location.state?.filter || 'all');
  const [viewMode, setViewMode] = useState('masked');
  const [loading, setLoading] = useState(true);
  const [editModal, setEditModal] = useState(false);
  const [addModal, setAddModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [saving, setSaving] = useState(false);
  const toast = useToast();

  // Add user form
  const [newUser, setNewUser] = useState({ full_name: '', email: '', phone: '', plan: 'solo', card_id: '', password: '' });
  // Edit user form
  const [editForm, setEditForm] = useState({});

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const [usersRes, cardsRes] = await Promise.all([
        supabase.from('profiles').select('*').eq('role', 'member').order('created_at', { ascending: false }),
        supabase.from('qr_cards').select('card_id, status').eq('status', 'available').order('card_id').limit(100),
      ]);
      setUsers(usersRes.data || []);
      setCards(cardsRes.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filtered = users.filter((u) => {
    const matchSearch = u.full_name.toLowerCase().includes(search.toLowerCase()) ||
      (u.member_id || '').toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || u.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const handleAddUser = async () => {
    if (!newUser.full_name || !newUser.password || !newUser.card_id) {
      toast.error('Name, password and card ID are required.');
      return;
    }
    setSaving(true);
    try {
      // Generate a synthetic email if none provided
      const email = newUser.email.trim() || `${newUser.card_id.toLowerCase()}@members.eliteclub.local`;

      // Create auth user via secure RPC (bypasses email rate limits)
      const { data: userId, error: rpcError } = await supabase.rpc('create_member_user', {
        p_email: email,
        p_password: newUser.password,
      });
      if (rpcError) throw rpcError;
      if (!userId) throw new Error('Failed to create user account.');

      const authUserId = userId;

      const joinDate = new Date();
      const expiryDate = new Date(joinDate);
      expiryDate.setDate(joinDate.getDate() + 30);

      // Create profile
      const { error: profileError } = await supabase.from('profiles').insert({
        id: authUserId,
        email,
        full_name: newUser.full_name.trim(),
        phone: newUser.phone.trim(),
        role: 'member',
        status: 'active',
        plan: newUser.plan,
        card_id: newUser.card_id,
        member_id: newUser.card_id,
        join_date: joinDate.toISOString(),
        expiry_date: expiryDate.toISOString(),
      });
      if (profileError) throw profileError;

      // Assign the QR card
      await supabase.from('qr_cards')
        .update({ status: 'assigned', assigned_to: authUserId, assigned_at: new Date().toISOString() })
        .eq('card_id', newUser.card_id);

      toast.success(`User ${newUser.full_name} created! Member ID: ${newUser.card_id}`);
      setAddModal(false);
      setNewUser({ full_name: '', email: '', phone: '', plan: 'solo', card_id: '', password: '' });
      fetchData();
    } catch (err) {
      toast.error(err.message || 'Failed to create user.');
    } finally {
      setSaving(false);
    }
  };

  const handleEditUser = async () => {
    setSaving(true);
    try {
      const { error } = await supabase.from('profiles')
        .update({
          full_name: editForm.full_name,
          phone: editForm.phone,
          status: editForm.status,
          plan: editForm.plan,
          expiry_date: editForm.expiry_date || null,
        })
        .eq('id', editForm.id);
      if (error) throw error;
      toast.success('User updated.');
      setEditModal(false);
      fetchData();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleResetPassword = async () => {
    const newPass = prompt("Enter new password for " + editForm.full_name);
    if (!newPass) return;
    try {
      const { error } = await supabase.rpc('admin_reset_password', {
        p_email: editForm.email,
        p_new_password: newPass
      });
      if (error) throw error;
      toast.success("Password reset successfully!");
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleDeleteUser = async () => {
    if (!window.confirm(`Are you sure you want to PERMANENTLY DELETE ${editForm.full_name}? This will remove their account and free up card ${editForm.card_id}.`)) return;
    setSaving(true);
    try {
      const { error } = await supabase.rpc('admin_delete_member', {
        p_user_id: editForm.id
      });
      if (error) throw error;
      toast.success('Member deleted and card freed successfully!');
      setEditModal(false);
      fetchData();
    } catch (err) {
      toast.error(err.message || 'Failed to delete member.');
    } finally {
      setSaving(false);
    }
  };

  const handleReassignCard = async () => {
    if (!window.confirm("This will permanently mark the current card as SUSPENDED and assign a new available card. Continue?")) return;
    
    const nextCard = cards.find(c => c.status === 'available');
    if (!nextCard) {
      toast.error("No available cards in inventory!");
      return;
    }

    setSaving(true);
    try {
      // Suspend old card
      if (editForm.card_id) {
        await supabase.from('qr_cards').update({ status: 'suspended', assigned_to: null }).eq('card_id', editForm.card_id);
      }
      
      // Assign new card
      await supabase.from('qr_cards').update({ status: 'assigned', assigned_to: editForm.id, assigned_at: new Date().toISOString() }).eq('card_id', nextCard.card_id);

      // Update profile
      await supabase.from('profiles').update({ card_id: nextCard.card_id, member_id: nextCard.card_id }).eq('id', editForm.id);

      toast.success(`New card ${nextCard.card_id} assigned successfully!`);
      setEditModal(false);
      fetchData();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <PageTransition>
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-playfair text-3xl font-bold text-champagne mb-1">
            User <span className="text-gold-gradient">Management</span>
          </h1>
          <p className="text-smoke">Manage members, assign cards, and control access.</p>
        </div>
        <Button variant="gold" size="sm" icon={UserPlus} onClick={() => setAddModal(true)}>
          Add Member
        </Button>
      </div>

      {/* Filters */}
      <GlassCard hover={false} className="mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gold-muted" />
            <input type="text" placeholder="Search by name or Member ID..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full elite-input rounded-xl pl-11 pr-4 py-3 text-sm" />
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <Filter size={16} className="text-gold" />
            {['all', 'active', 'inactive', 'pending', 'expired'].map((s) => (
              <button key={s} onClick={() => setStatusFilter(s)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all capitalize cursor-pointer ${statusFilter === s ? 'bg-gold/15 text-gold border border-gold/25' : 'text-smoke hover:text-champagne hover:bg-white/5 border border-transparent'}`}>
                {s}
              </button>
            ))}
          </div>
          <button onClick={() => setViewMode(viewMode === 'masked' ? 'full' : 'masked')} className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium text-gold border border-gold/20 hover:bg-gold/5 transition-all cursor-pointer shrink-0">
            {viewMode === 'masked' ? <Eye size={14} /> : <EyeOff size={14} />}
            {viewMode === 'masked' ? 'Show Full' : 'Mask'}
          </button>
        </div>
      </GlassCard>

      {/* Table */}
      <GlassCard hover={false} className="overflow-x-auto">
        {loading ? (
          <p className="text-smoke text-center py-12">Loading users...</p>
        ) : (
          <table className="elite-table">
            <thead>
              <tr>
                <th>Member ID</th>
                <th>Name</th>
                <th>Contact</th>
                <th>Plan</th>
                <th>Status</th>
                <th>Joined</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((user, i) => (
                <motion.tr key={user.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}>
                  <td className="font-mono text-gold text-xs">{user.member_id || '—'}</td>
                  <td className="text-champagne font-medium">{user.full_name}</td>
                  <td className="text-smoke text-xs">
                    <div>{viewMode === 'masked' ? maskEmail(user.email) : user.email}</div>
                    <div className="mt-0.5">{viewMode === 'masked' ? maskPhone(user.phone) : user.phone}</div>
                  </td>
                  <td className="text-champagne-dark text-xs capitalize">{user.plan || '—'}</td>
                  <td><Badge status={user.status} /></td>
                  <td className="text-smoke text-xs">{formatDate(user.join_date)}</td>
                  <td>
                    <button
                      onClick={() => { setEditForm({ ...user }); setEditModal(true); }}
                      className="p-2 rounded-lg hover:bg-gold/10 text-smoke hover:text-gold transition-all cursor-pointer"
                    >
                      <Edit3 size={14} />
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        )}
        {!loading && filtered.length === 0 && (
          <div className="text-center py-12 text-smoke">No users found.</div>
        )}
      </GlassCard>

      {/* Add User Modal */}
      <Modal isOpen={addModal} onClose={() => setAddModal(false)} title="Add New Member" size="lg">
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-champagne-dark">Full Name *</label>
              <input value={newUser.full_name} onChange={e => setNewUser(p => ({ ...p, full_name: e.target.value }))} className="w-full elite-input rounded-xl px-4 py-3 text-sm" placeholder="Member's full name" />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-champagne-dark">Phone</label>
              <input value={newUser.phone} onChange={e => setNewUser(p => ({ ...p, phone: e.target.value }))} className="w-full elite-input rounded-xl px-4 py-3 text-sm" placeholder="+91 98765 43210" />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-champagne-dark">Email (optional)</label>
              <input type="email" value={newUser.email} onChange={e => setNewUser(p => ({ ...p, email: e.target.value }))} className="w-full elite-input rounded-xl px-4 py-3 text-sm" placeholder="member@email.com" />
              <p className="text-ash text-xs">If empty, auto-generated from Card ID</p>
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-champagne-dark">Plan *</label>
              <select value={newUser.plan} onChange={e => setNewUser(p => ({ ...p, plan: e.target.value }))} className="w-full elite-input rounded-xl px-4 py-3 text-sm">
                <option value="solo">Solo (₹4,000) - Single Person</option>
                <option value="shareable">Shareable (₹6,000) - OTP Verified</option>
                <option value="dainik">Dainik Member (Legacy)</option>
                <option value="decka">Decka Member (Legacy)</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-champagne-dark flex items-center gap-2"><CreditCard size={14} className="text-gold" /> Assign Card ID *</label>
              <select value={newUser.card_id} onChange={e => setNewUser(p => ({ ...p, card_id: e.target.value }))} className="w-full elite-input rounded-xl px-4 py-3 text-sm">
                <option value="">Select available card...</option>
                {cards.map(c => (
                  <option key={c.card_id} value={c.card_id}>{c.card_id}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-champagne-dark flex items-center gap-2"><Lock size={14} className="text-gold" /> Password *</label>
              <input type="text" value={newUser.password} onChange={e => setNewUser(p => ({ ...p, password: e.target.value }))} className="w-full elite-input rounded-xl px-4 py-3 text-sm" placeholder="Set member password" />
            </div>
          </div>
          <div className="flex gap-3 pt-4">
            <Button variant="gold" className="flex-1" onClick={handleAddUser} disabled={saving}>
              {saving ? 'Creating...' : 'Create Member'}
            </Button>
            <Button variant="ghost" onClick={() => setAddModal(false)}>Cancel</Button>
          </div>
        </div>
      </Modal>

      {/* Edit User Modal */}
      <Modal isOpen={editModal} onClose={() => setEditModal(false)} title="Edit Member" size="md">
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-champagne-dark">Full Name</label>
            <input value={editForm.full_name || ''} onChange={e => setEditForm(p => ({ ...p, full_name: e.target.value }))} className="w-full elite-input rounded-xl px-4 py-3 text-sm" />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-champagne-dark">Phone</label>
            <input value={editForm.phone || ''} onChange={e => setEditForm(p => ({ ...p, phone: e.target.value }))} className="w-full elite-input rounded-xl px-4 py-3 text-sm" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-champagne-dark">Status</label>
              <select value={editForm.status || 'active'} onChange={e => setEditForm(p => ({ ...p, status: e.target.value }))} className="w-full elite-input rounded-xl px-4 py-3 text-sm">
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="pending">Pending</option>
                <option value="expired">Expired</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-champagne-dark">Plan</label>
              <select value={editForm.plan || ''} onChange={e => setEditForm(p => ({ ...p, plan: e.target.value }))} className="w-full elite-input rounded-xl px-4 py-3 text-sm">
                <option value="solo">Solo (₹4,000)</option>
                <option value="shareable">Shareable (₹6,000)</option>
                <option value="dainik">Dainik (Legacy)</option>
                <option value="decka">Decka (Legacy)</option>
              </select>
            </div>
            <div className="space-y-2 col-span-2">
              <label className="block text-sm font-medium text-champagne-dark">Expiry Date</label>
              <input type="date" value={editForm.expiry_date ? editForm.expiry_date.split('T')[0] : ''} onChange={e => setEditForm(p => ({ ...p, expiry_date: new Date(e.target.value).toISOString() }))} className="w-full elite-input rounded-xl px-4 py-3 text-sm" />
            </div>
          </div>
          <div className="flex items-center justify-between border-t border-white/5 pt-4">
            <div className="space-y-1">
              <label className="block text-sm font-medium text-champagne-dark">Member ID / Card</label>
              <p className="text-gold font-mono text-sm">{editForm.member_id || 'Not assigned'}</p>
            </div>
            <button onClick={handleReassignCard} className="text-xs text-red-400 hover:text-red-300 border border-red-400/20 bg-red-400/10 px-3 py-1.5 rounded-lg transition-colors cursor-pointer">
              Mark Lost & Reassign
            </button>
          </div>
          <div className="flex justify-between items-center pb-2">
            <button onClick={handleResetPassword} className="text-xs text-smoke hover:text-champagne transition-colors cursor-pointer flex items-center gap-1">
              <Lock size={12} /> Reset Password
            </button>
            <button onClick={handleDeleteUser} disabled={saving} className="text-xs text-red-500 hover:text-red-400 transition-colors cursor-pointer font-medium border-b border-transparent hover:border-red-400">
              Delete Member
            </button>
          </div>
          <div className="flex gap-3 pt-2">
            <Button variant="gold" className="flex-1" onClick={handleEditUser} disabled={saving}>
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
            <Button variant="ghost" onClick={() => setEditModal(false)}>Cancel</Button>
          </div>
        </div>
      </Modal>
    </PageTransition>
  );
}

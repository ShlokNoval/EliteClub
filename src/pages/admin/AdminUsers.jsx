import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Edit3, RefreshCw, Eye, UserPlus } from 'lucide-react';
import PageTransition from '../../components/layout/PageTransition';
import GlassCard from '../../components/common/GlassCard';
import Badge from '../../components/common/Badge';
import Modal from '../../components/common/Modal';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import { mockUsers, membershipPlans } from '../../data/mockData';
import { formatDate, formatCurrency, maskPhone, maskEmail } from '../../utils/helpers';

export default function AdminUsers() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedUser, setSelectedUser] = useState(null);
  const [editModal, setEditModal] = useState(false);
  const [viewMode, setViewMode] = useState('masked'); // 'masked' or 'full'

  const filtered = mockUsers.filter((u) => {
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.id.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || u.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const getPlanName = (planId) => {
    const plan = membershipPlans.find(p => p.id === planId);
    return plan ? plan.name : '—';
  };

  return (
    <PageTransition>
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-playfair text-3xl font-bold text-champagne mb-1">
            User <span className="text-gold-gradient">Management</span>
          </h1>
          <p className="text-smoke">Manage members, view details, and control access.</p>
        </div>
        <Button variant="gold" size="sm" icon={UserPlus}>
          Add User
        </Button>
      </div>

      {/* Filters */}
      <GlassCard hover={false} className="mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gold-muted" />
            <input
              type="text"
              placeholder="Search by name or ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full elite-input rounded-xl pl-11 pr-4 py-3 text-sm"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter size={16} className="text-gold" />
            {['all', 'active', 'inactive', 'pending', 'expired'].map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all capitalize cursor-pointer ${
                  statusFilter === s
                    ? 'bg-gold/15 text-gold border border-gold/25'
                    : 'text-smoke hover:text-champagne hover:bg-white/5 border border-transparent'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
          <button
            onClick={() => setViewMode(viewMode === 'masked' ? 'full' : 'masked')}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium text-gold border border-gold/20 hover:bg-gold/5 transition-all cursor-pointer"
          >
            <Eye size={14} />
            {viewMode === 'masked' ? 'Show Full Details' : 'Mask Details'}
          </button>
        </div>
      </GlassCard>

      {/* Table */}
      <GlassCard hover={false} className="overflow-x-auto">
        <table className="elite-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Contact</th>
              <th>Plan</th>
              <th>Status</th>
              <th>Expiry</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((user, i) => (
              <motion.tr
                key={user.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
              >
                <td className="font-mono text-gold text-xs">{user.id}</td>
                <td className="text-champagne font-medium">{user.name}</td>
                <td className="text-smoke text-xs">
                  <div>{viewMode === 'masked' ? maskEmail(user.email) : user.email}</div>
                  <div className="mt-0.5">{viewMode === 'masked' ? maskPhone(user.phone) : user.phone}</div>
                </td>
                <td className="text-champagne-dark text-xs">{getPlanName(user.plan)}</td>
                <td><Badge status={user.status} /></td>
                <td className="text-smoke text-xs">{formatDate(user.expiryDate)}</td>
                <td>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => { setSelectedUser(user); setEditModal(true); }}
                      className="p-2 rounded-lg hover:bg-gold/10 text-smoke hover:text-gold transition-all cursor-pointer"
                    >
                      <Edit3 size={14} />
                    </button>
                    <button className="p-2 rounded-lg hover:bg-gold/10 text-smoke hover:text-gold transition-all cursor-pointer">
                      <RefreshCw size={14} />
                    </button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="text-center py-12 text-smoke">No users found.</div>
        )}
      </GlassCard>

      {/* Edit Modal */}
      <Modal
        isOpen={editModal}
        onClose={() => setEditModal(false)}
        title="Edit User"
        size="md"
      >
        {selectedUser && (
          <div className="space-y-4">
            <Input label="Full Name" value={selectedUser.name} onChange={() => {}} />
            <Input label="Email" type="email" value={selectedUser.email} onChange={() => {}} />
            <Input label="Phone" value={selectedUser.phone} onChange={() => {}} />
            <div className="space-y-2">
              <label className="block text-sm font-medium text-champagne-dark">Status</label>
              <select className="w-full elite-input rounded-xl px-4 py-3 text-sm" defaultValue={selectedUser.status}>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="pending">Pending</option>
                <option value="expired">Expired</option>
              </select>
            </div>
            <div className="flex gap-3 pt-4">
              <Button variant="gold" className="flex-1">Save Changes</Button>
              <Button variant="ghost" onClick={() => setEditModal(false)}>Cancel</Button>
            </div>
          </div>
        )}
      </Modal>
    </PageTransition>
  );
}

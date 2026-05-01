import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, CheckCircle2, XCircle, Clock, Building2 } from 'lucide-react';
import PageTransition from '../../components/layout/PageTransition';
import GlassCard from '../../components/common/GlassCard';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import { mockHotels } from '../../data/mockData';
import { formatDate } from '../../utils/helpers';

export default function AdminHotels() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [selected, setSelected] = useState(null);

  const list = mockHotels.filter(h => {
    const m1 = h.name.toLowerCase().includes(search.toLowerCase());
    const m2 = filter === 'all' || h.status === filter;
    return m1 && m2;
  });

  const counts = { verified: mockHotels.filter(h=>h.status==='verified').length, pending: mockHotels.filter(h=>h.status==='pending').length, rejected: mockHotels.filter(h=>h.status==='rejected').length };

  return (
    <PageTransition>
      <div className="mb-8">
        <h1 className="font-playfair text-3xl font-bold text-champagne mb-1">Hotel <span className="text-gold-gradient">Management</span></h1>
        <p className="text-smoke">Manage partner venues, approvals, and verification.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {[{icon:CheckCircle2,label:'Verified',count:counts.verified,color:'text-green-400',bg:'bg-green-400/10'},{icon:Clock,label:'Pending',count:counts.pending,color:'text-yellow-400',bg:'bg-yellow-400/10'},{icon:XCircle,label:'Rejected',count:counts.rejected,color:'text-red-400',bg:'bg-red-400/10'}].map((s,i)=>(
          <GlassCard key={i} delay={i*0.1} className="p-5">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl ${s.bg} flex items-center justify-center`}><s.icon size={22} className={s.color}/></div>
              <div><p className={`text-2xl font-bold ${s.color}`}>{s.count}</p><p className="text-smoke text-xs">{s.label}</p></div>
            </div>
          </GlassCard>
        ))}
      </div>

      <GlassCard hover={false} className="mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gold-muted"/>
            <input type="text" placeholder="Search hotels..." value={search} onChange={e=>setSearch(e.target.value)} className="w-full elite-input rounded-xl pl-11 pr-4 py-3 text-sm"/>
          </div>
          <div className="flex items-center gap-2">
            {['all','verified','pending','rejected'].map(s=>(
              <button key={s} onClick={()=>setFilter(s)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all capitalize cursor-pointer ${filter===s?'bg-gold/15 text-gold border border-gold/25':'text-smoke hover:text-champagne border border-transparent'}`}>{s}</button>
            ))}
          </div>
        </div>
      </GlassCard>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {list.map((h,i)=>(
          <GlassCard key={h.id} delay={i*0.05}>
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gold/8 border border-gold/15 flex items-center justify-center"><Building2 size={20} className="text-gold"/></div>
                <div><h3 className="text-champagne font-semibold text-sm">{h.name}</h3><p className="text-ash text-xs">{h.id}</p></div>
              </div>
              <Badge status={h.status}/>
            </div>
            <div className="space-y-2 text-xs mb-4">
              <div className="flex justify-between"><span className="text-smoke">Contact</span><span className="text-champagne-dark">{h.contact}</span></div>
              <div className="flex justify-between"><span className="text-smoke">Role</span><Badge status={h.role}/></div>
              <div className="flex justify-between"><span className="text-smoke">Scans</span><span className="text-champagne-dark font-mono">{h.scanCount}</span></div>
              <div className="flex justify-between"><span className="text-smoke">Joined</span><span className="text-champagne-dark">{formatDate(h.joinDate)}</span></div>
            </div>
            <div className="flex gap-2 pt-3 border-t border-white/5">
              {h.status==='pending'&&<><Button variant="gold" size="sm" className="flex-1">Approve</Button><Button variant="danger" size="sm" className="flex-1">Reject</Button></>}
              {h.status==='verified'&&<Button variant="ghost" size="sm" className="flex-1" onClick={()=>setSelected(h)}>View Details</Button>}
              {h.status==='rejected'&&<Button variant="ghost" size="sm" className="flex-1">Review</Button>}
            </div>
          </GlassCard>
        ))}
      </div>

      <Modal isOpen={!!selected} onClose={()=>setSelected(null)} title="Hotel Details">
        {selected&&(
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div><span className="text-smoke">ID:</span><p className="text-champagne font-mono">{selected.id}</p></div>
            <div><span className="text-smoke">Status:</span><div className="mt-1"><Badge status={selected.status}/></div></div>
            <div><span className="text-smoke">Contact:</span><p className="text-champagne">{selected.contact}</p></div>
            <div><span className="text-smoke">Phone:</span><p className="text-champagne">{selected.phone}</p></div>
            <div><span className="text-smoke">Scans:</span><p className="text-champagne font-mono">{selected.scanCount}</p></div>
            <div><span className="text-smoke">Joined:</span><p className="text-champagne">{formatDate(selected.joinDate)}</p></div>
          </div>
        )}
      </Modal>
    </PageTransition>
  );
}

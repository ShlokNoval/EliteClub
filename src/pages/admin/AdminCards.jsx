import { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { motion } from 'framer-motion';
import { CreditCard, Search, Filter, User, Download } from 'lucide-react';
import PageTransition from '../../components/layout/PageTransition';
import GlassCard from '../../components/common/GlassCard';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import { supabase } from '../../lib/supabase';
import { getQRScanUrl } from '../../lib/qrConfig';
import logo from '../../assets/logo.png';

export default function AdminCards() {
  const [cards, setCards] = useState([]);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [selectedCard, setSelectedCard] = useState(null);
  const [memberInfo, setMemberInfo] = useState(null);
  const [counts, setCounts] = useState({ total: 0, available: 0, assigned: 0, suspended: 0 });
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const PAGE_SIZE = 50;

  useEffect(() => { fetchCards(); }, [page, filter]);

  const fetchCards = async () => {
    setLoading(true);
    let query = supabase.from('qr_cards').select('*, profiles:assigned_to(full_name, member_id, plan, status, email, phone)', { count: 'exact' });

    if (filter !== 'all') query = query.eq('status', filter);
    if (search) query = query.ilike('card_id', `%${search}%`);

    query = query.order('card_id').range(page * PAGE_SIZE, (page + 1) * PAGE_SIZE - 1);

    const { data, count } = await query;
    setCards(data || []);

    // Fetch global counts (only needed if search is empty, but we'll fetch always for simplicity)
    const [availRes, assignRes, suspRes] = await Promise.all([
      supabase.from('qr_cards').select('id', { count: 'exact', head: true }).eq('status', 'available'),
      supabase.from('qr_cards').select('id', { count: 'exact', head: true }).eq('status', 'assigned'),
      supabase.from('qr_cards').select('id', { count: 'exact', head: true }).eq('status', 'suspended')
    ]);

    setCounts({
      total: count || 0,
      available: availRes.count || 0,
      assigned: assignRes.count || 0,
      suspended: suspRes.count || 0,
    });

    setLoading(false);
  };

  const handleSearch = () => { setPage(0); fetchCards(); };

  const selectCard = (card) => {
    setSelectedCard(card);
    setMemberInfo(card.profiles || null);
  };

  return (
    <PageTransition>
      <div className="mb-8">
        <h1 className="font-playfair text-3xl font-bold text-champagne mb-1">QR Card <span className="text-gold-gradient">Inventory</span></h1>
        <p className="text-smoke">Manage 1111+ QR cards — view status, assignments, and card previews.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: 'Available', status: 'available', color: 'text-green-400' },
          { label: 'Assigned', status: 'assigned', color: 'text-gold' },
          { label: 'Suspended', status: 'suspended', color: 'text-red-400' },
        ].map((s, i) => (
          <GlassCard key={i} delay={i * 0.1} className="p-4 text-center">
            <p className={`text-2xl font-bold ${s.color}`}>{counts[s.status]}</p>
            <p className="text-smoke text-xs">{s.label}</p>
          </GlassCard>
        ))}
      </div>

      {/* Filters */}
      <GlassCard hover={false} className="mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gold-muted" />
            <input type="text" placeholder="Search card ID (e.g. K002098)..." value={search} onChange={e => setSearch(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSearch()} className="w-full elite-input rounded-xl pl-11 pr-4 py-3 text-sm" />
          </div>
          <div className="flex items-center gap-2">
            <Filter size={16} className="text-gold" />
            {['all', 'available', 'assigned', 'suspended'].map(s => (
              <button key={s} onClick={() => { setFilter(s); setPage(0); }} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all capitalize cursor-pointer ${filter === s ? 'bg-gold/15 text-gold border border-gold/25' : 'text-smoke hover:text-champagne border border-transparent'}`}>{s}</button>
            ))}
          </div>
          <Button variant="ghost" size="sm" onClick={handleSearch}>Search</Button>
        </div>
      </GlassCard>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Card List */}
        <div className="lg:col-span-2">
          <GlassCard hover={false} className="overflow-x-auto">
            {loading ? (
              <p className="text-smoke text-center py-12">Loading cards...</p>
            ) : (
              <table className="elite-table">
                <thead>
                  <tr>
                    <th>Card ID</th>
                    <th>Status</th>
                    <th>Assigned To</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {cards.map((card, i) => (
                    <motion.tr key={card.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.02 }}
                      className={`cursor-pointer ${selectedCard?.card_id === card.card_id ? 'bg-gold/5' : ''}`}
                      onClick={() => selectCard(card)}
                    >
                      <td className="font-mono text-gold text-xs">{card.card_id}</td>
                      <td><Badge status={card.status} /></td>
                      <td className="text-champagne-dark text-xs">
                        {card.profiles ? card.profiles.full_name : '—'}
                      </td>
                      <td>
                        <button onClick={(e) => { e.stopPropagation(); selectCard(card); }} className="text-xs text-gold hover:text-gold-light">
                          Preview
                        </button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            )}
            {/* Pagination */}
            <div className="flex items-center justify-between px-4 py-3 border-t border-white/5">
              <Button variant="ghost" size="sm" onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0}>Previous</Button>
              <span className="text-smoke text-xs">Page {page + 1}</span>
              <Button variant="ghost" size="sm" onClick={() => setPage(p => p + 1)} disabled={cards.length < PAGE_SIZE}>Next</Button>
            </div>
          </GlassCard>
        </div>

        {/* Card Preview */}
        <div>
          <h3 className="text-champagne font-semibold mb-4">Card Preview</h3>
          {selectedCard ? (
            <motion.div
              key={selectedCard.card_id}
              className="membership-card rounded-2xl p-6 max-w-sm"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <div className="flex items-start justify-between mb-6">
                <img src={logo} alt="EliteClub" className="h-10 w-auto" />
                <Badge status={selectedCard.status} />
              </div>
              <div className="mb-6">
                <p className="text-champagne font-playfair text-xl font-bold">
                  {memberInfo ? memberInfo.full_name : 'Unassigned Card'}
                </p>
                <p className="text-gold text-sm font-mono mt-1">{selectedCard.card_id}</p>
              </div>
              {memberInfo && (
                <div className="grid grid-cols-2 gap-3 mb-6 text-xs">
                  <div><p className="text-smoke">Plan</p><p className="text-champagne-dark capitalize">{memberInfo.plan || '—'}</p></div>
                  <div><p className="text-smoke">Status</p><p className="text-champagne-dark capitalize">{memberInfo.status}</p></div>
                </div>
              )}
              <div className="flex items-end justify-between">
                <div className="text-xs text-smoke">
                  {memberInfo ? <p>Member: <span className="text-gold">{memberInfo.member_id}</span></p> : <p>Scan to view ID</p>}
                </div>
                <div className="bg-white rounded-lg p-2">
                  <QRCodeSVG value={getQRScanUrl(selectedCard.card_id)} size={72} level="M" fgColor="#0A0A0A" />
                </div>
              </div>
            </motion.div>
          ) : (
            <GlassCard hover={false} className="flex flex-col items-center justify-center py-16 text-center">
              <CreditCard size={48} className="text-gold/20 mb-4" />
              <h3 className="text-champagne font-semibold mb-2">Select a Card</h3>
              <p className="text-smoke text-sm">Click on any card in the list to preview it.</p>
            </GlassCard>
          )}
        </div>
      </div>
    </PageTransition>
  );
}

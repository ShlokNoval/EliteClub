import { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { motion } from 'framer-motion';
import { CreditCard, RefreshCw, Download, Eye, EyeOff } from 'lucide-react';
import PageTransition from '../../components/layout/PageTransition';
import GlassCard from '../../components/common/GlassCard';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import { mockUsers, membershipPlans } from '../../data/mockData';
import { maskPhone, maskEmail, formatDate } from '../../utils/helpers';
import logo from '../../assets/logo.png';

export default function AdminCards() {
  const [selectedId, setSelectedId] = useState('USR001');
  const [showFull, setShowFull] = useState(false);
  const [qrKey, setQrKey] = useState(Date.now());

  const user = mockUsers.find(u => u.id === selectedId);
  const plan = membershipPlans.find(p => p.id === user?.plan);

  return (
    <PageTransition>
      <div className="mb-8">
        <h1 className="font-playfair text-3xl font-bold text-champagne mb-1">Card <span className="text-gold-gradient">Generator</span></h1>
        <p className="text-smoke">Generate and manage digital membership cards.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Controls */}
        <div className="space-y-6">
          <GlassCard hover={false}>
            <h3 className="text-champagne font-semibold mb-4 flex items-center gap-2"><CreditCard size={18} className="text-gold"/>Select Member</h3>
            <select
              value={selectedId}
              onChange={e => setSelectedId(e.target.value)}
              className="w-full elite-input rounded-xl px-4 py-3 text-sm mb-4"
            >
              {mockUsers.map(u => (
                <option key={u.id} value={u.id}>{u.name} ({u.id})</option>
              ))}
            </select>

            {user && (
              <div className="space-y-3 text-sm">
                <div className="flex justify-between"><span className="text-smoke">Name</span><span className="text-champagne">{user.name}</span></div>
                <div className="flex justify-between"><span className="text-smoke">Email</span><span className="text-champagne">{showFull ? user.email : maskEmail(user.email)}</span></div>
                <div className="flex justify-between"><span className="text-smoke">Phone</span><span className="text-champagne">{showFull ? user.phone : maskPhone(user.phone)}</span></div>
                <div className="flex justify-between"><span className="text-smoke">Plan</span><span className="text-gold">{plan?.name}</span></div>
                <div className="flex justify-between"><span className="text-smoke">Status</span><Badge status={user.status}/></div>
              </div>
            )}

            <div className="flex gap-3 mt-6">
              <Button variant="ghost" size="sm" icon={showFull ? EyeOff : Eye} onClick={() => setShowFull(!showFull)}>
                {showFull ? 'Mask' : 'Reveal'}
              </Button>
              <Button variant="gold" size="sm" icon={RefreshCw} onClick={() => setQrKey(Date.now())}>
                Regenerate QR
              </Button>
            </div>
          </GlassCard>
        </div>

        {/* Card Preview */}
        <div>
          <h3 className="text-champagne font-semibold mb-4">Card Preview</h3>
          {user && (
            <motion.div
              key={qrKey}
              className="membership-card rounded-2xl p-6 sm:p-8 max-w-md"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex items-start justify-between mb-6">
                <img src={logo} alt="EliteClub" className="h-10 w-auto"/>
                <span className="text-xs text-gold font-semibold tracking-widest uppercase bg-gold/10 border border-gold/20 px-3 py-1 rounded-full">
                  {plan?.name}
                </span>
              </div>
              <div className="mb-6">
                <p className="text-champagne font-playfair text-xl font-bold">{user.name}</p>
                <p className="text-gold text-sm font-mono mt-1">EC-2026-{user.id.replace('USR','')}</p>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-6 text-xs">
                <div><p className="text-smoke">From</p><p className="text-champagne-dark">{user.joinDate}</p></div>
                <div><p className="text-smoke">Until</p><p className="text-champagne-dark">{user.expiryDate || '—'}</p></div>
              </div>
              <div className="flex items-end justify-between">
                <div className="text-xs text-smoke">
                  <p>Status: <span className={user.status==='active'?'text-green-400':'text-yellow-400'}>{user.status}</span></p>
                </div>
                <div className="bg-white rounded-lg p-2">
                  <QRCodeSVG value={`ELITECLUB:EC-2026-${user.id}:${qrKey}`} size={72} level="M" fgColor="#0A0A0A"/>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </PageTransition>
  );
}

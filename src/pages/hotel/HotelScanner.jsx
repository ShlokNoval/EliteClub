import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ScanLine, CheckCircle2, XCircle, AlertTriangle, Shield, Lock, User } from 'lucide-react';
import PageTransition from '../../components/layout/PageTransition';
import GlassCard from '../../components/common/GlassCard';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import { mockUsers, membershipPlans, currentHotel } from '../../data/mockData';
import { maskEmail, maskPhone, formatDate } from '../../utils/helpers';

const scanResults = {
  valid: { icon: CheckCircle2, color: 'text-green-400', bg: 'bg-green-400/10', border: 'border-green-400/20', title: 'Valid Membership', desc: 'This member has an active membership.' },
  expired: { icon: AlertTriangle, color: 'text-yellow-400', bg: 'bg-yellow-400/10', border: 'border-yellow-400/20', title: 'Membership Expired', desc: 'This membership has expired.' },
  invalid: { icon: XCircle, color: 'text-red-400', bg: 'bg-red-400/10', border: 'border-red-400/20', title: 'Invalid QR Code', desc: 'This QR code is not recognized.' },
  unauthorized: { icon: Lock, color: 'text-red-400', bg: 'bg-red-400/10', border: 'border-red-400/20', title: 'Unauthorized Access', desc: 'Your venue is not verified to view member details.' },
};

export default function HotelScanner() {
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState(null);
  const [resultType, setResultType] = useState(null);

  const isVerified = currentHotel.status === 'verified';

  const simulateScan = (type) => {
    setScanning(true);
    setResult(null);
    setTimeout(() => {
      setScanning(false);
      setResultType(type);
      if (type === 'valid') {
        setResult(mockUsers.find(u => u.status === 'active'));
      } else if (type === 'expired') {
        setResult(mockUsers.find(u => u.status === 'expired' || u.status === 'inactive'));
      } else {
        setResult(null);
      }
    }, 2000);
  };

  const getPlan = (planId) => membershipPlans.find(p => p.id === planId);

  return (
    <PageTransition>
      <div className="mb-8">
        <h1 className="font-playfair text-3xl font-bold text-champagne mb-1">QR <span className="text-gold-gradient">Scanner</span></h1>
        <p className="text-smoke">Scan member QR codes to verify membership status.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Scanner */}
        <GlassCard hover={false}>
          <div className="relative aspect-square max-w-sm mx-auto rounded-2xl bg-black-deep border border-gold/10 overflow-hidden flex items-center justify-center">
            {scanning ? (
              <motion.div className="absolute inset-0 flex flex-col items-center justify-center"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <motion.div className="absolute left-4 right-4 h-0.5 bg-gold/60"
                  animate={{ top: ['15%', '85%', '15%'] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                />
                <ScanLine size={64} className="text-gold/30 mb-4"/>
                <p className="text-gold text-sm animate-pulse">Scanning...</p>
              </motion.div>
            ) : (
              <div className="text-center p-8">
                <ScanLine size={64} className="text-gold/20 mx-auto mb-4"/>
                <p className="text-smoke text-sm mb-2">Position QR code in frame</p>
                <p className="text-ash text-xs">Camera preview area</p>
              </div>
            )}
            {/* Corner guides */}
            <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-gold/40 rounded-tl-lg"/>
            <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-gold/40 rounded-tr-lg"/>
            <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-gold/40 rounded-bl-lg"/>
            <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-gold/40 rounded-br-lg"/>
          </div>

          <div className="mt-6 space-y-3">
            <p className="text-xs text-gold font-semibold uppercase tracking-wider mb-3">Simulate Scan:</p>
            <div className="grid grid-cols-2 gap-3">
              <Button variant="gold" size="sm" onClick={() => simulateScan('valid')} disabled={scanning}>Valid QR</Button>
              <Button variant="ghost" size="sm" onClick={() => simulateScan('expired')} disabled={scanning}>Expired QR</Button>
              <Button variant="danger" size="sm" onClick={() => simulateScan('invalid')} disabled={scanning}>Invalid QR</Button>
              <Button variant="ghost" size="sm" onClick={() => { setResultType('unauthorized'); setResult(null); setScanning(false); }} disabled={scanning}>Unauthorized</Button>
            </div>
          </div>
        </GlassCard>

        {/* Result */}
        <div>
          <AnimatePresence mode="wait">
            {resultType && !scanning && (
              <motion.div key={resultType} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                <GlassCard hover={false} className={`border ${scanResults[resultType].border}`}>
                  <div className="text-center mb-6">
                    <div className={`w-16 h-16 rounded-full ${scanResults[resultType].bg} flex items-center justify-center mx-auto mb-3`}>
                      {(() => { const I = scanResults[resultType].icon; return <I size={32} className={scanResults[resultType].color}/>; })()}
                    </div>
                    <h3 className={`font-playfair text-xl font-semibold ${scanResults[resultType].color}`}>{scanResults[resultType].title}</h3>
                    <p className="text-smoke text-sm mt-1">{scanResults[resultType].desc}</p>
                  </div>

                  {result && resultType !== 'unauthorized' && isVerified && (
                    <div className="border-t border-white/5 pt-4 space-y-3 text-sm">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center">
                          <User size={20} className="text-gold"/>
                        </div>
                        <div>
                          <p className="text-champagne font-semibold">{result.name}</p>
                          <p className="text-ash text-xs">{result.id}</p>
                        </div>
                        <Badge status={result.status} className="ml-auto"/>
                      </div>
                      <div className="flex justify-between"><span className="text-smoke">Email</span><span className="text-champagne">{isVerified ? result.email : maskEmail(result.email)}</span></div>
                      <div className="flex justify-between"><span className="text-smoke">Phone</span><span className="text-champagne">{isVerified ? result.phone : maskPhone(result.phone)}</span></div>
                      <div className="flex justify-between"><span className="text-smoke">Plan</span><span className="text-gold">{getPlan(result.plan)?.name}</span></div>
                      <div className="flex justify-between"><span className="text-smoke">Joined</span><span className="text-champagne">{formatDate(result.joinDate)}</span></div>
                      <div className="flex justify-between"><span className="text-smoke">Expires</span><span className="text-champagne">{formatDate(result.expiryDate)}</span></div>
                    </div>
                  )}

                  {result && !isVerified && resultType !== 'unauthorized' && (
                    <div className="border-t border-white/5 pt-4 text-center">
                      <Lock size={24} className="text-red-400 mx-auto mb-2"/>
                      <p className="text-red-400 text-sm font-medium">Venue Not Verified</p>
                      <p className="text-smoke text-xs mt-1">Complete verification to view member details.</p>
                    </div>
                  )}
                </GlassCard>
              </motion.div>
            )}
          </AnimatePresence>

          {!resultType && !scanning && (
            <GlassCard hover={false} className="flex flex-col items-center justify-center py-16 text-center">
              <Shield size={48} className="text-gold/20 mb-4"/>
              <h3 className="text-champagne font-semibold mb-2">Ready to Scan</h3>
              <p className="text-smoke text-sm">Use the scanner or simulate a scan to verify membership.</p>
            </GlassCard>
          )}
        </div>
      </div>
    </PageTransition>
  );
}

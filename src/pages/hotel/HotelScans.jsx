import { motion } from 'framer-motion';
import { ScanLine, CheckCircle2, XCircle, AlertTriangle, Clock } from 'lucide-react';
import PageTransition from '../../components/layout/PageTransition';
import GlassCard from '../../components/common/GlassCard';
import Badge from '../../components/common/Badge';
import { mockScans, currentHotel } from '../../data/mockData';

const resultIcons = {
  valid: { icon: CheckCircle2, color: 'text-green-400' },
  expired: { icon: AlertTriangle, color: 'text-yellow-400' },
  invalid: { icon: XCircle, color: 'text-red-400' },
};

export default function HotelScans() {
  const scans = mockScans.filter(s => s.hotelId === currentHotel.id);

  return (
    <PageTransition>
      <div className="mb-8">
        <h1 className="font-playfair text-3xl font-bold text-champagne mb-1">Recent <span className="text-gold-gradient">Scans</span></h1>
        <p className="text-smoke">History of all QR scans at {currentHotel.name}.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: 'Total', value: scans.length, color: 'text-blue-400' },
          { label: 'Valid', value: scans.filter(s=>s.result==='valid').length, color: 'text-green-400' },
          { label: 'Failed', value: scans.filter(s=>s.result!=='valid').length, color: 'text-red-400' },
        ].map((s,i) => (
          <GlassCard key={i} delay={i*0.1} className="p-4 text-center">
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-smoke text-xs">{s.label}</p>
          </GlassCard>
        ))}
      </div>

      {/* Scan List */}
      <GlassCard hover={false}>
        <div className="space-y-0">
          {scans.map((scan, i) => {
            const r = resultIcons[scan.result] || resultIcons.invalid;
            const Icon = r.icon;
            return (
              <motion.div
                key={scan.id}
                className="flex items-center gap-4 p-4 border-b border-white/5 last:border-0 hover:bg-white/2 transition-colors"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${scan.result === 'valid' ? 'bg-green-400/10' : scan.result === 'expired' ? 'bg-yellow-400/10' : 'bg-red-400/10'}`}>
                  <Icon size={20} className={r.color}/>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-champagne font-medium text-sm truncate">{scan.userName}</p>
                  <p className="text-ash text-xs">{scan.plan}</p>
                </div>
                <div className="text-right shrink-0">
                  <Badge status={scan.result}/>
                  <p className="text-ash text-xs mt-1 flex items-center gap-1 justify-end">
                    <Clock size={10}/>
                    {new Date(scan.timestamp).toLocaleString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </GlassCard>
    </PageTransition>
  );
}

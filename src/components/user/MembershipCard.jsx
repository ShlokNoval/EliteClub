import { QRCodeSVG } from 'qrcode.react';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Crown } from 'lucide-react';
import logo from '../../assets/logo.png';
import { formatDate } from '../../utils/helpers';
import { getQRScanUrl } from '../../lib/qrConfig';
import { toPng } from 'html-to-image';
import { useRef } from 'react';

export default function MembershipCard({ user, isActive, showCard, onToggle }) {
  const cardRef = useRef(null);

  const handleDownload = async () => {
    if (cardRef.current === null) return;
    try {
      const dataUrl = await toPng(cardRef.current, { cacheBust: true, pixelRatio: 3 });
      const link = document.createElement('a');
      link.download = `${user.full_name || 'Member'}_EliteClub_Card.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Failed to download card', err);
    }
  };

  if (!isActive) {
    return (
      <motion.div
        className="membership-card rounded-2xl p-8 flex flex-col items-center justify-center text-center max-w-md mx-auto"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        style={{ filter: 'grayscale(0.5)' }}
      >
        <div className="w-16 h-16 rounded-full bg-yellow-400/10 border border-yellow-400/20 flex items-center justify-center mb-4">
          <Crown size={28} className="text-yellow-400" />
        </div>
        <h3 className="font-playfair text-xl font-semibold text-champagne mb-2">
          Membership Inactive
        </h3>
        <p className="text-smoke text-sm mb-6">
          Your membership is currently inactive or pending approval.
        </p>
      </motion.div>
    );
  }

  return (
    <div className="max-w-md mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-playfair text-lg font-semibold text-champagne">
          Your Membership Card
        </h3>
        <div className="flex items-center gap-4">
          {showCard && (
            <button
              onClick={handleDownload}
              className="text-xs text-champagne hover:text-white transition-colors"
            >
              Download
            </button>
          )}
          <button
            onClick={onToggle}
            className="flex items-center gap-2 text-sm text-gold hover:text-gold-light transition-colors cursor-pointer"
          >
            {showCard ? <EyeOff size={16} /> : <Eye size={16} />}
            {showCard ? 'Hide Card' : 'Show Card'}
          </button>
        </div>
      </div>

      {showCard && (
        <motion.div
          ref={cardRef}
          className="membership-card rounded-2xl p-6 sm:p-8 cursor-pointer transition-shadow relative"
          initial={{ opacity: 0, rotateY: -90 }}
          animate={{ opacity: 1, rotateY: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          whileHover={{
            scale: 1.02,
            rotateX: 2,
            rotateY: -2,
            boxShadow: "0 25px 50px -12px rgba(201,169,78,0.25)"
          }}
          style={{ perspective: '1000px' }}
        >
          {/* Top Row */}
          <div className="flex items-start justify-between mb-4">
            <img src={logo} alt="EliteClub" className="h-10 w-auto" />
            <span className="text-xs text-gold font-semibold tracking-[0.15em] uppercase bg-gold/10 border border-gold/20 px-3 py-1 rounded-full">
              {user.plan ? `${user.plan} Member` : 'Member'}
            </span>
          </div>

          {/* Member Info */}
          <div className="mb-4">
            <p className="text-champagne font-playfair text-xl font-bold">{user.full_name}</p>
            <p className="text-gold text-sm font-mono mt-1">{user.member_id || user.card_id || '—'}</p>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-4 mb-4 text-xs">
            <div>
              <p className="text-smoke">Valid From</p>
              <p className="text-champagne-dark font-medium">{formatDate(user.join_date)}</p>
            </div>
            <div>
              <p className="text-smoke">Valid Until</p>
              <p className="text-champagne-dark font-medium">{formatDate(user.expiry_date)}</p>
            </div>
          </div>

          {/* QR Code — contains ONLY the Card ID */}
          <div className="flex items-end justify-between">
            <div className="text-xs text-smoke">
              <p>Scan at any partner venue</p>
              <p className="text-gold mt-1 font-semibold">Status: Active ✓</p>
            </div>
            <div className="bg-white rounded-lg p-2">
              <QRCodeSVG
                value={getQRScanUrl(user.card_id || user.member_id || 'ELITECLUB')}
                size={72}
                level="M"
                fgColor="#0A0A0A"
                bgColor="#FFFFFF"
              />
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}

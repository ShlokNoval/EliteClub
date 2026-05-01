import { QRCodeSVG } from 'qrcode.react';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Crown } from 'lucide-react';
import logo from '../../assets/logo.png';

export default function MembershipCard({ user, isActive, showCard, onToggle }) {
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
        <button className="btn-gold px-6 py-3 rounded-xl text-sm font-semibold">
          Activate Membership
        </button>
      </motion.div>
    );
  }

  return (
    <div className="max-w-md mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-playfair text-lg font-semibold text-champagne">
          Your Membership Card
        </h3>
        <button
          onClick={onToggle}
          className="flex items-center gap-2 text-sm text-gold hover:text-gold-light transition-colors cursor-pointer"
        >
          {showCard ? <EyeOff size={16} /> : <Eye size={16} />}
          {showCard ? 'Hide Card' : 'Show Card'}
        </button>
      </div>

      {showCard && (
        <motion.div
          className="membership-card rounded-2xl p-6 sm:p-8"
          initial={{ opacity: 0, rotateY: -90 }}
          animate={{ opacity: 1, rotateY: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          style={{ perspective: '1000px' }}
        >
          {/* Top Row */}
          <div className="flex items-start justify-between mb-6">
            <img src={logo} alt="EliteClub" className="h-10 w-auto" />
            <span className="text-xs text-gold font-semibold tracking-[0.15em] uppercase bg-gold/10 border border-gold/20 px-3 py-1 rounded-full">
              {user.planName}
            </span>
          </div>

          {/* Member Info */}
          <div className="mb-6">
            <p className="text-champagne font-playfair text-xl font-bold">{user.name}</p>
            <p className="text-gold text-sm font-mono mt-1">{user.memberId}</p>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-4 mb-6 text-xs">
            <div>
              <p className="text-smoke">Valid From</p>
              <p className="text-champagne-dark font-medium">{user.joinDate}</p>
            </div>
            <div>
              <p className="text-smoke">Valid Until</p>
              <p className="text-champagne-dark font-medium">{user.expiryDate}</p>
            </div>
          </div>

          {/* QR Code */}
          <div className="flex items-end justify-between">
            <div className="text-xs text-smoke">
              <p>Scan at any partner venue</p>
              <p className="text-gold mt-1 font-semibold">Status: Active ✓</p>
            </div>
            <div className="bg-white rounded-lg p-2">
              <QRCodeSVG
                value={`ELITECLUB:${user.memberId}:${user.id}:${user.plan}`}
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

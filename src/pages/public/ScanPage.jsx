import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { QRCodeSVG } from 'qrcode.react';
import { CreditCard, ArrowLeft, CheckCircle2, XCircle, AlertTriangle, Lock, LogIn, LogOut } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { getQRScanUrl } from '../../lib/qrConfig';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../components/common/Toast';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import logo from '../../assets/logo.png';
import { formatDate } from '../../utils/helpers';

export default function ScanPage() {
  const { cardId } = useParams();
  const { isAuthenticated, isHotel, isAdmin, hotel } = useAuth();
  const toast = useToast();
  const [card, setCard] = useState(null);
  const [member, setMember] = useState(null);
  const [loading, setLoading] = useState(true);
  const [visitStatus, setVisitStatus] = useState(null); // 'none' | 'open' | 'closed_today'
  const [openVisit, setOpenVisit] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    if (cardId) fetchCard();
  }, [cardId]);

  const fetchCard = async () => {
    try {
      const { data } = await supabase.from('qr_cards')
        .select('*, profiles:assigned_to(id, full_name, member_id, plan, status, join_date, expiry_date)')
        .eq('card_id', cardId.toUpperCase())
        .single();

      if (data) {
        setCard(data);
        let profileData = data.profiles;
        
        if (profileData && profileData.status === 'active' && profileData.expiry_date) {
            const todayStart = new Date(); todayStart.setHours(0, 0, 0, 0);
            if (new Date(profileData.expiry_date) < todayStart) {
                await supabase.from('profiles').update({ status: 'expired' }).eq('id', profileData.id);
                profileData.status = 'expired';
            }
        }

        setMember(profileData || null);
        if (profileData) await checkVisitStatus(profileData.id);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const checkVisitStatus = async (memberId) => {
    const todayStart = new Date(); todayStart.setHours(0, 0, 0, 0);

    // Check closed visits today
    const { data: closedToday } = await supabase.from('visits')
      .select('id').eq('member_id', memberId).eq('status', 'closed')
      .gte('check_in', todayStart.toISOString());

    if (closedToday && closedToday.length > 0) {
      setVisitStatus('closed_today');
      return;
    }

    // Check open visits
    const { data: open } = await supabase.from('visits')
      .select('id, hotel_id, check_in').eq('member_id', memberId).eq('status', 'open');

    if (open && open.length > 0) {
      setVisitStatus('open');
      setOpenVisit(open[0]);
    } else {
      setVisitStatus('none');
    }
  };

  const handleCheckIn = async () => {
    if (!isHotel || !hotel || !member) return;
    setActionLoading(true);
    try {
      // Create visit
      await supabase.from('visits').insert({ member_id: member.id, hotel_id: hotel.id, status: 'open' });
      // Log scan
      await supabase.from('scans').insert({ card_id: cardId.toUpperCase(), hotel_id: hotel.id, member_id: member.id, scan_type: 'check_in', result: 'valid' });
      await supabase.from('hotels').update({ scan_count: (hotel.scan_count || 0) + 1 }).eq('id', hotel.id);
      toast.success(`${member.full_name} checked in!`);
      await fetchCard(); // refresh
    } catch (err) {
      toast.error(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleCheckOut = async () => {
    if (!isHotel || !hotel || !openVisit) return;
    setActionLoading(true);
    try {
      await supabase.from('visits').update({ check_out: new Date().toISOString(), status: 'closed' }).eq('id', openVisit.id);
      await supabase.from('scans').insert({ card_id: cardId.toUpperCase(), hotel_id: hotel.id, member_id: member.id, scan_type: 'check_out', result: 'valid' });
      toast.success(`${member.full_name} checked out! Go to Bill Upload to record the bill.`);
      await fetchCard(); // refresh
    } catch (err) {
      toast.error(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black-deep flex items-center justify-center px-4 py-8 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(201,169,78,0.08)_0%,_transparent_50%)]" />

      <Link to="/" className="absolute top-6 left-6 flex items-center gap-2 text-smoke hover:text-gold transition-colors z-10">
        <ArrowLeft size={18} /><span className="text-sm">Home</span>
      </Link>

      <motion.div className="relative w-full max-w-md" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
        {/* Logo */}
        <div className="text-center mb-8">
          <img src={logo} alt="The Elite Club" className="h-16 w-auto mx-auto mb-4" />
        </div>

        {loading ? (
          <div className="glass-strong rounded-2xl p-8 text-center">
            <p className="text-champagne">Loading card information...</p>
          </div>
        ) : (!isHotel && !isAdmin) ? (
          <div className="glass-strong rounded-2xl p-8 text-center border border-red-400/20">
            <Lock size={48} className="text-red-400/50 mx-auto mb-4" />
            <h2 className="font-playfair text-xl font-bold text-red-400 mb-2">Unauthorized Access</h2>
            <p className="text-smoke text-sm mb-6">Only verified EliteClub partner venues can scan and process membership cards.</p>
            <Link to="/hotel-login" className="inline-block px-6 py-2 bg-gold/10 text-gold rounded-lg border border-gold/20 hover:bg-gold/20 transition-colors">
              Venue Login
            </Link>
          </div>
        ) : !card ? (
          <div className="glass-strong rounded-2xl p-8 text-center">
            <CreditCard size={48} className="text-red-400/30 mx-auto mb-4" />
            <h2 className="font-playfair text-xl font-bold text-red-400 mb-2">Card Not Found</h2>
            <p className="text-smoke text-sm">Card ID <span className="text-gold font-mono">{cardId?.toUpperCase()}</span> not found in the system.</p>
          </div>
        ) : member ? (
          <div className="space-y-4">
            {/* Member Card Display */}
            <motion.div className="membership-card rounded-2xl p-6 sm:p-8" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
              <div className="flex items-start justify-between mb-6">
                <img src={logo} alt="EliteClub" className="h-10 w-auto" />
                <Badge status={member.status} />
              </div>
              <div className="mb-6">
                <p className="text-champagne font-playfair text-xl font-bold">{member.full_name}</p>
                <p className="text-gold text-sm font-mono mt-1">{card.card_id}</p>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-6 text-xs">
                <div><p className="text-smoke">Plan</p><p className="text-champagne-dark capitalize">{member.plan || '—'}</p></div>
                <div><p className="text-smoke">Valid Until</p><p className="text-champagne-dark">{formatDate(member.expiry_date)}</p></div>
              </div>
              <div className="flex items-end justify-between">
                <div className="text-xs text-smoke">
                  <p>The Elite Club</p>
                  <p className="text-gold mt-1 font-semibold">Verified Member</p>
                </div>
                <div className="bg-white rounded-lg p-2">
                  <QRCodeSVG value={getQRScanUrl(card.card_id)} size={72} level="M" fgColor="#0A0A0A" />
                </div>
              </div>
            </motion.div>

            {/* Hotel Employee Actions */}
            {isHotel && member.status === 'active' && (
              <GlassCardActions
                visitStatus={visitStatus}
                openVisit={openVisit}
                hotel={hotel}
                memberName={member.full_name}
                onCheckIn={handleCheckIn}
                onCheckOut={handleCheckOut}
                loading={actionLoading}
              />
            )}

            {/* Status message for non-hotel users */}
            {!isHotel && member.status !== 'active' && (
              <div className="glass-strong rounded-2xl p-4 text-center">
                <AlertTriangle size={20} className="text-yellow-400 mx-auto mb-2" />
                <p className="text-yellow-400 text-sm font-medium">Membership is {member.status}</p>
              </div>
            )}
          </div>
        ) : (
          /* Card exists but not assigned */
          <div className="glass-strong rounded-2xl p-8 text-center">
            <div className="bg-white rounded-xl p-4 inline-block mb-6">
              <QRCodeSVG value={getQRScanUrl(card.card_id)} size={120} level="M" fgColor="#0A0A0A" />
            </div>
            <h2 className="font-playfair text-2xl font-bold text-gold mb-2">{card.card_id}</h2>
            <p className="text-smoke text-sm mb-4">This Elite Club card has not been assigned to a member yet.</p>
            <Badge status={card.status} />
          </div>
        )}

        <p className="text-center text-ash text-xs mt-6">The Elite Club — Chh. Sambhajinagar</p>
      </motion.div>
    </div>
  );
}

/* ─── Check-in / Check-out Action Card ─── */
function GlassCardActions({ visitStatus, openVisit, hotel, memberName, onCheckIn, onCheckOut, loading }) {
  if (visitStatus === 'closed_today') {
    return (
      <div className="glass-strong rounded-2xl p-6 text-center border border-red-400/20">
        <Lock size={28} className="text-red-400 mx-auto mb-3" />
        <h3 className="text-red-400 font-semibold mb-1">Already Visited Today</h3>
        <p className="text-smoke text-sm">{memberName} has already completed a visit today. Cannot check in again.</p>
      </div>
    );
  }

  if (visitStatus === 'open') {
    const isThisHotel = openVisit?.hotel_id === hotel?.id;
    if (!isThisHotel) {
      return (
        <div className="glass-strong rounded-2xl p-6 text-center border border-yellow-400/20">
          <AlertTriangle size={28} className="text-yellow-400 mx-auto mb-3" />
          <h3 className="text-yellow-400 font-semibold mb-1">Visit Open Elsewhere</h3>
          <p className="text-smoke text-sm">{memberName} has an open visit at another venue. They must check out there first.</p>
        </div>
      );
    }
    return (
      <div className="glass-strong rounded-2xl p-6 text-center border border-blue-400/20">
        <LogOut size={28} className="text-blue-400 mx-auto mb-3" />
        <h3 className="text-blue-400 font-semibold mb-1">Ready to Check Out</h3>
        <p className="text-smoke text-sm mb-4">{memberName} is currently checked in. Scan to close the visit.</p>
        <Button variant="gold" size="lg" icon={LogOut} className="w-full" onClick={onCheckOut} disabled={loading}>
          {loading ? 'Processing...' : 'Check Out'}
        </Button>
      </div>
    );
  }

  // visitStatus === 'none' — ready for check-in
  return (
    <div className="glass-strong rounded-2xl p-6 text-center border border-green-400/20">
      <LogIn size={28} className="text-green-400 mx-auto mb-3" />
      <h3 className="text-green-400 font-semibold mb-1">Ready to Check In</h3>
      <p className="text-smoke text-sm mb-4">Verify and check in {memberName}.</p>
      <Button variant="gold" size="lg" icon={LogIn} className="w-full" onClick={onCheckIn} disabled={loading}>
        {loading ? 'Processing...' : 'Check In'}
      </Button>
    </div>
  );
}

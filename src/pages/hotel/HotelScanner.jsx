import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ScanLine, CheckCircle2, XCircle, AlertTriangle, Shield, Lock, User, Camera, Hash } from 'lucide-react';
import PageTransition from '../../components/layout/PageTransition';
import GlassCard from '../../components/common/GlassCard';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../components/common/Toast';
import { supabase } from '../../lib/supabase';
import { formatDate } from '../../utils/helpers';

const resultStyles = {
  valid: { icon: CheckCircle2, color: 'text-green-400', bg: 'bg-green-400/10', border: 'border-green-400/20' },
  expired: { icon: AlertTriangle, color: 'text-yellow-400', bg: 'bg-yellow-400/10', border: 'border-yellow-400/20' },
  invalid: { icon: XCircle, color: 'text-red-400', bg: 'bg-red-400/10', border: 'border-red-400/20' },
  blocked: { icon: Lock, color: 'text-red-400', bg: 'bg-red-400/10', border: 'border-red-400/20' },
  not_found: { icon: XCircle, color: 'text-red-400', bg: 'bg-red-400/10', border: 'border-red-400/20' },
  check_in: { icon: CheckCircle2, color: 'text-green-400', bg: 'bg-green-400/10', border: 'border-green-400/20' },
  check_out: { icon: CheckCircle2, color: 'text-blue-400', bg: 'bg-blue-400/10', border: 'border-blue-400/20' },
};

export default function HotelScanner() {
  const { hotel } = useAuth();
  const toast = useToast();
  const [manualId, setManualId] = useState('');
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState(null);
  const [cameraActive, setCameraActive] = useState(false);
  const scannerRef = useRef(null);
  const html5QrRef = useRef(null);

  const [otpStep, setOtpStep] = useState(null);
  const [otpCode, setOtpCode] = useState('');
  const [activatingUnlimited, setActivatingUnlimited] = useState(false);

  // Clean up camera on unmount
  useEffect(() => {
    return () => { stopCamera(); };
  }, []);

  const stopCamera = () => {
    if (html5QrRef.current) {
      html5QrRef.current.stop().catch(() => {});
      html5QrRef.current = null;
    }
    setCameraActive(false);
  };

  const startCamera = async () => {
    try {
      const { Html5Qrcode } = await import('html5-qrcode');
      const scanner = new Html5Qrcode('qr-reader');
      html5QrRef.current = scanner;
      setCameraActive(true);

      await scanner.start(
        { facingMode: 'environment' },
        { fps: 15, qrbox: { width: 250, height: 250 } },
        (decodedText) => {
          stopCamera();
          
          let cardId = decodedText.trim();
          // If the QR code contains the full scan URL, extract just the ID (e.g. K002098)
          if (cardId.includes('/scan/')) {
            cardId = cardId.split('/scan/').pop();
          }
          
          // Aggressively clean: remove any trailing slashes, spaces, or invisible characters, and uppercase
          cardId = cardId.replace(/[^A-Za-z0-9]/g, '').toUpperCase();
          
          console.log('Scanned Raw:', decodedText, 'Parsed:', cardId);
          processScan(cardId);
        },
        () => {} // ignore errors during scanning
      );
    } catch (err) {
      toast.error('Camera access denied or not available.');
      setCameraActive(false);
    }
  };

  const handleManualScan = () => {
    if (!manualId.trim()) return;
    processScan(manualId.trim().toUpperCase());
    setManualId('');
  };

  const processScan = async (cardId) => {
    setScanning(true);
    setResult(null);

    try {
      // 1. Look up card
      const { data: card } = await supabase.from('qr_cards').select('*, profiles:assigned_to(id, full_name, email, phone, plan, status, member_id, join_date, expiry_date)').eq('card_id', cardId).single();

      if (!card) {
        await logScan(cardId, null, 'check_in', 'not_found');
        setResult({ type: 'not_found', title: 'Card Not Found', desc: `QR code "${cardId}" is not in the system.` });
        setScanning(false);
        return;
      }

      if (!card.profiles) {
        await logScan(cardId, null, 'check_in', 'invalid');
        setResult({ type: 'invalid', title: 'Card Not Assigned', desc: `Card ${cardId} exists but is not assigned to any member.` });
        setScanning(false);
        return;
      }

      const member = card.profiles;

      // 2. Check member status
      if (member.status !== 'active') {
        await logScan(cardId, member.id, 'check_in', 'expired');
        setResult({ type: 'expired', title: 'Membership Inactive', desc: `${member.full_name}'s membership is ${member.status}.`, member });
        setScanning(false);
        return;
      }

      // 3. Quota Math (Global Daily Consumption)
      const todayStart = new Date(); todayStart.setHours(0, 0, 0, 0);
      const isUnlimitedToday = member.unlimited_day_used_at && new Date(member.unlimited_day_used_at) >= todayStart;

      if (!isUnlimitedToday) {
        const { data: billsToday } = await supabase.from('bills')
          .select('nips_consumed, beers_consumed')
          .eq('member_id', member.id)
          .gte('created_at', todayStart.toISOString());
        
        let totalNips = 0, totalBeers = 0;
        if (billsToday) {
          billsToday.forEach(b => {
            totalNips += b.nips_consumed || 0;
            totalBeers += b.beers_consumed || 0;
          });
        }

        const nipLimit = hotel.nip_limit || 4;
        const beerLimit = hotel.beer_limit || 8;
        
        // If both quotas are completely exhausted, block check-in
        if (totalNips >= nipLimit && totalBeers >= beerLimit) {
          await logScan(cardId, member.id, 'check_in', 'blocked');
          setResult({ type: 'blocked', title: 'Quota Exhausted', desc: `${member.full_name} has consumed their daily allowance (${totalNips} Nips, ${totalBeers} Beers) for this venue's limit.`, member });
          setScanning(false);
          return;
        }
      }

      // 4. Check for open visit (this would be check-out)
      const { data: openVisits } = await supabase.from('visits')
        .select('id, check_in, hotel_id')
        .eq('member_id', member.id)
        .eq('status', 'open');

      if (openVisits && openVisits.length > 0) {
        const openVisit = openVisits[0];
        if (openVisit.hotel_id === hotel.id) {
          // Check-out at same hotel
          await supabase.from('visits')
            .update({ check_out: new Date().toISOString(), status: 'closed' })
            .eq('id', openVisit.id);
          await logScan(cardId, member.id, 'check_out', 'valid');
          setResult({ type: 'check_out', title: '✓ Checked Out', desc: `${member.full_name} has been checked out. Please proceed to upload the bill.`, member, visitId: openVisit.id });
        } else {
          // Open visit at different hotel
          setResult({ type: 'blocked', title: 'Visit Open Elsewhere', desc: `${member.full_name} has an open visit at another venue. They must check out there first.`, member });
        }
        setScanning(false);
        return;
      }

      // 5. Check-in Flow (OTP if shareable)
      if (member.plan === 'shareable') {
        const code = Math.floor(1000 + Math.random() * 9000).toString();
        const expires = new Date(Date.now() + 10 * 60000).toISOString();
        await supabase.from('profiles').update({ otp_code: code, otp_expires_at: expires }).eq('id', member.id);
        console.log(`[MVP] OTP for ${member.phone || member.email} is ${code}`);
        setOtpStep({ member, cardId });
        setScanning(false);
        return;
      } else {
        await executeCheckIn(member, cardId);
      }
    } catch (err) {
      console.error(err);
      setResult({ type: 'invalid', title: 'Error', desc: err.message });
      setScanning(false);
    }
  };

  const executeCheckIn = async (member, cardId) => {
    try {
      const { data: newVisit } = await supabase.from('visits').insert({
        member_id: member.id,
        hotel_id: hotel.id,
        status: 'open',
      }).select().single();

      await logScan(cardId, member.id, 'check_in', 'valid');
      await supabase.from('hotels').update({ scan_count: (hotel.scan_count || 0) + 1 }).eq('id', hotel.id);

      const todayStart = new Date(); todayStart.setHours(0, 0, 0, 0);
      const isUnlimitedToday = member.unlimited_day_used_at && new Date(member.unlimited_day_used_at) >= todayStart;

      setResult({ type: 'check_in', title: '✓ Checked In', desc: `${member.full_name} has been checked in successfully.`, member, visitId: newVisit?.id, showUnlimitedBtn: !isUnlimitedToday });
      setOtpStep(null);
    } catch (err) {
      toast.error('Failed to complete check-in');
    } finally {
      setScanning(false);
    }
  };

  const verifyOtp = async () => {
    if (!otpCode || otpCode.length < 4) return;
    setScanning(true);
    const { data } = await supabase.from('profiles').select('otp_code, otp_expires_at').eq('id', otpStep.member.id).single();
    if (data?.otp_code === otpCode && new Date(data.otp_expires_at) > new Date()) {
      toast.success('OTP Verified');
      await executeCheckIn(otpStep.member, otpStep.cardId);
    } else {
      toast.error('Invalid or expired OTP');
      setScanning(false);
    }
  };

  const activateUnlimitedDay = async (memberId) => {
    if (!window.confirm("Activate 1-Day Unlimited for this user? This cannot be undone.")) return;
    setActivatingUnlimited(true);
    try {
      await supabase.from('profiles').update({ unlimited_day_used_at: new Date().toISOString() }).eq('id', memberId);
      toast.success('Unlimited Day Activated!');
      setResult(prev => ({ ...prev, showUnlimitedBtn: false, desc: prev.desc + ' (Unlimited Day Active)' }));
    } catch (err) {
      toast.error('Failed to activate unlimited day.');
    } finally {
      setActivatingUnlimited(false);
    }
  };

  const logScan = async (cardId, memberId, scanType, resultType) => {
    await supabase.from('scans').insert({
      card_id: cardId,
      hotel_id: hotel?.id,
      member_id: memberId,
      scan_type: scanType,
      result: resultType,
    });
  };

  const style = result ? (resultStyles[result.type] || resultStyles.invalid) : null;
  const ResultIcon = style?.icon || XCircle;

  return (
    <PageTransition>
      <div className="mb-8">
        <h1 className="font-playfair text-3xl font-bold text-champagne mb-1">QR <span className="text-gold-gradient">Scanner</span></h1>
        <p className="text-smoke">Scan member QR codes to check in / check out.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Scanner */}
        <GlassCard hover={false}>
          {/* Camera Area */}
          <div className="relative aspect-square max-w-sm mx-auto rounded-2xl bg-black-deep border border-gold/10 overflow-hidden flex items-center justify-center mb-6">
            <div id="qr-reader" className="w-full h-full" />
            {!cameraActive && !scanning && (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8">
                <ScanLine size={64} className="text-gold/20 mb-4" />
                <p className="text-smoke text-sm mb-2">Use camera or enter ID manually</p>
              </div>
            )}
            {scanning && (
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <motion.div className="absolute left-4 right-4 h-0.5 bg-gold/60" animate={{ top: ['15%', '85%', '15%'] }} transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }} />
                <ScanLine size={64} className="text-gold/30 mb-4" />
                <p className="text-gold text-sm animate-pulse">Processing...</p>
              </div>
            )}
            {/* Corner guides */}
            <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-gold/40 rounded-tl-lg" />
            <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-gold/40 rounded-tr-lg" />
            <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-gold/40 rounded-bl-lg" />
            <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-gold/40 rounded-br-lg" />
          </div>

          {/* Camera toggle */}
          <div className="flex gap-3 mb-6">
            {!cameraActive ? (
              <Button variant="gold" size="sm" icon={Camera} className="flex-1" onClick={startCamera}>Start Camera</Button>
            ) : (
              <Button variant="danger" size="sm" className="flex-1" onClick={stopCamera}>Stop Camera</Button>
            )}
          </div>

          {/* Manual Entry */}
          <div className="border-t border-white/5 pt-4">
            <p className="text-xs text-gold font-semibold uppercase tracking-wider mb-3">Or enter Card ID manually:</p>
            <div className="flex gap-3">
              <div className="relative flex-1">
                <Hash size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gold-muted" />
                <input
                  type="text"
                  value={manualId}
                  onChange={e => setManualId(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleManualScan()}
                  placeholder="e.g. K002098"
                  className="w-full elite-input rounded-xl pl-9 pr-4 py-2.5 text-sm"
                />
              </div>
              <Button variant="gold" size="sm" onClick={handleManualScan} disabled={scanning || !manualId.trim()}>Verify</Button>
            </div>
          </div>
        </GlassCard>

        {/* Result */}
        <div>
          <AnimatePresence mode="wait">
            {result && !scanning && (
              <motion.div key={result.type + Date.now()} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                <GlassCard hover={false} className={`border ${style.border}`}>
                  <div className="text-center mb-6">
                    <div className={`w-16 h-16 rounded-full ${style.bg} flex items-center justify-center mx-auto mb-3`}>
                      <ResultIcon size={32} className={style.color} />
                    </div>
                    <h3 className={`font-playfair text-xl font-semibold ${style.color}`}>{result.title}</h3>
                    <p className="text-smoke text-sm mt-1">{result.desc}</p>
                  </div>

                  {result.member && (
                    <div className="border-t border-white/5 pt-4 space-y-3 text-sm">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center">
                          <User size={20} className="text-gold" />
                        </div>
                        <div>
                          <p className="text-champagne font-semibold">{result.member.full_name}</p>
                          <p className="text-ash text-xs">{result.member.member_id}</p>
                        </div>
                        <Badge status={result.member.status} className="ml-auto" />
                      </div>
                      <div className="flex justify-between"><span className="text-smoke">Plan</span><span className="text-gold capitalize">{result.member.plan}</span></div>
                      <div className="flex justify-between"><span className="text-smoke">Joined</span><span className="text-champagne">{formatDate(result.member.join_date)}</span></div>
                      <div className="flex justify-between"><span className="text-smoke">Expires</span><span className="text-champagne">{formatDate(result.member.expiry_date)}</span></div>
                    </div>
                  )}

                  {result.showUnlimitedBtn && (
                    <div className="border-t border-white/5 pt-4 mt-4">
                      <Button variant="gold" size="sm" className="w-full" onClick={() => activateUnlimitedDay(result.member.id)} disabled={activatingUnlimited}>
                        {activatingUnlimited ? 'Activating...' : 'Activate 1-Day Unlimited'}
                      </Button>
                      <p className="text-[10px] text-smoke mt-2">Bypasses all limits for today. Only usable once per membership.</p>
                    </div>
                  )}
                </GlassCard>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence mode="wait">
            {otpStep && !scanning && !result && (
              <motion.div key="otp" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                <GlassCard hover={false} className="border border-gold/20">
                  <div className="text-center mb-6">
                    <Lock size={32} className="text-gold mx-auto mb-3" />
                    <h3 className="font-playfair text-xl font-semibold text-champagne">OTP Verification</h3>
                    <p className="text-smoke text-sm mt-1">Shareable plan requires OTP to check in.</p>
                  </div>
                  <div className="space-y-4">
                    <div className="text-center text-xs text-champagne-dark p-3 bg-white/5 rounded-lg border border-white/10">
                      OTP sent to: {otpStep.member.phone || otpStep.member.email || 'Registered Contact'}
                      <div className="mt-1 text-[10px] text-gold">(MVP Check: View console or admin panel for OTP code)</div>
                    </div>
                    <input
                      type="text"
                      maxLength={4}
                      value={otpCode}
                      onChange={e => setOtpCode(e.target.value.replace(/\D/g, ''))}
                      className="w-full elite-input rounded-xl px-4 py-3 text-center text-xl tracking-widest font-mono"
                      placeholder="• • • •"
                    />
                    <div className="flex gap-2">
                      <Button variant="ghost" className="flex-1" onClick={() => setOtpStep(null)}>Cancel</Button>
                      <Button variant="gold" className="flex-1" onClick={verifyOtp} disabled={otpCode.length !== 4}>Verify</Button>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            )}
          </AnimatePresence>

          {!result && !scanning && !otpStep && (
            <GlassCard hover={false} className="flex flex-col items-center justify-center py-16 text-center">
              <Shield size={48} className="text-gold/20 mb-4" />
              <h3 className="text-champagne font-semibold mb-2">Ready to Scan</h3>
              <p className="text-smoke text-sm">Use the camera or enter a Card ID to verify membership.</p>
              <p className="text-ash text-xs mt-4">Scan 1 = Check In • Scan 2 = Check Out</p>
            </GlassCard>
          )}
        </div>
      </div>
    </PageTransition>
  );
}

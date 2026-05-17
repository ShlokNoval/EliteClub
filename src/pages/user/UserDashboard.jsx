import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Crown, CreditCard, MapPin, Calendar, IndianRupee, Star, ArrowLeft, LogOut, User, Wine, TrendingUp } from 'lucide-react';
import PageTransition from '../../components/layout/PageTransition';
import GlassCard from '../../components/common/GlassCard';
import MembershipCard from '../../components/user/MembershipCard';
import Badge from '../../components/common/Badge';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { formatCurrency, formatDate } from '../../utils/helpers';
import { membershipPlans, partnerVenues } from '../../data/mockData';
import logo from '../../assets/logo.png';

export default function UserDashboard() {
  const { profile, logout } = useAuth();
  const [showCard, setShowCard] = useState(true);
  const [stats, setStats] = useState({ visits: 0, totalSaved: 0, totalSpent: 0, nipsToday: 0, beersToday: 0 });
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);

  const plan = membershipPlans.find(p => p.id === profile?.plan);
  
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const isDateExpired = profile?.expiry_date && new Date(profile.expiry_date) < todayStart;
  const isActive = profile?.status === 'active' && !isDateExpired;

  useEffect(() => {
    if (profile?.id) fetchStats();
  }, [profile]);

  const fetchStats = async () => {
    try {
      // Auto-expire in database if date has passed
      if (profile.status === 'active' && isDateExpired) {
         await supabase.from('profiles').update({ status: 'expired' }).eq('id', profile.id);
      }

      const [visitsRes, billsRes, hotelsRes] = await Promise.all([
        supabase.from('visits').select('id').eq('member_id', profile.id),
        supabase.from('bills').select('food_bev_cost, liquor_cost_billed, savings, nips_consumed, beers_consumed, created_at').eq('member_id', profile.id),
        supabase.from('hotels').select('id, name, nip_limit, beer_limit').eq('status', 'verified').order('name'),
      ]);
      const visits = visitsRes.data || [];
      const bills = billsRes.data || [];
      const hotels = hotelsRes.data || [];

      const todaysBills = bills.filter(b => new Date(b.created_at) >= todayStart);
      const nipsToday = todaysBills.reduce((s, b) => s + (b.nips_consumed || 0), 0);
      const beersToday = todaysBills.reduce((s, b) => s + (b.beers_consumed || 0), 0);

      const isUnlimitedToday = profile.unlimited_day_used_at && new Date(profile.unlimited_day_used_at) >= todayStart;

      // Dynamically filter venues based on consumed quota
      if (isUnlimitedToday) {
        setVenues(hotels);
      } else {
        const availableVenues = hotels.filter(v => {
          // 1 nip = 2 beers. So 1 beer = 0.5 nips.
          // Calculate total consumption in "equivalent nips"
          const equivalentNipsConsumed = nipsToday + (beersToday / 2);
          
          // Venue is available if the consumed equivalent is less than the limit
          return equivalentNipsConsumed < (v.nip_limit || 4);
        });
        setVenues(availableVenues);
      }

      setStats({
        visits: visits.length,
        totalSpent: bills.reduce((s, b) => s + Number(b.liquor_cost_billed || 0), 0),
        totalSaved: bills.reduce((s, b) => s + Number(b.savings || 0), 0),
        nipsToday,
        beersToday
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!profile) return null;

  return (
    <div className="min-h-screen bg-black-primary">
      {/* Top Bar */}
      <div className="glass border-b border-gold/10 px-4 sm:px-6 lg:px-8 py-4 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/" className="text-smoke hover:text-gold transition-colors">
              <ArrowLeft size={20} />
            </Link>
            <img src={logo} alt="EliteClub" className="h-8 w-auto" />
            <span className="text-champagne font-playfair font-semibold hidden sm:block">Member Dashboard</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-champagne text-sm font-medium">{profile.full_name}</p>
              <p className="text-ash text-xs">{profile.member_id}</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center">
              <User size={18} className="text-gold" />
            </div>
            <button onClick={logout} className="p-2 text-smoke hover:text-red-400 transition-colors cursor-pointer">
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </div>

      <PageTransition>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Welcome */}
          <motion.div className="mb-8" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="font-playfair text-3xl font-bold text-champagne mb-1">
              Welcome back, <span className="text-gold-gradient">{profile.full_name?.split(' ')[0]}</span>
            </h1>
            <p className="text-smoke">Manage your membership and access your privileges.</p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-8">
              {/* Membership Card */}
              <MembershipCard user={profile} isActive={isActive} showCard={showCard} onToggle={() => setShowCard(!showCard)} />

              {/* Quick Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  { icon: CreditCard, label: 'Plan', value: plan?.name || '—', color: 'text-gold' },
                  { icon: Calendar, label: 'Expires', value: formatDate(profile.expiry_date), color: 'text-champagne' },
                  { icon: MapPin, label: 'Visits', value: loading ? '...' : stats.visits, color: 'text-green-400' },
                  { icon: IndianRupee, label: 'Saved', value: loading ? '...' : formatCurrency(stats.totalSaved), color: 'text-gold-light' },
                ].map((stat, i) => (
                  <GlassCard key={i} delay={i * 0.1} className="text-center p-4">
                    <stat.icon size={20} className={`${stat.color} mx-auto mb-2`} />
                    <p className={`font-semibold text-lg ${stat.color}`}>{stat.value}</p>
                    <p className="text-smoke text-xs mt-1">{stat.label}</p>
                  </GlassCard>
                ))}
              </div>

              {/* Plan Benefits */}
              {plan && (
                <GlassCard hover={false}>
                  <h3 className="font-playfair text-lg font-semibold text-champagne mb-4 flex items-center gap-2">
                    <Wine size={20} className="text-gold" /> Plan Benefits
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {plan.features.map((feature, i) => (
                      <div key={i} className="flex items-start gap-3 text-sm">
                        <Star size={14} className="text-gold shrink-0 mt-0.5" />
                        <span className="text-champagne-dark">{feature}</span>
                      </div>
                    ))}
                  </div>
                </GlassCard>
              )}

              {/* Savings Breakdown */}
              {stats.totalSaved > 0 && (
                <GlassCard hover={false}>
                  <h3 className="font-playfair text-lg font-semibold text-champagne mb-4 flex items-center gap-2">
                    <TrendingUp size={20} className="text-green-400" /> Your Savings
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 rounded-xl bg-green-400/5 border border-green-400/10">
                      <p className="text-3xl font-bold text-green-400">{formatCurrency(stats.totalSaved)}</p>
                      <p className="text-smoke text-xs mt-1">Total Liquor Savings</p>
                    </div>
                    <div className="text-center p-4 rounded-xl bg-gold/5 border border-gold/10">
                      <p className="text-3xl font-bold text-gold">{formatCurrency(stats.totalSpent)}</p>
                      <p className="text-smoke text-xs mt-1">Total Spent</p>
                    </div>
                  </div>
                </GlassCard>
              )}

              {/* Today's Consumption */}
              <GlassCard hover={false}>
                <h3 className="font-playfair text-lg font-semibold text-champagne mb-4 flex items-center gap-2">
                  <Wine size={20} className="text-gold" /> Today's Consumption
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 rounded-xl bg-champagne/5 border border-champagne/10">
                    <p className="text-3xl font-bold text-champagne">{stats.nipsToday}</p>
                    <p className="text-smoke text-xs mt-1">Nips Consumed</p>
                  </div>
                  <div className="text-center p-4 rounded-xl bg-gold/5 border border-gold/10">
                    <p className="text-3xl font-bold text-gold">{stats.beersToday}</p>
                    <p className="text-smoke text-xs mt-1">Beers Consumed</p>
                  </div>
                </div>
              </GlassCard>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Profile */}
              <GlassCard hover={false}>
                <div className="text-center mb-4">
                  <div className="w-16 h-16 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center mx-auto mb-3">
                    <Crown size={28} className="text-gold" />
                  </div>
                  <h3 className="font-playfair text-lg font-semibold text-champagne">{profile.full_name}</h3>
                  <p className="text-smoke text-sm">{profile.email}</p>
                  <div className="mt-3"><Badge status={profile.status} /></div>
                </div>
                <div className="border-t border-gold/10 pt-4 space-y-3 text-sm">
                  <div className="flex justify-between"><span className="text-smoke">Member ID</span><span className="text-champagne font-mono">{profile.member_id}</span></div>
                  <div className="flex justify-between"><span className="text-smoke">Phone</span><span className="text-champagne">{profile.phone || '—'}</span></div>
                  <div className="flex justify-between"><span className="text-smoke">Plan</span><span className="text-gold font-medium">{plan?.name || '—'}</span></div>
                  <div className="flex justify-between"><span className="text-smoke">Member Since</span><span className="text-champagne">{formatDate(profile.join_date)}</span></div>
                  <div className="flex flex-col gap-1 border-t border-white/5 pt-3 mt-3">
                    <div className="flex justify-between items-start">
                      <span className="text-smoke flex items-center gap-1 mt-0.5"><Wine size={12}/> 1-Day Unlimited</span>
                      {(() => {
                        let statusText = "Available Today";
                        let isAvailable = true;
                        let nextDate = null;
                        
                        if (profile.unlimited_day_used_at) {
                          const usedDate = new Date(profile.unlimited_day_used_at);
                          const todayStart = new Date(); todayStart.setHours(0,0,0,0);
                          
                          if (usedDate >= todayStart) {
                            statusText = "Active Today";
                          } else {
                            nextDate = new Date(usedDate);
                            nextDate.setMonth(nextDate.getMonth() + 1);
                            
                            if (new Date() < nextDate) {
                              isAvailable = false;
                              statusText = "Used on " + formatDate(profile.unlimited_day_used_at);
                            }
                          }
                        }
                        
                        return (
                          <div className="text-right">
                             <span className={isAvailable ? "text-green-400 font-medium" : "text-ash"}>
                               {statusText}
                             </span>
                             {!isAvailable && nextDate && (
                               <div className="text-[10px] text-smoke mt-1">Next available: {formatDate(nextDate)}</div>
                             )}
                          </div>
                        );
                      })()}
                    </div>
                  </div>
                </div>
              </GlassCard>

              {/* Partner Venues */}
              <GlassCard hover={false}>
                <h3 className="text-sm font-semibold text-gold mb-3">Available Venues ({venues.length})</h3>
                <div className="space-y-3 max-h-48 overflow-y-auto">
                  {venues.map((v) => (
                    <div key={v.id} className="flex flex-col gap-1 py-2 border-b border-white/5 last:border-0">
                      <div className="flex items-center gap-2 text-sm">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
                        <span className="text-champagne-dark">{v.name}</span>
                      </div>
                      <div className="text-xs text-smoke pl-3.5">
                        Limits: <span className="text-gold">{v.nip_limit} Nips</span> or <span className="text-gold">{v.beer_limit} Beers</span>
                      </div>
                    </div>
                  ))}
                  {venues.length === 0 && !loading && <p className="text-smoke text-xs">No verified venues yet.</p>}
                </div>
              </GlassCard>
            </div>
          </div>
        </div>
      </PageTransition>
    </div>
  );
}

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import {
  Crown, CreditCard, MapPin, Calendar, IndianRupee, Star,
  ArrowLeft, LogOut, User, Wine, TrendingUp
} from 'lucide-react';
import PageTransition from '../../components/layout/PageTransition';
import GlassCard from '../../components/common/GlassCard';
import MembershipCard from '../../components/user/MembershipCard';
import Badge from '../../components/common/Badge';
import { currentUser, membershipPlans, partnerVenues } from '../../data/mockData';
import { formatCurrency, formatDate } from '../../utils/helpers';
import logo from '../../assets/logo.png';

export default function UserDashboard() {
  const [showCard, setShowCard] = useState(true);
  const [memberStatus] = useState('active'); // Toggle to 'inactive' to see inactive state
  const navigate = useNavigate();
  const user = currentUser;
  const plan = membershipPlans.find(p => p.id === user.plan);
  const isActive = memberStatus === 'active';

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
              <p className="text-champagne text-sm font-medium">{user.name}</p>
              <p className="text-ash text-xs">{user.memberId}</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center">
              <User size={18} className="text-gold" />
            </div>
            <button
              onClick={() => navigate('/')}
              className="p-2 text-smoke hover:text-red-400 transition-colors cursor-pointer"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </div>

      <PageTransition>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Welcome */}
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="font-playfair text-3xl font-bold text-champagne mb-1">
              Welcome back, <span className="text-gold-gradient">{user.name.split(' ')[0]}</span>
            </h1>
            <p className="text-smoke">Manage your membership and access your privileges.</p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Card + Profile */}
            <div className="lg:col-span-2 space-y-8">
              {/* Membership Card */}
              <MembershipCard
                user={user}
                isActive={isActive}
                showCard={showCard}
                onToggle={() => setShowCard(!showCard)}
              />

              {/* Quick Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  { icon: CreditCard, label: 'Plan', value: plan?.name || '—', color: 'text-gold' },
                  { icon: Calendar, label: 'Expires', value: formatDate(user.expiryDate), color: 'text-champagne' },
                  { icon: MapPin, label: 'Visits', value: user.visitsCount, color: 'text-green-400' },
                  { icon: IndianRupee, label: 'Total Spent', value: formatCurrency(user.totalSpent), color: 'text-gold-light' },
                ].map((stat, i) => (
                  <GlassCard key={i} delay={i * 0.1} className="text-center p-4">
                    <stat.icon size={20} className={`${stat.color} mx-auto mb-2`} />
                    <p className={`font-semibold text-lg ${stat.color}`}>{stat.value}</p>
                    <p className="text-smoke text-xs mt-1">{stat.label}</p>
                  </GlassCard>
                ))}
              </div>

              {/* Plan Details */}
              {plan && (
                <GlassCard hover={false}>
                  <h3 className="font-playfair text-lg font-semibold text-champagne mb-4 flex items-center gap-2">
                    <Wine size={20} className="text-gold" />
                    Plan Benefits
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
            </div>

            {/* Right Column - Profile Summary */}
            <div className="space-y-6">
              {/* Status */}
              <GlassCard hover={false}>
                <div className="text-center mb-4">
                  <div className="w-16 h-16 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center mx-auto mb-3">
                    <Crown size={28} className="text-gold" />
                  </div>
                  <h3 className="font-playfair text-lg font-semibold text-champagne">{user.name}</h3>
                  <p className="text-smoke text-sm">{user.email}</p>
                  <div className="mt-3">
                    <Badge status={isActive ? 'active' : 'inactive'} />
                  </div>
                </div>

                <div className="border-t border-gold/10 pt-4 space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-smoke">Member ID</span>
                    <span className="text-champagne font-mono">{user.memberId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-smoke">Phone</span>
                    <span className="text-champagne">{user.phone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-smoke">Plan</span>
                    <span className="text-gold font-medium">{plan?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-smoke">Member Since</span>
                    <span className="text-champagne">{formatDate(user.joinDate)}</span>
                  </div>
                </div>
              </GlassCard>

              {/* Favourite Venue */}
              <GlassCard hover={false}>
                <h3 className="text-sm font-semibold text-gold mb-3 flex items-center gap-2">
                  <TrendingUp size={16} />
                  Most Visited
                </h3>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gold/8 border border-gold/15 flex items-center justify-center">
                    <MapPin size={18} className="text-gold" />
                  </div>
                  <div>
                    <p className="text-champagne text-sm font-medium">{user.favouriteVenue}</p>
                    <p className="text-smoke text-xs">Your favourite venue</p>
                  </div>
                </div>
              </GlassCard>

              {/* Partner Venues Quick List */}
              <GlassCard hover={false}>
                <h3 className="text-sm font-semibold text-gold mb-3">
                  Available Venues ({partnerVenues.length})
                </h3>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {partnerVenues.slice(0, 6).map((v) => (
                    <div key={v.id} className="flex items-center gap-2 text-xs py-1.5 border-b border-white/3 last:border-0">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
                      <span className="text-champagne-dark">{v.name}</span>
                    </div>
                  ))}
                  {partnerVenues.length > 6 && (
                    <p className="text-gold text-xs pt-1">+{partnerVenues.length - 6} more venues</p>
                  )}
                </div>
              </GlassCard>
            </div>
          </div>
        </div>
      </PageTransition>
    </div>
  );
}

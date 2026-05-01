import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Users, Building2, CreditCard, Menu, X, Crown, LogOut,
  ScanLine, ClipboardList, ChevronLeft
} from 'lucide-react';
import { useState } from 'react';
import logo from '../../assets/logo.png';

const adminLinks = [
  { to: '/admin', icon: LayoutDashboard, label: 'Overview', end: true },
  { to: '/admin/users', icon: Users, label: 'Users' },
  { to: '/admin/hotels', icon: Building2, label: 'Hotels' },
  { to: '/admin/cards', icon: CreditCard, label: 'Card Generator' },
];

const hotelLinks = [
  { to: '/hotel', icon: LayoutDashboard, label: 'Overview', end: true },
  { to: '/hotel/scanner', icon: ScanLine, label: 'QR Scanner' },
  { to: '/hotel/scans', icon: ClipboardList, label: 'Recent Scans' },
];

export default function Sidebar({ type = 'admin' }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const links = type === 'admin' ? adminLinks : hotelLinks;
  const title = type === 'admin' ? 'Admin Panel' : 'Hotel Portal';

  const SidebarContent = ({ mobile = false }) => (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className={`p-4 border-b border-gold/10 flex items-center ${collapsed && !mobile ? 'justify-center' : 'gap-3'}`}>
        <img src={logo} alt="EliteClub" className="h-10 w-auto" />
        {(!collapsed || mobile) && (
          <div>
            <p className="text-gold font-playfair font-bold text-sm">{title}</p>
            <p className="text-ash text-xs">The Elite Club</p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.end}
            onClick={() => setMobileOpen(false)}
            className={({ isActive }) =>
              `sidebar-link flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? 'active bg-gold/8 text-gold border-l-gold'
                  : 'text-smoke hover:text-champagne'
              } ${collapsed && !mobile ? 'justify-center px-3' : ''}`
            }
          >
            <link.icon size={20} />
            {(!collapsed || mobile) && <span>{link.label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Bottom */}
      <div className="p-3 border-t border-gold/10">
        {!mobile && (
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm text-smoke hover:text-champagne hover:bg-white/3 transition-all"
          >
            <ChevronLeft size={18} className={`transition-transform ${collapsed ? 'rotate-180' : ''}`} />
            {!collapsed && <span>Collapse</span>}
          </button>
        )}
        <NavLink
          to="/"
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-smoke hover:text-red-400 transition-all mt-1"
        >
          <LogOut size={18} />
          {(!collapsed || mobile) && <span>Exit</span>}
        </NavLink>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <motion.aside
        className={`hidden lg:flex flex-col fixed left-0 top-0 bottom-0 bg-black-deep/95 backdrop-blur-xl border-r border-gold/10 z-40 transition-all duration-300 ${
          collapsed ? 'w-20' : 'w-64'
        }`}
        initial={{ x: -280 }}
        animate={{ x: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        <SidebarContent />
      </motion.aside>

      {/* Mobile Toggle */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 p-3 glass rounded-xl text-gold"
      >
        <Menu size={20} />
      </button>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="fixed inset-0 z-50 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="absolute inset-0 bg-black/80" onClick={() => setMobileOpen(false)} />
            <motion.aside
              className="absolute left-0 top-0 bottom-0 w-72 bg-black-deep/98 backdrop-blur-xl border-r border-gold/10"
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            >
              <button
                onClick={() => setMobileOpen(false)}
                className="absolute top-4 right-4 p-2 text-smoke hover:text-champagne"
              >
                <X size={20} />
              </button>
              <SidebarContent mobile />
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

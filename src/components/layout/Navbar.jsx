import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Crown } from 'lucide-react';
import logo from '../../assets/logo.png';
import Button from '../common/Button';

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'Membership', href: '/#membership' },
  { label: 'Benefits', href: '/#benefits' },
  { label: 'Venues', href: '/#venues' },
  { label: 'Contact', href: '/#contact' },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileOpen(false);
  }, [location]);

  const handleNavClick = (href) => {
    setIsMobileOpen(false);
    if (href.startsWith('/#')) {
      const id = href.replace('/#', '');
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
        return;
      }
    }
  };

  return (
    <>
      <motion.nav
        className={`fixed top-4 left-4 right-4 md:left-12 md:right-12 z-50 transition-all duration-500 rounded-full ${
          isScrolled
            ? 'bg-black-deep/80 backdrop-blur-2xl border border-gold/20 shadow-[0_10px_40px_rgba(0,0,0,0.8)] py-2'
            : 'bg-transparent border border-transparent py-4'
        }`}
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
      >
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group mix-blend-screen">
              <img src={logo} alt="The Elite Club" className="h-14 w-auto object-contain brightness-125" />
            </Link>

            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center gap-10">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={(e) => {
                    if (link.href.startsWith('/#')) {
                      e.preventDefault();
                      handleNavClick(link.href);
                    }
                  }}
                  className="text-champagne-dark hover:text-gold text-xs uppercase tracking-[0.2em] font-semibold transition-colors duration-300 relative group"
                >
                  {link.label}
                  <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-[2px] bg-gold transition-all duration-300 group-hover:w-full" />
                </a>
              ))}
            </div>

            {/* CTA */}
            <div className="hidden lg:flex items-center">
              <Link to="/login">
                <button className="relative group overflow-hidden rounded-full border border-gold/30 bg-black-deep/50 px-6 py-2.5 transition-all duration-300 hover:border-gold/80 hover:shadow-[0_0_20px_rgba(201,169,78,0.2)]">
                  <div className="absolute inset-0 w-0 bg-gold/10 transition-all duration-300 ease-out group-hover:w-full" />
                  <span className="relative flex items-center gap-2 text-gold text-xs font-semibold uppercase tracking-widest">
                    <Crown size={14} /> Member Login
                  </span>
                </button>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileOpen(!isMobileOpen)}
              className="lg:hidden p-2 text-champagne hover:text-gold transition-colors"
            >
              {isMobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            className="fixed inset-0 z-40 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsMobileOpen(false)} />
            <motion.div
              className="absolute right-0 top-0 bottom-0 w-80 max-w-[85vw] bg-black-deep/95 backdrop-blur-xl border-l border-gold/10 p-8 pt-24"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            >
              <div className="flex flex-col gap-6">
                {navLinks.map((link, i) => (
                  <motion.a
                    key={link.label}
                    href={link.href}
                    onClick={(e) => {
                      if (link.href.startsWith('/#')) {
                        e.preventDefault();
                        handleNavClick(link.href);
                      }
                    }}
                    className="text-champagne-dark hover:text-gold text-lg font-medium tracking-wide transition-colors"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + i * 0.05 }}
                  >
                    {link.label}
                  </motion.a>
                ))}
                <div className="border-t border-gold/10 pt-6 mt-2">
                  <Link to="/login" onClick={() => setIsMobileOpen(false)}>
                    <Button variant="gold" size="md" icon={Crown} className="w-full">
                      Member Login
                    </Button>
                  </Link>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

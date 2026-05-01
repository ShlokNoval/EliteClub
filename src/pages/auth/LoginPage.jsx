import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Crown, Mail, Lock, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import logo from '../../assets/logo.png';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigate('/dashboard');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-black-deep flex items-center justify-center relative overflow-hidden px-4">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(107,29,42,0.15)_0%,_transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_rgba(201,169,78,0.08)_0%,_transparent_50%)]" />

      {/* Back */}
      <Link
        to="/"
        className="absolute top-6 left-6 flex items-center gap-2 text-smoke hover:text-gold transition-colors z-10"
      >
        <ArrowLeft size={18} />
        <span className="text-sm">Back to Home</span>
      </Link>

      <motion.div
        className="relative w-full max-w-md"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <img src={logo} alt="The Elite Club" className="h-20 w-auto mx-auto mb-4" />
          <h1 className="font-playfair text-2xl font-bold text-champagne">
            Member Access
          </h1>
          <p className="text-smoke text-sm mt-2">
            Sign in to your exclusive membership portal
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="glass-strong rounded-2xl p-8 space-y-5">
          <Input
            label="Email or Member ID"
            type="text"
            placeholder="Enter your email or member ID"
            icon={Mail}
            required
          />

          <div className="space-y-2">
            <label className="block text-sm font-medium text-champagne-dark tracking-wide">
              Password <span className="text-burgundy-light ml-1">*</span>
            </label>
            <div className="relative">
              <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gold-muted" />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                required
                className="w-full elite-input rounded-xl px-4 py-3 text-sm pl-11 pr-11"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-smoke hover:text-champagne transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 text-smoke cursor-pointer">
              <input type="checkbox" className="rounded border-gold/30 bg-transparent accent-gold" />
              Remember me
            </label>
            <a href="#" className="text-gold hover:text-gold-light transition-colors">
              Forgot password?
            </a>
          </div>

          <Button
            type="submit"
            variant="gold"
            size="lg"
            icon={Crown}
            className="w-full"
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </Button>

          <div className="text-center pt-2">
            <p className="text-smoke text-sm">
              Not a member?{' '}
              <Link to="/#membership" className="text-gold hover:text-gold-light transition-colors font-medium">
                View Plans
              </Link>
            </p>
          </div>
        </form>

        {/* Quick Access Links */}
        <div className="mt-6 text-center space-y-2">
          <p className="text-ash text-xs">Quick demo access:</p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => navigate('/admin')}
              className="text-xs text-smoke hover:text-gold transition-colors underline underline-offset-4 cursor-pointer"
            >
              Admin Panel
            </button>
            <span className="text-ash">•</span>
            <button
              onClick={() => navigate('/hotel')}
              className="text-xs text-smoke hover:text-gold transition-colors underline underline-offset-4 cursor-pointer"
            >
              Hotel Portal
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

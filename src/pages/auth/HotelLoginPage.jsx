import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Building2, Mail, Lock, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../components/common/Toast';
import logo from '../../assets/logo.png';
import Button from '../../components/common/Button';

export default function HotelLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { loginHotel } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await loginHotel(email.trim(), password);
      toast.success('Welcome to Hotel Portal');
      navigate('/hotel');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black-deep flex items-center justify-center relative overflow-hidden px-4">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(201,169,78,0.1)_0%,_transparent_50%)]" />

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
        <div className="text-center mb-8">
          <img src={logo} alt="The Elite Club" className="h-20 w-auto mx-auto mb-4" />
          <h1 className="font-playfair text-2xl font-bold text-champagne">
            Hotel Portal
          </h1>
          <p className="text-smoke text-sm mt-2">
            Access your venue's verification dashboard
          </p>
        </div>

        <form onSubmit={handleSubmit} className="glass-strong rounded-2xl p-8 space-y-5">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-champagne-dark tracking-wide">
              Hotel Email <span className="text-burgundy-light ml-1">*</span>
            </label>
            <div className="relative">
              <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gold-muted" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your hotel email"
                required
                className="w-full elite-input rounded-xl px-4 py-3 text-sm pl-11"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-champagne-dark tracking-wide">
              Password <span className="text-burgundy-light ml-1">*</span>
            </label>
            <div className="relative">
              <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gold-muted" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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

          <Button
            type="submit"
            variant="gold"
            size="lg"
            icon={Building2}
            className="w-full"
            disabled={loading}
          >
            {loading ? 'Verifying...' : 'Access Portal'}
          </Button>

          <div className="text-center pt-2">
            <p className="text-smoke text-sm">
              Don't have access?{' '}
              <Link to="/hotel-register" className="text-gold hover:text-gold-light transition-colors font-medium">
                Request Hotel Access
              </Link>
            </p>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

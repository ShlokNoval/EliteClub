import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Building2, Mail, Lock, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import logo from '../../assets/logo.png';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';

export default function HotelLoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigate('/hotel');
    }, 1500);
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
          <Input
            label="Hotel ID or Email"
            type="text"
            placeholder="Enter your hotel ID or email"
            icon={Building2}
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
        </form>
      </motion.div>
    </div>
  );
}

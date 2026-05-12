import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, Mail, Lock, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../components/common/Toast';
import logo from '../../assets/logo.png';
import Button from '../../components/common/Button';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { loginAdmin } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('1. Form submitted, setting loading to true');
    setLoading(true);
    try {
      console.log('2. Calling loginAdmin with:', email);
      const result = await loginAdmin(email.trim(), password);
      console.log('3. loginAdmin succeeded:', result);
      toast.success('Welcome, Admin.');
      console.log('4. Navigating to /admin');
      navigate('/admin');
    } catch (err) {
      console.log('5. Catch block hit:', err);
      if (toast && toast.error) {
        toast.error(err.message || 'Login failed');
      } else {
        alert('Login failed: ' + (err.message || 'Unknown error'));
      }
    } finally {
      console.log('6. Finally block hit, setting loading to false');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black-deep flex items-center justify-center relative overflow-hidden px-4">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(107,29,42,0.2)_0%,_transparent_50%)]" />

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
            Admin Access
          </h1>
          <p className="text-smoke text-sm mt-2">
            Restricted access — authorized personnel only
          </p>
        </div>

        <form onSubmit={handleSubmit} className="glass-strong rounded-2xl p-8 space-y-5">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-champagne-dark tracking-wide">
              Email <span className="text-burgundy-light ml-1">*</span>
            </label>
            <div className="relative">
              <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gold-muted" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@theeliteclub.in"
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
                placeholder="Enter admin password"
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
            variant="burgundy"
            size="lg"
            icon={Shield}
            className="w-full"
            disabled={loading}
          >
            {loading ? 'Verifying...' : 'Access Admin Panel'}
          </Button>
        </form>
      </motion.div>
    </div>
  );
}

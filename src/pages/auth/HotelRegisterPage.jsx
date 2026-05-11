import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Building2, User, Phone, Mail, MapPin, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useToast } from '../../components/common/Toast';
import logo from '../../assets/logo.png';
import Button from '../../components/common/Button';

export default function HotelRegisterPage() {
  const [form, setForm] = useState({ name: '', contact_person: '', phone: '', email: '', location: '' });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const toast = useToast();

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.from('hotels').insert({
        name: form.name.trim(),
        contact_person: form.contact_person.trim(),
        phone: form.phone.trim(),
        email: form.email.trim().toLowerCase(),
        location: form.location.trim(),
        status: 'pending',
      });
      if (error) throw error;
      setSubmitted(true);
      toast.success('Registration request submitted!');
    } catch (err) {
      toast.error(err.message || 'Failed to submit request.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-black-deep flex items-center justify-center px-4">
        <motion.div
          className="text-center max-w-md"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="w-20 h-20 rounded-full bg-green-400/10 border border-green-400/20 flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 size={40} className="text-green-400" />
          </div>
          <h1 className="font-playfair text-2xl font-bold text-champagne mb-3">
            Request Submitted!
          </h1>
          <p className="text-smoke mb-6">
            Your hotel access request has been submitted for review. The Elite Club admin will review and approve your access. 
            Once approved, you'll receive your login credentials.
          </p>
          <Link to="/hotel-login">
            <Button variant="gold">Back to Hotel Login</Button>
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black-deep flex items-center justify-center relative overflow-hidden px-4 py-8">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(201,169,78,0.08)_0%,_transparent_50%)]" />

      <Link
        to="/hotel-login"
        className="absolute top-6 left-6 flex items-center gap-2 text-smoke hover:text-gold transition-colors z-10"
      >
        <ArrowLeft size={18} />
        <span className="text-sm">Back to Login</span>
      </Link>

      <motion.div
        className="relative w-full max-w-lg"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="text-center mb-8">
          <img src={logo} alt="The Elite Club" className="h-16 w-auto mx-auto mb-4" />
          <h1 className="font-playfair text-2xl font-bold text-champagne">
            Request Hotel Access
          </h1>
          <p className="text-smoke text-sm mt-2">
            Submit your venue details for admin review and approval
          </p>
        </div>

        <form onSubmit={handleSubmit} className="glass-strong rounded-2xl p-8 space-y-5">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-champagne-dark">Hotel / Venue Name *</label>
            <div className="relative">
              <Building2 size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gold-muted" />
              <input name="name" value={form.name} onChange={handleChange} required placeholder="e.g. Sky Lounge Bar & Restaurant" className="w-full elite-input rounded-xl px-4 py-3 text-sm pl-11" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-champagne-dark">Contact Person *</label>
            <div className="relative">
              <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gold-muted" />
              <input name="contact_person" value={form.contact_person} onChange={handleChange} required placeholder="Full name of contact person" className="w-full elite-input rounded-xl px-4 py-3 text-sm pl-11" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-champagne-dark">Phone *</label>
              <div className="relative">
                <Phone size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gold-muted" />
                <input name="phone" value={form.phone} onChange={handleChange} required placeholder="+91 98765 43210" className="w-full elite-input rounded-xl px-4 py-3 text-sm pl-11" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-champagne-dark">Email *</label>
              <div className="relative">
                <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gold-muted" />
                <input name="email" type="email" value={form.email} onChange={handleChange} required placeholder="hotel@example.com" className="w-full elite-input rounded-xl px-4 py-3 text-sm pl-11" />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-champagne-dark">Location</label>
            <div className="relative">
              <MapPin size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gold-muted" />
              <input name="location" value={form.location} onChange={handleChange} placeholder="Area, City" className="w-full elite-input rounded-xl px-4 py-3 text-sm pl-11" />
            </div>
          </div>

          <Button type="submit" variant="gold" size="lg" icon={Building2} className="w-full" disabled={loading}>
            {loading ? 'Submitting...' : 'Submit Request'}
          </Button>
        </form>
      </motion.div>
    </div>
  );
}

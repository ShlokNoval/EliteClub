import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Phone, Mail, MapPin, CheckCircle2 } from 'lucide-react';
import SectionHeading from '../common/SectionHeading';
import Input from '../common/Input';
import Button from '../common/Button';
import { brandInfo } from '../../data/mockData';
import { supabase } from '../../lib/supabase';

export default function ContactForm() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;

    setSending(true);
    setError('');

    try {
      // 1. Store in Supabase database (as backup)
      const { error: dbError } = await supabase.from('contact_messages').insert({
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        message: form.message.trim(),
      });

      if (dbError) throw dbError;

      // 2. Send Real Email via Web3Forms
      // This sends the message directly to parthpawareliteclub@gmail.com
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          access_key: import.meta.env.VITE_WEB3FORMS_KEY || 'YOUR_ACCESS_KEY_HERE',
          name: form.name,
          email: form.email,
          phone: form.phone,
          message: form.message,
          from_name: 'EliteClub Website Inquiry',
          subject: `New Message from ${form.name}`,
        })
      });

      const result = await response.json();

      if (result.success || !dbError) {
        setSubmitted(true);
        setForm({ name: '', email: '', phone: '', message: '' });
        setTimeout(() => setSubmitted(false), 5000);
      } else {
        throw new Error('Email delivery failed');
      }
    } catch (err) {
      console.error('Contact form error:', err);
      setError('Something went wrong. Please try emailing us directly at parthpawareliteclub@gmail.com');
    } finally {
      setSending(false);
    }
  };

  return (
    <section id="contact" className="py-24 md:py-32 relative">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(201,169,78,0.05)_0%,_transparent_50%)]" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Get in Touch"
          title="Contact Us"
          subtitle="Have questions about membership? We'd love to hear from you."
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
          {/* Contact Info */}
          <motion.div
            className="space-y-8"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <div>
              <h3 className="font-playfair text-2xl font-semibold text-champagne mb-6">
                Reach Out Directly
              </h3>
              <p className="text-smoke text-sm leading-relaxed mb-8">
                Our team is available to assist you with membership inquiries, partnership opportunities, or any questions you may have.
              </p>
            </div>

            <div className="space-y-6">
              {[
                { icon: Phone, label: 'Call Us', value: brandInfo.phone, href: `tel:${brandInfo.phone?.replace(/\s/g, '')}` },
                { icon: Mail, label: 'Email Us', value: 'parthpawareliteclub@gmail.com', href: 'mailto:parthpawareliteclub@gmail.com' },
                { icon: MapPin, label: 'Location', value: brandInfo.location },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gold/8 border border-gold/15 flex items-center justify-center shrink-0">
                    <item.icon size={20} className="text-gold" />
                  </div>
                  <div>
                    <p className="text-champagne-dark text-sm font-medium">{item.label}</p>
                    {item.href ? (
                      <a href={item.href} className="text-smoke text-sm hover:text-gold transition-colors">{item.value}</a>
                    ) : (
                      <p className="text-smoke text-sm">{item.value}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Form */}
          <motion.form
            onSubmit={handleSubmit}
            className="glass-strong rounded-2xl p-8"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            {submitted ? (
              <motion.div
                className="flex flex-col items-center justify-center py-12 text-center"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <div className="w-16 h-16 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center mb-4">
                  <CheckCircle2 size={28} className="text-green-400" />
                </div>
                <h3 className="font-playfair text-xl font-semibold text-champagne mb-2">
                  Message Sent!
                </h3>
                <p className="text-smoke text-sm">Thank you for reaching out. We'll get back to you shortly.</p>
              </motion.div>
            ) : (
              <div className="space-y-5">
                <Input
                  label="Full Name"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Enter your name"
                  required
                />
                <Input
                  label="Email"
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  required
                />
                <Input
                  label="Phone"
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="+91 XXXXX XXXXX"
                />
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-champagne-dark tracking-wide">
                    Message <span className="text-burgundy-light ml-1">*</span>
                  </label>
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    placeholder="Tell us about your interest..."
                    required
                    rows={4}
                    className="w-full elite-input rounded-xl px-4 py-3 text-sm resize-none"
                  />
                </div>

                {error && (
                  <p className="text-red-400 text-sm text-center">{error}</p>
                )}

                <Button
                  type="submit"
                  variant="gold"
                  size="lg"
                  icon={Send}
                  className="w-full mt-2"
                  disabled={sending}
                >
                  {sending ? 'Sending...' : 'Send Message'}
                </Button>
              </div>
            )}
          </motion.form>
        </div>
      </div>
    </section>
  );
}

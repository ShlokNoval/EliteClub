import { useState, useEffect } from 'react';
import { MessageSquare, Mail, Phone, Clock, CheckCircle2, Circle } from 'lucide-react';
import { motion } from 'framer-motion';
import PageTransition from '../../components/layout/PageTransition';
import GlassCard from '../../components/common/GlassCard';
import Button from '../../components/common/Button';
import { supabase } from '../../lib/supabase';
import { useToast } from '../../components/common/Toast';

export default function AdminMessages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  useEffect(() => { fetchMessages(); }, []);

  const fetchMessages = async () => {
    const { data } = await supabase.from('contact_messages')
      .select('*')
      .order('created_at', { ascending: false });
    setMessages(data || []);
    setLoading(false);
  };

  const markRead = async (id) => {
    await supabase.from('contact_messages').update({ is_read: true }).eq('id', id);
    setMessages(prev => prev.map(m => m.id === id ? { ...m, is_read: true } : m));
    toast.success('Marked as read');
  };

  const unreadCount = messages.filter(m => !m.is_read).length;

  return (
    <PageTransition>
      <div className="mb-8">
        <h1 className="font-playfair text-3xl font-bold text-champagne mb-1">
          Contact <span className="text-gold-gradient">Messages</span>
        </h1>
        <p className="text-smoke">
          {unreadCount > 0 ? `${unreadCount} unread message${unreadCount > 1 ? 's' : ''}` : 'All messages read'}
        </p>
      </div>

      {loading ? (
        <p className="text-smoke text-center py-12">Loading messages...</p>
      ) : messages.length === 0 ? (
        <GlassCard hover={false} className="text-center py-16">
          <MessageSquare size={48} className="text-gold/20 mx-auto mb-4" />
          <h3 className="text-champagne font-semibold mb-2">No Messages Yet</h3>
          <p className="text-smoke text-sm">Contact form submissions will appear here.</p>
        </GlassCard>
      ) : (
        <div className="space-y-4">
          {messages.map((msg, i) => (
            <motion.div key={msg.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
              <GlassCard hover={false} className={`${!msg.is_read ? 'border-gold/30' : ''}`}>
                <div className="flex items-start gap-4">
                  <div className={`w-3 h-3 rounded-full shrink-0 mt-2 ${msg.is_read ? 'bg-ash/30' : 'bg-gold animate-pulse'}`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div>
                        <h3 className="text-champagne font-semibold">{msg.name}</h3>
                        <div className="flex items-center gap-4 text-xs text-smoke mt-1">
                          <span className="flex items-center gap-1"><Mail size={12} /> {msg.email}</span>
                          {msg.phone && <span className="flex items-center gap-1"><Phone size={12} /> {msg.phone}</span>}
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-ash text-xs flex items-center gap-1">
                          <Clock size={12} />
                          {new Date(msg.created_at).toLocaleString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                        </p>
                        {!msg.is_read && (
                          <button onClick={() => markRead(msg.id)} className="text-xs text-gold hover:text-gold-light mt-2 cursor-pointer">
                            Mark read
                          </button>
                        )}
                      </div>
                    </div>
                    <p className="text-champagne-dark text-sm leading-relaxed mt-3 border-t border-white/5 pt-3">{msg.message}</p>
                    <div className="mt-3">
                      <a
                        href={`mailto:${msg.email}?subject=Re: Your inquiry to The Elite Club&body=Hi ${msg.name},%0A%0AThank you for contacting The Elite Club.%0A%0A`}
                        className="text-xs text-gold hover:text-gold-light transition-colors underline underline-offset-4"
                      >
                        Reply via email →
                      </a>
                    </div>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      )}
    </PageTransition>
  );
}

import { useState, useEffect } from 'react';
import { Calendar, Plus, Edit3, Trash2, Users } from 'lucide-react';
import { motion } from 'framer-motion';
import PageTransition from '../../components/layout/PageTransition';
import GlassCard from '../../components/common/GlassCard';
import Modal from '../../components/common/Modal';
import Button from '../../components/common/Button';
import { useToast } from '../../components/common/Toast';
import { supabase } from '../../lib/supabase';
import { formatDate } from '../../utils/helpers';

export default function AdminEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [interestedModalOpen, setInterestedModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [saving, setSaving] = useState(false);
  const toast = useToast();

  const [form, setForm] = useState({
    title: '',
    date: '',
    location: '',
    description: '',
    status: 'active'
  });

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      // We will also fetch the count of interested responses
      const { data, error } = await supabase
        .from('events')
        .select(`
          *,
          event_responses(
            status,
            profiles(full_name, phone, member_id)
          )
        `)
        .order('date', { ascending: true });

      if (error) throw error;
      setEvents(data || []);
    } catch (err) {
      toast.error('Failed to load events.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (evt = null) => {
    if (evt) {
      setEditingEvent(evt);
      setForm({
        title: evt.title,
        date: new Date(evt.date).toISOString().slice(0, 16), // Format for datetime-local
        location: evt.location,
        description: evt.description || '',
        status: evt.status
      });
    } else {
      setEditingEvent(null);
      setForm({
        title: '',
        date: '',
        location: '',
        description: '',
        status: 'active'
      });
    }
    setModalOpen(true);
  };

  const handleSubmit = async () => {
    if (!form.title || !form.date || !form.location) {
      toast.error('Title, date, and location are required.');
      return;
    }
    setSaving(true);
    try {
      if (editingEvent) {
        const { error } = await supabase.from('events')
          .update({
            title: form.title,
            date: new Date(form.date).toISOString(),
            location: form.location,
            description: form.description,
            status: form.status
          })
          .eq('id', editingEvent.id);
        if (error) throw error;
        toast.success('Event updated successfully!');
      } else {
        const { error } = await supabase.from('events')
          .insert([{
            title: form.title,
            date: new Date(form.date).toISOString(),
            location: form.location,
            description: form.description,
            status: form.status
          }]);
        if (error) throw error;
        toast.success('Event created successfully!');
      }
      setModalOpen(false);
      fetchEvents();
    } catch (err) {
      toast.error(err.message || 'Failed to save event.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this event? All RSVP data will be lost.")) return;
    try {
      const { error } = await supabase.from('events').delete().eq('id', id);
      if (error) throw error;
      toast.success('Event deleted.');
      fetchEvents();
    } catch (err) {
      toast.error('Failed to delete event.');
    }
  };

  return (
    <PageTransition>
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-playfair text-3xl font-bold text-champagne mb-1">Upcoming <span className="text-gold-gradient">Events</span></h1>
          <p className="text-smoke">Manage club events and track member interest.</p>
        </div>
        <Button variant="gold" size="sm" icon={Plus} onClick={() => handleOpenModal()}>
          Add Event
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {loading ? (
          <p className="text-smoke">Loading events...</p>
        ) : events.length === 0 ? (
          <p className="text-smoke">No events found. Create one to get started.</p>
        ) : (
          events.map((evt, i) => {
            const responses = evt.event_responses || [];
            const interestedCount = responses.filter(r => r.status === 'interested').length;
            return (
              <motion.div key={evt.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                <GlassCard hover={false} className="h-full flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-champagne font-semibold text-lg">{evt.title}</h3>
                      <span className={`text-xs px-2 py-1 rounded-md border ${evt.status === 'active' ? 'text-green-400 border-green-400/20 bg-green-400/10' : 'text-smoke border-white/10 bg-white/5'} uppercase tracking-wider`}>
                        {evt.status}
                      </span>
                    </div>
                    <div className="space-y-1 mb-4">
                      <p className="text-smoke text-sm flex items-center gap-2"><Calendar size={14} className="text-gold"/> {formatDate(evt.date)}</p>
                      <p className="text-smoke text-sm flex items-center gap-2"><span className="text-gold font-bold">@</span> {evt.location}</p>
                    </div>
                    {evt.description && (
                      <p className="text-ash text-sm mb-4 line-clamp-3">{evt.description}</p>
                    )}
                  </div>
                  <div className="border-t border-white/5 pt-4 mt-4 flex items-center justify-between">
                    <button 
                      onClick={() => {
                        setSelectedEvent(evt);
                        setInterestedModalOpen(true);
                      }}
                      className="flex items-center gap-2 text-sm text-gold bg-gold/10 hover:bg-gold/20 px-3 py-1.5 rounded-lg border border-gold/20 transition-colors cursor-pointer"
                    >
                      <Users size={16} /> <span>{interestedCount} Interested</span>
                    </button>
                    <div className="flex gap-2">
                      <button onClick={() => handleOpenModal(evt)} className="p-2 rounded-lg bg-white/5 text-smoke hover:text-gold transition-colors">
                        <Edit3 size={16} />
                      </button>
                      <button onClick={() => handleDelete(evt.id)} className="p-2 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-colors">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            );
          })
        )}
      </div>

      {/* Add/Edit Modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editingEvent ? "Edit Event" : "Create Event"} size="md">
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-champagne-dark">Event Title *</label>
            <input value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} className="w-full elite-input rounded-xl px-4 py-3 text-sm" placeholder="e.g. DJ Night Special" />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-champagne-dark">Date & Time *</label>
            <input type="datetime-local" value={form.date} onChange={e => setForm(p => ({ ...p, date: e.target.value }))} className="w-full elite-input rounded-xl px-4 py-3 text-sm" />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-champagne-dark">Location *</label>
            <input value={form.location} onChange={e => setForm(p => ({ ...p, location: e.target.value }))} className="w-full elite-input rounded-xl px-4 py-3 text-sm" placeholder="e.g. Club Velvet, Downtown" />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-champagne-dark">Description</label>
            <textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} className="w-full elite-input rounded-xl px-4 py-3 text-sm resize-none" rows={3} placeholder="Event details..." />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-champagne-dark">Status</label>
            <select value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value }))} className="w-full elite-input rounded-xl px-4 py-3 text-sm">
              <option value="active">Active</option>
              <option value="cancelled">Cancelled</option>
              <option value="completed">Completed</option>
            </select>
          </div>
          <div className="flex gap-3 pt-4 border-t border-white/5">
            <Button variant="gold" className="flex-1" onClick={handleSubmit} disabled={saving}>
              {saving ? 'Saving...' : 'Save Event'}
            </Button>
            <Button variant="ghost" onClick={() => setModalOpen(false)}>Cancel</Button>
          </div>
        </div>
      </Modal>

      {/* Interested Members Modal */}
      <Modal 
        isOpen={interestedModalOpen} 
        onClose={() => { setInterestedModalOpen(false); setSelectedEvent(null); }} 
        title={`Interested Members (${(selectedEvent?.event_responses || []).filter(r => r.status === 'interested').length})`} 
        size="md"
      >
        <div className="max-h-[60vh] overflow-y-auto pr-2 space-y-3">
          {selectedEvent && (selectedEvent.event_responses || []).filter(r => r.status === 'interested').length > 0 ? (
            (selectedEvent.event_responses || [])
              .filter(r => r.status === 'interested' && r.profiles)
              .map((r, idx) => (
                <div key={idx} className="flex justify-between items-center p-3 rounded-xl bg-white/5 border border-white/10">
                  <div>
                    <p className="text-champagne font-semibold text-sm">{r.profiles.full_name}</p>
                    <p className="text-ash text-xs">{r.profiles.member_id || 'No ID'}</p>
                  </div>
                  {r.profiles.phone && (
                    <a href={`tel:${r.profiles.phone}`} className="text-gold hover:text-gold-light text-sm bg-gold/10 px-3 py-1 rounded-full">
                      {r.profiles.phone}
                    </a>
                  )}
                </div>
              ))
          ) : (
            <p className="text-smoke text-sm text-center py-4">No members have marked interested yet.</p>
          )}
        </div>
      </Modal>
    </PageTransition>
  );
}

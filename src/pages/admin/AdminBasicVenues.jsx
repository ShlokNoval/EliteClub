import { useState, useEffect } from 'react';
import { Building2, Plus, Trash2, MapPin, Search, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import PageTransition from '../../components/layout/PageTransition';
import GlassCard from '../../components/common/GlassCard';
import Button from '../../components/common/Button';
import { supabase } from '../../lib/supabase';
import { useToast } from '../../components/common/Toast';

export default function AdminBasicVenues() {
  const toast = useToast();
  const [allHotels, setAllHotels] = useState([]);
  const [selectedVenueIds, setSelectedVenueIds] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState('');

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const [hotelsRes, venuesRes] = await Promise.all([
        supabase.from('hotels').select('id, name, location, status').eq('status', 'verified').order('name'),
        supabase.from('basic_plan_venues').select('hotel_id'),
      ]);

      setAllHotels(hotelsRes.data || []);
      setSelectedVenueIds(new Set((venuesRes.data || []).map(v => v.hotel_id)));
    } catch (err) {
      console.error(err);
      toast.error('Failed to load venues.');
    } finally {
      setLoading(false);
    }
  };

  const toggleVenue = async (hotelId) => {
    setSaving(true);
    const isSelected = selectedVenueIds.has(hotelId);

    try {
      if (isSelected) {
        const { error } = await supabase.from('basic_plan_venues').delete().eq('hotel_id', hotelId);
        if (error) throw error;
        setSelectedVenueIds(prev => {
          const next = new Set(prev);
          next.delete(hotelId);
          return next;
        });
        toast.success('Venue removed from Basic Plan.');
      } else {
        // Enforce 5 venue limit
        if (selectedVenueIds.size >= 5) {
          toast.error('Maximum 5 venues allowed for Basic Plan. Remove one before adding another.');
          setSaving(false);
          return;
        }
        const { error } = await supabase.from('basic_plan_venues').insert({ hotel_id: hotelId });
        if (error) throw error;
        setSelectedVenueIds(prev => new Set([...prev, hotelId]));
        toast.success('Venue added to Basic Plan.');
      }
    } catch (err) {
      console.error(err);
      toast.error(err.message || 'Failed to update venue.');
    } finally {
      setSaving(false);
    }
  };

  const filteredHotels = allHotels.filter(h =>
    h.name.toLowerCase().includes(search.toLowerCase()) ||
    (h.location || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <PageTransition>
      <div className="mb-8">
        <h1 className="font-playfair text-3xl font-bold text-champagne mb-1">
          Basic Plan <span className="text-gold-gradient">Venues</span>
        </h1>
        <p className="text-smoke">Select up to 5 partner venues available for Basic Plan (₹999) members.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Selected Venues Summary */}
        <GlassCard hover={false} className="lg:col-span-1">
          <h3 className="text-champagne font-semibold mb-4 flex items-center gap-2">
            <CheckCircle2 size={18} className="text-gold" />
            Selected Venues ({selectedVenueIds.size}/5)
          </h3>
          {loading ? (
            <p className="text-smoke text-sm py-4 text-center">Loading...</p>
          ) : selectedVenueIds.size === 0 ? (
            <div className="text-center py-8 border border-white/10 rounded-xl bg-black/20">
              <Building2 size={32} className="text-smoke mx-auto mb-2 opacity-50" />
              <p className="text-smoke text-sm">No venues selected yet.</p>
              <p className="text-ash text-xs mt-1">Toggle venues from the list to add them.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {allHotels.filter(h => selectedVenueIds.has(h.id)).map((hotel, i) => (
                <motion.div
                  key={hotel.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-center justify-between p-3 rounded-xl bg-gold/5 border border-gold/15"
                >
                  <div>
                    <p className="text-champagne text-sm font-medium">{hotel.name}</p>
                    <p className="text-ash text-xs flex items-center gap-1 mt-0.5">
                      <MapPin size={10} /> {hotel.location || 'Unknown'}
                    </p>
                  </div>
                  <button
                    onClick={() => toggleVenue(hotel.id)}
                    disabled={saving}
                    className="p-2 text-red-400/60 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all cursor-pointer disabled:opacity-50"
                    title="Remove from Basic Plan"
                  >
                    <Trash2 size={14} />
                  </button>
                </motion.div>
              ))}
            </div>
          )}

          {/* Progress bar */}
          <div className="mt-6">
            <div className="flex justify-between text-xs text-smoke mb-2">
              <span>Venue slots used</span>
              <span className="text-gold font-medium">{selectedVenueIds.size}/5</span>
            </div>
            <div className="h-2 rounded-full bg-white/5 overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-gold to-gold-light"
                initial={{ width: 0 }}
                animate={{ width: `${(selectedVenueIds.size / 5) * 100}%` }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
              />
            </div>
          </div>
        </GlassCard>

        {/* All Venues List */}
        <GlassCard hover={false} className="lg:col-span-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
            <h3 className="text-champagne font-semibold flex items-center gap-2">
              <Building2 size={18} className="text-gold" />
              All Partner Venues
            </h3>
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gold-muted" />
              <input
                type="text"
                placeholder="Search venues..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="elite-input rounded-xl pl-9 pr-4 py-2 text-sm w-full sm:w-56"
              />
            </div>
          </div>

          {loading ? (
            <p className="text-smoke text-sm py-8 text-center">Loading venues...</p>
          ) : filteredHotels.length === 0 ? (
            <p className="text-smoke text-sm py-8 text-center">No verified venues found.</p>
          ) : (
            <div className="space-y-2 max-h-[600px] overflow-y-auto pr-2">
              <AnimatePresence>
                {filteredHotels.map((hotel, i) => {
                  const isSelected = selectedVenueIds.has(hotel.id);
                  return (
                    <motion.div
                      key={hotel.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.03 }}
                      onClick={() => toggleVenue(hotel.id)}
                      className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all ${
                        saving ? 'opacity-60 pointer-events-none' : ''
                      } ${
                        isSelected
                          ? 'bg-gold/8 border-gold/25 hover:bg-gold/12'
                          : 'bg-white/2 border-white/5 hover:bg-white/5 hover:border-white/10'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                          isSelected ? 'bg-gold/15 border border-gold/25' : 'bg-white/5 border border-white/10'
                        }`}>
                          <Building2 size={18} className={isSelected ? 'text-gold' : 'text-smoke'} />
                        </div>
                        <div>
                          <p className={`text-sm font-medium ${isSelected ? 'text-gold' : 'text-champagne'}`}>
                            {hotel.name}
                          </p>
                          <p className="text-ash text-xs flex items-center gap-1 mt-0.5">
                            <MapPin size={10} /> {hotel.location || 'Unknown Location'}
                          </p>
                        </div>
                      </div>
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center border-2 transition-all ${
                        isSelected
                          ? 'bg-gold border-gold text-black'
                          : 'border-white/20 bg-transparent'
                      }`}>
                        {isSelected && <CheckCircle2 size={14} />}
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          )}
        </GlassCard>
      </div>
    </PageTransition>
  );
}

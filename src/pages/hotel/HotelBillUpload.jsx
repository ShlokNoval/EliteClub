import { useState, useEffect } from 'react';
import { Receipt, Upload, IndianRupee, Camera, Eye } from 'lucide-react';
import PageTransition from '../../components/layout/PageTransition';
import GlassCard from '../../components/common/GlassCard';
import Button from '../../components/common/Button';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../components/common/Toast';
import { supabase } from '../../lib/supabase';
import { formatCurrency } from '../../utils/helpers';

export default function HotelBillUpload() {
  const { hotel } = useAuth();
  const toast = useToast();
  const [closedVisits, setClosedVisits] = useState([]);
  const [selectedVisit, setSelectedVisit] = useState('');
  const [form, setForm] = useState({ food_bev_cost: '', liquor_cost_original: '', liquor_cost_billed: '', nips_consumed: '', beers_consumed: '' });
  const [billImage, setBillImage] = useState(null);
  const [notes, setNotes] = useState('');
  const [markUnlimited, setMarkUnlimited] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [recentBills, setRecentBills] = useState([]);

  useEffect(() => { if (hotel) fetchData(); }, [hotel]);

  const fetchData = async () => {
    try {
      // Get closed visits without bills (today)
      const todayStart = new Date(); todayStart.setHours(0, 0, 0, 0);

      const { data: visits } = await supabase.from('visits')
        .select('id, member_id, check_in, check_out, profiles:member_id(full_name, member_id, unlimited_day_used_at)')
        .eq('hotel_id', hotel.id)
        .eq('status', 'closed')
        .gte('check_in', todayStart.toISOString())
        .order('check_out', { ascending: false });

      // Get bills for today to exclude visits that already have bills
      const { data: todayBills } = await supabase.from('bills')
        .select('visit_id')
        .eq('hotel_id', hotel.id)
        .gte('created_at', todayStart.toISOString());

      const billedVisitIds = new Set((todayBills || []).map(b => b.visit_id));
      const unbilled = (visits || []).filter(v => !billedVisitIds.has(v.id));
      setClosedVisits(unbilled);

      // Recent bills
      const { data: bills } = await supabase.from('bills')
        .select('*, profiles:member_id(full_name)')
        .eq('hotel_id', hotel.id)
        .order('created_at', { ascending: false })
        .limit(10);
      setRecentBills(bills || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const savings = Math.max(0, Number(form.liquor_cost_original || 0) - Number(form.liquor_cost_billed || 0));

  const handleSubmit = async () => {
    if (!selectedVisit) { toast.error('Please select a visit.'); return; }
    if (!form.food_bev_cost && !form.liquor_cost_billed) { toast.error('Please enter at least one cost.'); return; }

    setSaving(true);
    try {
      const visit = closedVisits.find(v => v.id === Number(selectedVisit));
      let imageUrl = null;

      // Upload bill image if provided
      if (billImage) {
        const ext = billImage.name.split('.').pop();
        const path = `${hotel.id}/${Date.now()}.${ext}`;
        const { error: uploadErr } = await supabase.storage.from('bills').upload(path, billImage);
        if (!uploadErr) {
          const { data: urlData } = supabase.storage.from('bills').getPublicUrl(path);
          imageUrl = urlData?.publicUrl;
        }
      }

      const { error } = await supabase.from('bills').insert({
        visit_id: Number(selectedVisit),
        hotel_id: hotel.id,
        member_id: visit.member_id,
        food_bev_cost: Number(form.food_bev_cost || 0),
        liquor_cost_original: Number(form.liquor_cost_original || 0),
        liquor_cost_billed: Number(form.liquor_cost_billed || 0),
        nips_consumed: Number(form.nips_consumed || 0),
        beers_consumed: Number(form.beers_consumed || 0),
        bill_image_url: imageUrl,
        notes: notes.trim() || null,
      });

      if (error) throw error;

      // Update unlimited_day_used_at if checked
      if (markUnlimited) {
        await supabase.from('profiles').update({ unlimited_day_used_at: new Date().toISOString() }).eq('id', visit.member_id);
      }

      toast.success('Bill uploaded successfully!');
      setSelectedVisit('');
      setForm({ food_bev_cost: '', liquor_cost_original: '', liquor_cost_billed: '', nips_consumed: '', beers_consumed: '' });
      setBillImage(null);
      setNotes('');
      setMarkUnlimited(false);
      fetchData();
    } catch (err) {
      toast.error(err.message || 'Failed to upload bill.');
    } finally {
      setSaving(false);
    }
  };

  const selectedVisitObj = closedVisits.find(v => v.id === Number(selectedVisit));
  
  let canUseUnlimited = true;
  let nextUnlimitedDate = null;
  if (selectedVisitObj?.profiles?.unlimited_day_used_at) {
     const usedDate = new Date(selectedVisitObj.profiles.unlimited_day_used_at);
     const todayStart = new Date(); todayStart.setHours(0,0,0,0);
     if (usedDate < todayStart) { // Not already used today
        nextUnlimitedDate = new Date(usedDate);
        nextUnlimitedDate.setMonth(nextUnlimitedDate.getMonth() + 1);
        if (new Date() < nextUnlimitedDate) {
           canUseUnlimited = false;
        }
     }
  }

  return (
    <PageTransition>
      <div className="mb-8">
        <h1 className="font-playfair text-3xl font-bold text-champagne mb-1">Upload <span className="text-gold-gradient">Bill</span></h1>
        <p className="text-smoke">Upload bills for completed visits and record costs.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Bill Form */}
        <GlassCard hover={false}>
          <h3 className="text-champagne font-semibold mb-6 flex items-center gap-2"><Receipt size={18} className="text-gold" /> Bill Details</h3>

          {/* Select Visit */}
          <div className="space-y-2 mb-4">
            <label className="block text-sm font-medium text-champagne-dark">Select Visit *</label>
            <select value={selectedVisit} onChange={e => { setSelectedVisit(e.target.value); setMarkUnlimited(false); }} className="w-full elite-input rounded-xl px-4 py-3 text-sm">
              <option value="">Choose a completed visit...</option>
              {closedVisits.map(v => (
                <option key={v.id} value={v.id}>
                  {v.profiles?.full_name} ({v.profiles?.member_id}) — {new Date(v.check_in).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                </option>
              ))}
            </select>
            {closedVisits.length === 0 && !loading && (
              <p className="text-ash text-xs">No unbilled visits today. Check out a member first.</p>
            )}
          </div>

          {/* Costs */}
          <div className="space-y-4 mb-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-champagne-dark flex items-center gap-2"><IndianRupee size={14} className="text-gold" /> Food & Beverages Cost</label>
              <input type="number" value={form.food_bev_cost} onChange={e => setForm(p => ({ ...p, food_bev_cost: e.target.value }))} placeholder="₹ 0" className="w-full elite-input rounded-xl px-4 py-3 text-sm" />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-champagne-dark">Liquor Cost — Original (MRP)</label>
              <input type="number" value={form.liquor_cost_original} onChange={e => setForm(p => ({ ...p, liquor_cost_original: e.target.value }))} placeholder="₹ 0 (what it would cost normally)" className="w-full elite-input rounded-xl px-4 py-3 text-sm" />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-champagne-dark">Liquor Cost — Billed (Member Price)</label>
              <input type="number" value={form.liquor_cost_billed} onChange={e => setForm(p => ({ ...p, liquor_cost_billed: e.target.value }))} placeholder="₹ 0 (what member actually paid)" className="w-full elite-input rounded-xl px-4 py-3 text-sm" />
            </div>
          </div>

          {/* Quota Consumed */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-champagne-dark">Nips Consumed</label>
              <input type="number" step="any" value={form.nips_consumed} onChange={e => setForm(p => ({ ...p, nips_consumed: e.target.value }))} placeholder="0" className="w-full elite-input rounded-xl px-4 py-3 text-sm" />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-champagne-dark">Beers Consumed</label>
              <input type="number" step="any" value={form.beers_consumed} onChange={e => setForm(p => ({ ...p, beers_consumed: e.target.value }))} placeholder="0" className="w-full elite-input rounded-xl px-4 py-3 text-sm" />
            </div>
          </div>

          {/* Mark Unlimited */}
          {selectedVisitObj && canUseUnlimited && (
            <div className="flex items-center gap-3 mb-4 p-4 rounded-xl bg-champagne/5 border border-champagne/10">
              <input type="checkbox" id="markUnlimited" checked={markUnlimited} onChange={e => setMarkUnlimited(e.target.checked)} className="w-5 h-5 accent-gold cursor-pointer" />
              <label htmlFor="markUnlimited" className="text-sm font-medium text-champagne-dark cursor-pointer">
                Mark as 1-Day Unlimited Quota
                <p className="text-smoke text-xs font-normal mt-0.5">Check this if the member used their monthly unlimited consumption day today.</p>
              </label>
            </div>
          )}
          {selectedVisitObj && !canUseUnlimited && nextUnlimitedDate && (
            <div className="mb-4 p-4 rounded-xl bg-ash/5 border border-white/5">
               <p className="text-sm font-medium text-smoke flex items-center gap-2"><Wine size={14}/> 1-Day Unlimited Quota Unavailable</p>
               <p className="text-xs text-ash mt-0.5">Next available: {new Date(nextUnlimitedDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
            </div>
          )}

          {/* Savings preview */}
          {savings > 0 && (
            <div className="bg-green-400/5 border border-green-400/15 rounded-xl p-4 mb-4 text-center">
              <p className="text-green-400 text-lg font-bold">{formatCurrency(savings)}</p>
              <p className="text-smoke text-xs">Member savings on liquor</p>
            </div>
          )}

          {/* Bill Image */}
          <div className="space-y-2 mb-4">
            <label className="block text-sm font-medium text-champagne-dark flex items-center gap-2"><Camera size={14} className="text-gold" /> Bill Photo</label>
            <input type="file" accept="image/*" capture="environment" onChange={e => setBillImage(e.target.files[0])} className="w-full elite-input rounded-xl px-4 py-3 text-sm file:mr-4 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-sm file:bg-gold/10 file:text-gold" />
            {billImage && <p className="text-ash text-xs">{billImage.name}</p>}
          </div>

          {/* Notes */}
          <div className="space-y-2 mb-6">
            <label className="block text-sm font-medium text-champagne-dark">Notes (optional)</label>
            <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={2} placeholder="Any additional notes..." className="w-full elite-input rounded-xl px-4 py-3 text-sm resize-none" />
          </div>

          <Button variant="gold" size="lg" icon={Upload} className="w-full" onClick={handleSubmit} disabled={saving || !selectedVisit}>
            {saving ? 'Uploading...' : 'Upload Bill'}
          </Button>
        </GlassCard>

        {/* Recent Bills */}
        <GlassCard hover={false}>
          <h3 className="text-champagne font-semibold mb-4">Recent Bills</h3>
          {loading ? <p className="text-smoke text-center py-8">Loading...</p> : recentBills.length === 0 ? (
            <p className="text-smoke text-center py-8">No bills uploaded yet.</p>
          ) : (
            <div className="space-y-4">
              {recentBills.map(b => (
                <div key={b.id} className="pb-4 border-b border-white/5 last:border-0">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                      <p className="text-champagne text-sm font-medium">{b.profiles?.full_name || '—'}</p>
                      {b.bill_image_url && (
                        <a href={b.bill_image_url} target="_blank" rel="noopener noreferrer" className="text-gold hover:text-gold-light transition-colors" title="View Bill Image">
                          <Eye size={14} />
                        </a>
                      )}
                    </div>
                    <p className="text-ash text-xs">{new Date(b.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}</p>
                  </div>
                  <div className="grid grid-cols-4 gap-2 text-xs">
                    <div><p className="text-smoke">Food</p><p className="text-champagne">{formatCurrency(b.food_bev_cost)}</p></div>
                    <div><p className="text-smoke">Liquor</p><p className="text-champagne">{formatCurrency(b.liquor_cost_billed)}</p></div>
                    <div><p className="text-smoke">Consumed</p><p className="text-champagne">{b.nips_consumed || 0}N / {b.beers_consumed || 0}B</p></div>
                    <div><p className="text-smoke">Saved</p><p className="text-green-400 font-semibold">{formatCurrency(b.savings)}</p></div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </GlassCard>
      </div>
    </PageTransition>
  );
}

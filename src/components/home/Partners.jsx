import { motion } from 'framer-motion';
import { MapPin, CheckCircle2 } from 'lucide-react';
import SectionHeading from '../common/SectionHeading';
import { partnerVenues } from '../../data/mockData';
import venueImage from '../../assets/venue.png';

export default function Partners() {
  return (
    <section id="venues" className="py-24 md:py-32 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_rgba(107,29,42,0.1)_0%,_transparent_60%)]" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Partner Venues"
          title="The Elite Venues"
          subtitle="Your membership grants you privileged access to the finest establishments in Chh. Sambhajinagar."
        />

        {/* Venue Image Banner */}
        <motion.div
          className="relative rounded-3xl overflow-hidden mb-16 glass-card p-2"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <img
            src={venueImage}
            alt="The Elite Venues"
            className="w-full rounded-2xl object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black-deep/60 via-transparent to-transparent rounded-2xl" />
        </motion.div>

        {/* Venue Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {partnerVenues.map((venue, i) => (
            <motion.div
              key={venue.id}
              className="glass-card rounded-xl p-5 flex items-start gap-4 group"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05, duration: 0.5 }}
            >
              <div className="w-10 h-10 rounded-lg bg-gold/8 border border-gold/15 flex items-center justify-center shrink-0 group-hover:bg-gold/15 transition-colors">
                <MapPin size={18} className="text-gold" />
              </div>
              <div>
                <h4 className="text-champagne font-semibold text-sm mb-1">
                  {venue.name}
                </h4>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 size={12} className="text-green-400" />
                  <span className="text-smoke text-xs">{venue.type}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

import { motion } from 'framer-motion';
import { MapPin, CheckCircle2 } from 'lucide-react';
import SectionHeading from '../common/SectionHeading';
import { partnerVenues } from '../../data/mockData';
import venueImage from '../../assets/venue.png';

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
};

const venueCard = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  show:   { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

export default function Partners() {
  return (
    <section id="venues" className="py-24 md:py-32 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_rgba(107,29,42,0.1)_0%,_transparent_60%)] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Partner Venues"
          title="The Elite Venues"
          subtitle="Your membership grants you privileged access to the finest establishments in Chh. Sambhajinagar."
        />

        {/* Venue Image Banner */}
        <motion.div
          className="relative rounded-3xl overflow-hidden mb-16 glass-card p-2"
          initial={{ opacity: 0, scale: 0.93, y: 40 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        >
          <img src={venueImage} alt="The Elite Venues" className="w-full rounded-2xl object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black-deep/60 via-transparent to-transparent rounded-2xl" />
        </motion.div>

        {/* Venue Grid */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-60px' }}
        >
          {partnerVenues.map((venue) => (
            <motion.div
              key={venue.id}
              variants={venueCard}
              whileHover={{
                y: -6,
                boxShadow: '0 16px 32px -8px rgba(201,169,78,0.18)',
                borderColor: 'rgba(201,169,78,0.3)',
              }}
              className="glass-card rounded-xl p-5 flex items-start gap-4 group cursor-default"
            >
              <div className="w-10 h-10 rounded-lg bg-gold/8 border border-gold/15 flex items-center justify-center shrink-0 group-hover:bg-gold/20 group-hover:border-gold/35 group-hover:scale-110 transition-all duration-300">
                <MapPin size={18} className="text-gold" />
              </div>
              <div>
                <h4 className="text-champagne font-semibold text-sm mb-1">{venue.name}</h4>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 size={12} className="text-green-400" />
                  <span className="text-smoke text-xs">{venue.type}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

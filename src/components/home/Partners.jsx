import { motion } from 'framer-motion';
import { MapPin, CheckCircle2 } from 'lucide-react';
import SectionHeading from '../common/SectionHeading';
import { partnerVenues } from '../../data/mockData';
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
    <section id="venues" className="py-20 sm:py-24 md:py-32 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_rgba(107,29,42,0.1)_0%,_transparent_60%)] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Partner Venues"
          title="The Elite Venues"
          subtitle="Your membership grants you privileged access to the finest establishments in Chh. Sambhajinagar."
        />

        {/* Venue Grid */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6"
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
                y: -8,
                boxShadow: '0 20px 40px -10px rgba(201,169,78,0.15)',
                borderColor: 'rgba(201,169,78,0.3)',
              }}
              className="glass-card rounded-2xl overflow-hidden flex flex-col group cursor-default"
            >
              {/* Image Section - 4:3 Aspect Ratio */}
              <div className="w-full aspect-[4/3] bg-black/40 relative overflow-hidden border-b border-gold/10">
                {venue.image ? (
                  <img 
                    src={venue.image} 
                    alt={venue.name}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-contain p-6 group-hover:scale-105 transition-transform duration-500 ease-out" 
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center group-hover:scale-105 transition-transform duration-500 ease-out">
                    <MapPin size={48} className="text-gold/30" />
                  </div>
                )}
              </div>

              {/* Content Section */}
              <div className="p-6 flex-1 flex flex-col">
                <h4 className="text-champagne font-semibold text-lg mb-3">{venue.name}</h4>
                
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-green-400 shrink-0" />
                    <span className="text-smoke text-sm">{venue.type}</span>
                  </div>
                  
                  {venue.address && (
                    <div className="flex items-start gap-2">
                      <MapPin size={16} className="text-smoke/60 mt-0.5 shrink-0" />
                      <span className="text-smoke/70 text-sm leading-relaxed">{venue.address}</span>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

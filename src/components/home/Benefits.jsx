import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import SectionHeading from '../common/SectionHeading';
import { benefits } from '../../data/mockData';

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

const cardVariant = {
  hidden: { opacity: 0, y: 50, scale: 0.95 },
  show:   { opacity: 1, y: 0, scale: 1, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
};

export default function Benefits() {
  return (
    <section id="benefits" className="py-24 md:py-32 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(201,169,78,0.06)_0%,_transparent_55%)] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-burgundy/8 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Benefits"
          title="Why Join The Elite Club"
          subtitle="From exclusive pricing to digital convenience — discover why our members never look back."
        />

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-60px' }}
        >
          {benefits.map((benefit) => {
            const Icon = Icons[benefit.icon] || Icons.Star;
            return (
              <motion.div
                key={benefit.id}
                variants={cardVariant}
                whileHover={{
                  y: -10,
                  scale: 1.02,
                  boxShadow: '0 20px 40px -10px rgba(201,169,78,0.2)',
                }}
                className="glass-card rounded-2xl p-8 group cursor-default"
              >
                <div className="w-14 h-14 rounded-2xl bg-gold/8 border border-gold/15 flex items-center justify-center mb-6 group-hover:bg-gold/20 group-hover:border-gold/35 group-hover:scale-110 transition-all duration-400">
                  <Icon size={24} className="text-gold" />
                </div>
                <h3 className="font-playfair text-xl font-semibold text-champagne mb-3">
                  {benefit.title}
                </h3>
                <p className="text-smoke text-sm leading-relaxed">
                  {benefit.description}
                </p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}

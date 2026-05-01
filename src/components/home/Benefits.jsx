import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import SectionHeading from '../common/SectionHeading';
import { benefits } from '../../data/mockData';

export default function Benefits() {
  return (
    <section id="benefits" className="py-24 md:py-32 relative">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(201,169,78,0.05)_0%,_transparent_50%)]" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Benefits"
          title="Why Join The Elite Club"
          subtitle="From exclusive pricing to digital convenience — discover why our members never look back."
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {benefits.map((benefit, i) => {
            const Icon = Icons[benefit.icon] || Icons.Star;
            return (
              <motion.div
                key={benefit.id}
                className="glass-card rounded-2xl p-8 group"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
              >
                <div className="w-14 h-14 rounded-2xl bg-gold/8 border border-gold/15 flex items-center justify-center mb-6 group-hover:bg-gold/15 group-hover:border-gold/25 transition-all duration-500">
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
        </div>
      </div>
    </section>
  );
}

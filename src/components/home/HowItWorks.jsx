import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import SectionHeading from '../common/SectionHeading';
import { howItWorks } from '../../data/mockData';

export default function HowItWorks() {
  return (
    <section className="py-20 sm:py-24 md:py-32 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_rgba(107,29,42,0.08)_0%,_transparent_60%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="How It Works"
          title="Four Simple Steps"
          subtitle="Getting started with The Elite Club is effortless."
        />

        <div className="relative max-w-5xl mx-auto">
          {/* Connecting animated line */}
          <motion.div
            className="hidden md:block absolute top-10 left-[10%] right-[10%] h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent"
            initial={{ scaleX: 0, opacity: 0 }}
            whileInView={{ scaleX: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, ease: 'easeOut', delay: 0.3 }}
            style={{ originX: 0 }}
          />

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 sm:gap-10">
            {howItWorks.map((item, i) => {
              const Icon = Icons[item.icon] || Icons.Star;
              return (
                <motion.div
                  key={item.step}
                  className="relative flex flex-col items-center text-center"
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{ delay: i * 0.2, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                >
                  {/* Icon circle */}
                  <motion.div
                    className="relative w-20 h-20 rounded-full bg-black-deep border-2 border-gold/25 flex items-center justify-center mb-6 z-10"
                    whileHover={{ scale: 1.12, borderColor: 'rgba(201,169,78,0.6)', boxShadow: '0 0 24px rgba(201,169,78,0.25)' }}
                    transition={{ duration: 0.3 }}
                  >
                    <Icon size={28} className="text-gold" />
                    {/* Step badge */}
                    <motion.span
                      className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-burgundy text-champagne text-xs font-bold flex items-center justify-center border-2 border-black-deep"
                      initial={{ scale: 0, rotate: -90 }}
                      whileInView={{ scale: 1, rotate: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.2 + 0.4, type: 'spring', stiffness: 200 }}
                    >
                      {item.step}
                    </motion.span>
                  </motion.div>

                  <h3 className="font-playfair text-lg font-semibold text-champagne mb-2">
                    {item.title}
                  </h3>
                  <p className="text-smoke text-sm leading-relaxed">
                    {item.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import SectionHeading from '../common/SectionHeading';
import { howItWorks } from '../../data/mockData';

export default function HowItWorks() {
  return (
    <section className="py-24 md:py-32 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="How It Works"
          title="Four Simple Steps"
          subtitle="Getting started with The Elite Club is effortless."
        />

        <div className="relative max-w-4xl mx-auto">
          {/* Connecting Line */}
          <div className="hidden md:block absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent -translate-y-1/2" />

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {howItWorks.map((item, i) => {
              const Icon = Icons[item.icon] || Icons.Star;
              return (
                <motion.div
                  key={item.step}
                  className="relative text-center"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15, duration: 0.6 }}
                >
                  {/* Step Number */}
                  <div className="relative mx-auto w-20 h-20 rounded-full bg-black-deep border-2 border-gold/25 flex items-center justify-center mb-6 z-10">
                    <Icon size={28} className="text-gold" />
                    <span className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-burgundy text-champagne text-xs font-bold flex items-center justify-center border-2 border-black-deep">
                      {item.step}
                    </span>
                  </div>

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

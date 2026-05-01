import { motion } from 'framer-motion';
import { Crown, Star, Users } from 'lucide-react';
import SectionHeading from '../common/SectionHeading';

export default function AboutSection() {
  const stats = [
    { icon: Users, value: '150+', label: 'Active Members' },
    { icon: Star, value: '12+', label: 'Partner Venues' },
    { icon: Crown, value: '1800+', label: 'QR Scans' },
  ];

  return (
    <section id="about" className="py-24 md:py-32 relative">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 relative z-10">
        <div className="max-w-2xl text-left">
          <SectionHeading
            eyebrow="About Us"
            title="The Art of Elevated Drinking"
            subtitle="The Elite Club redefines how Chh. Sambhajinagar enjoys its finest spirits. We bring together the city's best bars, restaurants, and lounges under one premium membership, offering unmatched value and an experience reserved for the select few."
            align="left"
          />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-4xl mt-16 text-left">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              className="glass-card rounded-2xl p-10 relative overflow-hidden group"
              initial={{ opacity: 0, y: 100, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ delay: i * 0.2, type: "spring", stiffness: 50, damping: 20 }}
            >
              <div className="absolute inset-0 bg-gold/5 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out" />
              <stat.icon size={32} className="text-gold mb-4 relative z-10" />
              <p className="font-playfair text-4xl font-bold text-gold-gradient mb-2 relative z-10">{stat.value}</p>
              <p className="text-smoke text-sm uppercase tracking-widest relative z-10">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

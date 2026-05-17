import React, { useState, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import * as Icons from 'lucide-react';
import SectionHeading from '../common/SectionHeading';
import { benefits } from '../../data/mockData';

function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(
    typeof window !== 'undefined' ? window.innerWidth <= breakpoint : false
  );
  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${breakpoint}px)`);
    const handler = (e) => setIsMobile(e.matches);
    mq.addEventListener('change', handler);
    setIsMobile(mq.matches);
    return () => mq.removeEventListener('change', handler);
  }, [breakpoint]);
  return isMobile;
}

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

const cardVariant = {
  hidden: { opacity: 0, y: 50, scale: 0.95 },
  show:   { opacity: 1, y: 0, scale: 1, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
};

function BenefitCard({ benefit, isMobile }) {
  const Icon = Icons[benefit.icon] || Icons.Star;
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 40 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 40 });
  
  const glareX = useTransform(mouseXSpring, [-0.5, 0.5], ["100%", "0%"]);
  const glareY = useTransform(mouseYSpring, [-0.5, 0.5], ["100%", "0%"]);

  const handleMouseMove = (e) => {
    if (isMobile) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    x.set(mouseX / width - 0.5);
    y.set(mouseY / height - 0.5);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      variants={cardVariant}
      whileHover={isMobile ? {} : { y: -5, scale: 1.02 }}
      className="relative rounded-2xl overflow-hidden group"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      role="article"
      aria-label={`Benefit: ${benefit.title}`}
    >
      {!isMobile && (
        <motion.div 
          className="absolute inset-0 z-20 pointer-events-none opacity-0 transition-opacity duration-300 group-hover:opacity-100 mix-blend-overlay"
          style={{
            background: `radial-gradient(circle at ${glareX} ${glareY}, rgba(255,255,255,0.3) 0%, transparent 60%)`,
          }}
        />
      )}
      <div className="glass-card h-full rounded-2xl p-6 sm:p-8 border border-white/5 group-hover:border-gold/30 bg-black-deep/60 backdrop-blur-xl shadow-[0_4px_30px_rgba(0,0,0,0.5)] transition-all duration-500 relative z-10">
        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-br from-gold/10 to-burgundy/10 border border-gold/30 flex items-center justify-center mb-5 sm:mb-6 shadow-[inset_0_0_15px_rgba(201,169,78,0.2)] group-hover:shadow-[inset_0_0_25px_rgba(201,169,78,0.5)] group-hover:border-gold/60 transition-all duration-500">
          <Icon size={22} className="text-gold group-hover:drop-shadow-[0_0_8px_rgba(201,169,78,0.8)] transition-all duration-500" />
        </div>
        <h3 className="font-playfair text-lg sm:text-xl font-bold text-champagne mb-2 sm:mb-3 group-hover:text-gold-light transition-colors duration-300">
          {benefit.title}
        </h3>
        <p className="text-smoke text-sm leading-relaxed">
          {benefit.description}
        </p>
      </div>
    </motion.div>
  );
}

export default function Benefits() {
  const isMobile = useIsMobile();

  return (
    <section id="benefits" className="py-20 sm:py-24 md:py-40 relative overflow-hidden">
      {/* Royal Background Ambience */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(201,169,78,0.08)_0%,_transparent_70%)] pointer-events-none" />
      {!isMobile && (
        <>
          <motion.div 
            className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-gold/5 rounded-full blur-[120px] pointer-events-none"
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div 
            className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-burgundy/10 rounded-full blur-[150px] pointer-events-none"
            animate={{ scale: [1.2, 1, 1.2], opacity: [0.4, 0.7, 0.4] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          />
        </>
      )}

      <div className="relative max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12 sm:mb-20">
          <SectionHeading
            eyebrow="Benefits"
            title="Why Join The Elite Club"
            subtitle="From exclusive pricing to digital convenience — discover why our members never look back."
          />
        </div>

        {/* Split Runway Layout — fixed gap values */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 lg:gap-x-16 xl:gap-x-24 lg:gap-y-12 items-start justify-center max-w-7xl mx-auto"
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-60px' }}
        >
          {benefits.map((benefit) => (
            <BenefitCard key={benefit.id} benefit={benefit} isMobile={isMobile} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}

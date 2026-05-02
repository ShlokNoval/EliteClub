import { useRef, useEffect, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { Crown, Star, Users } from 'lucide-react';
import SectionHeading from '../common/SectionHeading';

// Animated counter that counts up when it enters the viewport
function Counter({ target, suffix = '', duration = 2000 }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  useEffect(() => {
    if (!inView) return;
    const num = parseInt(target.replace(/[^0-9]/g, ''));
    const step = num / (duration / 16);
    let current = 0;
    const timer = setInterval(() => {
      current += step;
      if (current >= num) {
        setCount(num);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [inView, target, duration]);

  return (
    <span ref={ref}>
      {count}{suffix}
    </span>
  );
}

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.18 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 60 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } },
};

export default function AboutSection() {
  const stats = [
    { icon: Users,  value: '150', suffix: '+', label: 'Active Members' },
    { icon: Star,   value: '12',  suffix: '+', label: 'Partner Venues' },
    { icon: Crown,  value: '1800',suffix: '+', label: 'QR Scans' },
  ];

  return (
    <section id="about" className="py-24 md:py-32 relative overflow-hidden">

      {/* Parallax ambient glow */}
      <div className="absolute -top-20 -left-20 w-[500px] h-[500px] bg-burgundy/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 sm:px-8 relative z-10">
        
        {/* Heading */}
        <motion.div
          className="max-w-2xl"
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-80px' }}
        >
          <motion.p variants={fadeUp} className="text-gold text-xs uppercase tracking-[0.3em] mb-3">About Us</motion.p>
          <motion.h2 variants={fadeUp} className="font-playfair text-4xl md:text-5xl font-bold text-champagne leading-tight mb-6">
            The Art of Elevated Drinking
          </motion.h2>
          <motion.p variants={fadeUp} className="text-smoke text-base leading-relaxed">
            The Elite Club redefines how Chh. Sambhajinagar enjoys its finest spirits. We bring together the city's best bars, restaurants, and lounges under one premium membership — offering unmatched value and an experience reserved for the select few.
          </motion.p>
        </motion.div>

        {/* Stats */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-4xl mt-16"
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-60px' }}
        >
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              variants={fadeUp}
              whileHover={{ y: -8, boxShadow: '0 24px 48px -12px rgba(201,169,78,0.15)' }}
              className="glass-card rounded-2xl p-10 relative overflow-hidden group cursor-default"
            >
              {/* Hover shimmer */}
              <div className="absolute inset-0 bg-gradient-to-br from-gold/5 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out rounded-2xl" />
              
              <stat.icon size={32} className="text-gold mb-4 relative z-10" />
              <p className="font-playfair text-5xl font-bold text-gold-gradient mb-2 relative z-10">
                <Counter target={stat.value} suffix={stat.suffix} />
              </p>
              <p className="text-smoke text-sm uppercase tracking-widest relative z-10">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  );
}

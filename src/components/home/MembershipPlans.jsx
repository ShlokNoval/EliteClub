import React from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Check, Sparkles, Crown } from 'lucide-react';
import SectionHeading from '../common/SectionHeading';
import Button from '../common/Button';
import { membershipPlans } from '../../data/mockData';
// v2: Buttons scroll to contact section instead of login

const featureVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};

const featureItem = {
  hidden: { opacity: 0, x: -20 },
  show:   { opacity: 1, x: 0, transition: { duration: 0.4 } },
};

function MembershipCard({ plan, i }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 40 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 40 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["7deg", "-7deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-7deg", "7deg"]);
  
  // Transform mapped coordinates for the glare gradient
  const glareX = useTransform(mouseXSpring, [-0.5, 0.5], ["100%", "0%"]);
  const glareY = useTransform(mouseYSpring, [-0.5, 0.5], ["100%", "0%"]);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      className={`relative rounded-3xl overflow-hidden`}
      initial={{ opacity: 0, y: 120 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ delay: i * 0.2, type: 'spring', stiffness: 40, damping: 20 }}
      style={{ rotateX, rotateY, transformPerspective: 1000 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      whileHover={{
        y: -10,
        scale: 1.02,
        boxShadow: plan.popular
          ? '0 30px 60px -10px rgba(107,29,42,0.4)'
          : '0 30px 60px -10px rgba(201,169,78,0.3)',
      }}
    >
      {/* Dynamic Glare Overlay */}
      <motion.div 
        className="absolute inset-0 z-20 pointer-events-none opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: `radial-gradient(circle at ${glareX} ${glareY}, rgba(255,255,255,0.15) 0%, transparent 60%)`,
        }}
      />

      {plan.popular && (
        <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-burgundy to-burgundy-light py-2 text-center z-10">
          <span className="text-gold-light text-xs font-bold tracking-[0.2em] uppercase flex items-center justify-center gap-2">
            <Crown size={14} /> Most Popular
          </span>
        </div>
      )}

      <div className={`glass-card flex flex-col rounded-3xl p-8 md:p-10 h-full relative z-0 ${
        plan.popular ? 'border-burgundy/50 shadow-[0_0_60px_rgba(107,29,42,0.2)] pt-14' : 'border-gold/30'
      }`}>
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles size={18} className={plan.popular ? "text-burgundy-light" : "text-gold"} />
            <span className={`text-sm font-semibold tracking-[0.15em] uppercase ${plan.popular ? 'text-burgundy-light' : 'text-gold'}`}>{plan.subtitle}</span>
          </div>
          <h3 className="font-playfair text-3xl font-bold text-champagne mb-2">{plan.name}</h3>
          <p className="text-smoke text-sm">{plan.duration} • {plan.mrpDays} days normal quota + {plan.unlimitedDays} day unlimited</p>
        </div>

        <div className="mb-8 flex items-end gap-2">
          <span className="font-playfair text-5xl font-bold text-gold-gradient">₹{plan.price.toLocaleString()}</span>
          <span className="text-smoke text-sm mb-2">/ cycle</span>
        </div>

        <motion.ul
          className="space-y-4 mb-10"
          variants={featureVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-60px' }}
        >
          {plan.features.map((feature, j) => (
            <motion.li key={j} variants={featureItem} className="flex items-start gap-3">
              <Check size={18} className={`${plan.popular ? 'text-burgundy-light' : 'text-gold'} shrink-0 mt-0.5`} />
              <span className="text-champagne-dark text-sm">{feature}</span>
            </motion.li>
          ))}
        </motion.ul>

        <div className="mt-auto pt-8 z-10">
          <Button 
            variant={plan.popular ? 'burgundy' : 'gold'} 
            size="lg" 
            className="w-full relative overflow-hidden group"
            onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
          >
            <span className="relative z-10">Get {plan.name}</span>
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
}

export default function MembershipPlans() {
  return (
    <section id="membership" className="py-24 md:py-32 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_rgba(107,29,42,0.1)_0%,_transparent_60%)] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Membership Plans"
          title="Choose Your Privilege"
          subtitle="Select the membership that suits your lifestyle. Every plan comes with exclusive access to all partner venues."
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-5xl mx-auto items-stretch group/container">
          {membershipPlans.map((plan, i) => (
            <MembershipCard key={plan.id} plan={plan} i={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

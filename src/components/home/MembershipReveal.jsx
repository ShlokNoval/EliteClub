import React, { useState, useEffect } from 'react';
import { motion, useScroll, useSpring, useTransform, useMotionValue } from 'framer-motion';
import { Check, Sparkles, Crown } from 'lucide-react';
// v2: Buttons scroll to contact section
import Button from '../common/Button';

import { membershipPlans } from '../../data/mockData';

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




// ─── Original membership card (exact replica of MembershipPlans.jsx card) ────
const featureVariants = { hidden:{}, show:{ transition:{ staggerChildren:0.06 } } };
const featureItem = { hidden:{opacity:0,x:-20}, show:{opacity:1,x:0,transition:{duration:0.4}} };

function MembershipCard({ plan, i, animate, isMobile }) {
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const mxS = useSpring(mx,{stiffness:300,damping:40});
  const myS = useSpring(my,{stiffness:300,damping:40});
  const rotateX = useTransform(myS,[-0.5,0.5],['7deg','-7deg']);
  const rotateY = useTransform(mxS,[-0.5,0.5],['-7deg','7deg']);
  const glareX  = useTransform(mxS,[-0.5,0.5],['100%','0%']);
  const glareY  = useTransform(myS,[-0.5,0.5],['100%','0%']);

  const onMove = (e) => {
    if (isMobile) return;
    const r=e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX-r.left)/r.width-.5);
    my.set((e.clientY-r.top)/r.height-.5);
  };
  const onLeave = () => { mx.set(0); my.set(0); };

  return (
    <motion.div
      className="relative rounded-3xl overflow-hidden"
      style={isMobile ? {} : { rotateX, rotateY, transformPerspective:1000 }}
      onMouseMove={onMove} onMouseLeave={onLeave}
      whileHover={isMobile ? {} : { y:-10, scale:1.02,
        boxShadow: plan.popular
          ? '0 30px 60px -10px rgba(107,29,42,0.4)'
          : '0 30px 60px -10px rgba(201,169,78,0.3)'
      }}
    >
      {!isMobile && (
        <motion.div className="absolute inset-0 z-20 pointer-events-none opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{ background:`radial-gradient(circle at ${glareX} ${glareY}, rgba(255,255,255,0.15) 0%, transparent 60%)` }}
        />
      )}
      {plan.popular && (
        <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-burgundy to-burgundy-light py-2 text-center z-10">
          <span className="text-gold-light text-xs font-bold tracking-[0.2em] uppercase flex items-center justify-center gap-2">
            <Crown size={14}/> Most Popular
          </span>
        </div>
      )}
      <div className={`glass-card flex flex-col rounded-3xl p-6 sm:p-8 md:p-10 h-full relative z-0 ${
        plan.popular ? 'border-burgundy/50 shadow-[0_0_60px_rgba(107,29,42,0.2)] pt-14' : 'border-gold/30'
      }`}>
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles size={18} className={plan.popular ? 'text-burgundy-light' : 'text-gold'}/>
            <span className={`text-sm font-semibold tracking-[0.15em] uppercase ${plan.popular ? 'text-burgundy-light' : 'text-gold'}`}>{plan.subtitle}</span>
          </div>
          <h3 className="font-playfair text-2xl sm:text-3xl font-bold text-champagne mb-2">{plan.name}</h3>
          <p className="text-smoke text-sm">{plan.duration} • {plan.mrpDays} days normal quota + {plan.unlimitedDays} day unlimited</p>
        </div>
        <div className="mb-6 sm:mb-8 flex items-end gap-2">
          <span className="font-playfair text-4xl sm:text-5xl font-bold text-gold-gradient">₹{plan.price.toLocaleString()}</span>
          <span className="text-smoke text-sm mb-2">/ cycle</span>
        </div>
        <motion.ul className="space-y-4 mb-10" variants={featureVariants}
          initial="hidden" animate={animate ? 'show' : 'hidden'}>
          {plan.features.map((f,j)=>(
            <motion.li key={j} variants={featureItem} className="flex items-start gap-3">
              <Check size={18} className={`${plan.popular?'text-burgundy-light':'text-gold'} shrink-0 mt-0.5`}/>
              <span className="text-champagne-dark text-sm">{f}</span>
            </motion.li>
          ))}
        </motion.ul>
        <div className="mt-auto pt-8 z-10">
          <Button variant={plan.popular?'burgundy':'gold'} size="lg" className="w-full relative overflow-hidden group"
            onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}>
            <span className="relative z-10">Get {plan.name}</span>
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"/>
          </Button>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Main export ──────────────────────────────────────────────────
export default function MembershipReveal({ sectionRef }) {
  const isMobile = useIsMobile();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  });

  const smooth = useSpring(scrollYProgress, { stiffness:55, damping:22, mass:1, restDelta:0.001 });

  // Heading: fades in fast, exits before bottle leaves
  const headingOpacity = useTransform(smooth, [0.02,0.10,0.18,0.26], [0,1,1,0]);
  const headingY       = useTransform(smooth, [0.02,0.12], [24,0]);

  // Cards: overlap bottle exit for zero dark-gap feeling
  const cardsOpacity   = useTransform(smooth, [0.28,0.44], [0,1]);

  // Progress bar
  const barScale = scrollYProgress;

  return (
    <section
      ref={sectionRef}
      id="membership"
      className="relative bg-black-primary"
      style={{ height: isMobile ? '200vh' : '280vh' }}
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden">

        {/* Glows */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_70%_at_50%_50%,_rgba(107,29,42,0.16)_0%,_transparent_70%)] pointer-events-none z-0"/>
        {!isMobile && <div className="absolute inset-0 bg-[radial-gradient(ellipse_40%_50%_at_50%_50%,_rgba(201,169,78,0.05)_0%,_transparent_65%)] pointer-events-none z-0"/>}



        {/* ── DOM Overlay ── */}
        <div className="absolute inset-0 z-20 flex flex-col">

          {/* Heading — visible only during bottle descent/dwell */}
          <motion.div
            style={{ opacity: headingOpacity, y: headingY, willChange: 'transform, opacity' }}
            className="flex flex-col items-center pt-10 sm:pt-14 gap-3 pointer-events-none"
          >
            <div className="flex items-center gap-2 px-5 py-1.5 rounded-full border border-gold/25 bg-black/40 backdrop-blur-md">
              <Crown size={13} className="text-gold"/>
              <span className="text-[10px] sm:text-xs font-bold tracking-[0.28em] uppercase text-gold">Membership Plans</span>
            </div>
            <h2 className="font-playfair text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-center leading-tight">
              <span className="text-champagne">Choose Your</span><br/>
              <span className="text-gold-gradient">Privilege</span>
            </h2>
            <p className="text-smoke text-sm sm:text-base text-center max-w-sm leading-relaxed px-6">
              Scroll to reveal your membership. Every pour, a statement.
            </p>
          </motion.div>

          {/* Cards — top-aligned so the 'Most Popular' banner is never clipped */}
          <motion.div
            style={{ opacity: cardsOpacity }}
            className="absolute inset-0 overflow-y-auto"
          >
            <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 sm:pt-20 pb-4">
              <div
                className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch"
                style={isMobile ? {} : { transform: 'scale(0.82)', transformOrigin: 'top center' }}
              >
                {membershipPlans.map((plan, i) => (
                  <MembershipCard
                    key={plan.id}
                    plan={plan}
                    i={i}
                    animate={true}
                    isMobile={isMobile}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Gold scroll progress bar */}
        <motion.div
          className="absolute bottom-0 left-0 h-[2px] z-30 bg-gradient-to-r from-burgundy via-gold to-gold-light"
          style={{ scaleX: barScale, transformOrigin:'left center' }}
        />

        {/* Edge vignette */}
        <div className="absolute inset-0 pointer-events-none z-5"
          style={{ background:'radial-gradient(ellipse 85% 85% at 50% 50%, transparent 55%, rgba(5,5,5,0.6) 100%)' }}
        />
      </div>
    </section>
  );
}

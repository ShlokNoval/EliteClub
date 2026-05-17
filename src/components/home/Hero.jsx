import { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ChevronDown, Crown } from 'lucide-react';
import Button from '../common/Button';
import logo from '../../assets/logo.png';

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

export default function Hero() {
  const containerRef = useRef(null);
  const isMobile = useIsMobile();
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  // Background text parallax — PURE slides UP, ELITE slides DOWN
  const pureX    = useTransform(scrollYProgress, [0, 1], [0, -120]);
  const textScale = useTransform(scrollYProgress, [0, 0.6], [1, 1.15]);
  const bgOpacity = useTransform(scrollYProgress, [0, 0.5], [0.5, 0]);

  // Foreground fade + lift on scroll
  const contentOpacity = useTransform(scrollYProgress, [0, 0.25], [1, 0]);
  const contentY       = useTransform(scrollYProgress, [0, 0.25], [0, -80]);

  return (
    <section ref={containerRef} className={`relative bg-black-deep ${isMobile ? 'h-[150vh]' : 'h-[200vh]'}`}>
      
      {/* ── Sticky viewport ─────────────────────── */}
      <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col items-center justify-center">

        {/* Depth glow */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(107,29,42,0.18)_0%,_transparent_65%)] pointer-events-none" />
        {!isMobile && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-gold/5 rounded-full blur-[120px] pointer-events-none" />
        )}

        {/* ── Massive background typography ──────── */}
        <motion.div
          style={{ scale: textScale, opacity: bgOpacity, willChange: 'transform, opacity' }}
          className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none select-none overflow-hidden gap-0"
        >
          <motion.div style={{ y: pureX }}>
            <span
              className="block font-playfair font-black leading-[0.9] tracking-tighter stroke-text text-center whitespace-nowrap drop-shadow-[0_0_30px_rgba(201,169,78,0.2)]"
              style={{ fontSize: "clamp(50px, 12vw, 180px)" }}
            >
              PURE ELITE
            </span>
          </motion.div>
        </motion.div>

        {/* ── Left side floating accent ──────────────── */}
        <motion.div
          className="absolute left-8 xl:left-16 top-1/2 -translate-y-1/2 z-40 hidden lg:flex flex-col items-center gap-6"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1, duration: 1, ease: [0.22, 1, 0.36, 1] }}
          style={{ opacity: contentOpacity }}
        >
          {/* Vertical line top */}
          <div className="w-[1px] h-32 bg-gradient-to-b from-transparent to-gold/30" />
          
          {/* Badge */}
          <motion.div 
            className="glass-card rounded-full py-6 px-3 border border-gold/20 shadow-[0_0_30px_rgba(201,169,78,0.1)] flex flex-col items-center gap-4 backdrop-blur-md"
            animate={{ y: [-8, 8, -8] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          >
            <Crown size={18} className="text-gold" />
            <div className="text-center" style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}>
              <span className="text-xs font-bold tracking-[0.3em] text-champagne uppercase">Members Only</span>
            </div>
          </motion.div>
          
          {/* Vertical line bottom */}
          <div className="w-[1px] h-32 bg-gradient-to-t from-transparent to-gold/30" />
        </motion.div>

        {/* ── Foreground content ─────────────────── */}
        <motion.div
          className="relative z-30 flex flex-col items-center text-center px-6 max-w-5xl"
          style={{ opacity: contentOpacity, y: contentY, willChange: 'transform, opacity' }}
        >
          {/* Logo */}
          <motion.div
            className="mb-6"
            initial={{ opacity: 0, scale: 0.7, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          >
            <img
              src={logo}
              alt="The Elite Club"
              className="h-28 sm:h-36 md:h-44 w-auto mx-auto drop-shadow-[0_0_50px_rgba(201,169,78,0.35)] brightness-125"
            />
          </motion.div>

          <motion.h2
            className="font-playfair text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-bold leading-[1.08] mb-6 sm:mb-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 1, ease: [0.22, 1, 0.36, 1] }}
          >
            <span 
              className="text-champagne inline-block drop-shadow-[0_0_15px_rgba(255,246,229,0.3)]"
            >
              Where Every Pour
            </span>
            <br />
            <span 
              className="text-gold-gradient inline-block pb-4 pr-2 drop-shadow-[0_0_20px_rgba(201,169,78,0.6)]"
            >
              is a Privilege
            </span>
          </motion.h2>

          {/* Sub copy */}
          <motion.p
            className="text-smoke text-base sm:text-xl md:text-2xl lg:text-3xl max-w-3xl mb-8 sm:mb-12 leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55, duration: 1 }}
          >
            India's most exclusive beverage membership — premium access, premium experience.
          </motion.p>

          {/* CTA */}
          <motion.div
            className="flex flex-col sm:flex-row items-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.75, duration: 1 }}
          >
            <a href="#about">
              <Button variant="gold" size="lg" icon={Crown} className="shadow-[0_0_40px_rgba(201,169,78,0.35)]">
                Enter The Club
              </Button>
            </a>
            <a href="#membership">
              <Button variant="ghost" size="lg">
                View Membership
              </Button>
            </a>
          </motion.div>
        </motion.div>

        {/* Scroll cue */}
        <motion.div
          className="absolute bottom-8 z-40 text-gold/60 flex flex-col items-center gap-1"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          style={{ opacity: contentOpacity }}
        >
          <span className="text-xs uppercase tracking-[0.2em] text-gold/40">Scroll</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          >
            <ChevronDown size={28} />
          </motion.div>
        </motion.div>

      </div>
    </section>
  );
}

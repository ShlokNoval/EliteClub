import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ChevronDown, Crown } from 'lucide-react';
import Button from '../common/Button';
import logo from '../../assets/logo.png';

export default function Hero() {
  const containerRef = useRef(null);
  
  // Track scroll progress within this section
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  // Background Text Parallax
  const textYLeft = useTransform(scrollYProgress, [0, 1], ["0%", "-100%"]);
  const textYRight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  const textScale = useTransform(scrollYProgress, [0, 0.5], [1, 1.1]);

  // Foreground Content Fade
  const contentOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const contentY = useTransform(scrollYProgress, [0, 0.2], ["0%", "-50px"]);

  return (
    <section ref={containerRef} className="relative h-[200vh] bg-black-deep">
      
      {/* Sticky viewport container */}
      <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col items-center justify-end pb-32">
        
        {/* Radial gradients for depth */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(107,29,42,0.15)_0%,_transparent_60%)]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gold/5 rounded-full blur-[100px] pointer-events-none" />

        {/* ═══ Background Marquee Typography ═══ */}
        <motion.div 
          style={{ scale: textScale }}
          className="absolute inset-0 flex items-center justify-center gap-8 z-0 opacity-20 select-none pointer-events-none overflow-hidden"
        >
          <motion.h1 
            style={{ y: textYLeft }} 
            className="text-[25vw] font-playfair font-black stroke-text leading-none tracking-tighter whitespace-nowrap"
          >
            PURE
          </motion.h1>
          <motion.h1 
            style={{ y: textYRight }} 
            className="text-[25vw] font-playfair font-black stroke-text leading-none tracking-tighter whitespace-nowrap"
          >
            ELITE
          </motion.h1>
        </motion.div>

        {/* ═══ Foreground Content ═══ */}
        {/* Pushed down to avoid the massive bottle starting in the center */}
        <motion.div 
          className="relative z-30 w-full flex flex-col items-center justify-center px-4"
          style={{ opacity: contentOpacity, y: contentY }}
        >
          {/* Wax Seal Logo */}
          <motion.div
            className="mb-4 mix-blend-screen"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          >
            <img
              src={logo}
              alt="The Elite Club"
              className="h-20 sm:h-24 w-auto mx-auto drop-shadow-[0_0_40px_rgba(201,169,78,0.25)] brightness-125"
            />
          </motion.div>

          <motion.h2 
            className="font-playfair text-3xl sm:text-4xl md:text-5xl font-bold leading-[1.1] text-center mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 1 }}
          >
            <span className="text-champagne drop-shadow-xl">Where Every Pour</span><br/>
            <span className="text-gold-gradient drop-shadow-xl">is a Privilege</span>
          </motion.h2>

          <motion.div
            className="flex flex-col sm:flex-row items-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 1 }}
          >
            <a href="#about">
              <Button variant="gold" size="md" icon={Crown} className="shadow-[0_0_30px_rgba(201,169,78,0.3)]">
                Enter The Club
              </Button>
            </a>
          </motion.div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-6 z-40 text-gold/60"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, y: [0, 10, 0] }}
          transition={{ delay: 1.5, duration: 2, repeat: Infinity }}
          style={{ opacity: contentOpacity }}
        >
          <ChevronDown size={32} />
        </motion.div>

      </div>
    </section>
  );
}

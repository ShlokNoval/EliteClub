import React, { useRef, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, Preload } from '@react-three/drei';
import { motion, useScroll, useSpring, useTransform } from 'framer-motion';
import { Crown } from 'lucide-react';
import AnimatedBottle from './AnimatedBottle';

export default function MembershipShowcase() {
  const sectionRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  });

  const smooth = useSpring(scrollYProgress, { stiffness: 60, damping: 24, mass: 1, restDelta: 0.001 });

  // Badge + heading: visible during dwell, exit as bottle fades out
  const topOpacity = useTransform(smooth, [0.03, 0.14, 0.50, 0.62], [0, 1, 1, 0]);
  const headingY   = useTransform(smooth, [0.10, 0.20], [28, 0]);

  // CTA: removed — the real DOM MembershipPlans cards have their own CTAs

  return (
    <section
      ref={sectionRef}
      id="membership-showcase"
      className="relative bg-black-primary"
      style={{ height: '350vh' }}
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden">

        {/* Ambient glows */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_70%_at_50%_55%,_rgba(107,29,42,0.18)_0%,_transparent_70%)] pointer-events-none z-0" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_50%_at_50%_50%,_rgba(201,169,78,0.06)_0%,_transparent_65%)] pointer-events-none z-0" />
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-gold/20 to-transparent z-0" />
        <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-gold/20 to-transparent z-0" />

        {/* Three.js Canvas */}
        <div className="absolute inset-0 z-10 pointer-events-none">
          <Canvas
            camera={{ position: [0, 0, 9], fov: 55 }}
            dpr={[1, 2]}
            gl={{ powerPreference: 'high-performance', antialias: true }}
          >
            <ambientLight intensity={1.4} />
            <spotLight position={[10, 10, 10]}   angle={0.15} penumbra={1} intensity={2.5} />
            <spotLight position={[-10, 10, -10]}  angle={0.15} penumbra={1} intensity={1.5} />
            <pointLight position={[0, 0, 6]}  intensity={1.0} color="#C9A94E" />
            <pointLight position={[0, -3, 4]} intensity={0.5} color="#8B2E3F" />
            <Environment preset="studio" />
            <Suspense fallback={null}>
              <AnimatedBottle scrollProgress={scrollYProgress} />
              <Environment preset="city" />
              <Preload all />
            </Suspense>
          </Canvas>
        </div>

        {/* DOM Overlay — top badge + heading only (3D panels handle the card reveal) */}
        <div className="absolute inset-0 z-20 flex flex-col pointer-events-none">

          <motion.div
            style={{ opacity: topOpacity }}
            className="flex flex-col items-center pt-10 sm:pt-14 gap-4"
          >
            <div className="flex items-center gap-2 px-5 py-1.5 rounded-full border border-gold/25 bg-black/40 backdrop-blur-md">
              <Crown size={13} className="text-gold" />
              <span className="text-[10px] sm:text-xs font-bold tracking-[0.28em] uppercase text-gold">
                Membership Plans
              </span>
            </div>

            <motion.h2
              style={{ y: headingY }}
              className="font-playfair text-4xl sm:text-5xl md:text-6xl font-bold text-center leading-tight px-4"
            >
              <span className="text-champagne">Choose Your</span>
              <br />
              <span className="text-gold-gradient">Privilege</span>
            </motion.h2>

            <p className="text-smoke text-sm sm:text-base text-center max-w-xs sm:max-w-sm leading-relaxed px-6">
              Scroll to unfold your membership.
              <br />
              Every pour, a statement.
            </p>
          </motion.div>

        </div>

        {/* Scroll progress bar */}
        <motion.div
          className="absolute bottom-0 left-0 h-[2px] z-30 bg-gradient-to-r from-burgundy via-gold to-gold-light"
          style={{ scaleX: scrollYProgress, transformOrigin: 'left center' }}
        />

        {/* Vignette */}
        <div
          className="absolute inset-0 pointer-events-none z-5"
          style={{ background: 'radial-gradient(ellipse 80% 80% at 50% 50%, transparent 55%, rgba(5,5,5,0.55) 100%)' }}
        />
      </div>
    </section>
  );
}


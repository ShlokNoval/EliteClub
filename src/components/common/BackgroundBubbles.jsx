import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

export default function BackgroundBubbles() {
  const bubbles = useMemo(() => {
    // Generate 40 random bubbles
    return Array.from({ length: 40 }).map((_, i) => {
      const size = Math.random() * 6 + 2; // 2px to 8px
      return {
        id: i,
        size,
        left: `${Math.random() * 100}%`,
        duration: Math.random() * 15 + 10, // 10s to 25s
        delay: Math.random() * -20, // Start at different times (negative so they are already on screen)
        opacity: Math.random() * 0.4 + 0.1, // 0.1 to 0.5
        wobbleOffset: Math.random() * 60 - 30, // How far they drift horizontally
      };
    });
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden mix-blend-screen">
      {bubbles.map((b) => (
        <motion.div
          key={b.id}
          className="absolute bottom-[-20px] rounded-full bg-gold"
          style={{
            left: b.left,
            width: b.size,
            height: b.size,
            opacity: b.opacity,
            boxShadow: `0 0 ${b.size * 2}px rgba(201,169,78,0.8)`
          }}
          animate={{
            y: ['0vh', '-120vh'], // Rise past the top
            x: [0, b.wobbleOffset, -b.wobbleOffset, 0] // Gentle wobble
          }}
          transition={{
            y: {
              duration: b.duration,
              repeat: Infinity,
              ease: "linear",
              delay: b.delay,
            },
            x: {
              duration: b.duration * 0.6, // Wobble speed
              repeat: Infinity,
              ease: "easeInOut",
              repeatType: "mirror",
              delay: b.delay,
            }
          }}
        />
      ))}
    </div>
  );
}

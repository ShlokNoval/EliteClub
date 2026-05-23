import React, { useMemo, useState, useEffect } from 'react';

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

export default function BackgroundBubbles() {
  const isMobile = useIsMobile();

  // Check for reduced motion preference
  const prefersReducedMotion = useMemo(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }, []);

  const bubbleCount = isMobile ? 8 : 20;

  const bubbles = useMemo(() => {
    return Array.from({ length: bubbleCount }).map((_, i) => {
      const size = Math.random() * 6 + 2; // 2px to 8px
      return {
        id: i,
        size,
        left: `${Math.random() * 100}%`,
        duration: Math.random() * 15 + 10, // 10s to 25s
        delay: Math.random() * -20,
        opacity: Math.random() * 0.4 + 0.1, // 0.1 to 0.5
        wobbleOffset: Math.random() * 60 - 30,
      };
    });
  }, [bubbleCount]);

  if (prefersReducedMotion) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden mix-blend-screen">
      {bubbles.map((b) => (
        <div
          key={b.id}
          className="absolute bottom-[-20px] rounded-full bg-gold"
          style={{
            left: b.left,
            width: b.size,
            height: b.size,
            opacity: b.opacity,
            boxShadow: `0 0 ${b.size * 2}px rgba(201,169,78,0.8)`,
            animation: `bubbleRise ${b.duration}s linear ${b.delay}s infinite, bubbleWobble ${b.duration * 0.6}s ease-in-out ${b.delay}s infinite alternate`,
            willChange: 'transform',
          }}
        />
      ))}

      <style>{`
        @keyframes bubbleRise {
          from { transform: translateY(0vh); }
          to   { transform: translateY(-120vh); }
        }
        @keyframes bubbleWobble {
          from { margin-left: 0px; }
          to   { margin-left: 30px; }
        }
      `}</style>
    </div>
  );
}

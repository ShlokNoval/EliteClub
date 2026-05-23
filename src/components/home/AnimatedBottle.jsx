import React, { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { useScroll, useSpring } from 'framer-motion';
import { Float } from '@react-three/drei';
import Bottle3D from './Bottle3D';

// CO2 Particle Burst Component
function CO2Burst() {
  const groupRef = useRef();
  const [active, setActive] = useState(true);
  
  const particles = useRef(
    Array.from({ length: 25 }).map(() => ({
      x: (Math.random() - 0.5) * 0.1,
      y: 3.1 + Math.random() * 0.2, // Start right above the cap
      z: (Math.random() - 0.5) * 0.1,
      vx: (Math.random() - 0.5) * 0.02, // Very little horizontal spread
      vy: Math.random() * 0.2 + 0.1, // Fast straight up
      vz: (Math.random() - 0.5) * 0.02,
      scale: Math.random() * 0.2 + 0.05,
      life: 1.0, // 1.0 to 0.0
    }))
  );

  useFrame(() => {
    if (!active || !groupRef.current) return;
    
    let anyAlive = false;
    groupRef.current.children.forEach((mesh, i) => {
      const p = particles.current[i];
      if (p.life > 0) {
        anyAlive = true;
        p.x += p.vx;
        p.y += p.vy;
        p.z += p.vz;
        p.life -= 0.015; // Fade out slightly slower
        p.scale *= 0.96; // Shrink
        mesh.position.set(p.x, p.y, p.z);
        mesh.scale.set(p.scale, p.scale, p.scale);
        mesh.material.opacity = p.life;
      } else {
        mesh.visible = false;
      }
    });

    if (!anyAlive) {
      setActive(false);
    }
  });

  if (!active) return null;

  return (
    <group ref={groupRef}>
      {particles.current.map((_, i) => (
        <mesh key={i}>
          <sphereGeometry args={[1, 8, 8]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={1} depthWrite={false} />
        </mesh>
      ))}
    </group>
  );
}

// Helpers
function ei(t){return t<.5?2*t*t:-1+(4-2*t)*t;}
function c01(v){return Math.max(0,Math.min(1,v));}
function mr(v,a,b,c,d){return c+(d-c)*c01((v-a)/(b-a));}
function lp(a,b,t){return a+(b-a)*t;}

export default function AnimatedBottle({ membershipRef, isMobile = false }) {
  const groupRef = useRef();
  const capRef = useRef();
  const [popped, setPopped] = useState(false);
  const [benefitsEl, setBenefitsEl] = useState(null);

  useEffect(() => {
    setBenefitsEl(document.getElementById('benefits'));
  }, []);

  // 1. Hero Scroll (0 to 200vh)
  const { scrollY } = useScroll();
  const heroProgress = useSpring(0, { stiffness: 50, damping: 20 });
  
  useEffect(() => {
    return scrollY.on("change", (v) => {
      const max = window.innerHeight * 2;
      heroProgress.set(Math.min(Math.max(v / max, 0), 1));
      
      if (v > 20 && !popped) {
        setPopped(true);
      }
    });
  }, [scrollY, popped, heroProgress]);

  // 2. Membership Scroll
  const { scrollYProgress: memScrollRaw } = useScroll({
    target: membershipRef,
    offset: ['start start', 'end end'],
  });
  const smoothMem = useSpring(memScrollRaw, { stiffness: 55, damping: 22, mass: 1, restDelta: 0.001 });

  // 3. Benefits Scroll
  const { scrollYProgress: benScrollRaw } = useScroll({
    target: benefitsEl ? { current: benefitsEl } : null,
    offset: ['start end', 'end start'],
  });
  const smoothBen = useSpring(benScrollRaw, { stiffness: 50, damping: 20, mass: 1, restDelta: 0.001 });

  useFrame(() => {
    if (!groupRef.current) return;
    
    const h = heroProgress.get();
    const m = smoothMem.get();
    const b = smoothBen.get();
    
    const mRaw = memScrollRaw.get();
    const bRaw = benScrollRaw.get();

    let s = 0;
    let x = 0;
    let y = 0;
    let rx = 0;
    let ry = 0;
    let rz = 0;
    let visible = true;

    // Default Cap State
    let cy = 2.75;
    let crx = 0;
    let crz = 0;
    let cVis = true;

    if (mRaw > 0.001 && mRaw < 0.999) {
      // ── In MembershipReveal ──
      cVis = false;
      rx = Math.PI * 4;

      if (isMobile) {
        // Sweep in from right, stay briefly, sweep out to left
        if (m < 0.15) {
          // Enter from right
          const t = mr(m, 0, 0.15, 0, 1);
          s = lp(0.25, 0.25, t);
          x = lp(4.5, 0, ei(t));
          y = -0.5;
          rx = Math.PI * 4 + t * Math.PI * 2;
        } else if (m < 0.42) {
          // Visible centre
          s = 0.25;
          x = 0;
          y = -0.5;
        } else {
          // Sweep out to left
          const t = mr(m, 0.42, 0.65, 0, 1);
          s = lp(0.25, 0, t);
          x = lp(0, -4.5, ei(t));
          y = -0.5;
          rx = Math.PI * 4 + t * Math.PI * 2;
        }
        visible = m < 0.65;
      } else {
        y = -1.0;
        x = 0;
        const maxScale = 0.55;
        s = m < 0.24 ? maxScale : lp(maxScale, 0, ei(mr(m, 0.24, 0.42, 0, 1)));
        visible = mRaw < 0.44;
      }
      
    } else if (bRaw > 0.001 && bRaw < 0.999) {
      // ── In Benefits ──
      cVis = false;
      const benefitScale = isMobile ? 0.25 : 0.25;

      if (isMobile) {
        y = 0;
        if (b < 0.15) {
          // Enter from left
          const t = mr(b, 0, 0.15, 0, 1);
          s = lp(0, benefitScale, ei(t));
          x = lp(-4.5, 0, ei(t));
          rx = Math.PI * 8 + t * Math.PI * 2;
        } else if (b < 0.55) {
          // Visible centre
          s = benefitScale;
          x = 0;
          rx = Math.PI * 8;
          ry = lp(-0.2, 0.2, (b - 0.15) / 0.4);
        } else if (b < 0.7) {
          // Exit right
          const t = mr(b, 0.55, 0.7, 0, 1);
          s = lp(benefitScale, 0, ei(t));
          x = lp(0, 4.5, ei(t));
          rx = Math.PI * 8 + t * Math.PI * 2;
        } else if (b < 0.85) {
          // Hidden gap
          visible = false;
        } else {
          // Final re-entry from left, then exit right
          const t = mr(b, 0.85, 1.0, 0, 1);
          s = lp(0, benefitScale, ei(Math.min(t * 2, 1)));
          x = lp(-4.5, 4.5, ei(t));
          rx = Math.PI * 10 + t * Math.PI * 2;
        }
      } else {
        y = 0.0;
        if (b < 0.2) {
          const bt = mr(b, 0, 0.2, 0, 1);
          s = lp(0, benefitScale, ei(bt));
          x = lp(5, 0, ei(bt));
          rx = lp(Math.PI * 4, Math.PI * 8, ei(bt));
        } else if (b < 0.8) {
          s = benefitScale;
          x = 0;
          rx = Math.PI * 8;
          ry = lp(-0.2, 0.2, (b - 0.2) / 0.6);
        } else {
          const bt = mr(b, 0.8, 1.0, 0, 1);
          s = lp(benefitScale, 0, ei(bt));
          x = lp(0, -5, ei(bt));
          rx = lp(Math.PI * 8, Math.PI * 12, ei(bt));
        }
      }
    } else if (mRaw <= 0.001) {
      // ── In Hero ──
      if (isMobile) {
        // Completely hidden on mobile hero to prevent overlapping content
        visible = false;
        cVis = false;
      } else {
        const maxScale = 0.55;
        s = maxScale;
        y = 0.3 - (h * 1.3);
        x = lp(4.0, 0, ei(h));
        rx = lp(0, Math.PI * 4, ei(h));

        // Cap fly-off physics
        if (h > 0.05) {
          const ct = c01((h - 0.05) / 0.15);
          cy = lp(2.75, 10.0, ct);
          crx = lp(0, Math.PI * 4, ct);
          crz = lp(0, Math.PI * 2, ct);
          cVis = ct < 0.99;
        }
      }
    } else {
       // Between Membership and Benefits (e.g. AboutSection)
       visible = false;
       cVis = false;
    }

    groupRef.current.scale.set(s, s, s);
    groupRef.current.position.set(x, y, 0);
    groupRef.current.rotation.set(rx, ry, rz);
    groupRef.current.visible = visible;

    if (capRef.current) {
      capRef.current.position.y = cy;
      capRef.current.rotation.x = crx;
      capRef.current.rotation.z = crz;
      capRef.current.visible = cVis;
    }
  });

  return (
    <group>
      <group ref={groupRef}>
        <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
          <Bottle3D capRef={capRef} />
        </Float>
        {popped && <CO2Burst />}
      </group>
    </group>
  );
}

import React, { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { useScroll, useTransform, useSpring } from 'framer-motion';
import { Float } from '@react-three/drei';
import Bottle3D from './Bottle3D';

// CO2 Particle Burst Component
function CO2Burst() {
  const groupRef = useRef();
  const particles = useRef(
    Array.from({ length: 50 }).map(() => ({
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
    if (!groupRef.current) return;
    groupRef.current.children.forEach((mesh, i) => {
      const p = particles.current[i];
      if (p.life > 0) {
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
  });

  return (
    <group ref={groupRef}>
      {particles.current.map((_, i) => (
        <mesh key={i}>
          <sphereGeometry args={[1, 16, 16]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={1} depthWrite={false} />
        </mesh>
      ))}
    </group>
  );
}

export default function AnimatedBottle() {
  const groupRef = useRef();
  const capRef = useRef();
  const [popped, setPopped] = useState(false);

  // 1. Get Scroll Progress
  const { scrollYProgress } = useScroll();

  // Trigger pop when scroll passes 0.02
  useEffect(() => {
    const unsubscribe = scrollYProgress.on("change", (latest) => {
      if (latest > 0.02 && !popped) {
        setPopped(true);
      }
    });
    return () => unsubscribe();
  }, [scrollYProgress, popped]);

  // 2. Apply Inertia/Damping to the Scroll! (Apple-like feel)
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 50,
    damping: 20,
    mass: 1,
    restDelta: 0.001
  });

  // 3. Map values using the SMOOTHED progress
  // Wait until 0.2 (leaving 200vh Hero section) before tilting and rolling away
  const scaleM = useTransform(smoothProgress, [0, 0.2, 0.3, 0.6, 0.8, 1], [0.55, 0.55, 0.25, 0.25, 0.25, 0]);
  const yM = useTransform(smoothProgress, [0, 0.2, 0.3, 0.6, 0.8, 1], [0.3, 0.3, -1, 1, 0, -2]);
  
  // Push the bottle to the far edges (x: 5 or -5) so it doesn't overlap text
  const xM = useTransform(smoothProgress, [0, 0.2, 0.3, 0.6, 0.8, 1], [4.0, 4.0, 5, -5, 5, -5]);
  
  const rotateZM = useTransform(smoothProgress, [0, 0.2, 0.3, 0.6, 0.8, 1], [0, 0, -1.57, 1.57, -1.57, 1.57]);
  const rotateXM = useTransform(smoothProgress, [0, 0.2, 0.3, 0.6, 0.8, 1], [0, 0, Math.PI * 4, Math.PI * 8, Math.PI * 12, Math.PI * 16]);
  const rotateYM = useTransform(smoothProgress, [0, 0.2, 0.3, 0.6, 0.8, 1], [0, 0, -0.2, 0.2, -0.2, 0.2]);

  // Cap Fly-Off Physics (Happens between 0.02 and 0.1)
  const capY = useTransform(smoothProgress, [0, 0.02, 0.1], [2.75, 2.75, 10.0]);
  const capRX = useTransform(smoothProgress, [0, 0.02, 0.1], [0, 0, Math.PI * 4]);
  const capRZ = useTransform(smoothProgress, [0, 0.02, 0.1], [0, 0, Math.PI * 2]);

  useFrame(() => {
    if (groupRef.current) {
      const s = scaleM.get();
      groupRef.current.scale.set(s, s, s);
      groupRef.current.position.set(xM.get(), yM.get(), 0);
      groupRef.current.rotation.set(rotateXM.get(), rotateYM.get(), rotateZM.get());
    }
    if (capRef.current) {
      capRef.current.position.y = capY.get();
      capRef.current.rotation.x = capRX.get();
      capRef.current.rotation.z = capRZ.get();
      
      // Hide cap completely once it flies off so it doesn't stick around horizontally
      if (capY.get() > 5.0) {
        capRef.current.visible = false;
      } else {
        capRef.current.visible = true;
      }
    }
  });

  return (
    <group>
      {/* The main animated bottle group */}
      <group ref={groupRef}>
        <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
          <Bottle3D capRef={capRef} />
        </Float>
        {popped && <CO2Burst />}
      </group>
    </group>
  );
}

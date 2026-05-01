import React, { Suspense, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, Float } from '@react-three/drei';
import { useScroll, useTransform } from 'framer-motion';
import Bottle3D from './Bottle3D';

function Scene({ scrollYProgress }) {
  const groupRef = useRef();

  // Mapping scroll progress across the entire page (0 to 1)
  const scaleM = useTransform(scrollYProgress, [0, 0.2, 0.4, 0.6, 0.8, 1], [1.1, 0.5, 0.5, 0.5, 0.3, 0]);
  const yM = useTransform(scrollYProgress, [0, 0.2, 0.4, 0.6, 0.8, 1], [-0.5, 0, -1, 1, 0, -2]);
  const xM = useTransform(scrollYProgress, [0, 0.2, 0.4, 0.6, 0.8, 1], [0, 3.5, 3.5, -3.5, 0, 0]);
  const rotateZM = useTransform(scrollYProgress, [0, 0.2, 0.4, 0.6, 0.8, 1], [0, -1.57, -1.57, 1.57, 0, 0]);
  const rotateXM = useTransform(scrollYProgress, [0, 0.2, 0.4, 0.6, 0.8, 1], [0, 0, Math.PI * 2, Math.PI * 4, Math.PI * 6, Math.PI * 8]);
  const rotateYM = useTransform(scrollYProgress, [0, 0.2, 0.4, 0.6, 0.8, 1], [0, 0.5, -0.5, 0.5, 0, 0]);

  // Apply motion values directly to the 3D mesh every frame
  useFrame(() => {
    if (!groupRef.current) return;
    const s = scaleM.get();
    groupRef.current.scale.set(s, s, s);
    groupRef.current.position.set(xM.get(), yM.get(), 0);
    groupRef.current.rotation.set(rotateXM.get(), rotateYM.get(), rotateZM.get());
  });

  return (
    <group ref={groupRef}>
      <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
        <Bottle3D />
      </Float>
    </group>
  );
}

export default function BottleSequence() {
  const { scrollYProgress } = useScroll();

  return (
    <div className="fixed inset-0 pointer-events-none z-20">
      <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
        <ambientLight intensity={1} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={2} />
        <spotLight position={[-10, 10, -10]} angle={0.15} penumbra={1} intensity={1} />
        
        <Suspense fallback={null}>
          <Scene scrollYProgress={scrollYProgress} />
          {/* Environment maps provide realistic reflections on the glass */}
          <Environment preset="city" />
        </Suspense>
      </Canvas>
    </div>
  );
}

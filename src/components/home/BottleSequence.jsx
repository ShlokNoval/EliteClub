import React, { Suspense, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, Preload, Lightformer } from '@react-three/drei';
import AnimatedBottle from './AnimatedBottle';

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

export default function BottleSequence({ membershipRef }) {
  const isMobile = useIsMobile();

  // Skip the entire 3D canvas on mobile — massive performance win
  if (isMobile) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-20">
      <Canvas 
        style={{ pointerEvents: 'none' }} 
        // Camera positioned to provide a cinematic view of the bottle
        camera={{ position: [0, 0, 8], fov: 45 }}
        // Limit DPR for better performance on high-resolution screens
        dpr={[1, 1.5]}
        gl={{ powerPreference: "high-performance", antialias: true }}
      >
        {/* Basic scene lighting */}
        <ambientLight intensity={1} />
        {/* Rim lighting and key lighting for bottle highlights */}
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={2} />
        <spotLight position={[-10, 10, -10]} angle={0.15} penumbra={1} intensity={1} />
        
        <Suspense fallback={null}>
          <AnimatedBottle membershipRef={membershipRef} />
          {/* Procedural Environment map for realistic reflections without CDN loading lag */}
          <Environment resolution={256}>
            <group rotation={[-Math.PI / 2, 0, 0]}>
              <Lightformer intensity={4} rotation-x={Math.PI / 2} position={[0, 5, -9]} scale={[10, 10, 1]} />
              <Lightformer intensity={2} rotation-y={Math.PI / 2} position={[-5, 1, -1]} scale={[20, 0.1, 1]} />
              <Lightformer rotation-y={Math.PI / 2} position={[-5, -1, -1]} scale={[20, 0.5, 1]} />
              <Lightformer rotation-y={-Math.PI / 2} position={[10, 1, 0]} scale={[20, 1, 1]} />
            </group>
          </Environment>
          <Preload all />
        </Suspense>
      </Canvas>
    </div>
  );
}

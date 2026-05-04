import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, Preload } from '@react-three/drei';
import AnimatedBottle from './AnimatedBottle';

export default function BottleSequence({ membershipRef }) {
  return (
    <div className="fixed inset-0 pointer-events-none z-20">
      <Canvas 
        style={{ pointerEvents: 'none' }} 
        camera={{ position: [0, 0, 8], fov: 45 }}
        dpr={[1, 1.5]}
        gl={{ powerPreference: "high-performance", antialias: true }}
      >
        <ambientLight intensity={1} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={2} />
        <spotLight position={[-10, 10, -10]} angle={0.15} penumbra={1} intensity={1} />
        
        <Suspense fallback={null}>
          <AnimatedBottle membershipRef={membershipRef} />
          {/* Environment maps provide realistic reflections on the glass */}
          <Environment preset="city" />
          <Preload all />
        </Suspense>
      </Canvas>
    </div>
  );
}

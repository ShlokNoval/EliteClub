import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment } from '@react-three/drei';
import AnimatedBottle from './AnimatedBottle';

export default function BottleSequence() {
  return (
    <div className="fixed inset-0 pointer-events-none z-20">
      <Canvas style={{ pointerEvents: 'none' }} camera={{ position: [0, 0, 8], fov: 45 }}>
        <ambientLight intensity={1} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={2} />
        <spotLight position={[-10, 10, -10]} angle={0.15} penumbra={1} intensity={1} />
        
        <Environment preset="studio" />
        <Suspense fallback={null}>
          <AnimatedBottle />
          {/* Environment maps provide realistic reflections on the glass */}
          <Environment preset="city" />
        </Suspense>
      </Canvas>
    </div>
  );
}

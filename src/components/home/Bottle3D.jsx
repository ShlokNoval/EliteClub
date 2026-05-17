import React, { useRef } from 'react';

export default function Bottle3D({ capRef, ...props }) {
  const group = useRef();

  return (
    <group ref={group} {...props} dispose={null}>
      
      {/* ═══ BOTTLE CAP (WAX SEAL / METALLIC) ═══ */}
      {/* Y goes from 2.45 to 3.05 */}
      <mesh ref={capRef} position={[0, 2.75, 0]}>
        <cylinderGeometry args={[0.3, 0.3, 0.6, 32]} />
        <meshStandardMaterial 
          color="#6B1D2A" // Burgundy wax color
          metalness={0.5}
          roughness={0.4}
        />
      </mesh>

      {/* ═══ BOTTLE LIP ═══ */}
      {/* Y goes from 2.3 to 2.45 */}
      <mesh position={[0, 2.375, 0]}>
        <cylinderGeometry args={[0.28, 0.28, 0.15, 32]} />
        <meshStandardMaterial 
          color="#c9a94e" 
          transparent={true}
          opacity={0.8}
          roughness={0.1}
          metalness={0.3}
        />
      </mesh>

      {/* ═══ BOTTLE NECK ═══ */}
      {/* Y goes from 0.8 to 2.3 */}
      <mesh position={[0, 1.55, 0]}>
        <cylinderGeometry args={[0.22, 0.25, 1.5, 32]} />
        <meshStandardMaterial 
          color="#c9a94e" 
          transparent={true}
          opacity={0.8}
          roughness={0.1}
          metalness={0.3}
        />
      </mesh>

      {/* ═══ BOTTLE SHOULDERS ═══ */}
      {/* Y goes from 0 to 0.8 */}
      <mesh position={[0, 0.4, 0]}>
        <cylinderGeometry args={[0.25, 0.85, 0.8, 32]} />
        <meshStandardMaterial 
          color="#c9a94e" 
          transparent={true}
          opacity={0.8}
          roughness={0.1}
          metalness={0.3}
        />
      </mesh>

      {/* ═══ BOTTLE BODY ═══ */}
      {/* Y goes from -3.5 to 0 */}
      <mesh position={[0, -1.75, 0]}>
        <cylinderGeometry args={[0.85, 0.85, 3.5, 32]} />
        <meshStandardMaterial 
          color="#b08d3b" // Deep amber liquid color
          transparent={true}
          opacity={0.85}
          roughness={0.1}
          metalness={0.4}
        />
      </mesh>

      {/* ═══ LABEL ═══ */}
      <mesh position={[0, -1.5, 0]}>
        {/* Slightly larger radius than body, rendering front half */}
        <cylinderGeometry args={[0.86, 0.86, 1.5, 32, 1, true, -Math.PI / 2, Math.PI]} />
        <meshStandardMaterial 
          color="#0A0A0A" 
          metalness={0.8}
          roughness={0.2}
          side={2} // THREE.DoubleSide
        />
      </mesh>
      
      {/* ═══ LABEL EMBLEM (GOLD) ═══ */}
      <mesh position={[0, -1.0, 0.85]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.2, 0.2, 0.05, 32]} />
        <meshStandardMaterial 
          color="#C9A94E" // Gold
          metalness={1}
          roughness={0.2}
        />
      </mesh>

    </group>
  );
}

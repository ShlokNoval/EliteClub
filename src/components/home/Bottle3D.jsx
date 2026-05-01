import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';

export default function Bottle3D(props) {
  const group = useRef();

  return (
    <group ref={group} {...props} dispose={null}>
      
      {/* ═══ BOTTLE CAP (WAX SEAL / METALLIC) ═══ */}
      <mesh position={[0, 3.2, 0]}>
        <cylinderGeometry args={[0.35, 0.35, 0.8, 32]} />
        <meshStandardMaterial 
          color="#6B1D2A" // Burgundy wax color
          metalness={0.5}
          roughness={0.4}
        />
      </mesh>

      {/* ═══ BOTTLE LIP ═══ */}
      <mesh position={[0, 2.7, 0]}>
        <cylinderGeometry args={[0.32, 0.32, 0.2, 32]} />
        <meshPhysicalMaterial 
          transmission={1} 
          roughness={0.1} 
          ior={1.5} 
          thickness={1} 
          color="#c9a94e" 
        />
      </mesh>

      {/* ═══ BOTTLE NECK ═══ */}
      <mesh position={[0, 2.0, 0]}>
        <cylinderGeometry args={[0.25, 0.3, 1.4, 32]} />
        <meshPhysicalMaterial 
          transmission={1} 
          roughness={0.05} 
          ior={1.5} 
          thickness={1.5} 
          color="#c9a94e" 
        />
      </mesh>

      {/* ═══ BOTTLE SHOULDERS ═══ */}
      <mesh position={[0, 0.8, 0]}>
        <cylinderGeometry args={[0.3, 1.2, 1.0, 32]} />
        <meshPhysicalMaterial 
          transmission={1} 
          roughness={0.05} 
          ior={1.5} 
          thickness={2} 
          color="#c9a94e" 
        />
      </mesh>

      {/* ═══ BOTTLE BODY ═══ */}
      <mesh position={[0, -1.2, 0]}>
        <cylinderGeometry args={[1.2, 1.1, 3.0, 32]} />
        <meshPhysicalMaterial 
          transmission={1} 
          roughness={0.05} 
          metalness={0.1}
          ior={1.5} 
          thickness={2} 
          color="#b08d3b" // Deep amber liquid color
          clearcoat={1}
          clearcoatRoughness={0.1}
        />
      </mesh>

      {/* ═══ LABEL ═══ */}
      <mesh position={[0, -1.2, 0]}>
        {/* Slightly larger radius than body, only rendering the front half or wrapping completely */}
        <cylinderGeometry args={[1.21, 1.11, 1.5, 32, 1, true, 0, Math.PI * 2]} />
        <meshStandardMaterial 
          color="#0A0A0A" 
          metalness={0.8}
          roughness={0.2}
          side={2} // THREE.DoubleSide
        />
      </mesh>
      
      {/* ═══ LABEL EMBLEM (GOLD) ═══ */}
      <mesh position={[0, -1.2, 1.17]} rotation={[0, 0, 0]}>
        <cylinderGeometry args={[0.4, 0.4, 0.05, 32]} />
        <meshStandardMaterial 
          color="#C9A94E" // Gold
          metalness={1}
          roughness={0.2}
        />
      </mesh>

    </group>
  );
}

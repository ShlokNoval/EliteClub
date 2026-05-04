import React, { useRef, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Environment, Preload } from '@react-three/drei';
import { motion, useScroll, useSpring, useTransform, useMotionValue } from 'framer-motion';
import { Check, Sparkles, Crown } from 'lucide-react';
import { Link } from 'react-router-dom';
import * as THREE from 'three';
import Button from '../common/Button';

import { membershipPlans } from '../../data/mockData';



// ─── Helpers ─────────────────────────────────────────────────────
function ei(t){return t<.5?2*t*t:-1+(4-2*t)*t;}
function c01(v){return Math.max(0,Math.min(1,v));}
function mr(v,a,b,c,d){return c+(d-c)*c01((v-a)/(b-a));}
function lp(a,b,t){return a+(b-a)*t;}

// ─── 3-D Bottle ──────────────────────────────────────────────────
// Scroll story (0→1 maps to the 400vh sticky section):
//  0.00–0.18  Bottle descends from top into the centre between the cards
//  0.18–0.32  Dwell — bottle hovers between hidden card slots
//  0.32–0.58  Label panels peel open (left/right)
//  0.58–0.72  Bottle fades out; cards become visible
//  0.72+      Bottle gone
function Bottle({ scrollProgress }) {
  const gRef   = useRef();
  const capRef = useRef();
  const sp     = useRef(0);

  useFrame(()=>{
    const raw = scrollProgress ? scrollProgress.get() : 0;
    sp.current = lp(sp.current, raw, 0.12); // faster lerp = snappier response
    const p = sp.current;

    // ── Outer group ──
    if (gRef.current) {
      const y = p < 0.14 ? lp(6.5, 0.2, ei(mr(p,0,0.14,0,1))) : 0.2;
      const s = p < 0.10 ? lp(0.18,0.55,ei(mr(p,0,0.10,0,1)))
                : p < 0.24 ? 0.55
                : lp(0.55, 0, ei(mr(p,0.24,0.42,0,1)));
      gRef.current.position.set(0, y, 0);
      gRef.current.scale.setScalar(s);
      gRef.current.visible = p < 0.44;
    }

    // ── Cap fly-off ──
    if (capRef.current) {
      if (p > 0.03) {
        const t = c01((p - 0.03) / 0.06);
        capRef.current.position.y = 2.75 + t * 9;
        capRef.current.rotation.x = t * Math.PI * 3;
        capRef.current.visible = t < 0.99;
      } else {
        capRef.current.position.y = 2.75;
        capRef.current.rotation.x = 0;
        capRef.current.visible = true;
      }
    }

    // ── Labels: static cylinders, no animation needed ──
  });

  const glass = { transmission:1, roughness:0.05, ior:1.5, thickness:1.5, color:'#c9a94e' };
  return (
    <group ref={gRef}>
      <Float speed={1.4} rotationIntensity={0.05} floatIntensity={0.18}>
        {/* Cap — has its own ref for the fly-off animation */}
        <mesh ref={capRef} position={[0,2.75,0]}><cylinderGeometry args={[.3,.3,.6,32]}/><meshStandardMaterial color="#6B1D2A" metalness={.5} roughness={.4}/></mesh>
        {/* Lip */}
        <mesh position={[0,2.375,0]}><cylinderGeometry args={[.28,.28,.15,32]}/><meshPhysicalMaterial {...glass} thickness={1}/></mesh>
        {/* Neck */}
        <mesh position={[0,1.55,0]}><cylinderGeometry args={[.22,.25,1.5,32]}/><meshPhysicalMaterial {...glass}/></mesh>
        {/* Shoulders */}
        <mesh position={[0,.4,0]}><cylinderGeometry args={[.25,.85,.8,32]}/><meshPhysicalMaterial {...glass} thickness={2}/></mesh>
        {/* Body */}
        <mesh position={[0,-1.75,0]}><cylinderGeometry args={[.85,.85,3.5,32]}/><meshPhysicalMaterial transmission={1} roughness={.05} metalness={.1} ior={1.5} thickness={2.5} color="#b08d3b" clearcoat={1} clearcoatRoughness={.1}/></mesh>
        {/* Emblem */}
        <mesh position={[0,-1,.86]} rotation={[Math.PI/2,0,0]}><cylinderGeometry args={[.18,.18,.04,32]}/><meshStandardMaterial color="#C9A94E" metalness={1} roughness={.15}/></mesh>

        {/* Plain label wrap — no text, original appearance */}
        <mesh position={[0,-1.5,0]}>
          <cylinderGeometry args={[0.89,0.89,1.65,32,1,true,-Math.PI/2,Math.PI]}/>
          <meshStandardMaterial color="#1c1008" metalness={0.15} roughness={0.55} side={THREE.DoubleSide}/>
        </mesh>
        <mesh position={[0,-1.5,0]}>
          <cylinderGeometry args={[0.89,0.89,1.65,32,1,true,Math.PI/2,-Math.PI]}/>
          <meshStandardMaterial color="#1c1008" metalness={0.15} roughness={0.55} side={THREE.DoubleSide}/>
        </mesh>
      </Float>
    </group>
  );
}

// ─── Original membership card (exact replica of MembershipPlans.jsx card) ────
const featureVariants = { hidden:{}, show:{ transition:{ staggerChildren:0.06 } } };
const featureItem = { hidden:{opacity:0,x:-20}, show:{opacity:1,x:0,transition:{duration:0.4}} };

function MembershipCard({ plan, i, animate }) {
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const mxS = useSpring(mx,{stiffness:300,damping:40});
  const myS = useSpring(my,{stiffness:300,damping:40});
  const rotateX = useTransform(myS,[-0.5,0.5],['7deg','-7deg']);
  const rotateY = useTransform(mxS,[-0.5,0.5],['-7deg','7deg']);
  const glareX  = useTransform(mxS,[-0.5,0.5],['100%','0%']);
  const glareY  = useTransform(myS,[-0.5,0.5],['100%','0%']);

  const onMove = (e) => {
    const r=e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX-r.left)/r.width-.5);
    my.set((e.clientY-r.top)/r.height-.5);
  };
  const onLeave = () => { mx.set(0); my.set(0); };

  return (
    <motion.div
      className="relative rounded-3xl overflow-hidden"
      style={{ rotateX, rotateY, transformPerspective:1000 }}
      onMouseMove={onMove} onMouseLeave={onLeave}
      whileHover={{ y:-10, scale:1.02,
        boxShadow: plan.popular
          ? '0 30px 60px -10px rgba(107,29,42,0.4)'
          : '0 30px 60px -10px rgba(201,169,78,0.3)'
      }}
    >
      <motion.div className="absolute inset-0 z-20 pointer-events-none opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{ background:`radial-gradient(circle at ${glareX} ${glareY}, rgba(255,255,255,0.15) 0%, transparent 60%)` }}
      />
      {plan.popular && (
        <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-burgundy to-burgundy-light py-2 text-center z-10">
          <span className="text-gold-light text-xs font-bold tracking-[0.2em] uppercase flex items-center justify-center gap-2">
            <Crown size={14}/> Most Popular
          </span>
        </div>
      )}
      <div className={`glass-card flex flex-col rounded-3xl p-8 md:p-10 h-full relative z-0 ${
        plan.popular ? 'border-burgundy/50 shadow-[0_0_60px_rgba(107,29,42,0.2)] pt-14' : 'border-gold/30'
      }`}>
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles size={18} className={plan.popular ? 'text-burgundy-light' : 'text-gold'}/>
            <span className={`text-sm font-semibold tracking-[0.15em] uppercase ${plan.popular ? 'text-burgundy-light' : 'text-gold'}`}>{plan.subtitle}</span>
          </div>
          <h3 className="font-playfair text-3xl font-bold text-champagne mb-2">{plan.name}</h3>
          <p className="text-smoke text-sm">{plan.duration} • {plan.mrpDays} days MRP + {plan.freeDays} day FREE</p>
        </div>
        <div className="mb-8 flex items-end gap-2">
          <span className="font-playfair text-5xl font-bold text-gold-gradient">₹{plan.price.toLocaleString()}</span>
          <span className="text-smoke text-sm mb-2">/ cycle</span>
        </div>
        <motion.ul className="space-y-4 mb-10" variants={featureVariants}
          initial="hidden" animate={animate ? 'show' : 'hidden'}>
          {plan.features.map((f,j)=>(
            <motion.li key={j} variants={featureItem} className="flex items-start gap-3">
              <Check size={18} className={`${plan.popular?'text-burgundy-light':'text-gold'} shrink-0 mt-0.5`}/>
              <span className="text-champagne-dark text-sm">{f}</span>
            </motion.li>
          ))}
        </motion.ul>
        <Link to="/login" className="mt-auto pt-8 z-10">
          <Button variant={plan.popular?'burgundy':'gold'} size="lg" className="w-full relative overflow-hidden group">
            <span className="relative z-10">Get {plan.name}</span>
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"/>
          </Button>
        </Link>
      </div>
    </motion.div>
  );
}

// ─── Main export ──────────────────────────────────────────────────
export default function MembershipReveal() {
  const sectionRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  });

  const smooth = useSpring(scrollYProgress, { stiffness:55, damping:22, mass:1, restDelta:0.001 });

  // Heading: fades in fast, exits before bottle leaves
  const headingOpacity = useTransform(smooth, [0.02,0.10,0.18,0.26], [0,1,1,0]);
  const headingY       = useTransform(smooth, [0.02,0.12], [24,0]);

  // Cards: overlap bottle exit for zero dark-gap feeling
  const cardsOpacity   = useTransform(smooth, [0.28,0.44], [0,1]);

  // Progress bar
  const barScale = scrollYProgress;

  return (
    <section
      ref={sectionRef}
      id="membership"
      className="relative bg-black-primary"
      style={{ height: '280vh' }}
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden">

        {/* Glows */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_70%_at_50%_50%,_rgba(107,29,42,0.16)_0%,_transparent_70%)] pointer-events-none z-0"/>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_40%_50%_at_50%_50%,_rgba(201,169,78,0.05)_0%,_transparent_65%)] pointer-events-none z-0"/>

        {/* ── 3-D Canvas ── */}
        <div className="absolute inset-0 z-10 pointer-events-none">
          <Canvas camera={{position:[0,0,9], fov:55}} dpr={[1,2]} gl={{powerPreference:'high-performance',antialias:true}}>
            <ambientLight intensity={1.3}/>
            <spotLight position={[10,10,10]} angle={0.15} penumbra={1} intensity={2.5}/>
            <spotLight position={[-10,10,-10]} angle={0.15} penumbra={1} intensity={1.5}/>
            <pointLight position={[0,0,6]} intensity={0.9} color="#C9A94E"/>
            <pointLight position={[0,-4,4]} intensity={0.4} color="#8B2E3F"/>
            <Environment preset="studio"/>
            <Suspense fallback={null}>
              <Bottle scrollProgress={scrollYProgress}/>
              <Environment preset="city"/>
              <Preload all/>
            </Suspense>
          </Canvas>
        </div>

        {/* ── DOM Overlay ── */}
        <div className="absolute inset-0 z-20 flex flex-col">

          {/* Heading — visible only during bottle descent/dwell */}
          <motion.div
            style={{ opacity: headingOpacity, y: headingY }}
            className="flex flex-col items-center pt-10 sm:pt-14 gap-3 pointer-events-none"
          >
            <div className="flex items-center gap-2 px-5 py-1.5 rounded-full border border-gold/25 bg-black/40 backdrop-blur-md">
              <Crown size={13} className="text-gold"/>
              <span className="text-[10px] sm:text-xs font-bold tracking-[0.28em] uppercase text-gold">Membership Plans</span>
            </div>
            <h2 className="font-playfair text-4xl sm:text-5xl md:text-6xl font-bold text-center leading-tight">
              <span className="text-champagne">Choose Your</span><br/>
              <span className="text-gold-gradient">Privilege</span>
            </h2>
            <p className="text-smoke text-sm sm:text-base text-center max-w-sm leading-relaxed px-6">
              Scroll to reveal your membership. Every pour, a statement.
            </p>
          </motion.div>

          {/* Cards — top-aligned so the 'Most Popular' banner is never clipped */}
          <motion.div
            style={{ opacity: cardsOpacity }}
            className="absolute inset-0 overflow-y-auto"
          >
            <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-4">
              <div
                className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch"
                style={{ transform: 'scale(0.82)', transformOrigin: 'top center' }}
              >
                {membershipPlans.map((plan, i) => (
                  <MembershipCard
                    key={plan.id}
                    plan={plan}
                    i={i}
                    animate={true}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Gold scroll progress bar */}
        <motion.div
          className="absolute bottom-0 left-0 h-[2px] z-30 bg-gradient-to-r from-burgundy via-gold to-gold-light"
          style={{ scaleX: barScale, transformOrigin:'left center' }}
        />

        {/* Edge vignette */}
        <div className="absolute inset-0 pointer-events-none z-5"
          style={{ background:'radial-gradient(ellipse 85% 85% at 50% 50%, transparent 55%, rgba(5,5,5,0.6) 100%)' }}
        />
      </div>
    </section>
  );
}

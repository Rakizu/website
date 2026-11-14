'use client';

import React, { useRef, useMemo, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { ScrollControls, useScroll, Image as DreiImage, Text, Preload, Scroll } from '@react-three/drei';
import * as THREE from 'three';

// ── 3D Particles Galaxy ──
function Particles({ count = 2000 }) {
  const mesh = useRef<THREE.InstancedMesh>(null);
  
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      const t = Math.random() * 100;
      const factor = 20 + Math.random() * 100;
      const speed = 0.01 + Math.random() / 200;
      const xFactor = -50 + Math.random() * 100;
      const yFactor = -50 + Math.random() * 100;
      const zFactor = -50 + Math.random() * 100;
      temp.push({ t, factor, speed, xFactor, yFactor, zFactor, mx: 0, my: 0 });
    }
    return temp;
  }, [count]);

  useFrame((state) => {
    if (!mesh.current) return;
    particles.forEach((particle, i) => {
      let { t, factor, speed, xFactor, yFactor, zFactor } = particle;
      t = particle.t += speed / 2;
      const a = Math.cos(t) + Math.sin(t * 1) / 10;
      const b = Math.sin(t) + Math.cos(t * 2) / 10;
      const s = Math.cos(t);
      
      dummy.position.set(
        (particle.mx / 10) * a + xFactor + Math.cos((t / 10) * factor) + (Math.sin(t * 1) * factor) / 10,
        (particle.my / 10) * b + yFactor + Math.sin((t / 10) * factor) + (Math.cos(t * 2) * factor) / 10,
        (particle.my / 10) * b + zFactor + Math.cos((t / 10) * factor) + (Math.sin(t * 3) * factor) / 10
      );
      dummy.scale.set(s, s, s);
      dummy.rotation.set(s * 5, s * 5, s * 5);
      dummy.updateMatrix();
      mesh.current!.setMatrixAt(i, dummy.matrix);
    });
    mesh.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, count]}>
      <dodecahedronGeometry args={[0.05, 0]} />
      <meshBasicMaterial color="#c79a45" transparent opacity={0.6} />
    </instancedMesh>
  );
}

// ── Cinematic Scene with Camera Fly-Through ──
function Scene() {
  const scroll = useScroll();
  const group = useRef<THREE.Group>(null);
  
  useFrame((state, delta) => {
    // scroll.offset goes from 0 to 1
    const offset = scroll.offset;
    
    // Move the entire scene forward towards the camera based on scroll
    // Camera is at z=0, scene starts at z=0 and moves positive Z to pass through
    if (group.current) {
      // Smooth interpolation for the movement
      const targetZ = offset * 25; 
      group.current.position.z = THREE.MathUtils.damp(group.current.position.z, targetZ, 4, delta);
      
      // Slight rotation for cinematic feel
      group.current.rotation.y = THREE.MathUtils.damp(group.current.rotation.y, offset * 0.2, 4, delta);
      group.current.rotation.x = THREE.MathUtils.damp(group.current.rotation.x, offset * 0.1, 4, delta);
    }
  });

  return (
    <group ref={group}>
      <Particles count={1500} />

      {/* Floating Image Panels */}
      {/* Panel 1 */}
      <DreiImage 
        url="https://images.unsplash.com/photo-1544717302-de2939b7ef71?q=80&w=1200&auto=format&fit=crop" 
        transparent opacity={0.9} 
        position={[-2, 0, -5]} 
        scale={[4, 6]} 
      />
      {/* Panel 2 */}
      <DreiImage 
        url="https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=1200&auto=format&fit=crop" 
        transparent opacity={0.9} 
        position={[2.5, -1, -12]} 
        scale={[3.5, 5]} 
      />
      {/* Panel 3 */}
      <DreiImage 
        url="https://images.unsplash.com/photo-1511629091441-ee46146481b6?q=80&w=1200&auto=format&fit=crop" 
        transparent opacity={0.9} 
        position={[-1.5, 1, -19]} 
        scale={[5, 7.5]} 
      />
      
      {/* Background 3D Typography */}
      <Text
        position={[0, 0, -25]}
        fontSize={3}
        color="#FDF6EC"
        font="https://fonts.gstatic.com/s/outfit/v11/QGYyz_MVcBeNP4NjuGObqx1XmO1I4TC0C4G-EiAou6Y.woff"
        characters="abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!"
        material-toneMapped={false}
      >
        MASA DEPAN
      </Text>
    </group>
  );
}

// ── HTML Overlay (DOM) ──
// This sits on top of the canvas, but inside the scroll context
function DOMOverlay() {
  const scroll = useScroll();
  const overlayRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useFrame(() => {
    if (overlayRef.current && textRef.current) {
      // Fade out the main text as we scroll deep into the 3D space
      const opacity = Math.max(1 - scroll.offset * 3, 0);
      textRef.current.style.opacity = opacity.toString();
      textRef.current.style.transform = `scale(${1 + scroll.offset * 0.5}) translate3d(0, ${-scroll.offset * 100}px, 0)`;
    }
  });

  return (
    <div ref={overlayRef} className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center pt-20">
      
      {/* The Massive Typography */}
      <div ref={textRef} className="flex flex-col items-center text-center px-4 w-full max-w-screen-2xl">
        <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 mb-8 backdrop-blur-md pointer-events-auto shadow-2xl">
          <span className="w-2 h-2 rounded-full bg-[#c79a45] animate-pulse" />
          <span className="font-body text-[10px] md:text-xs font-medium uppercase tracking-[0.2em] text-[#FDF6EC]/80">
            Penerimaan Siswa Baru Dibuka
          </span>
        </div>

        <h1 className="font-heading font-bold text-[13vw] md:text-[9vw] leading-[0.9] tracking-tighter uppercase text-[#FDF6EC] drop-shadow-2xl">
          THORIQUL<br/>JANNAH
        </h1>
        
        <p className="mt-8 font-accent italic text-lg md:text-2xl text-[#FDF6EC]/70 max-w-2xl font-light leading-relaxed drop-shadow-lg">
          Jelajahi dimensi baru pendidikan IT.
        </p>

        {/* Scroll Indicator */}
        <div className="mt-20 flex flex-col items-center gap-2 opacity-60">
          <span className="text-[10px] uppercase tracking-[0.3em] text-white">Mulai Perjalanan</span>
          <div className="w-[1px] h-12 bg-gradient-to-b from-white to-transparent" />
        </div>
      </div>
      
    </div>
  );
}

export const HeroCinematicV6 = () => {
  return (
    <section className="relative w-full h-[100dvh] bg-[#0a0806]">
      {/* The R3F Canvas */}
      <Canvas
        camera={{ position: [0, 0, 0], fov: 45 }}
        gl={{ antialias: false, powerPreference: "high-performance" }}
        dpr={[1, 2]}
      >
        <color attach="background" args={['#0a0806']} />
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 10]} intensity={1} />
        
        {/* ScrollControls creates a scrollable area in HTML (e.g. 4 pages tall) 
            and syncs it with the useScroll hook inside the Canvas. */}
        <ScrollControls pages={4} damping={0.25}>
          <Suspense fallback={null}>
            <Scene />
          </Suspense>
          
          {/* We use Scroll html to overlay our DOM on top of the 3D scene, synced with the scroll area */}
          <Scroll html style={{ width: '100%', height: '100%' }}>
            <DOMOverlay />
          </Scroll>
        </ScrollControls>
        
        <Preload all />
      </Canvas>
    </section>
  );
};

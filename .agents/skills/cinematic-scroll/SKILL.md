---
name: cinematic-scroll
description: >
  Skill untuk membangun pengalaman scroll sinematik 3D menggunakan GSAP ScrollTrigger,
  ScrollSmoother, dan WebGL (OGL atau Three.js/R3F). Mencakup dua pola arsitektur utama:
  (1) Cylinder Carousel dengan shader OGL, partikel reaktif, dan kamera orbit,
  (2) Cinematic Scene Showcase dengan Three.js/R3F, kamera path, dan SplitText typography.
  Gunakan skill ini ketika user meminta animasi scroll 3D sinematik, galeri silinder,
  kamera orbit scroll-driven, atau showcase produk/bangunan 3D berbasis scroll.
---

# Cinematic 3D Scroll Animations

Skill ini mengajarkan cara membangun **pengalaman scroll sinematik 3D** berkualitas Awwwards menggunakan GSAP, ScrollTrigger, dan WebGL. Diekstrak dan disempurnakan dari repository referensi [codrops-cinematic-scroll-animations](https://github.com/JosephASG/codrops-cinematic-scroll-animations) oleh JosephASG untuk Codrops.

> **Referensi kode lengkap** tersedia di `repo-ref/` di samping skill ini.

---

## Daftar Isi

1. [Arsitektur Inti](#1-arsitektur-inti)
2. [Pola 1: Cylinder Carousel (OGL)](#2-pola-1-cylinder-carousel-ogl)
3. [Pola 2: Cinematic Scene Showcase (R3F)](#3-pola-2-cinematic-scene-showcase-r3f)
4. [GSAP Plugin & Custom Easing](#4-gsap-plugin--custom-easing)
5. [Responsive & Mobile Strategy](#5-responsive--mobile-strategy)
6. [Typography & Text Overlay](#6-typography--text-overlay)
7. [Performance Guidelines](#7-performance-guidelines)
8. [Adaptasi ke Next.js App Router](#8-adaptasi-ke-nextjs-app-router)
9. [Dependency Reference](#9-dependency-reference)
10. [Anti-Patterns](#10-anti-patterns)

---

## 1. Arsitektur Inti

Kedua pola berbagi arsitektur dasar yang sama:

### The Fixed Canvas + Scroll Proxy Pattern

```
┌─────────────────────────────────────┐
│  <div> Scroll Proxy (500-900svh)    │  ← Invisible, provides scroll height
│    (height creates scrollable area) │
└─────────────────────────────────────┘
┌─────────────────────────────────────┐
│  <div> / <canvas> FIXED inset-0    │  ← Pinned fullscreen, z-0
│    (3D scene renders here)          │
└─────────────────────────────────────┘
┌─────────────────────────────────────┐
│  <div> FIXED inset-0, z-10         │  ← Text overlays, pointer-events-none
│    (positioned typography)          │
└─────────────────────────────────────┘
```

**Prinsip kunci:**
- Canvas/3D scene di-`fixed` ke viewport (`fixed inset-0`), BUKAN di-scroll.
- Sebuah **scroll proxy** div (tinggi `500svh`–`900svh`) menyediakan area scrollable.
- GSAP `ScrollTrigger` mengamati scroll proxy, dan `ScrollSmoother` melapisi inersia halus.
- Semua animasi 3D digerakkan oleh **ref objects** (bukan React state) yang di-tween oleh GSAP timeline.
- Text overlay ditempatkan `fixed` dengan `pointer-events-none`, dianimasikan masuk/keluar per section.

### The Ref-Driven Animation Pattern (Zero Re-renders)

```typescript
// BENAR: Animasi via mutable ref — zero React re-renders
const cameraAnimRef = useRef({ x: 0, y: 0, z: 8 });

gsap.to(cameraAnimRef.current, {
  x: 5, y: 10, z: 3,
  scrollTrigger: { trigger: proxy, scrub: true }
});

// Di render loop (rAF atau useFrame):
camera.position.set(cameraAnimRef.current.x, cameraAnimRef.current.y, cameraAnimRef.current.z);
```

```typescript
// SALAH: useState menyebabkan re-render setiap frame
const [camPos, setCamPos] = useState({ x: 0, y: 0, z: 8 });
// ❌ Ini akan re-render komponen 60x/detik!
```

### ScrollSmoother Setup

```typescript
import { ScrollSmoother } from 'gsap/ScrollSmoother';

const smoother = ScrollSmoother.create({
  wrapper: smoothWrapperRef.current,   // Outer container
  content: smoothContentRef.current,   // Inner scrollable content
  smooth: 4,            // Smoothing factor (higher = more inertia)
  effects: false,       // Disable parallax effects (kita handle sendiri)
  smoothTouch: 0.1,     // Light touch smoothing for mobile
});
```

**JSX Structure:**
```tsx
{/* Fixed 3D Canvas */}
<div className="fixed inset-0 w-full h-svh z-0">
  <canvas ref={canvasRef} className="w-full h-full" style={{ display: 'block' }} />
</div>

{/* Fixed Text Overlays */}
<div className="fixed inset-0 pointer-events-none z-10">
  {/* Positioned text elements */}
</div>

{/* ScrollSmoother Wrapper → provides scrollable area */}
<div ref={smoothWrapperRef} id="smooth-wrapper" className="relative z-20">
  <div ref={smoothContentRef} id="smooth-content">
    <div ref={containerRef} style={{ height: '500svh' }} />
  </div>
</div>
```

---

## 2. Pola 1: Cylinder Carousel (OGL)

Silinder WebGL dengan gambar sebagai tekstur panoramik, diputar oleh scroll, dengan partikel reaktif.

### Dependencies

```
ogl          — Lightweight WebGL library (alternative to Three.js, ~28KB)
gsap         — Animation engine
gsap/ScrollTrigger
gsap/CustomEase
gsap/ScrollSmoother
```

### Cylinder Geometry Creation

```typescript
function createCylinderGeometry(gl: WebGLRenderingContext, config: CylinderConfig) {
  const { radius, height, radialSegments, heightSegments } = config;
  const positions: number[] = [];
  const uvs: number[] = [];
  const indices: number[] = [];

  for (let y = 0; y <= heightSegments; y++) {
    const v = y / heightSegments;
    const yPos = (v - 0.5) * height;
    for (let x = 0; x <= radialSegments; x++) {
      const u = x / radialSegments;
      const theta = u * Math.PI * 2;
      positions.push(Math.cos(theta) * radius, yPos, Math.sin(theta) * radius);
      uvs.push(u, 1 - v);  // Flip V for correct image orientation
    }
  }

  for (let y = 0; y < heightSegments; y++) {
    for (let x = 0; x < radialSegments; x++) {
      const a = y * (radialSegments + 1) + x;
      const b = a + radialSegments + 1;
      indices.push(a, b, a + 1, b, b + 1, a + 1);
    }
  }

  return new Geometry(gl, {
    position: { size: 3, data: new Float32Array(positions) },
    uv:       { size: 2, data: new Float32Array(uvs) },
    index:    { data: new Uint16Array(indices) },
  });
}
```

### Image Atlas Texture

Semua gambar (12 buah) digabungkan menjadi satu atlas texture yang dibungkus di sekeliling silinder:

```typescript
const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d')!;

// Respect GPU texture size limits
const hardwareLimit = gl.getParameter(gl.MAX_TEXTURE_SIZE);
const safeLimit = isMobile ? 2048 : Math.min(hardwareLimit, 8192);
const scale = Math.min(1, safeLimit / (imageWidth * numImages));

canvas.width = Math.floor(imageWidth * numImages * scale);
canvas.height = Math.floor(imageHeight * scale);

// Draw each image side-by-side using object-fit: cover logic
imageElements.forEach((img, i) => {
  const xPos = Math.floor((i / numImages) * canvas.width);
  const xEnd = Math.floor(((i + 1) / numImages) * canvas.width);
  drawImageCover(ctx, img, xPos, 0, xEnd - xPos, canvas.height);
});

const texture = new Texture(gl, {
  wrapS: gl.CLAMP_TO_EDGE,
  wrapT: gl.CLAMP_TO_EDGE,
  minFilter: gl.LINEAR,
  magFilter: gl.LINEAR,
  generateMipmaps: false  // PENTING: false untuk atlas non-power-of-2
});
texture.image = canvas;
```

### GLSL Shaders

**Cylinder vertex/fragment:**
```glsl
// Vertex — passthrough UV
attribute vec2 uv;
attribute vec3 position;
uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}

// Fragment — texture + darkness control
precision highp float;
uniform sampler2D tMap;
uniform float uDarkness;   // 0.0 = normal, 1.0 = fully black
varying vec2 vUv;
void main() {
  vec4 tex = texture2D(tMap, vUv);
  tex.rgb *= (1.0 - uDarkness);
  gl_FragColor = tex;
}
```

**Particle vertex/fragment:**
```glsl
// Vertex
attribute vec3 position;
uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
void main() {
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}

// Fragment
precision highp float;
uniform vec3 uColor;
uniform float uOpacity;
void main() {
  gl_FragColor = vec4(uColor, uOpacity);
}
```

### Camera Animation Timeline (Cinematic Path)

```typescript
const tl = gsap.timeline({
  scrollTrigger: {
    trigger: containerRef.current,
    start: 'top top',
    end: 'bottom bottom',
    scrub: 1,            // 1s smoothing
  },
});

// Sequence of cinematic camera positions
tl.to(cameraAnimRef.current, { x: 0, y: 0, z: 8,   duration: 1,   ease: 'cinematicSilk' })
  .to(cameraAnimRef.current, { x: 0, y: 5, z: 5,   duration: 1,   ease: 'cinematicFlow' })
  .to(cameraAnimRef.current, { x: 1.5, y: 2, z: 2, duration: 2,   ease: 'cinematicLinear' })
  .to(cameraAnimRef.current, { x: 0.5, y: 0, z: 0.8, duration: 3.5, ease: 'power1.inOut' })
  .to(cameraAnimRef.current, { x: -6, y: -1, z: 8, duration: 1,   ease: 'cinematicSmooth' });

// Cylinder rotation (continuous, synced to scroll)
tl.to(cylinderRef.current.rotation, {
  y: '+=28.27',   // ~4.5 full rotations (28.27 ≈ 9π)
  duration: 8.5,
  ease: 'none',
}, 0);             // Start at time 0
```

### Reactive Particles (Velocity-Driven)

Partikel bergerak dan muncul berdasarkan **kecepatan rotasi silinder**, bukan posisi scroll:

```typescript
const animate = () => {
  requestAnimationFrame(animate);

  // Track rotation velocity
  const currentRotation = cylinder.rotation.y;
  const velocity = currentRotation - lastRotation;
  lastRotation = currentRotation;

  // Momentum with decay
  momentum = momentum * 0.92 + velocity * 0.15;
  const speed = Math.abs(velocity) * 100;
  const isRotating = Math.abs(velocity) > 0.0001;

  particles.forEach((particle) => {
    // Fade opacity based on rotation speed
    const targetOpacity = isRotating ? Math.min(speed * 3, 0.95) : 0;
    const currentOpacity = particle.program.uniforms.uOpacity.value;
    particle.program.uniforms.uOpacity.value = currentOpacity + (targetOpacity - currentOpacity) * 0.15;

    if (isRotating) {
      // Rotate particle arc to follow cylinder
      const rotationOffset = velocity * particle.userData.speed * 1.5;
      particle.userData.baseAngle += rotationOffset;

      // Update geometry positions
      const positions = particle.geometry.attributes.position.data;
      for (let j = 0; j <= segments; j++) {
        const t = j / segments;
        const angle = particle.userData.baseAngle + particle.userData.angleSpan * t;
        positions[j * 3] = Math.cos(angle) * particle.userData.radius;
        positions[j * 3 + 1] = particle.userData.baseY;
        positions[j * 3 + 2] = Math.sin(angle) * particle.userData.radius;
      }
      particle.geometry.attributes.position.needsUpdate = true;
    }
  });

  renderer.render({ scene, camera });
};
```

### Particle Geometry (Curved Line Strips)

```typescript
function createParticleGeometry(gl, config, index, height) {
  const startAngle = (index / config.numParticles) * Math.PI * 2;

  // Distribute half above, half below cylinder
  const isTop = index < config.numParticles / 2;
  const yPosition = isTop
    ? height * 0.7 + Math.random() * height * 0.3
    : -height * 1.0 + Math.random() * height * 0.3;

  const positions = [];
  for (let j = 0; j <= config.segments; j++) {
    const t = j / config.segments;
    const angle = startAngle + config.angleSpan * t;
    positions.push(
      Math.cos(angle) * config.particleRadius,
      yPosition,
      Math.sin(angle) * config.particleRadius
    );
  }

  return {
    geometry: new Geometry(gl, {
      position: { size: 3, data: new Float32Array(positions) }
    }),
    userData: { baseAngle: startAngle, angleSpan: config.angleSpan, baseY: yPosition, speed: 0.5 + Math.random(), radius: config.particleRadius }
  };
}
```

---

## 3. Pola 2: Cinematic Scene Showcase (R3F)

Model 3D GLB dengan kamera scroll-driven yang mengorbit objek, dilengkapi SplitText character animation.

### Dependencies

```
three                      — 3D engine
@react-three/fiber         — React wrapper for Three.js
@react-three/drei          — Helper components (useGLTF, PerspectiveCamera)
gsap
gsap/ScrollTrigger
gsap/ScrollSmoother
gsap/SplitText
```

### Scene Setup (R3F Canvas)

```tsx
<Canvas
  gl={{
    antialias: true,
    alpha: false,
    powerPreference: 'high-performance',
  }}
  dpr={[1, 2]}                    // Limit DPR to 2 for performance
  style={{ background: '#0a0a0a' }}
>
  <Scene cameraAnimRef={cameraAnimRef} targetAnimRef={targetAnimRef} />
</Canvas>
```

### Animated Camera (useFrame + Ref)

```tsx
function AnimatedCamera({ cameraAnimRef, targetAnimRef }) {
  const cameraRef = useRef(null);
  const { set } = useThree();

  useEffect(() => {
    if (cameraRef.current) set({ camera: cameraRef.current });
  }, [set]);

  useFrame(() => {
    if (cameraRef.current) {
      cameraRef.current.position.set(
        cameraAnimRef.current.x,
        cameraAnimRef.current.y,
        cameraAnimRef.current.z
      );
      cameraRef.current.lookAt(
        targetAnimRef.current.x,
        targetAnimRef.current.y,
        targetAnimRef.current.z
      );
    }
  });

  return <PerspectiveCamera ref={cameraRef} makeDefault fov={45} near={1} far={1000} />;
}
```

### Scene Perspective Data Structure

```typescript
interface ScenePerspective {
  title: string;
  subtitle: string;
  position: 'top' | 'top-left' | 'left' | 'right' | 'center' | 'top-right' | 'bottom' | 'bottom-left' | 'bottom-right';
  camera: { x: number; y: number; z: number };
  target: { x: number; y: number; z: number };   // lookAt target
  scrollProgress: { start: number; end: number }; // 0-100 percentage
  hideText?: boolean;     // For transition-only sections (no text)
}

// Example data:
const scenePerspectives: ScenePerspective[] = [
  {
    title: 'DISCOVER',
    subtitle: 'The Future of Architecture',
    position: 'center',
    camera: { x: 0, y: 2, z: 10 },
    target: { x: 0, y: 5, z: 0 },
    scrollProgress: { start: 0, end: 11.9 },
  },
  // ... more perspectives
  {
    title: '',
    subtitle: '',
    position: 'top-right',
    camera: { x: 5, y: 35, z: 5 },
    target: { x: 0, y: 20, z: 0 },
    scrollProgress: { start: 45.8, end: 52.5 },
    hideText: true,   // ← Pure camera transition, no text
  },
];
```

### Camera Path Timeline (Data-Driven)

```typescript
const tl = gsap.timeline({
  scrollTrigger: {
    trigger: containerRef.current,
    start: 'top top',
    end: 'bottom bottom',
    scrub: true,           // Direct 1:1 scrub (no smoothing lag)
    onUpdate: (self) => {
      // Optional: update progress bar
      const progress = self.progress * 100;
      setProgressWidth(progress);
      setProgressText(Math.round(progress).toString().padStart(3, '0') + '%');
    },
  },
});

// Build timeline from perspective data
scenePerspectives.forEach((perspective) => {
  const start = perspective.scrollProgress.start / 100;
  const end = perspective.scrollProgress.end / 100;

  tl.to(cameraAnimRef.current, {
    x: perspective.camera.x,
    y: perspective.camera.y,
    z: perspective.camera.z,
    duration: end - start,
    ease: 'none',
  }, start);

  tl.to(targetAnimRef.current, {
    x: perspective.target.x,
    y: perspective.target.y,
    z: perspective.target.z,
    duration: end - start,
    ease: 'none',
  }, start);
});
```

### SplitText Character Animation

```typescript
// Wait for fonts to load before splitting
document.fonts.ready.then(() => {
  scenePerspectives.forEach((perspective, index) => {
    const textEl = textRefs.current[index];
    if (!textEl || perspective.hideText) return;

    const titleEl = textEl.querySelector('h2');
    const subtitleEl = textEl.querySelector('p');

    const titleSplit = new SplitText(titleEl, { type: 'chars' });
    const subtitleSplit = new SplitText(subtitleEl, { type: 'chars' });

    const textTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: `${perspective.scrollProgress.start}% top`,
        end: `${perspective.scrollProgress.end}% top`,
        scrub: 0.5,
      },
    });

    if (index === 0) {
      // First section: start visible, animate out
      gsap.set([titleSplit.chars, subtitleSplit.chars], { x: 0, opacity: 1 });
      textTimeline.to([subtitleSplit.chars, titleSplit.chars], {
        x: 100, opacity: 0, duration: 1, stagger: -0.02, ease: 'power2.in',
      });
    } else {
      // Other sections: animate in → hold → animate out
      textTimeline
        .fromTo([subtitleSplit.chars, titleSplit.chars],
          { x: -100, opacity: 0 },
          { x: 0, opacity: 1, duration: 0.25, stagger: -0.02, ease: 'power2.out' }
        )
        .to({}, { duration: 0.5 })    // Hold visible
        .to([subtitleSplit.chars, titleSplit.chars], {
          x: 100, opacity: 0, duration: 0.25, stagger: -0.02, ease: 'power2.in',
        });
    }
  });
});

// CRITICAL: Cleanup on unmount
return () => {
  splitInstances.forEach(split => split.revert());
  ScrollTrigger.getAll().forEach(trigger => trigger.kill());
};
```

---

## 4. GSAP Plugin & Custom Easing

### Plugin Registration

```typescript
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CustomEase } from 'gsap/CustomEase';
import { ScrollSmoother } from 'gsap/ScrollSmoother';
import { SplitText } from 'gsap/SplitText';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, CustomEase, ScrollSmoother, SplitText);
}
```

### Custom Easing Curves

```typescript
CustomEase.create('cinematicSilk',   '0.45, 0.05, 0.55, 0.95');  // Symmetric ease
CustomEase.create('cinematicSmooth', '0.25, 0.1, 0.25, 1');       // Smooth deceleration
CustomEase.create('cinematicFlow',   '0.33, 0, 0.2, 1');          // Natural flow
CustomEase.create('cinematicLinear', '0.4, 0, 0.6, 1');           // Near-linear with soft edges
```

**Kapan menggunakan masing-masing:**
| Ease | Penggunaan |
|------|-----------|
| `cinematicSilk` | Transisi kamera utama yang simetris |
| `cinematicSmooth` | Teks fade-in/out yang halus |
| `cinematicFlow` | Pergerakan kamera yang mengalir natural |
| `cinematicLinear` | Pergerakan kamera yang hampir linear |
| `'none'` | Rotasi silinder kontinu (constant speed) |
| `'power1.inOut'` | Close-up / zoom yang dramatis |

---

## 5. Responsive & Mobile Strategy

### Dynamic Dimensions Pattern

```typescript
const getResponsiveDimensions = () => {
  const width = window.innerWidth;
  const isMobile = width < 768;
  const isTablet = width >= 768 && width < 1024;

  return {
    cylinderScale: (isMobile ? 1.8 : isTablet ? 2.2 : 2.5) / baseRadius,
    cameraZ: isMobile ? 6 : isTablet ? 7 : 8,
    fov: isMobile ? 50 : 45,
    isMobile,
  };
};
```

### Mobile Address Bar Jump Prevention

```typescript
let lastWidth = window.innerWidth;

const handleResize = () => {
  const currentWidth = window.innerWidth;
  const dims = getResponsiveDimensions();

  // CRITICAL: On mobile, if width hasn't changed, it's just the URL bar showing/hiding.
  // Abort resize to prevent camera zoom/crop artifacts.
  if (dims.isMobile && currentWidth === lastWidth) return;
  lastWidth = currentWidth;

  // Safe to resize
  renderer.setSize(currentWidth, window.innerHeight);
  camera.perspective({ fov: dims.fov, aspect: currentWidth / window.innerHeight });
};
```

### Texture Size Limits

```typescript
const hardwareLimit = gl.getParameter(gl.MAX_TEXTURE_SIZE);
const safeLimit = isMobile ? 2048 : Math.min(hardwareLimit, 8192);
```

---

## 6. Typography & Text Overlay

### Position Utility Function

```typescript
function getPositionClasses(position: string): string {
  const map: Record<string, string> = {
    'top':          'top-[20vh] left-1/2 -translate-x-1/2 text-center',
    'top-left':     'top-[20vh] left-20 max-md:left-6',
    'left':         'left-[20vh] top-1/2 -translate-y-1/2',
    'right':        'right-20 top-1/2 -translate-y-1/2',
    'center':       'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center',
    'top-right':    'top-[20vh] right-20 flex flex-col items-end',
    'bottom':       'bottom-[20vh] left-1/2 -translate-x-1/2 text-center',
    'bottom-left':  'bottom-[20vh] left-20 flex flex-col items-start text-left',
    'bottom-right': 'bottom-[20vh] right-20 flex flex-col items-end text-right',
  };
  return map[position] || map['center'];
}
```

### Text Overlay JSX Pattern

```tsx
<div className="fixed inset-0 pointer-events-none z-10">
  {perspectives.map((perspective, index) => (
    <div
      key={index}
      ref={(el) => { textRefs.current[index] = el; }}
      className={`absolute max-md:w-full ${getPositionClasses(perspective.position)}`}
    >
      <h2 className="text-[4vw] max-md:text-2xl font-bold leading-[1.1] mb-2 tracking-tight text-white drop-shadow-2xl">
        {perspective.title}
      </h2>
      <p className="text-[1.25vw] max-md:text-lg leading-[1.4] text-white/70 font-light drop-shadow-lg">
        {perspective.subtitle}
      </p>
    </div>
  ))}
</div>
```

---

## 7. Performance Guidelines

### WAJIB

- [ ] **Gunakan `useRef` untuk animasi**, BUKAN `useState` — mencegah re-render React
- [ ] **DPR cap: `dpr={[1, 2]}`** — jangan biarkan device 3x DPR menghabiskan GPU
- [ ] **`generateMipmaps: false`** untuk atlas texture non-power-of-2
- [ ] **Mobile texture limit: 2048px** — cek `gl.getParameter(gl.MAX_TEXTURE_SIZE)`
- [ ] **`gl.disable(gl.CULL_FACE)`** untuk silinder (agar sisi dalam terlihat)
- [ ] **Satu `requestAnimationFrame` loop** — jangan buat multiple rAF
- [ ] **Cleanup ScrollTrigger + ScrollSmoother** di return function useEffect/useGSAP

### DILARANG

- ❌ `useState` untuk posisi kamera, rotasi, atau properti per-frame
- ❌ `backdrop-blur` pada elemen scroll
- ❌ `h-screen` — gunakan `h-svh` (small viewport height) untuk mobile
- ❌ Multiple `requestAnimationFrame` loops
- ❌ Memuat gambar tanpa `crossOrigin = 'anonymous'`
- ❌ Lupa `texture.needsUpdate = true` setelah assign `texture.image`

---

## 8. Adaptasi ke Next.js App Router

Untuk mengadaptasi pola ini ke Next.js (bukan Vite):

### 1. Client Component Directive

```typescript
'use client';  // WAJIB di baris pertama
```

### 2. SSR Guard

```typescript
// Guard window-dependent code
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, CustomEase, ScrollSmoother);
}
```

### 3. Dynamic Import (untuk Three.js/R3F)

```typescript
import dynamic from 'next/dynamic';

const CinematicScene = dynamic(
  () => import('@/components/sections/CinematicScene'),
  { ssr: false }  // Three.js membutuhkan browser APIs
);
```

### 4. Image Loading (Next/Image vs Raw)

Untuk texture atlas OGL, tetap gunakan raw `Image()` (bukan `next/image`):

```typescript
const img = new Image();
img.crossOrigin = 'anonymous';
img.onload = () => { /* draw to canvas */ };
img.src = '/img/img1.webp';
```

Untuk text overlay atau UI image, gunakan `next/image`:

```tsx
import Image from 'next/image';
<Image src="/img/hero.webp" alt="..." fill className="object-cover" />
```

### 5. useGSAP (Bukan useEffect)

Di Next.js + React, gunakan `useGSAP` dari `@gsap/react`:

```typescript
import { useGSAP } from '@gsap/react';

useGSAP(() => {
  // Semua setup GSAP di sini
  // Cleanup otomatis saat unmount
}, { scope: containerRef });
```

---

## 9. Dependency Reference

| Package | Version | Fungsi |
|---------|---------|--------|
| `gsap` | ^3.13.0 | Animation engine, ScrollTrigger, CustomEase, ScrollSmoother, SplitText |
| `ogl` | ^1.0.11 | Lightweight WebGL (Variant 1 — cylinder) |
| `three` | ^0.180.0 | Full 3D engine (Variant 2 — GLB scene) |
| `@react-three/fiber` | ^9.4.0 | React wrapper for Three.js |
| `@react-three/drei` | ^10.7.6 | Helper components (useGLTF, PerspectiveCamera) |
| `@react-three/postprocessing` | ^3.0.4 | Post-processing effects (bloom, vignette) |
| `tailwindcss` | ^4.1.11 | Utility-first CSS |
| `tailwind-merge` | ^3.3.1 | Class merging utility |

---

## 10. Anti-Patterns

| ❌ Anti-Pattern | ✅ Correct Approach |
|----------------|-------------------|
| `useState` untuk kamera position | `useRef` + GSAP tween |
| Multiple rAF loops | Satu rAF atau `useFrame` |
| `useEffect` untuk GSAP di React | `useGSAP` dari `@gsap/react` |
| Hard-coded viewport height | `svh` unit + responsive breakpoints |
| Resize handler tanpa mobile guard | Cek `currentWidth === lastWidth` |
| `generateMipmaps: true` pada atlas | `generateMipmaps: false` |
| Direct `window.scrollY` reads | `ScrollTrigger.progress` via `onUpdate` |
| CSS scroll animations | GSAP `scrub` untuk 3D scene sync |
| Inline style animations | GSAP `quickSetter` untuk per-frame updates |
| Lupa cleanup SplitText | `split.revert()` di cleanup function |

---

## Quick Start Checklist

Saat membangun pengalaman cinematic scroll 3D:

1. **Pilih renderer**: OGL (ringan, shader manual) vs R3F (ecosystem Three.js penuh)
2. **Setup scroll proxy**: Fixed canvas + tall scroll proxy div
3. **Setup ScrollSmoother**: `smooth: 4`, `smoothTouch: 0.1`
4. **Definisikan perspectives**: Array of `{ camera, target, scrollProgress, title }`
5. **Build camera timeline**: `gsap.timeline({ scrollTrigger: { scrub: true } })`
6. **Animate text overlays**: SplitText chars atau simple opacity/transform
7. **Add custom easing**: `CustomEase.create(...)` untuk nuansa sinematik
8. **Handle responsive**: Mobile texture limits, FOV changes, address bar jumps
9. **Performance audit**: Cek DPR cap, texture size, single rAF loop
10. **Cleanup**: Kill all ScrollTriggers, revert SplitText, dispose WebGL resources

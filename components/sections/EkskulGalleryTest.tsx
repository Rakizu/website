'use client';

import React, { useRef, useState, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import Image from 'next/image';
import { X, Eye } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface Ekskul {
  id: string;
  nama: string;
  kategori: string;
  deskripsi: string;
  mainImage: string;
  galleryImages: string[];
}

// Default fallback images in case the CMS data is incomplete
const fallbackMainImages = [
  "https://images.unsplash.com/photo-1523301343968-6a6ebf63c672?q=80&w=1200&auto=format&fit=crop", 
  "https://images.unsplash.com/photo-1542816417-0983c9c9ad53?q=80&w=1200&auto=format&fit=crop", 
  "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1200&auto=format&fit=crop"
];

const fallbackDriftImages = [
  "https://images.unsplash.com/photo-1511632765486-a01980e01a18?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1529390079861-591de354faf5?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1444065381814-865dc9da92c0?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1506869640319-fea1a275306c?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1523580494112-071d384e236c?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1473679408190-0693dd22fe6a?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?q=80&w=800&auto=format&fit=crop"
];

// Helper to get exactly 9 images for the grid
const getDriftImages = (ekskul: Ekskul) => {
  const source = (ekskul.galleryImages && ekskul.galleryImages.length > 0) ? ekskul.galleryImages : fallbackDriftImages;
  const result = [];
  for (let i = 0; i < 9; i++) {
    result.push(source[i % source.length]);
  }
  return result;
};

// --- Sub-component: Column Drift Overlay ---
const ColumnDriftOverlay = ({ ekskul, mainImage, onClose }: { ekskul: Ekskul, mainImage: string, onClose: () => void }) => {
  const overlayRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  
  const track1Ref = useRef<HTMLDivElement>(null);
  const track2Ref = useRef<HTMLDivElement>(null);
  const track3Ref = useRef<HTMLDivElement>(null);
  
  const track2ContainerRef = useRef<HTMLDivElement>(null);
  const flipTargetRef = useRef<HTMLDivElement>(null);
  const flipDummyRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!overlayRef.current || !flipDummyRef.current || !flipTargetRef.current || !track2ContainerRef.current) return;
    const tl = gsap.timeline();

    // 1. Initial State
    gsap.set(overlayRef.current, { backgroundColor: 'transparent' });
    tl.to(overlayRef.current, { backgroundColor: '#191310', duration: 1.0, ease: "power2.inOut" }, 0);

    // Siapkan dummy elemen untuk memenuhi layar penuh
    gsap.set(flipDummyRef.current, {
      position: "fixed", 
      top: 0, left: 0,
      width: "100vw", height: "100vh",
      borderRadius: 0, 
      zIndex: 50, 
      opacity: 1
    });

    gsap.set('.dummy-dark-overlay', { opacity: 0.3 });
    gsap.set('.dummy-content', { opacity: 1, scale: 1 });

    const tracks = [track1Ref.current, track2Ref.current, track3Ref.current];
    gsap.set(tracks, { opacity: 1 }); // Track harus terlihat, konten yang disembunyikan

    const gridItems = gsap.utils.toArray('.grid-item-animate');
    const allTargets = gsap.utils.toArray('.flip-target');
    
    // Sembunyikan semua item di dalam grid
    gsap.set([gridItems, allTargets], { opacity: 0 });

    // Posisikan awal track2 untuk Marquee turun
    // track2Ref.current diset ke yPercent: -50 agar isi keduanya yang ada flip-target berada di layar
    gsap.set(track2Ref.current, { yPercent: -50 });

    // 2. Kalkulasi Offset agar flipTarget berada tepat di tengah layar
    // Kita harus menghitung rect setelah initial set di atas (karena yPercent: -50 sudah diterapkan)
    const targetRect = flipTargetRef.current.getBoundingClientRect();
    const viewportCenterY = window.innerHeight / 2;
    const targetCenterY = targetRect.top + targetRect.height / 2;
    const offset = viewportCenterY - targetCenterY;
    
    // Offset container tengah agar gambar benar-benar di tengah layar
    gsap.set(track2ContainerRef.current, { y: offset });

    // Ambil ulang Rect yang final setelah di-offset
    const finalRect = flipTargetRef.current.getBoundingClientRect();

    // Cosmic Grid Assembly Setup (Added random rotation and X offset for organic feel)
    gsap.set(gridItems, {
      scale: 2,
      opacity: 0,
      x: () => gsap.utils.random(-100, 100),
      y: () => gsap.utils.random(-200, 200),
      rotation: () => gsap.utils.random(-15, 15),
      filter: 'blur(30px)'
    });

    // 3. Animasi FLIP dari fullscreen menuju kotak grid
    tl.to(flipDummyRef.current, {
      top: finalRect.top,
      left: finalRect.left,
      width: finalRect.width,
      height: finalRect.height,
      borderRadius: 24, // Sesuai dengan rounded-3xl
      duration: 1.6,
      ease: "expo.inOut"
    }, 0);
    
    // Fade out konten dummy dan overlay gelap
    tl.to('.dummy-dark-overlay', { opacity: 0, duration: 1.0, ease: "power2.inOut" }, 0);
    tl.to('.dummy-content', { opacity: 0, scale: 0.9, duration: 0.6, ease: "power2.inOut" }, 0);

    // 3.5 Cosmic Assembly (Foto lain mendarat organik)
    tl.to(gridItems, {
      scale: 1,
      opacity: 1,
      x: 0,
      y: 0,
      rotation: 0,
      filter: 'blur(0px)',
      duration: 1.8,
      stagger: { amount: 0.5, from: "center" }, // Efek riak/gelombang dari tengah
      ease: "expo.out"
    }, 0.15);

    // 4. Fade In teks
    tl.fromTo(contentRef.current,
      { opacity: 0, y: -20 },
      { opacity: 1, y: 0, duration: 1, ease: "power2.out" },
      0.8
    );

    // 5. The Swap & Play
    tl.add(() => {
      // Tukar opacity seketika saat dummy mendarat sempurna
      gsap.set(allTargets, { opacity: 1 });
      gsap.set(flipDummyRef.current, { opacity: 0 });

      // Mulai Marquee secara perlahan
      const driftTl = gsap.timeline();
      
      // Col 1: Ke atas
      driftTl.fromTo(track1Ref.current, 
        { yPercent: 0 }, { yPercent: -50, ease: "none", duration: 40, repeat: -1 }
      , 0);
      
      // Col 2: Ke bawah
      driftTl.fromTo(track2Ref.current, 
        { yPercent: -50 }, { yPercent: 0, ease: "none", duration: 45, repeat: -1 }
      , 0);
      
      // Col 3: Ke atas
      driftTl.fromTo(track3Ref.current, 
        { yPercent: 0 }, { yPercent: -50, ease: "none", duration: 35, repeat: -1 }
      , 0);
      
    }, 1.2);

  }, []);

  const handleClose = () => {
    if (!overlayRef.current || !flipDummyRef.current || !flipTargetRef.current) return;
    
    // Hentikan semua animasi di track
    gsap.killTweensOf([track1Ref.current, track2Ref.current, track3Ref.current]);

    const tl = gsap.timeline({ onComplete: onClose });
    
    const gridItems = gsap.utils.toArray('.grid-item-animate');
    const allTargets = gsap.utils.toArray('.flip-target');

    // Ambil posisi terakhir dari elemen di dalam grid yang sedang berjalan
    const currentRect = flipTargetRef.current.getBoundingClientRect();
    
    // Pasang dummy kembali ke posisi grid tersebut
    gsap.set(flipDummyRef.current, {
      top: currentRect.top, 
      left: currentRect.left,
      width: currentRect.width, 
      height: currentRect.height,
      opacity: 1,
      borderRadius: 24
    });

    // Sembunyikan target asli dan tukar kembali ke dummy
    gsap.set(allTargets, { opacity: 0 });

    // Grid Disassembly
    tl.to(gridItems, {
      scale: 2,
      opacity: 0,
      x: () => gsap.utils.random(-100, 100),
      y: () => gsap.utils.random(-200, 200),
      rotation: () => gsap.utils.random(-15, 15),
      filter: 'blur(30px)',
      duration: 1.2,
      stagger: { amount: 0.3, from: "center" },
      ease: "expo.in"
    }, 0);

    tl.to(contentRef.current, { opacity: 0, duration: 0.4, ease: "power2.in" }, 0);
    
    // Mekar kembali ke Fullscreen
    tl.to(flipDummyRef.current, {
      top: 0, left: 0,
      width: "100vw", height: "100vh", 
      borderRadius: 0,
      duration: 1.4, ease: "expo.inOut"
    }, 0);
    
    // Fade in kembali konten dummy dan overlay gelap untuk seamless transition ke parent
    tl.to('.dummy-dark-overlay', { opacity: 0.3, duration: 1.4, ease: "expo.inOut" }, 0);
    tl.to('.dummy-content', { opacity: 1, scale: 1, duration: 1.0, ease: "power2.out", delay: 0.4 }, 0);

    tl.to(overlayRef.current, { backgroundColor: 'transparent', duration: 1.4, ease: "expo.inOut" }, 0);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => { if (e.key === 'Escape') handleClose(); };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // --- Grid Items Setup ---
  const dImages = getDriftImages(ekskul);
  const col1Items = [dImages[0], dImages[1], dImages[2], dImages[3]].map((src, i) => (
    <div key={i} className="grid-item-animate relative w-full h-[40vh] md:h-[60vh] rounded-3xl overflow-hidden shrink-0">
      <Image src={src} alt="Kegiatan" fill className="object-cover" />
    </div>
  ));
  
  const Col2Set = ({ isTarget = false }: { isTarget?: boolean }) => (
    <>
      <div className="grid-item-animate relative w-full h-[40vh] md:h-[60vh] rounded-3xl overflow-hidden shrink-0">
        <Image src={dImages[4]} alt="Kegiatan" fill className="object-cover" />
      </div>
      <div ref={isTarget ? flipTargetRef : null} className="flip-target relative w-full h-[50vh] md:h-[70vh] shrink-0 rounded-3xl overflow-hidden shadow-2xl">
        <Image src={mainImage} alt={ekskul.nama} fill className="object-cover" priority />
      </div>
      <div className="grid-item-animate relative w-full h-[40vh] md:h-[60vh] rounded-3xl overflow-hidden shrink-0">
        <Image src={dImages[5]} alt="Kegiatan" fill className="object-cover" />
      </div>
    </>
  );

  const col3Items = [dImages[6], dImages[7], dImages[8], dImages[0]].map((src, i) => (
    <div key={i} className="grid-item-animate relative w-full h-[40vh] md:h-[60vh] rounded-3xl overflow-hidden shrink-0">
      <Image src={src} alt="Kegiatan" fill className="object-cover" />
    </div>
  ));

  return (
    <div ref={overlayRef} className="fixed inset-0 z-50 overflow-hidden flex flex-col justify-center items-center pointer-events-auto">
      
      {/* Elemen Dummy Fullscreen */}
      <div ref={flipDummyRef} className="absolute overflow-hidden shadow-2xl will-change-transform transform-gpu pointer-events-none opacity-0 flex items-center justify-center">
        <Image src={mainImage} alt={ekskul.nama} fill className="object-cover" priority />
        <div className="dummy-dark-overlay absolute inset-0 bg-black" />
        
        <div className="dummy-content relative z-10 flex flex-col items-center justify-center text-center max-w-3xl px-6 pointer-events-none">
          <h3 className="text-5xl md:text-7xl font-heading font-bold tracking-tight mb-6 text-white drop-shadow-lg">{ekskul.nama}</h3>
          <p className="text-lg md:text-2xl text-cream/90 leading-relaxed mb-10 drop-shadow-md">{ekskul.deskripsi}</p>
          <button className="group flex items-center gap-3 bg-white/10 backdrop-blur-md border border-white/20 text-white px-8 py-4 rounded-full">
            <Eye className="w-5 h-5" />
            <span className="font-heading font-medium tracking-wide uppercase text-sm">Lihat Kegiatan</span>
          </button>
        </div>
      </div>

      <div ref={contentRef} className="absolute top-0 left-0 right-0 z-20 p-6 md:p-10 flex justify-between items-center bg-gradient-to-b from-black/80 via-black/40 to-transparent">
        <div>
          <h3 className="text-3xl md:text-5xl font-heading font-bold text-white mb-2">{ekskul.nama}</h3>
          <p className="text-cream text-sm md:text-base max-w-md">Galeri kegiatan & dokumentasi aksi</p>
        </div>
        <button onClick={handleClose} className="bg-white/10 hover:bg-white/20 backdrop-blur-md p-4 rounded-full text-white transition-all active:scale-95 border border-white/20">
          <X className="w-6 h-6" />
        </button>
      </div>

      <div className="w-full max-w-7xl mx-auto h-[100vh] px-4 md:px-8 flex gap-4 md:gap-8 items-start justify-center overflow-hidden pointer-events-none">
        
        {/* Kolom 1 - Ke Atas */}
        <div className="flex-1 relative h-full">
          <div ref={track1Ref} className="absolute top-0 left-0 w-full flex flex-col gap-4 md:gap-8 will-change-transform opacity-0">
            <div className="flex flex-col gap-4 md:gap-8">{col1Items}</div>
            <div className="flex flex-col gap-4 md:gap-8">{col1Items}</div>
          </div>
        </div>
        
        {/* Kolom 2 - Ke Bawah (Mulai dari -50%) */}
        <div className="flex-1 relative h-full">
          {/* Container offset agar gambar tepat di tengah */}
          <div ref={track2ContainerRef} className="absolute top-0 left-0 w-full h-full">
            <div ref={track2Ref} className="absolute top-0 left-0 w-full flex flex-col gap-4 md:gap-8 will-change-transform opacity-0">
              <div className="flex flex-col gap-4 md:gap-8"><Col2Set /></div>
              <div className="flex flex-col gap-4 md:gap-8"><Col2Set isTarget /></div>
            </div>
          </div>
        </div>
        
        {/* Kolom 3 - Ke Atas */}
        <div className="flex-1 relative h-full">
          <div ref={track3Ref} className="absolute top-0 left-0 w-full flex flex-col gap-4 md:gap-8 will-change-transform opacity-0">
            <div className="flex flex-col gap-4 md:gap-8">{col3Items}</div>
            <div className="flex flex-col gap-4 md:gap-8">{col3Items}</div>
          </div>
        </div>

      </div>
    </div>
  );
};

// --- Main Component ---
interface EkskulNonAkademikProps {
  ekskul: Ekskul[];
}

export const EkskulGalleryTest: React.FC<EkskulNonAkademikProps> = ({ ekskul }) => {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [activeEkskulId, setActiveEkskulId] = useState<string | null>(null);

  const wrapperRefs = useRef<(HTMLDivElement | null)[]>([]);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const contentRefs = useRef<(HTMLDivElement | null)[]>([]);
  const darkOverlayRefs = useRef<(HTMLDivElement | null)[]>([]);

  useGSAP(() => {
    if (!sectionRef.current || !trackRef.current) return;
    
    // Ignore mobile for this test component
    if (window.innerWidth < 768) return;

    const wrappers = wrapperRefs.current.filter(Boolean) as HTMLElement[];
    if (wrappers.length === 0) return;

    const scrollDistance = (wrappers.length - 1) * window.innerWidth;
    const totalScrollLength = wrappers.length * 1500;

    const tween = gsap.to(trackRef.current, {
      x: -scrollDistance,
      ease: "none",
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top top",
        end: `+=${totalScrollLength}`,
        pin: true,
        scrub: 1.5,
        snap: {
          snapTo: (progress) => {
            const total = wrappers.length - 1;
            return Math.round(progress * total) / total;
          },
          duration: { min: 0.3, max: 0.8 },
          delay: 0.15,
          ease: "power2.inOut"
        }
      }
    });

    wrappers.forEach((wrapper, i) => {
      const card = cardRefs.current[i];
      const content = contentRefs.current[i];
      const overlay = darkOverlayRefs.current[i];
      if (!card || !content || !overlay) return;

      // Card scale & Depth of Field (Blur) - Tidak ada lagi opacity: 0
      gsap.fromTo(card, 
        { scale: 0.4, filter: 'blur(10px)' }, 
        { scale: 1, filter: 'blur(0px)', ease: "power2.inOut",
          scrollTrigger: { trigger: wrapper, containerAnimation: tween, start: "left right", end: "center center", scrub: true } }
      );
      gsap.fromTo(card, 
        { scale: 1, filter: 'blur(0px)' },
        { scale: 0.4, filter: 'blur(10px)', ease: "power2.inOut",
          scrollTrigger: { trigger: wrapper, containerAnimation: tween, start: "center center", end: "right left", scrub: true } }
      );

      // Dynamic Exposure Overlay (Terang saat di tengah, Gelap saat menyusut)
      gsap.fromTo(overlay,
        { opacity: 0.8 },
        { opacity: 0.3, ease: "power2.inOut",
          scrollTrigger: { trigger: wrapper, containerAnimation: tween, start: "left right", end: "center center", scrub: true } }
      );
      gsap.fromTo(overlay,
        { opacity: 0.3 },
        { opacity: 0.8, ease: "power2.inOut",
          scrollTrigger: { trigger: wrapper, containerAnimation: tween, start: "center center", end: "right left", scrub: true } }
      );

      gsap.fromTo(content, 
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, ease: "power2.out",
          scrollTrigger: { trigger: wrapper, containerAnimation: tween, start: "center 60%", end: "center center", scrub: true } }
      );
      gsap.fromTo(content, 
        { opacity: 1, y: 0 },
        { opacity: 0, y: -50, ease: "power2.in",
          scrollTrigger: { trigger: wrapper, containerAnimation: tween, start: "center center", end: "center 40%", scrub: true } }
      );
    });
  }, { scope: sectionRef });

  useEffect(() => {
    if (activeEkskulId) document.body.classList.add('overflow-hidden');
    else document.body.classList.remove('overflow-hidden');
    return () => { document.body.classList.remove('overflow-hidden'); };
  }, [activeEkskulId]);

  return (
    <section id="ekskul-test" data-theme="dark" ref={sectionRef} className="relative bg-charcoal-ink text-pure-surface overflow-hidden">
      
      <div className="absolute top-12 left-16 z-0 mix-blend-overlay opacity-30 pointer-events-none">
        <h2 className="text-[8vw] font-heading font-bold tracking-tighter leading-none text-white whitespace-nowrap">
          Ekskul Test
        </h2>
      </div>

      <div ref={trackRef} className="flex w-max h-screen will-change-transform items-center">
        {ekskul.map((e, i) => (
          <div key={e.id} ref={el => { wrapperRefs.current[i] = el; }} className="w-screen h-screen flex items-center justify-center shrink-0 relative">
            <div ref={el => { cardRefs.current[i] = el; }} className="absolute inset-0 w-full h-full transform-gpu overflow-hidden origin-center will-change-transform rounded-none">
              <Image src={e.mainImage || fallbackMainImages[i % fallbackMainImages.length]} alt={e.nama} fill className="object-cover" sizes="100vw" priority={i === 0} />
              <div ref={el => { darkOverlayRefs.current[i] = el; }} className="absolute inset-0 bg-black" /> 
            </div>

            <div ref={el => { contentRefs.current[i] = el; }} className="relative z-10 flex flex-col items-center justify-center text-center max-w-3xl px-6 pointer-events-auto">
              <h3 className="text-5xl md:text-7xl font-heading font-bold tracking-tight mb-6 text-white drop-shadow-lg">{e.nama}</h3>
              <p className="text-lg md:text-2xl text-cream/90 leading-relaxed mb-10 drop-shadow-md">{e.deskripsi}</p>
              
              <button onClick={() => setActiveEkskulId(e.id)} className="group flex items-center gap-3 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white px-8 py-4 rounded-full transition-all duration-300 active:scale-95">
                <Eye className="w-5 h-5" />
                <span className="font-heading font-medium tracking-wide uppercase text-sm">Lihat Kegiatan</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {activeEkskulId && (
        <ColumnDriftOverlay 
          ekskul={ekskul.find(e => e.id === activeEkskulId)!} 
          mainImage={ekskul.find(e => e.id === activeEkskulId)?.mainImage || fallbackMainImages[0]}
          onClose={() => setActiveEkskulId(null)} 
        />
      )}
    </section>
  );
};

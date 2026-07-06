'use client';

import React, { useRef, useState, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { usePathname, useRouter } from 'next/navigation';
import { IslamicPattern } from '@/components/ui/IslamicPattern';

gsap.registerPlugin(ScrollTrigger);

const navLinks = [
  { label: 'Visi', href: '#visi' },
  { label: 'Fasilitas', href: '#fasilitas' },
  { label: 'Guru', href: '#guru' },
  { label: 'Akademik', href: '#kurikulum' },
  { label: 'Unggulan', href: '#unggulan' },
  { label: 'Ekskul', href: '#ekskul' },
  { label: 'Alumni', href: '#alumni' },
  { label: 'Artikel', href: '#artikel' },
];

export const Navbar = () => {
  const navRef = useRef<HTMLElement>(null);
  const curtainRef = useRef<SVGSVGElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const isAnimating = useRef(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const pathname = usePathname();
  const router = useRouter();

  // Effect untuk mempercepat animasi (skip) saat baru pindah halaman via Navbar
  useEffect(() => {
    if (sessionStorage.getItem('skipNextReveal') === 'true') {
      sessionStorage.removeItem('skipNextReveal');
      const interval = setInterval(() => {
        ScrollTrigger.getAll().forEach(t => {
          if (t.isActive && t.animation) {
            t.animation.progress(1);
          }
        });
      }, 50);
      setTimeout(() => clearInterval(interval), 1500);
    }
  }, [pathname]);

  useGSAP(() => {
    // Global shrink/expand based on scroll position
    const shrinkOffset = pathname === '/' ? window.innerHeight * 2.8 : 100;
    ScrollTrigger.create({
      start: `top -${shrinkOffset}`,
      end: "max",
      onEnter: () => setIsScrolled(true),
      onLeaveBack: () => setIsScrolled(false),
    });

    // 3. Real-time Intelligence Scanner for pixel-perfect theme detection
    ScrollTrigger.create({
      start: 0,
      end: "max",
      onUpdate: () => {
        // Sample a point directly behind the center of the Navbar
        const elements = document.elementsFromPoint(window.innerWidth / 2, 28);
        const themeElement = elements.find(el => el.hasAttribute('data-theme'));
        
        if (themeElement) {
          const detectedTheme = themeElement.getAttribute('data-theme');
          if (detectedTheme === 'light' || detectedTheme === 'dark') {
            setTheme(detectedTheme);
          }
        }
      }
    });

    // Initialize curtain safely out of sight
    if (curtainRef.current) {
      gsap.set(curtainRef.current, { autoAlpha: 0 });
      curtainRef.current.querySelectorAll('path').forEach(p => p.setAttribute("d", "M 0 0 L 100 0 L 100 0 Q 50 0 0 0 Z"));
    }
  }, { scope: navRef });

  const executeTransition = (href: string, isRoute: boolean = false) => {
    if (isAnimating.current) return;
    
    // Gunakan window.location.pathname agar selalu fresh dan terhindar dari stale closure di useEffect
    const currentPath = window.location.pathname;
    
    // Pengecualian khusus: Jika di halaman artikel dan klik navbar Artikel, tetap di halaman (gulir ke grid bawah)
    const isArticleToArticle = currentPath.startsWith('/artikel') && href === '#artikel';
    const isCrossPageHash = currentPath !== '/' && href.startsWith('#') && !isArticleToArticle;
    
    const target = (!isRoute && !isCrossPageHash) ? document.querySelector(href) : null;
    
    // Cek apakah pengunjung sudah berada di section tersebut (rect.top berada di dekat area pandang)
    let isAlreadyInSection = false;
    if (target) {
      const rect = target.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      // Jika jarak atas elemen kurang dari setengah layar, berarti kita sedang melihatnya
      if (Math.abs(rect.top) < viewportHeight * 0.5) {
        isAlreadyInSection = true;
      }
    }
    
    // Tirai dipicu jika: rute berubah, lompat dari halaman lain, atau target valid TAPI belum dilihat
    const shouldRunCurtain = (target && !isArticleToArticle && !isAlreadyInSection) || isRoute || isCrossPageHash;
    
    if (shouldRunCurtain && curtainRef.current && contentRef.current) {
      isAnimating.current = true;
      const svg = curtainRef.current;
      const paths = [
        svg.querySelector('.layer-gold') as SVGPathElement,
        svg.querySelector('.layer-ink') as SVGPathElement
      ];
      
      const content = contentRef.current;
      const logoWrapper = content.querySelector('.logo-wrapper');
      const sheen = content.querySelector('.sheen-layer');
      const pulseRing = content.querySelector('.pulse-ring');
      
      content.style.pointerEvents = 'auto'; // Block clicks
      
      const tl = gsap.timeline();
      
      // Initialize states
      tl.set(svg, { autoAlpha: 1 });
      tl.set(content, { autoAlpha: 0 });
      tl.set(logoWrapper, { yPercent: -150 });
      tl.set(sheen, { left: '-150%' });
      tl.set(pulseRing, { scale: 1, opacity: 0 });
      
      paths.forEach(p => p?.setAttribute("d", "M 0 0 L 100 0 L 100 0 Q 50 0 0 0 Z"));
      
      // 1. Drop down cascaded liquid waves
      paths.forEach((path, index) => {
         if (!path) return;
         const progress = { value: 0 };
         tl.to(progress, {
            value: 100,
            duration: 0.9,
            ease: "power3.inOut",
            onUpdate: () => {
               // ORGANIC PHYSICS: Use Math.pow(x, 3) to move the peak of the sine wave to ~80% of the animation.
               // This means the liquid drags and bulges massively right before it hits the bottom, then snaps flat!
               const x = progress.value / 100;
               const bow = Math.sin(Math.pow(x, 3) * Math.PI) * 60;
               path.setAttribute("d", `M 0 0 L 100 0 L 100 ${progress.value} Q 50 ${progress.value + bow} 0 ${progress.value} Z`);
            }
         }, index * 0.12); // Stagger
      });
      
      // Fade in pattern/vignette gently
      tl.to(content, { autoAlpha: 1, duration: 0.4 }, 0.1);
      
      // Slide down logo wrapper synced with Ink wave (now index 1)
      tl.to(logoWrapper, {
         yPercent: 0,
         duration: 0.9,
         ease: "power3.inOut"
      }, 0.12);
      
      // Ink wave finishes at 0.12 + 0.9 = 1.02s
      tl.addLabel("covered", 0.9);
      
      // Centerpiece Animations
      tl.to(sheen, { left: '150%', duration: 0.75, ease: "power2.inOut" }, "covered");
      tl.addLabel("sheenDone");
      
      tl.add(() => {
         const skipAnimations = () => {
           requestAnimationFrame(() => {
             requestAnimationFrame(() => {
               ScrollTrigger.getAll().forEach(t => {
                 if (t.isActive && t.animation) {
                   t.animation.progress(1);
                 }
               });
             });
           });
         };

         if (isCrossPageHash) {
           sessionStorage.setItem('skipNextReveal', 'true');
           router.push('/');
           // Wait for Next.js soft navigation and GSAP ScrollTrigger to initialize GatePage
           setTimeout(() => {
             const t = document.querySelector(href);
             if (t) {
               t.scrollIntoView({ behavior: 'auto', block: 'start' });
               ScrollTrigger.refresh();
               skipAnimations();
             }
           }, 600);
         } else if (isRoute) {
           sessionStorage.setItem('skipNextReveal', 'true');
           router.push(href);
         } else if (target) {
           target.scrollIntoView({ behavior: 'auto', block: 'start' });
           ScrollTrigger.refresh();
           skipAnimations();
         }
      }, "sheenDone-=0.2");
      
      tl.to(pulseRing, {
         scale: 2, opacity: 0, duration: 0.8, ease: "power2.out", startAt: { scale: 1, opacity: 0.8 }
      }, "sheenDone");
      
      // 3. Lift up cascaded liquid waves (Reverse order)
      const reversePaths = [...paths].reverse();
      
      tl.addLabel("liftStart", "sheenDone+=0.1");
      
      tl.to(content, { autoAlpha: 0, duration: 0.6 }, "liftStart");
      
      // Slide logo down to exit (parallax)
      tl.to(logoWrapper, {
         yPercent: 150,
         duration: 0.9,
         ease: "power3.inOut"
      }, "liftStart");
      
      reversePaths.forEach((path, index) => {
         if (!path) return;
         const liftProgress = { value: 0 };
         tl.to(liftProgress, {
            value: 100,
            duration: 0.9,
            ease: "power3.inOut",
            onUpdate: () => {
               // ORGANIC PHYSICS: Use Math.pow(x, 0.33) to move the peak to ~12% of the animation.
               // This means gravity resists the lift, causing a sudden heavy sag at the start, which smoothly resolves.
               const x = liftProgress.value / 100;
               const bow = Math.sin(Math.pow(x, 0.33) * Math.PI) * 60;
               path.setAttribute("d", `M 0 ${liftProgress.value} Q 50 ${liftProgress.value + bow} 100 ${liftProgress.value} L 100 100 L 0 100 Z`);
            },
            onComplete: index === 1 ? () => {
               gsap.set(svg, { autoAlpha: 0 });
               content.style.pointerEvents = 'none';
               isAnimating.current = false;
            } : undefined
         }, `liftStart+=${index * 0.12}`);
      });
    } else if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else if (isRoute) {
      router.push(href);
    } else if (isCrossPageHash) {
      router.push('/');
      setTimeout(() => {
        const t = document.querySelector(href);
        if (t) {
          t.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 600);
    }
  };

  useEffect(() => {
    const listener = (e: Event) => {
      const customEvent = e as CustomEvent<{ href: string, isRoute?: boolean }>;
      if (customEvent.detail && customEvent.detail.href) {
        executeTransition(customEvent.detail.href, customEvent.detail.isRoute);
      }
    };
    window.addEventListener('navigate-curtain', listener);
    return () => window.removeEventListener('navigate-curtain', listener);
  }, []);

  const handleNav = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    executeTransition(href);
  };

  const isDarkBg = theme === 'dark';
  const textColor = isDarkBg ? '#FFFFFF' : '#111111';
  const glassBg = isScrolled 
    ? (isDarkBg ? 'rgba(20, 20, 20, 0.4)' : 'rgba(255, 255, 255, 0.7)')
    : (isDarkBg ? 'rgba(0, 0, 0, 0.1)' : 'rgba(255, 255, 255, 0.2)');

  return (
    <header
      ref={navRef}
      className="fixed top-3 left-0 w-full z-[1000] px-[58px] pointer-events-none flex justify-center"
    >
      {/* Cinematic Liquid Color Cascade (SVG) */}
      <svg 
        className="fixed inset-0 w-screen h-screen z-[9998] pointer-events-none invisible opacity-0"
        viewBox="0 0 100 100" 
        preserveAspectRatio="none"
        ref={curtainRef}
      >
        <path className="layer-gold" d="M 0 0 L 100 0 L 100 0 Q 50 0 0 0 Z" fill="#c79a45" />
        <path className="layer-ink" d="M 0 0 L 100 0 L 100 0 Q 50 0 0 0 Z" fill="var(--ink)" />
      </svg>

      {/* Main Content (Transparent Overlay) */}
      <div 
        ref={contentRef}
        className="fixed inset-0 z-[9999] pointer-events-none flex flex-col items-center justify-center invisible opacity-0 overflow-hidden"
      >
        {/* 1. Background Pattern */}
        <IslamicPattern color="#c79a45" opacity={0.04} />
        
        {/* 2. Cinematic Spotlight/Vignette */}
        <div 
          className="absolute inset-0 pointer-events-none" 
          style={{ background: 'radial-gradient(circle at center, transparent 20%, rgba(0,0,0,0.85) 100%)' }} 
        />

        {/* 3. Center Emblem */}
        <div className="logo-wrapper relative flex flex-col items-center justify-center">
          <div className="relative flex items-center justify-center">
            {/* Elegant radar pulse */}
            <div className="pulse-ring absolute inset-0 rounded-full border border-accent-gold/50 opacity-0" />
            
            {/* Core Emblem Container */}
            <div className="relative flex items-center justify-center w-24 h-24 rounded-full border border-accent-gold/40 shadow-[0_0_60px_rgba(199,154,69,0.25)] bg-charcoal-ink/80 backdrop-blur-md overflow-hidden">
              <span className="relative z-10 font-heading font-bold text-4xl tracking-tighter text-accent-gold drop-shadow-[0_0_20px_rgba(199,154,69,0.8)]">TJ</span>
              
              {/* Glossy Sheen Sweep (Mengkilap) */}
              <div 
                className="sheen-layer absolute top-0 w-full h-full skew-x-[-25deg] z-20 mix-blend-overlay"
                style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.9), transparent)', left: '-150%' }}
              />
            </div>
          </div>
          
          <span className="mt-8 font-accent italic text-accent-gold/70 text-xs md:text-sm tracking-[0.4em] uppercase animate-pulse">
            Memuat Ruang
          </span>
        </div>
      </div>

      <div 
        className="relative flex items-center justify-between h-[56px] transition-all duration-[600ms]"
        style={{
          transitionTimingFunction: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
          width: '100%',
          maxWidth: isScrolled ? '960px' : '100%',
        }}
      >
        {/* Layer 1: The Single Fluid Glass Pill Background */}
        <div 
          className="absolute inset-0 rounded-full border pointer-events-auto transition-all duration-[600ms]"
          style={{
            background: glassBg,
            backdropFilter: isScrolled ? 'blur(24px) saturate(150%)' : 'blur(12px) saturate(120%)',
            WebkitBackdropFilter: isScrolled ? 'blur(24px) saturate(150%)' : 'blur(12px) saturate(120%)',
            borderColor: isDarkBg ? 'rgba(255, 255, 255, 0.15)' : 'rgba(42, 32, 26, 0.1)',
            boxShadow: isScrolled ? '0 10px 40px -10px rgba(0,0,0,0.1)' : '0 4px 20px -5px rgba(0,0,0,0.05)',
          }}
        />

        {/* Layer 2: The Content */}
        <div 
          className="absolute inset-0 flex items-center justify-between pointer-events-none transition-all duration-[600ms]"
          style={{
            padding: '0 8px',
          }}
        >
          {/* Left: Logo */}
          <a 
            href="#" 
            className="pointer-events-auto relative flex shrink-0 w-10 h-10 rounded-full items-center justify-center transition-all duration-500 z-20 group"
            style={{
              color: textColor,
              border: `1px solid ${isDarkBg ? 'rgba(253, 246, 236, 0.25)' : 'rgba(42, 32, 26, 0.15)'}`,
              textShadow: isDarkBg ? '0 0 12px rgba(253, 246, 236, 0.4)' : '0 2px 4px rgba(0,0,0,0.1)'
            }}
          >
            <span className="font-heading font-bold text-sm tracking-tighter group-hover:scale-110 transition-transform">TJ</span>
          </a>

          {/* Center: Tight Navigation Links */}
          <nav 
            className="absolute left-1/2 -translate-x-1/2 h-full hidden md:flex items-center gap-0 z-10 transition-all duration-500"
          >
            {navLinks.map((link) => {
              return (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => handleNav(e, link.href)}
                  className="pointer-events-auto relative px-[11px] py-2 text-sm font-heading font-bold uppercase tracking-wider rounded-full transition-all duration-300 group overflow-hidden"
                  style={{ 
                    color: textColor,
                    textShadow: isDarkBg ? '0 2px 10px rgba(0,0,0,0.5)' : 'none'
                  }}
                >
                  {/* Premium Hover Background */}
                  <div 
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full"
                    style={{ backgroundColor: isDarkBg ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.04)' }}
                  />
                  
                  {/* Text Content */}
                  <span className="relative z-10 opacity-75 group-hover:opacity-100 transition-opacity duration-300">
                    {link.label}
                  </span>
                  
                  {/* Premium Gold Dot Indicator */}
                  <span 
                    className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full opacity-0 group-hover:opacity-100 translate-y-2 group-hover:-translate-y-1.5 transition-all duration-300 ease-out"
                    style={{ 
                      backgroundColor: '#c79a45',
                      boxShadow: '0 0 10px rgba(199,154,69,0.8)'
                    }}
                  />
                </a>
              );
            })}
          </nav>

          {/* Right: Solid CTA */}
          <a
            href="#daftar"
            onClick={(e) => handleNav(e, '#daftar')}
            className="pointer-events-auto relative px-6 h-[40px] rounded-full overflow-hidden group shrink-0 flex items-center justify-center transition-all duration-500 z-20 hover:scale-105 hover:shadow-[0_0_20px_rgba(199,154,69,0.3)]"
            style={{
              background: isScrolled ? (isDarkBg ? 'rgba(253, 246, 236, 0.12)' : 'var(--sage-deep)') : (isDarkBg ? 'rgba(253, 246, 236, 0.12)' : 'var(--sage)'),
              border: `1px solid ${isDarkBg ? 'rgba(253, 246, 236, 0.25)' : 'var(--sage-deep)'}`,
              color: '#FDF6EC',
            }}
          >
            <span 
              className="relative z-10 text-sm font-heading font-bold uppercase tracking-widest transition-all duration-500"
              style={{
                textShadow: isScrolled 
                  ? '0 0 10px rgba(253, 246, 236, 0.4)' 
                  : (isDarkBg ? '0 0 10px rgba(253, 246, 236, 0.4)' : '0 1px 3px rgba(0,0,0,0.1)')
              }}
            >
              Daftar
            </span>
            {/* Glossy Sheen Effect */}
            <div 
              className="absolute top-0 -left-[150%] w-full h-full skew-x-[-25deg] transition-all duration-700 ease-in-out group-hover:left-[150%]" 
              style={{ background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.6), transparent)' }}
            />
          </a>
        </div>
      </div>
    </header>
  );
};

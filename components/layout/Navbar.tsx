'use client';

import React, { useRef, useState, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { usePathname, useRouter } from 'next/navigation';
import { IslamicPattern } from '@/components/ui/IslamicPattern';

gsap.registerPlugin(ScrollTrigger);

const navMenus = [
  {
    label: 'Profil',
    children: [
      { label: 'Visi & Misi', href: '#visi' },
      { label: 'Fasilitas', href: '#fasilitas' },
      { label: 'Profil Guru', href: '#guru' }
    ]
  },
  {
    label: 'Program',
    children: [
      { label: 'Akademik', href: '#kurikulum' },
      { label: 'Program Unggulan', href: '#unggulan' },
      { label: 'Ekstrakurikuler', href: '#ekskul' }
    ]
  },
  {
    label: 'Informasi',
    children: [
      { label: 'Alumni', href: '#alumni' },
      { label: 'Artikel', href: '#artikel' }
    ]
  }
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
      const pulseRing = content.querySelector('.pulse-ring');
      
      content.style.pointerEvents = 'auto'; // Block clicks
      
      const tl = gsap.timeline();
      const easeInOut = "power4.inOut";
      const duration = 1.0;
      const staggerDelay = 0.12;
      
      // 1. Initial State
      tl.set(svg, { autoAlpha: 1 });
      tl.set(content, { autoAlpha: 0 });
      tl.set(pulseRing, { scale: 1, opacity: 0 });
      paths.forEach(p => p?.setAttribute("d", "M 0 0 L 100 0 L 100 0 Q 50 0 0 0 Z"));
      
      // 2. Liquid Drop (IN)
      paths.forEach((path, index) => {
         if (!path) return;
         const progress = { value: 0 };
         tl.to(progress, {
            value: 100,
            duration: duration,
            ease: easeInOut,
            onUpdate: () => {
               // AWWWARDS STANDARD: Pure sine wave for perfect symmetrical liquid sweep
               const x = progress.value / 100;
               const bow = Math.sin(x * Math.PI) * 150; // Deep elegant curve
               path.setAttribute("d", `M 0 0 L 100 0 L 100 ${progress.value} Q 50 ${progress.value + bow} 0 ${progress.value} Z`);
            }
         }, index * staggerDelay);
      });
      
      // 3. Reveal Content (Logo & Vignette fade in as the curtain covers the screen)
      tl.to(content, { autoAlpha: 1, duration: 0.5, ease: "power2.out" }, duration * 0.4);
      
      // 4. Centerpiece Micro-interactions
      const contentReadyTime = duration + staggerDelay; 
      tl.to(pulseRing, {
         scale: 2, opacity: 0, duration: 0.8, ease: "power2.out", startAt: { scale: 1, opacity: 0.8 }
      }, contentReadyTime);
      
      // 5. Trigger Routing / Scrolling in the background
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
      }, contentReadyTime + 0.2);
      
      // 6. Liquid Lift (OUT)
      const reversePaths = [...paths].reverse();
      const liftStartTime = contentReadyTime + 0.8;
      
      // Fade out content perfectly seamlessly as the lift begins
      tl.to(content, { autoAlpha: 0, duration: 0.5, ease: "power2.inOut" }, liftStartTime);
      
      reversePaths.forEach((path, index) => {
         if (!path) return;
         const liftProgress = { value: 0 };
         tl.to(liftProgress, {
            value: 100,
            duration: duration,
            ease: easeInOut,
            onUpdate: () => {
               const x = liftProgress.value / 100;
               const bow = Math.sin(x * Math.PI) * 150; 
               // Lift animation: The liquid drains downwards seamlessly
               path.setAttribute("d", `M 0 ${liftProgress.value} Q 50 ${liftProgress.value + bow} 100 ${liftProgress.value} L 100 100 L 0 100 Z`);
            },
            onComplete: index === 1 ? () => {
               gsap.set(svg, { autoAlpha: 0 });
               content.style.pointerEvents = 'none';
               isAnimating.current = false;
            } : undefined
         }, liftStartTime + (index * staggerDelay));
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
            <div className="pulse-ring absolute w-48 h-48 rounded-full border border-accent-gold/50 opacity-0" />
            
            {/* Core Emblem Container (Best Practice: Free floating, no caged borders) */}
            <div className="relative flex items-center justify-center">
              <img src="/logo.svg" alt="TJ Logo" className="relative z-10 h-32 w-auto object-contain drop-shadow-[0_0_30px_rgba(199,154,69,0.6)]" />
            </div>
          </div>
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
            className="pointer-events-auto relative flex shrink-0 items-center justify-center transition-all duration-500 z-20 group"
          >
            <img src="/logo.svg" alt="TJ Logo" className="h-10 w-auto object-contain group-hover:scale-105 transition-transform" />
          </a>

          {/* Center: Tight Navigation Links */}
          <nav 
            className="absolute left-1/2 -translate-x-1/2 h-full hidden md:flex items-center gap-6 z-10 transition-all duration-500"
          >
            {navMenus.map((menu) => (
              <div key={menu.label} className="relative group pointer-events-auto h-full flex items-center">
                <button
                  className="relative px-3 py-2 text-sm font-heading font-bold uppercase tracking-wider rounded-full transition-all duration-300 flex items-center gap-1.5"
                  style={{ 
                    color: textColor,
                    textShadow: isDarkBg ? '0 2px 10px rgba(0,0,0,0.5)' : 'none'
                  }}
                >
                  <span className="relative z-10 opacity-75 group-hover:opacity-100 transition-opacity duration-300">
                    {menu.label}
                  </span>
                  <svg className="w-3.5 h-3.5 opacity-75 group-hover:opacity-100 transition-transform duration-300 group-hover:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                {/* Dropdown Panel */}
                <div className="absolute top-[80%] left-1/2 -translate-x-1/2 pt-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                  <div 
                    className="flex flex-col py-2 rounded-2xl border backdrop-blur-md shadow-2xl min-w-[200px] overflow-hidden"
                    style={{
                      background: isDarkBg ? 'rgba(26, 26, 46, 0.95)' : 'rgba(255, 255, 255, 0.95)',
                      borderColor: isDarkBg ? 'rgba(253, 246, 236, 0.15)' : 'rgba(42, 32, 26, 0.1)',
                    }}
                  >
                    {menu.children.map(child => (
                      <a
                        key={child.href}
                        href={child.href}
                        onClick={(e) => handleNav(e, child.href)}
                        className="group/child px-5 py-3 text-sm font-heading font-semibold transition-colors duration-200"
                        style={{
                          color: isDarkBg ? '#FDF6EC' : '#1A1A2E'
                        }}
                      >
                        <span className="opacity-70 group-hover/child:opacity-100 group-hover/child:text-accent-gold transition-colors">
                          {child.label}
                        </span>
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            ))}
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

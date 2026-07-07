'use client';

import React, { useRef, useState, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { usePathname, useRouter } from 'next/navigation';
import { IslamicPattern } from '@/components/ui/IslamicPattern';
import { Menu, X } from 'lucide-react';

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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
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
    
    // Check initial scroll state so it doesn't flicker on refresh
    if (window.scrollY > shrinkOffset) {
      setIsScrolled(true);
    } else {
      setIsScrolled(false);
    }

    ScrollTrigger.create({
      start: `top -${shrinkOffset}`,
      end: "max",
      onEnter: () => setIsScrolled(true),
      onLeaveBack: () => setIsScrolled(false),
    });

    // Performance-optimized Theme Detection (No Layout Thrashing)
    const themeSections = document.querySelectorAll('[data-theme]');
    themeSections.forEach((section) => {
      ScrollTrigger.create({
        trigger: section,
        start: "top 56px",
        end: "bottom 56px",
        onEnter: () => {
          const t = section.getAttribute('data-theme');
          if (t === 'light' || t === 'dark') setTheme(t);
        },
        onEnterBack: () => {
          const t = section.getAttribute('data-theme');
          if (t === 'light' || t === 'dark') setTheme(t);
        }
      });
    });

    // Initialize curtain safely out of sight
    if (curtainRef.current) {
      gsap.set(curtainRef.current, { autoAlpha: 0 });
      curtainRef.current.querySelectorAll('path').forEach(p => p.setAttribute("d", "M 0 0 L 100 0 L 100 0 Q 50 0 0 0 Z"));
    }
  }, { scope: navRef, dependencies: [pathname] });

  const shouldHideNav = pathname === '/' && !isScrolled;

  const executeTransition = (href: string, isRoute: boolean = false) => {
    if (isAnimating.current) return;
    
    // Gunakan window.location.pathname agar selalu fresh dan terhindar dari stale closure di useEffect
    const currentPath = window.location.pathname;
    
    // Pengecualian khusus: Jika di halaman artikel dan klik navbar Artikel, tetap di halaman (gulir ke grid bawah)
    const isArticleToArticle = currentPath.startsWith('/artikel') && href === '#artikel';
    const isCrossPageHash = currentPath !== '/' && href.startsWith('#') && !isArticleToArticle;
    
    // Cegah error "not a valid selector" jika href adalah '/'
    const isValidSelector = href.startsWith('#');
    const target = (!isRoute && !isCrossPageHash && isValidSelector) ? document.querySelector(href) : null;
    
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
    
    // Tirai dipicu jika: rute berubah, lompat dari halaman lain, target valid TAPI belum dilihat, atau kembali ke atas (klik logo jika belum di atas)
    const computedIsRoute = isRoute || (href.startsWith('/') && href !== currentPath);
    const isReturnToTop = href === '/' && currentPath === '/' && window.scrollY > 0;
    const shouldRunCurtain = (target && !isArticleToArticle && !isAlreadyInSection) || computedIsRoute || isCrossPageHash || isReturnToTop;
    
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
         const syncAnimations = () => {
           requestAnimationFrame(() => {
             requestAnimationFrame(() => {
               ScrollTrigger.getAll().forEach(t => {
                 if (t.animation) {
                   t.animation.progress(t.progress);
                 }
               });
             });
           });
         };
         
         const resetToTopAnimations = () => {
           requestAnimationFrame(() => {
             requestAnimationFrame(() => {
               ScrollTrigger.getAll().forEach(t => {
                 if (t.animation) {
                   t.animation.progress(0);
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
               syncAnimations();
             }
           }, 600);
          } else if (computedIsRoute) {
            sessionStorage.setItem('skipNextReveal', 'true');
            router.push(href);
          } else if (href === '/' || href === currentPath) {
            window.scrollTo({ top: 0, behavior: 'auto' });
            setTheme('dark');
            setIsScrolled(false);
            ScrollTrigger.refresh();
            resetToTopAnimations();
          } else if (target) {
            target.scrollIntoView({ behavior: 'auto', block: 'start' });
            ScrollTrigger.refresh();
            syncAnimations();
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
               
               // Bypassing radar for GatePage since it might pierce through fading elements
               if (isReturnToTop) {
                 setTheme('dark');
               }
               // GSAP ScrollTrigger will auto-update the theme based on position after jump
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
    } else if (computedIsRoute) {
      router.push(href);
    } else if (isReturnToTop) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
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
    if (href === '/') {
      setTheme('dark');
      setIsScrolled(false);
    }
    const isRoute = href.startsWith('/') && href !== pathname;
    executeTransition(href, isRoute);
  };

  const isDarkBg = theme === 'dark';
  const textColor = isDarkBg ? '#FFFFFF' : '#111111';
  const glassBg = isScrolled 
    ? (isDarkBg ? 'rgba(20, 20, 20, 0.4)' : 'rgba(255, 255, 255, 0.7)')
    : (isDarkBg ? 'rgba(0, 0, 0, 0.1)' : 'rgba(255, 255, 255, 0.2)');

  return (
    <header
      ref={navRef}
      className={`fixed top-3 left-0 w-full z-[1000] px-[58px] pointer-events-none flex justify-center transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
        shouldHideNav ? 'opacity-0 -translate-y-full' : 'opacity-100 translate-y-0'
      }`}
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
            
            {/* Core Emblem Container */}
            <div className="relative flex items-center justify-center">
              <img src="/logo.png" alt="TJ Logo" className="relative z-10 h-32 w-auto object-contain drop-shadow-[0_0_30px_rgba(199,154,69,0.6)]" />
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
            href="/" 
            onClick={(e) => handleNav(e, '/')}
            className="pointer-events-auto relative flex shrink-0 items-center justify-center transition-all duration-500 z-20 group"
          >
            <img src="/logo.png" alt="TJ Logo" className="h-10 w-auto object-contain group-hover:scale-105 transition-transform" />
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

          {/* Right: Solid CTA & Mobile Toggle */}
          <div className="flex items-center gap-2 z-20">
            <a
              href="#daftar"
              onClick={(e) => handleNav(e, '#daftar')}
              className="pointer-events-auto relative hidden md:flex px-6 h-[40px] rounded-full overflow-hidden group shrink-0 items-center justify-center transition-all duration-500 z-20 hover:scale-105 hover:shadow-[0_0_20px_rgba(199,154,69,0.3)]"
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

            {/* Mobile Hamburger Toggle */}
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden pointer-events-auto relative w-[40px] h-[40px] flex items-center justify-center rounded-full transition-all duration-300 z-[9999]"
              style={{
                color: textColor,
              }}
              aria-label="Toggle Menu"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Full-Screen Mobile Menu Overlay */}
      <div 
        className={`fixed inset-0 z-[9990] flex flex-col justify-center items-center pointer-events-none transition-all duration-700 ease-[cubic-bezier(0.85,0,0.15,1)] md:hidden ${
          isMobileMenuOpen ? 'opacity-100 pointer-events-auto translate-y-0' : 'opacity-0 translate-y-[-100%]'
        }`}
        style={{ background: 'var(--ink)' }}
      >
        <IslamicPattern color="var(--gold)" opacity={0.05} />
        <nav className="flex flex-col items-center gap-8 w-full px-8 relative z-10">
          {navLinks.map((link, i) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => {
                setIsMobileMenuOpen(false);
                handleNav(e, link.href);
              }}
              className="text-3xl sm:text-4xl font-heading font-bold text-cream uppercase tracking-widest relative"
              style={{
                transitionDelay: isMobileMenuOpen ? `${100 + (i * 50)}ms` : '0ms',
                transform: isMobileMenuOpen ? 'translateY(0)' : 'translateY(30px)',
                opacity: isMobileMenuOpen ? 1 : 0,
                transitionProperty: 'transform, opacity',
                transitionDuration: '600ms',
                transitionTimingFunction: 'cubic-bezier(0.2, 0.8, 0.2, 1)'
              }}
            >
              {link.label}
            </a>
          ))}
          
          <div 
            className="w-1/2 h-px my-4 origin-center" 
            style={{
              background: 'linear-gradient(90deg, transparent, var(--gold), transparent)',
              transitionDelay: isMobileMenuOpen ? '500ms' : '0ms',
              transform: isMobileMenuOpen ? 'scaleX(1)' : 'scaleX(0)',
              opacity: isMobileMenuOpen ? 1 : 0,
              transitionProperty: 'transform, opacity',
              transitionDuration: '700ms'
            }} 
          />
          
          <a
            href="#daftar"
            onClick={(e) => {
              setIsMobileMenuOpen(false);
              handleNav(e, '#daftar');
            }}
            className="px-10 py-4 rounded-full font-heading font-bold uppercase tracking-widest shadow-[0_0_30px_rgba(107,142,35,0.4)]"
            style={{
              background: 'var(--sage)',
              color: 'var(--cream)',
              transitionDelay: isMobileMenuOpen ? '600ms' : '0ms',
              transform: isMobileMenuOpen ? 'translateY(0)' : 'translateY(30px)',
              opacity: isMobileMenuOpen ? 1 : 0,
              transitionProperty: 'transform, opacity',
              transitionDuration: '600ms',
              transitionTimingFunction: 'cubic-bezier(0.2, 0.8, 0.2, 1)'
            }}
          >
            Daftar Sekarang
          </a>
        </nav>
      </div>

    </header>
  );
};

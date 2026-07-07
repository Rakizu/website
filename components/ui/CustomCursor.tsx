'use client';

import React, { useRef, useState, useEffect } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

export const CustomCursor = () => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  
  const [isVisible, setIsVisible] = useState(false);
  const [isPointer, setIsPointer] = useState(false); // Only enable on desktop pointer devices
  const [cursorState, setCursorState] = useState<'default' | 'hover' | 'drag'>('default');

  useEffect(() => {
    // Only mount interaction if device has a fine pointer (mouse/trackpad)
    if (window.matchMedia('(pointer: fine)').matches) {
      setIsPointer(true);
      document.body.classList.add('hide-default-cursor');
    }
    
    return () => {
      document.body.classList.remove('hide-default-cursor');
    };
  }, []);

  useGSAP(() => {
    if (!isPointer || !dotRef.current || !ringRef.current) return;

    // gsap.quickTo creates a highly optimized, reusable setter function 
    // that bypasses standard tween overhead.
    const xDot = gsap.quickTo(dotRef.current, "x", { duration: 0.1, ease: "power3.out" });
    const yDot = gsap.quickTo(dotRef.current, "y", { duration: 0.1, ease: "power3.out" });
    
    const xRing = gsap.quickTo(ringRef.current, "x", { duration: 0.5, ease: "power4.out" });
    const yRing = gsap.quickTo(ringRef.current, "y", { duration: 0.5, ease: "power4.out" });

    const handleMouseMove = (e: MouseEvent) => {
      if (!isVisible) setIsVisible(true);

      const { clientX, clientY } = e;
      xDot(clientX);
      yDot(clientY);
      xRing(clientX);
      yRing(clientY);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      
      // Determine what we are hovering over via event delegation
      if (target.closest('a, button, [role="button"], input, select, textarea')) {
        setCursorState('hover');
      } else if (target.closest('.ekskul-item, .alumni-frame')) {
        setCursorState('drag');
      } else {
        setCursorState('default');
      }
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };
    
    const handleMouseEnter = () => {
      setIsVisible(true);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, [isPointer, isVisible]); // Dependencies ensure quickTo is initialized

  if (!isPointer) return null;

  // State-based styling classes
  const ringBaseClass = "fixed top-0 left-0 w-10 h-10 -ml-5 -mt-5 rounded-full border pointer-events-none z-[99999] flex items-center justify-center transition-all duration-[600ms] ease-fluid mix-blend-difference";
  const dotBaseClass = "fixed top-0 left-0 w-2 h-2 -ml-1 -mt-1 rounded-full pointer-events-none z-[100000] transition-all duration-300 ease-fluid mix-blend-difference";

  let ringClasses = ringBaseClass;
  let dotClasses = dotBaseClass;
  let textOpacity = "opacity-0";

  switch (cursorState) {
    case 'hover':
      ringClasses += " scale-150 border-white/50 bg-white/10 shadow-[0_0_15px_rgba(255,255,255,0.3)]";
      dotClasses += " scale-0 opacity-0 bg-white";
      break;
    case 'drag':
      ringClasses += " scale-[2.5] border-transparent bg-white";
      dotClasses += " scale-0 opacity-0 bg-transparent";
      textOpacity = "opacity-100 scale-100 text-black";
      break;
    default:
      ringClasses += " scale-100 border-white bg-transparent";
      dotClasses += " scale-100 opacity-100 bg-white";
      textOpacity = "opacity-0 scale-50";
      break;
  }

  return (
    <div ref={cursorRef} className={`transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      {/* Outer Trailing Ring */}
      <div ref={ringRef} className={ringClasses} style={{ willChange: 'transform' }}>
         <span ref={textRef} className={`text-[8px] font-heading font-bold tracking-widest transition-all duration-500 ease-organic ${textOpacity}`}>
           GESER
         </span>
      </div>
      
      {/* Inner Dot */}
      <div ref={dotRef} className={dotClasses} style={{ willChange: 'transform' }} />
    </div>
  );
};

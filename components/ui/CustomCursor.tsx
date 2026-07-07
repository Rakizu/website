'use client';

import React, { useRef, useState, useEffect } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { usePathname } from 'next/navigation';

export const CustomCursor = () => {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/admin');

  const cursorRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  
  const [isVisible, setIsVisible] = useState(false);
  const [isPointer, setIsPointer] = useState(false);
  const [cursorState, setCursorState] = useState<'default' | 'hover' | 'drag'>('default');

  useEffect(() => {
    if (isAdmin) return;
    if (window.matchMedia('(pointer: fine)').matches) {
      setIsPointer(true);
      document.body.classList.add('hide-default-cursor');
    }
    return () => {
      document.body.classList.remove('hide-default-cursor');
    };
  }, [isAdmin]);

  useGSAP(() => {
    if (isAdmin || !isPointer || !cursorRef.current) return;

    // Zero-latency tracking for ultra-lightweight and precise feel
    // duration 0.05 gives just a microscopic buttery smooth buffer without feeling "laggy"
    const xMove = gsap.quickTo(cursorRef.current, "x", { duration: 0.05, ease: "none" });
    const yMove = gsap.quickTo(cursorRef.current, "y", { duration: 0.05, ease: "none" });

    const handleMouseMove = (e: MouseEvent) => {
      if (!isVisible) setIsVisible(true);
      xMove(e.clientX);
      yMove(e.clientY);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('.ekskul-item, .alumni-frame')) {
        setCursorState('drag');
      } else if (target.closest('a, button, [role="button"], input, select, textarea')) {
        setCursorState('hover');
      } else {
        setCursorState('default');
      }
    };

    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mouseover', handleMouseOver, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, [isPointer, isVisible, isAdmin]);

  if (isAdmin || !isPointer) return null;

  // Ultra-minimal morphing cursor
  const baseClass = "fixed top-0 left-0 flex items-center justify-center rounded-full pointer-events-none z-[100000] mix-blend-difference transition-all duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] will-change-transform";
  
  let dynamicClass = "";
  let textOpacity = "opacity-0 scale-50";

  switch (cursorState) {
    case 'hover':
      // Magnetic expanding aura (very subtle inverted bubble)
      dynamicClass = "w-14 h-14 -ml-7 -mt-7 bg-white opacity-25";
      break;
    case 'drag':
      // Solid drag indicator
      dynamicClass = "w-20 h-20 -ml-10 -mt-10 bg-white opacity-100";
      textOpacity = "opacity-100 scale-100 text-black";
      break;
    default:
      // Micro-precision dot
      dynamicClass = "w-2.5 h-2.5 -ml-[5px] -mt-[5px] bg-white opacity-100";
      textOpacity = "opacity-0 scale-50";
      break;
  }

  return (
    <div 
      ref={cursorRef} 
      className={`${baseClass} ${dynamicClass} ${isVisible ? '' : 'opacity-0'}`}
    >
       <span ref={textRef} className={`text-[9px] font-heading font-bold tracking-widest transition-all duration-300 ease-out ${textOpacity}`}>
         GESER
       </span>
    </div>
  );
};

'use client';

import React, { useRef, useState, useEffect, useSyncExternalStore } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { usePathname } from 'next/navigation';

function subscribePointer(callback: () => void) {
  const mq = window.matchMedia('(pointer: fine)');
  mq.addEventListener('change', callback);
  return () => mq.removeEventListener('change', callback);
}

function getPointerSnapshot() {
  return window.matchMedia('(pointer: fine)').matches;
}

function getServerSnapshot() {
  return false;
}

export const CustomCursor = () => {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/admin');

  const cursorRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  
  const [isVisible, setIsVisible] = useState(false);
  const isPointer = useSyncExternalStore(subscribePointer, getPointerSnapshot, getServerSnapshot);
  const [cursorState, setCursorState] = useState<'default' | 'hover' | 'drag'>('default');

  useEffect(() => {
    if (isAdmin || !isPointer) return;
    document.body.classList.add('hide-default-cursor');
    return () => {
      document.body.classList.remove('hide-default-cursor');
    };
  }, [isAdmin, isPointer]);

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
  }, [isPointer, isAdmin]);

  if (isAdmin || !isPointer) return null;

  // Ultra-minimal morphing cursor without mix-blend-difference overhead
  const baseClass = "fixed top-0 left-0 flex items-center justify-center rounded-full pointer-events-none z-[100000] transition-all duration-300 ease-[cubic-bezier(0.19,1,0.22,1)] will-change-transform";
  
  let dynamicClass = "";
  let textOpacity = "opacity-0 scale-50";

  switch (cursorState) {
    case 'hover':
      dynamicClass = "w-12 h-12 -ml-6 -mt-6 bg-[#c79a45]/20 border border-[#c79a45]/60 backdrop-blur-[2px]";
      break;
    case 'drag':
      dynamicClass = "w-16 h-16 -ml-8 -mt-8 bg-[#c79a45] border border-[#f5e4a8]/50 shadow-[0_0_20px_rgba(199,154,69,0.5)]";
      textOpacity = "opacity-100 scale-100 text-[#100D0B] font-black";
      break;
    default:
      dynamicClass = "w-2.5 h-2.5 -ml-[5px] -mt-[5px] bg-[#c79a45] shadow-[0_0_10px_rgba(199,154,69,0.7)]";
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

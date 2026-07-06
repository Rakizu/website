'use client';

import { useEffect } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export const SmoothScroll = () => {
  useEffect(() => {
    const lenis = new Lenis({
      lerp: 0.05,        // Silkier smoothing (Awwwards standard)
      wheelMultiplier: 1.1, // Slightly faster wheel to compensate for heavy lerp
      smoothWheel: true,
    });

    // Connect Lenis to GSAP ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update);

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);

    // Normalize scroll to fix jank on heavy desktop trackpads/mice
    ScrollTrigger.normalizeScroll({
      allowNestedScroll: true,
      type: "wheel,touch" // smooths out wheel events natively
    });
    ScrollTrigger.config({ ignoreMobileResize: true });

    return () => {
      lenis.destroy();
      gsap.ticker.remove((time) => {
        lenis.raf(time * 1000);
      });
    };
  }, []);

  return null;
};

'use client';

import { useEffect } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export const SmoothScroll = () => {
  useEffect(() => {
    const lenis = new Lenis({
      lerp: 0.1,        // Snappier smoothing to remove ghosting
      wheelMultiplier: 1.0, 
      smoothWheel: true,
    });

    // Expose lenis instance globally for modal/overlay freeze
    (window as any).__lenis = lenis;

    // Connect Lenis to GSAP ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update);

    const updateRaf = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(updateRaf);
    gsap.ticker.lagSmoothing(0); // Disable lag smoothing to prevent stutter with Lenis

    ScrollTrigger.config({ ignoreMobileResize: true });

    return () => {
      delete (window as any).__lenis;
      lenis.destroy();
      gsap.ticker.remove(updateRaf);
    };
  }, []);

  return null;
};

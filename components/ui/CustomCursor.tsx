'use client';

import React, { useRef, useEffect, useSyncExternalStore } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { usePathname } from 'next/navigation';

type CursorMode = 'default' | 'hover' | 'drag' | 'scroll';

const INTERACTIVE_SELECTOR =
  'a, button, [role="button"], input, select, textarea, summary, label[for], [data-cursor="hover"]';
const DRAG_SELECTOR = '.ekskul-item, .alumni-frame, [data-cursor="drag"]';
const SCROLL_SELECTOR = '[data-cursor="scroll"]';

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
  const isPointer = useSyncExternalStore(
    subscribePointer,
    getPointerSnapshot,
    getServerSnapshot
  );

  const coreTrackerRef = useRef<HTMLDivElement>(null);
  const ringTrackerRef = useRef<HTMLDivElement>(null);
  const coreVisualRef = useRef<HTMLDivElement>(null);
  const ringVisualRef = useRef<HTMLDivElement>(null);
  const badgeVisualRef = useRef<HTMLDivElement>(null);
  const badgeTextRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (isAdmin || !isPointer) return;
    document.body.classList.add('hide-default-cursor');
    return () => {
      document.body.classList.remove('hide-default-cursor');
    };
  }, [isAdmin, isPointer]);

  useGSAP(
    () => {
      if (
        isAdmin ||
        !isPointer ||
        !coreTrackerRef.current ||
        !ringTrackerRef.current ||
        !coreVisualRef.current ||
        !ringVisualRef.current ||
        !badgeVisualRef.current
      ) {
        return;
      }

      const coreTracker = coreTrackerRef.current;
      const ringTracker = ringTrackerRef.current;
      const coreVisual = coreVisualRef.current;
      const ringVisual = ringVisualRef.current;
      const badgeVisual = badgeVisualRef.current;
      const badgeText = badgeTextRef.current;

      const reducedMotion = window.matchMedia(
        '(prefers-reduced-motion: reduce)'
      ).matches;

      // Center trackers on GPU layer once; position only via quickSetter (zero CSS transitions)
      gsap.set([coreTracker, ringTracker], {
        xPercent: -50,
        yPercent: -50,
        opacity: 0,
        force3D: true,
      });
      gsap.set(coreVisual, { scale: 1, force3D: true });
      gsap.set(ringVisual, { scale: 1, opacity: 1, force3D: true });
      gsap.set(badgeVisual, { scale: 0.55, opacity: 0, force3D: true });

      const setCoreX = gsap.quickSetter(coreTracker, 'x', 'px');
      const setCoreY = gsap.quickSetter(coreTracker, 'y', 'px');
      const setRingX = gsap.quickSetter(ringTracker, 'x', 'px');
      const setRingY = gsap.quickSetter(ringTracker, 'y', 'px');

      const target = { x: -100, y: -100 };
      const core = { x: -100, y: -100 };
      const ring = { x: -100, y: -100 };

      let hasMoved = false;
      let isVisible = false;
      let currentMode: CursorMode = 'default';
      let isPressed = false;

      const showCursor = () => {
        if (isVisible) return;
        isVisible = true;
        gsap.to([coreTracker, ringTracker], {
          opacity: 1,
          duration: 0.22,
          ease: 'power2.out',
          overwrite: 'auto',
        });
      };

      const hideCursor = () => {
        if (!isVisible) return;
        isVisible = false;
        gsap.to([coreTracker, ringTracker], {
          opacity: 0,
          duration: 0.18,
          ease: 'power2.out',
          overwrite: 'auto',
        });
      };

      const applyVisualState = (mode: CursorMode, pressed: boolean) => {
        const pressScale = pressed ? 0.84 : 1;

        if (mode === 'drag' || mode === 'scroll') {
          if (badgeText) {
            badgeText.textContent = mode === 'scroll' ? 'SCROLL' : 'GESER';
          }
          gsap.to(coreVisual, {
            scale: 0,
            opacity: 0,
            duration: 0.2,
            ease: 'power3.out',
            overwrite: 'auto',
          });
          gsap.to(ringVisual, {
            scale: 0.65,
            opacity: 0,
            duration: 0.22,
            ease: 'power3.out',
            overwrite: 'auto',
          });
          gsap.to(badgeVisual, {
            scale: 1 * pressScale,
            opacity: 1,
            duration: 0.34,
            ease: 'expo.out',
            overwrite: 'auto',
          });
          return;
        }

        if (mode === 'hover') {
          gsap.to(coreVisual, {
            scale: 0.72 * pressScale,
            opacity: 1,
            duration: 0.24,
            ease: 'power3.out',
            overwrite: 'auto',
          });
          gsap.to(ringVisual, {
            scale: 1.52 * pressScale,
            opacity: 1,
            backgroundColor: 'rgba(199, 154, 69, 0.14)',
            borderColor: 'rgba(199, 154, 69, 0.75)',
            duration: 0.32,
            ease: 'expo.out',
            overwrite: 'auto',
          });
          gsap.to(badgeVisual, {
            scale: 0.55,
            opacity: 0,
            duration: 0.2,
            ease: 'power2.out',
            overwrite: 'auto',
          });
          return;
        }

        // Default precision mode
        gsap.to(coreVisual, {
          scale: 1 * pressScale,
          opacity: 1,
          duration: 0.24,
          ease: 'power3.out',
          overwrite: 'auto',
        });
        gsap.to(ringVisual, {
          scale: 1 * pressScale,
          opacity: 0.85,
          backgroundColor: 'rgba(199, 154, 69, 0)',
          borderColor: 'rgba(199, 154, 69, 0.45)',
          duration: 0.32,
          ease: 'expo.out',
          overwrite: 'auto',
        });
        gsap.to(badgeVisual, {
          scale: 0.55,
          opacity: 0,
          duration: 0.18,
          ease: 'power2.out',
          overwrite: 'auto',
        });
      };

      const resolveMode = (el: HTMLElement | null): CursorMode => {
        if (!el) return 'default';
        if (el.closest(SCROLL_SELECTOR)) return 'scroll';
        if (el.closest(DRAG_SELECTOR)) return 'drag';
        if (el.closest(INTERACTIVE_SELECTOR)) return 'hover';
        return 'default';
      };

      const tick = (_time: number, deltaTime: number) => {
        if (!hasMoved || !isVisible) return;

        if (reducedMotion) {
          core.x = target.x;
          core.y = target.y;
          ring.x = target.x;
          ring.y = target.y;
        } else {
          // Frame-rate independent exponential smoothing (identical feel at 60Hz, 120Hz ProMotion, 144Hz+)
          const dt = Math.min(deltaTime / 1000, 0.05);
          const coreAlpha = 1 - Math.exp(-48 * dt);
          const ringAlpha = 1 - Math.exp(-18 * dt);

          core.x += (target.x - core.x) * coreAlpha;
          core.y += (target.y - core.y) * coreAlpha;
          ring.x += (target.x - ring.x) * ringAlpha;
          ring.y += (target.y - ring.y) * ringAlpha;

          if (Math.abs(target.x - core.x) < 0.01) core.x = target.x;
          if (Math.abs(target.y - core.y) < 0.01) core.y = target.y;
          if (Math.abs(target.x - ring.x) < 0.01) ring.x = target.x;
          if (Math.abs(target.y - ring.y) < 0.01) ring.y = target.y;
        }

        setCoreX(core.x);
        setCoreY(core.y);
        setRingX(ring.x);
        setRingY(ring.y);
      };

      gsap.ticker.add(tick);

      const handlePointerMove = (e: PointerEvent) => {
        if (e.pointerType === 'touch') return;

        target.x = e.clientX;
        target.y = e.clientY;

        if (!hasMoved) {
          hasMoved = true;
          core.x = target.x;
          core.y = target.y;
          ring.x = target.x;
          ring.y = target.y;
          setCoreX(core.x);
          setCoreY(core.y);
          setRingX(ring.x);
          setRingY(ring.y);
        }

        showCursor();
      };

      const handlePointerOver = (e: PointerEvent) => {
        if (e.pointerType === 'touch') return;
        const nextMode = resolveMode(e.target as HTMLElement | null);
        if (nextMode !== currentMode) {
          currentMode = nextMode;
          applyVisualState(currentMode, isPressed);
        }
      };

      const handlePointerDown = (e: PointerEvent) => {
        if (e.pointerType === 'touch') return;
        isPressed = true;
        applyVisualState(currentMode, isPressed);
      };

      const handlePointerUp = (e: PointerEvent) => {
        if (e.pointerType === 'touch') return;
        isPressed = false;
        applyVisualState(currentMode, isPressed);
      };

      const handleMouseLeave = () => hideCursor();
      const handleWindowBlur = () => {
        isPressed = false;
        hideCursor();
      };

      window.addEventListener('pointermove', handlePointerMove, { passive: true });
      window.addEventListener('pointerover', handlePointerOver, { passive: true });
      window.addEventListener('pointerdown', handlePointerDown, { passive: true });
      window.addEventListener('pointerup', handlePointerUp, { passive: true });
      window.addEventListener('blur', handleWindowBlur);
      document.documentElement.addEventListener('mouseleave', handleMouseLeave);

      return () => {
        gsap.ticker.remove(tick);
        window.removeEventListener('pointermove', handlePointerMove);
        window.removeEventListener('pointerover', handlePointerOver);
        window.removeEventListener('pointerdown', handlePointerDown);
        window.removeEventListener('pointerup', handlePointerUp);
        window.removeEventListener('blur', handleWindowBlur);
        document.documentElement.removeEventListener('mouseleave', handleMouseLeave);
      };
    },
    { dependencies: [isPointer, isAdmin] }
  );

  if (isAdmin || !isPointer) return null;

  return (
    <>
      {/* Fluid Trailing Halo + Context Pill (Zero CSS transitions on tracker) */}
      <div
        ref={ringTrackerRef}
        aria-hidden="true"
        className="fixed top-0 left-0 pointer-events-none z-[100000] will-change-transform flex items-center justify-center"
      >
        <div
          ref={ringVisualRef}
          className="w-9 h-9 rounded-full border border-[#c79a45]/45 will-change-transform"
        />
        <div
          ref={badgeVisualRef}
          className="absolute w-16 h-16 rounded-full bg-[#c79a45] border border-[#f5e4a8]/60 shadow-[0_6px_24px_rgba(199,154,69,0.4)] flex items-center justify-center will-change-transform"
        >
          <span
            ref={badgeTextRef}
            className="text-[9px] font-heading font-black tracking-[0.16em] text-[#100D0B] uppercase select-none"
          >
            GESER
          </span>
        </div>
      </div>

      {/* Zero-Latency Pinpoint Core */}
      <div
        ref={coreTrackerRef}
        aria-hidden="true"
        className="fixed top-0 left-0 pointer-events-none z-[100001] will-change-transform flex items-center justify-center"
      >
        <div
          ref={coreVisualRef}
          className="w-2.5 h-2.5 rounded-full bg-[#c79a45] shadow-[0_0_10px_rgba(199,154,69,0.65)] will-change-transform"
        />
      </div>
    </>
  );
};

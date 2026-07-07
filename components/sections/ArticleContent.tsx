'use client';

import React, { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

interface ArticleContentProps {
  firstLetter: string;
  restOfFirstParagraph: string;
  remainingParagraphs: string[];
  tags?: string[];
}

export const ArticleContent: React.FC<ArticleContentProps> = ({
  firstLetter,
  restOfFirstParagraph,
  remainingParagraphs,
  tags = [],
}) => {
  const containerRef = useRef<HTMLElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!containerRef.current) return;

    // Reading Progress Bar Animation
    if (progressRef.current) {
      gsap.to(progressRef.current, {
        scaleX: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: true,
        },
      });
    }

    // Scroll Reveal for Paragraphs
    const paragraphs = containerRef.current.querySelectorAll('.reveal-p');
    
    paragraphs.forEach((p) => {
      gsap.fromTo(
        p,
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1.2,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: p,
            start: 'top 85%',
            once: true,
          },
        }
      );
    });
  }, { scope: containerRef });

  return (
    <>
      {/* Reading Progress Indicator */}
      <div className="fixed top-0 left-0 w-full h-1 z-[60] pointer-events-none bg-accent-gold/20">
        <div 
          ref={progressRef}
          className="h-full w-full bg-accent-gold origin-left scale-x-0 will-change-transform transform-gpu"
        />
      </div>

      <article ref={containerRef} className="max-w-[70ch] mx-auto px-6 mt-24 md:mt-32 relative z-10">
        {/* Drop Cap Paragraph */}
        <p className="reveal-p text-xl md:text-[22px] text-charcoal-ink leading-[1.8] font-body mb-8 will-change-transform transform-gpu">
          <span className="float-left text-7xl md:text-[8rem] font-accent italic text-accent-sage leading-[0.8] pr-6 pt-2 font-light">
            {firstLetter}
          </span>
          {restOfFirstParagraph}
        </p>

        {/* Remaining Paragraphs */}
        {remainingParagraphs.map((p, idx) => (
          <p key={idx} className="reveal-p text-xl md:text-[22px] text-muted-steel leading-[1.8] font-body mb-8 will-change-transform transform-gpu">
            {p}
          </p>
        ))}

        {/* End of Article Ornament */}
        <div className="reveal-p flex flex-col items-center justify-center mt-24 will-change-transform transform-gpu">
          <div className="flex items-center gap-4 opacity-40 mb-12">
            <span className="h-px w-12 bg-charcoal-ink" />
            <div className="w-2 h-2 rotate-45 bg-accent-gold" />
            <span className="h-px w-12 bg-charcoal-ink" />
          </div>

          {/* Tags */}
          {tags && tags.length > 0 && (
            <div className="flex flex-wrap justify-center gap-2">
              {tags.map((tag, idx) => (
                <span 
                  key={idx}
                  className="px-4 py-2 border border-charcoal-ink/10 rounded-full text-[10px] uppercase tracking-widest font-bold text-charcoal-ink/60 hover:border-accent-gold hover:text-accent-gold transition-colors cursor-default"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </article>
    </>
  );
};

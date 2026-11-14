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

  // Helper to parse inline styles (bold, italic, clean HTML)
  const parseInlineStyles = (raw: string): string => {
    let clean = raw.replace(/^<p[^>]*>/i, '').replace(/<\/p>$/i, '');
    clean = clean.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    clean = clean.replace(/(?<!\*)\*([^*]+)\*(?!\*)/g, '<em>$1</em>');
    return clean;
  };

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
        {/* Drop Cap Paragraph with Justify Alignment */}
        <p className="reveal-p text-xl md:text-[22px] text-charcoal-ink leading-[1.8] font-body mb-8 will-change-transform transform-gpu text-justify">
          <span className="float-left text-7xl md:text-[8rem] font-accent italic text-accent-sage leading-[0.8] pr-6 pt-2 font-light">
            {firstLetter}
          </span>
          <span dangerouslySetInnerHTML={{ __html: parseInlineStyles(restOfFirstParagraph) }} />
        </p>

        {/* Remaining Paragraphs & Editorial Blocks */}
        {remainingParagraphs.map((p, idx) => {
          const text = p.trim();

          // 0. Render pre-formatted HTML blocks directly (figure, custom blockquote, custom div)
          if (text.startsWith('<figure') || text.startsWith('<blockquote') || text.startsWith('<div')) {
            return (
              <div key={idx} className="reveal-p my-8 will-change-transform transform-gpu" dangerouslySetInnerHTML={{ __html: text }} />
            );
          }

          // 1. Heading 2
          if (text.startsWith('## ') || text.startsWith('<h2')) {
            const cleanH2 = text.replace('## ', '').replace(/<\/?h2[^>]*>/gi, '');
            return (
              <h2 key={idx} className="reveal-p font-heading font-bold text-2xl md:text-4xl text-charcoal-ink tracking-tight mt-12 mb-5 pb-2 border-b border-charcoal-ink/10 will-change-transform transform-gpu">
                {cleanH2}
              </h2>
            );
          }

          // 2. Heading 3
          if (text.startsWith('### ') || text.startsWith('<h3')) {
            const cleanH3 = text.replace('### ', '').replace(/<\/?h3[^>]*>/gi, '');
            return (
              <h3 key={idx} className="reveal-p font-heading font-bold text-xl md:text-2xl text-accent-sage tracking-tight mt-8 mb-4 will-change-transform transform-gpu">
                {cleanH3}
              </h3>
            );
          }

          // 3. Hadits / Islamic Quote Callout Box
          if (text.startsWith('> ')) {
            const cleanQuote = text.replace(/^>\s*/gm, '');
            const isHadits = text.includes('Mutiara Hikmah') || text.includes('💡');
            return (
              <blockquote key={idx} className={`reveal-p my-8 p-6 md:p-8 rounded-2xl border-l-4 will-change-transform transform-gpu ${
                isHadits 
                  ? 'bg-accent-sage/10 border-accent-sage text-charcoal-ink' 
                  : 'bg-accent-gold/10 border-accent-gold text-charcoal-ink'
              }`}>
                <div className="font-accent italic text-lg md:text-xl leading-relaxed whitespace-pre-line">
                  {cleanQuote}
                </div>
              </blockquote>
            );
          }

          // 4. Inline Markdown Image: ![alt](url)
          const imgMatch = text.match(/^!\[(.*?)\]\((.*?)\)/);
          if (imgMatch) {
            const altText = imgMatch[1];
            const srcUrl = imgMatch[2];
            const captionText = text.replace(imgMatch[0], '').replace(/^\n\*(.*?)\*$/, '$1').trim();

            return (
              <figure key={idx} className="reveal-p my-10 will-change-transform transform-gpu">
                <div className="relative w-full h-[40vh] md:h-[55vh] rounded-2xl overflow-hidden shadow-xl bg-charcoal-ink/5">
                  <img 
                    src={srcUrl} 
                    alt={altText || 'Gambar artikel'} 
                    className="w-full h-full object-cover"
                  />
                </div>
                {captionText && (
                  <figcaption className="mt-3 text-center text-xs md:text-sm text-charcoal-ink/60 italic font-body">
                    {captionText.replace(/\*/g, '')}
                  </figcaption>
                )}
              </figure>
            );
          }

          // 5. Divider
          if (text === '---' || text.startsWith('<hr')) {
            return (
              <div key={idx} className="reveal-p my-12 flex items-center justify-center gap-4 opacity-30 will-change-transform transform-gpu">
                <span className="h-px w-12 bg-charcoal-ink" />
                <div className="w-2 h-2 rotate-45 bg-accent-gold" />
                <span className="h-px w-12 bg-charcoal-ink" />
              </div>
            );
          }

          // 6. Bullet List
          if (text.startsWith('- ')) {
            const items = text.split('\n').filter((l) => l.startsWith('- '));
            return (
              <ul key={idx} className="reveal-p my-6 space-y-2.5 list-disc list-inside text-charcoal-ink/80 will-change-transform transform-gpu">
                {items.map((it, i) => (
                  <li key={i} className="text-lg md:text-xl font-body leading-relaxed">
                    {it.replace('- ', '')}
                  </li>
                ))}
              </ul>
            );
          }

          // Determine alignment class (defaults to text-justify)
          let alignClass = 'text-justify';
          if (text.includes('text-align: center') || text.includes('align="center"')) {
            alignClass = 'text-center';
          } else if (text.includes('text-align: right') || text.includes('align="right"')) {
            alignClass = 'text-right';
          } else if (text.includes('text-align: left') || text.includes('align="left"')) {
            alignClass = 'text-left';
          }

          // 7. Standard Paragraph
          return (
            <p 
              key={idx} 
              className={`reveal-p text-xl md:text-[22px] text-muted-steel leading-[1.8] font-body mb-8 will-change-transform transform-gpu whitespace-pre-line ${alignClass}`}
              dangerouslySetInnerHTML={{ __html: parseInlineStyles(text) }}
            />
          );
        })}

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

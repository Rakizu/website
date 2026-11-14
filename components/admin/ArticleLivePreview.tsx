'use client';

import React from 'react';
import Image from 'next/image';
import { Calendar, User, Clock, Tag, BookOpen, Quote } from 'lucide-react';

interface ArticleLivePreviewProps {
  judul: string;
  kategori: string;
  excerpt: string;
  image: string;
  content: string;
  penulis: string;
  author_role: string;
  tags: string;
}

export function ArticleLivePreview({
  judul,
  kategori,
  excerpt,
  image,
  content,
  penulis,
  author_role,
  tags,
}: ArticleLivePreviewProps) {
  // Parse tags string into array
  const tagsList = tags
    ? tags.split(',').map((t) => t.trim()).filter(Boolean)
    : [];

  // Calculate reading time
  const wordCount = content.trim() ? content.trim().split(/\s+/).filter(Boolean).length : 0;
  const readingTime = Math.max(1, Math.ceil(wordCount / 200));

  // Current date formatted in Indonesian
  const formattedDate = new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date());

  // Split paragraphs by double line break
  const rawParagraphs = content.split(/\n\n+/).filter((p) => p.trim() !== '');
  const firstParagraph = rawParagraphs[0] || '';
  const cleanFirst = firstParagraph.replace(/^<p[^>]*>/i, '').replace(/<\/p>$/i, '');
  const firstLetter = cleanFirst.charAt(0);
  const restOfFirstParagraph = cleanFirst.slice(1);
  const remainingParagraphs = rawParagraphs.slice(1);

  // Helper parser for inline bold, italic, and clean HTML
  const parseInlineStyles = (raw: string): string => {
    let clean = raw.replace(/^<p[^>]*>/i, '').replace(/<\/p>$/i, '');
    clean = clean.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    clean = clean.replace(/(?<!\*)\*([^*]+)\*(?!\*)/g, '<em>$1</em>');
    return clean;
  };

  // Helper parser for markdown-like syntax within paragraphs
  const renderFormattedParagraph = (text: string, isFirst = false) => {
    // 0. Render pre-formatted HTML blocks directly (figures, custom blockquotes, custom divs)
    if (text.startsWith('<figure') || text.startsWith('<blockquote') || text.startsWith('<div')) {
      return (
        <div key={Math.random()} className="my-6" dangerouslySetInnerHTML={{ __html: text }} />
      );
    }

    // 1. Heading 2
    if (text.startsWith('## ') || text.startsWith('<h2')) {
      const cleanH2 = text.replace('## ', '').replace(/<\/?h2[^>]*>/gi, '');
      return (
        <h2 className="font-heading font-bold text-2xl sm:text-3xl text-[#2a201a] tracking-tight mt-10 mb-4 pb-2 border-b border-[#2a201a]/10">
          {cleanH2}
        </h2>
      );
    }

    // 2. Heading 3
    if (text.startsWith('### ') || text.startsWith('<h3')) {
      const cleanH3 = text.replace('### ', '').replace(/<\/?h3[^>]*>/gi, '');
      return (
        <h3 className="font-heading font-bold text-xl sm:text-2xl text-[#6b8e23] tracking-tight mt-8 mb-3">
          {cleanH3}
        </h3>
      );
    }

    // 3. Hadits / Quote Callout Box
    if (text.startsWith('> ')) {
      const cleanQuote = text.replace(/^>\s*/gm, '');
      const isHadits = text.includes('Mutiara Hikmah') || text.includes('💡');
      return (
        <div className={`my-8 p-6 rounded-2xl border-l-4 ${
          isHadits 
            ? 'bg-[#6b8e23]/10 border-[#6b8e23] text-[#2a201a]' 
            : 'bg-[#c79a45]/10 border-[#c79a45] text-[#2a201a]'
        }`}>
          <div className="flex items-start gap-3">
            {isHadits ? <BookOpen size={20} className="text-[#6b8e23] shrink-0 mt-1" /> : <Quote size={20} className="text-[#c79a45] shrink-0 mt-1" />}
            <div className="font-serif italic text-base sm:text-lg leading-relaxed whitespace-pre-line">
              {cleanQuote}
            </div>
          </div>
        </div>
      );
    }

    // 4. Markdown Image: ![alt](url)
    const imgMatch = text.match(/^!\[(.*?)\]\((.*?)\)/);
    if (imgMatch) {
      const altText = imgMatch[1];
      const srcUrl = imgMatch[2];
      const captionText = text.replace(imgMatch[0], '').replace(/^\n\*(.*?)\*$/, '$1').trim();

      return (
        <figure className="my-8">
          <div className="relative w-full h-64 sm:h-96 rounded-2xl overflow-hidden shadow-md bg-slate-100">
            <img 
              src={srcUrl} 
              alt={altText || 'Gambar artikel'} 
              className="w-full h-full object-cover"
            />
          </div>
          {captionText && (
            <figcaption className="mt-2.5 text-center text-xs text-slate-500 font-sans italic">
              {captionText.replace(/\*/g, '')}
            </figcaption>
          )}
        </figure>
      );
    }

    // 5. Divider
    if (text.trim() === '---' || text.trim().startsWith('<hr')) {
      return (
        <div className="my-10 flex items-center justify-center gap-4 opacity-30">
          <span className="h-px w-12 bg-[#2a201a]" />
          <div className="w-2 h-2 rotate-45 bg-[#c79a45]" />
          <span className="h-px w-12 bg-[#2a201a]" />
        </div>
      );
    }

    // 6. Bullet List
    if (text.startsWith('- ')) {
      const items = text.split('\n').filter((l) => l.startsWith('- '));
      return (
        <ul className="my-5 space-y-2 list-disc list-inside text-slate-700 leading-relaxed">
          {items.map((it, i) => (
            <li key={i} className="text-base sm:text-lg font-sans">
              {it.replace('- ', '')}
            </li>
          ))}
        </ul>
      );
    }

    // 7. Regular paragraph with Drop Cap on the first paragraph
    if (isFirst && firstLetter) {
      return (
        <p className="text-lg sm:text-[20px] text-[#2a201a] leading-[1.8] font-sans mb-6 text-justify">
          <span className="float-left text-6xl sm:text-7xl font-serif italic text-[#6b8e23] leading-[0.8] pr-4 pt-1 font-light select-none">
            {firstLetter}
          </span>
          <span dangerouslySetInnerHTML={{ __html: parseInlineStyles(restOfFirstParagraph) }} />
        </p>
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

    return (
      <p 
        className={`text-base sm:text-lg text-[#4a3e35] leading-[1.85] font-sans mb-6 whitespace-pre-line ${alignClass}`}
        dangerouslySetInnerHTML={{ __html: parseInlineStyles(text) }}
      />
    );
  };

  return (
    <div className="w-full h-full overflow-y-auto bg-[#f6efe2] text-[#2a201a] pb-32">
      {/* Top Reading Simulator Bar */}
      <div className="sticky top-0 z-20 w-full h-1 bg-[#c79a45]/20">
        <div className="h-full w-2/3 bg-[#c79a45]" />
      </div>

      <div className="max-w-3xl mx-auto px-6 sm:px-10 pt-10 sm:pt-14">
        
        {/* Category & Date Metadata Header */}
        <div className="flex flex-wrap items-center gap-3 mb-6 text-xs font-mono tracking-wider uppercase">
          <span className="px-3 py-1 rounded-full bg-[#c79a45] text-white font-bold">
            {kategori || 'Edukasi'}
          </span>
          <span className="text-slate-400">•</span>
          <span className="flex items-center gap-1.5 text-slate-600">
            <Calendar size={13} className="text-[#c79a45]" />
            <span>{formattedDate}</span>
          </span>
          <span className="text-slate-400">•</span>
          <span className="flex items-center gap-1.5 text-[#6b8e23] font-semibold">
            <Clock size={13} />
            <span>{readingTime} Menit Baca</span>
          </span>
        </div>

        {/* Monumental Headline */}
        <h1 className="font-heading font-extrabold text-3xl sm:text-5xl text-[#2a201a] leading-[1.1] tracking-tight mb-8">
          {judul || 'Judul Artikel Anda...'}
        </h1>

        {/* Excerpt / Lead Paragraph */}
        {excerpt && (
          <p className="text-lg sm:text-xl font-serif italic text-slate-600 leading-relaxed mb-8 border-l-2 border-[#c79a45] pl-5">
            &ldquo;{excerpt}&rdquo;
          </p>
        )}

        {/* Author Byline */}
        <div className="flex items-center gap-3 py-4 mb-10 border-y border-[#2a201a]/10">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#2a201a] to-[#4a3e35] text-white flex items-center justify-center font-bold text-xs font-serif shadow-sm">
            {penulis ? penulis.charAt(0).toUpperCase() : 'T'}
          </div>
          <div>
            <p className="text-sm font-bold text-[#2a201a]">{penulis || 'Tim Redaksi'}</p>
            <p className="text-[11px] text-slate-500 font-mono tracking-wide">{author_role || 'Editor Utama'}</p>
          </div>
        </div>

        {/* Hero Cover Image */}
        {image && (
          <div className="relative w-full h-64 sm:h-[420px] rounded-3xl overflow-hidden shadow-xl mb-12 bg-slate-200">
            <img
              src={image}
              alt={judul || 'Gambar Artikel'}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Article Body Content */}
        <article className="prose prose-slate max-w-none">
          {rawParagraphs.length === 0 ? (
            <p className="text-slate-400 italic text-center py-16">
              Mulai ketik isi artikel di panel kiri untuk melihat pratinjau langsung...
            </p>
          ) : (
            <>
              {renderFormattedParagraph(firstParagraph, true)}
              {remainingParagraphs.map((p, idx) => (
                <React.Fragment key={idx}>
                  {renderFormattedParagraph(p, false)}
                </React.Fragment>
              ))}
            </>
          )}
        </article>

        {/* Tags Section */}
        {tagsList.length > 0 && (
          <div className="mt-14 pt-8 border-t border-[#2a201a]/10">
            <p className="text-xs font-mono uppercase tracking-widest text-slate-500 mb-3 flex items-center gap-1.5">
              <Tag size={12} className="text-[#c79a45]" />
              <span>Kategori &amp; Topik Terkait:</span>
            </p>
            <div className="flex flex-wrap gap-2">
              {tagsList.map((tag, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 rounded-full text-xs font-medium bg-[#ece3d1] text-[#2a201a] hover:bg-[#c79a45] hover:text-white transition-colors"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Public Footer Signature Ornament */}
        <div className="mt-16 flex flex-col items-center justify-center">
          <div className="flex items-center gap-4 opacity-40 mb-6">
            <span className="h-px w-16 bg-[#2a201a]" />
            <div className="w-2.5 h-2.5 rotate-45 bg-[#c79a45]" />
            <span className="h-px w-16 bg-[#2a201a]" />
          </div>
          <p className="text-[11px] font-mono tracking-[0.2em] uppercase text-slate-400">
            SMPIT THORIQUL JANNAH · BEKASI
          </p>
        </div>

      </div>
    </div>
  );
}

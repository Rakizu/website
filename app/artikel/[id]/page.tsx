import fs from 'fs';
import path from 'path';
import { notFound } from 'next/navigation';
import { IslamicPattern } from '@/components/ui/IslamicPattern';
import { CurtainLink } from '@/components/ui/CurtainLink';
import { ArticleContent } from '@/components/sections/ArticleContent';
import { ArticleExplore } from '@/components/sections/ArticleExplore';
import Image from 'next/image';

// Simulate CMS fetch for a single article and its successor
function getArtikelData(id: string) {
  const filePath = path.join(process.cwd(), 'content/data.json');
  const fileContents = fs.readFileSync(filePath, 'utf8');
  const data = JSON.parse(fileContents);
  
  const currentIndex = data.artikel.findIndex((a: any) => a.id === id);
  if (currentIndex === -1) return { artikel: null, nextArtikel: null };
  
  const artikel = data.artikel[currentIndex];
  const prevArtikel = data.artikel[(currentIndex - 1 + data.artikel.length) % data.artikel.length];
  const nextArtikel = data.artikel[(currentIndex + 1) % data.artikel.length];
  const remainingArticles = data.artikel.filter((a: any) => a.id !== id);
  
  return { artikel, prevArtikel, nextArtikel, remainingArticles };
}

// Generate static params for SSG
export async function generateStaticParams() {
  const filePath = path.join(process.cwd(), 'content/data.json');
  const fileContents = fs.readFileSync(filePath, 'utf8');
  const data = JSON.parse(fileContents);
  
  return data.artikel.map((a: any) => ({
    id: a.id,
  }));
}

export default async function ArtikelPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { artikel, prevArtikel, nextArtikel, remainingArticles } = getArtikelData(id);

  if (!artikel) {
    notFound();
  }

  // Split paragraphs to handle the Drop Cap on the first paragraph
  const paragraphs = artikel.content.split('\n\n');
  const firstParagraph = paragraphs[0];
  const firstLetter = firstParagraph.charAt(0);
  const restOfFirstParagraph = firstParagraph.slice(1);
  const remainingParagraphs = paragraphs.slice(1);

  return (
    <main data-theme="light" className="bg-canvas-white text-charcoal-ink min-h-screen relative overflow-hidden pb-32">
      <IslamicPattern color="#2a201a" opacity={0.03} />
      
      {/* Navigation (Floating Back Button) */}
      <nav className="fixed top-24 left-0 w-full p-6 md:p-12 z-50 pointer-events-none hidden md:block">
        <CurtainLink 
          href="/#artikel" 
          isRoute={true}
          className="inline-flex items-center gap-3 hover:gap-5 transition-all duration-500 text-sm tracking-widest uppercase font-semibold text-charcoal-ink/60 hover:text-charcoal-ink pointer-events-auto"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M19 12H5M12 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Kembali
        </CurtainLink>
      </nav>

      {/* Classic Editorial Header (Below Navbar) */}
      <div className="w-full max-w-4xl mx-auto px-6 md:px-12 pt-32 md:pt-40 pb-12 relative z-20">
        <div className="flex items-center gap-4 text-charcoal-ink/60 text-xs tracking-widest uppercase font-semibold mb-8">
          <span>{artikel.kategori}</span>
          <span className="w-1 h-1 rounded-full bg-accent-gold" />
          <span>{artikel.tanggal}</span>
          <span className="w-1 h-1 rounded-full bg-accent-gold" />
          <span>{artikel.waktu_baca || '5 Menit Baca'}</span>
        </div>
        
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-heading font-bold text-charcoal-ink tracking-tight leading-[1.1] mb-10">
          {artikel.judul}
        </h1>
        
        {/* Professional Byline */}
        <div className="flex items-center gap-4 pt-6 border-t border-charcoal-ink/10">
          {artikel.author_avatar ? (
            <div className="w-12 h-12 rounded-full relative overflow-hidden border border-accent-gold/30">
              <Image src={artikel.author_avatar} alt={artikel.penulis} fill className="object-cover" sizes="48px" />
            </div>
          ) : (
            <div className="w-12 h-12 rounded-full bg-charcoal-ink text-accent-gold flex items-center justify-center font-heading font-bold text-lg">
              {artikel.penulis?.charAt(0) || 'T'}
            </div>
          )}
          <div className="flex flex-col">
            <span className="text-charcoal-ink font-heading font-semibold tracking-wide">{artikel.penulis || 'Tim Redaksi'}</span>
            <span className="text-accent-gold text-xs uppercase tracking-widest font-bold">{artikel.author_role || 'Editor Utama'}</span>
          </div>
        </div>
      </div>

      {/* Unobstructed Hero Image */}
      <div className="w-full max-w-[1400px] mx-auto px-6 md:px-12 mb-16">
        <div className="w-full h-[50vh] md:h-[70vh] relative overflow-hidden rounded-3xl shadow-2xl group bg-charcoal-ink/5">
          <Image 
            src={artikel.image} 
            alt={artikel.judul} 
            fill
            priority
            className="object-cover scale-100 group-hover:scale-105 transition-transform duration-[2s] ease-[cubic-bezier(0.19,1,0.22,1)] will-change-transform"
            sizes="(max-width: 1400px) 100vw, 1400px"
          />
        </div>
      </div>

      {/* Editorial Content (Client Component for Animations) */}
      <ArticleContent 
        firstLetter={firstLetter} 
        restOfFirstParagraph={restOfFirstParagraph} 
        remainingParagraphs={remainingParagraphs} 
        tags={artikel.tags || []}
      />

      {/* Explore More Articles with Search */}
      <ArticleExplore articles={remainingArticles} />

      {/* Prev / Next Article Split Footer */}
      <div className="w-full flex flex-col md:flex-row border-t border-charcoal-ink/10">
        
        {/* Prev Article */}
        {prevArtikel && (
          <CurtainLink 
            href={`/artikel/${prevArtikel.id}`}
            isRoute={true}
            className="group block w-full md:w-1/2 relative h-[40vh] md:h-[50vh] overflow-hidden flex items-center justify-center border-b md:border-b-0 md:border-r border-charcoal-ink/10"
          >
            <div className="absolute inset-0 z-0 bg-charcoal-ink/5">
              <Image 
                src={prevArtikel.image} 
                alt={prevArtikel.judul} 
                fill
                className="object-cover grayscale opacity-20 group-hover:scale-110 group-hover:opacity-40 transition-all duration-[1.5s] ease-[cubic-bezier(0.19,1,0.22,1)] will-change-transform"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
            <div className="absolute inset-0 bg-charcoal-ink/80 group-hover:bg-charcoal-ink/60 transition-colors duration-[1s] z-10" />
            
            <div className="relative z-20 text-center flex flex-col items-center px-6">
              <span className="text-accent-gold text-xs uppercase tracking-[0.4em] font-semibold mb-6 block transform group-hover:-translate-y-2 transition-transform duration-700 will-change-transform transform-gpu">
                Sebelumnya
              </span>
              <h2 className="text-2xl md:text-4xl font-heading text-pure-surface max-w-sm tracking-tighter leading-tight transform group-hover:scale-105 transition-transform duration-1000 ease-out will-change-transform transform-gpu">
                {prevArtikel.judul}
              </h2>
            </div>
          </CurtainLink>
        )}

        {/* Next Article */}
        {nextArtikel && (
          <CurtainLink 
            href={`/artikel/${nextArtikel.id}`}
            isRoute={true}
            className="group block w-full md:w-1/2 relative h-[40vh] md:h-[50vh] overflow-hidden flex items-center justify-center"
          >
            <div className="absolute inset-0 z-0 bg-charcoal-ink/5">
              <Image 
                src={nextArtikel.image} 
                alt={nextArtikel.judul} 
                fill
                className="object-cover grayscale opacity-20 group-hover:scale-110 group-hover:opacity-40 transition-all duration-[1.5s] ease-[cubic-bezier(0.19,1,0.22,1)] will-change-transform"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
            <div className="absolute inset-0 bg-charcoal-ink/80 group-hover:bg-charcoal-ink/60 transition-colors duration-[1s] z-10" />
            
            <div className="relative z-20 text-center flex flex-col items-center px-6">
              <span className="text-accent-gold text-xs uppercase tracking-[0.4em] font-semibold mb-6 block transform group-hover:-translate-y-2 transition-transform duration-700 will-change-transform transform-gpu">
                Selanjutnya
              </span>
              <h2 className="text-2xl md:text-4xl font-heading text-pure-surface max-w-sm tracking-tighter leading-tight transform group-hover:scale-105 transition-transform duration-1000 ease-out will-change-transform transform-gpu">
                {nextArtikel.judul}
              </h2>
            </div>
          </CurtainLink>
        )}
      </div>
    </main>
  );
}

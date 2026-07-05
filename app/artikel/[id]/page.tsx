import fs from 'fs';
import path from 'path';
import { notFound } from 'next/navigation';
import { IslamicPattern } from '@/components/ui/IslamicPattern';
import { CurtainLink } from '@/components/ui/CurtainLink';
import { ArticleContent } from '@/components/sections/ArticleContent';
import { ArticleExplore } from '@/components/sections/ArticleExplore';

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
      <nav className="fixed top-0 left-0 w-full p-6 md:p-12 z-50 pointer-events-none">
        <CurtainLink 
          href="#artikel" 
          isRoute={false}
          className="inline-flex items-center gap-3 hover:gap-5 transition-all duration-500 text-sm tracking-widest uppercase font-semibold text-pure-surface mix-blend-difference pointer-events-auto"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M19 12H5M12 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Kembali
        </CurtainLink>
      </nav>

      {/* Cinematic Hero Image */}
      <div data-theme="dark" className="w-full h-[60vh] md:h-[80vh] relative overflow-hidden group">
        <div className="absolute inset-0 bg-charcoal-ink/40 z-10" />
        <img 
          src={artikel.image} 
          alt={artikel.judul} 
          className="w-full h-full object-cover grayscale-[0.3] scale-105 group-hover:scale-100 group-hover:grayscale-0 transition-transform duration-[2s] ease-[cubic-bezier(0.19,1,0.22,1)]"
        />
        
        {/* Title Overlay */}
        <div className="absolute bottom-0 left-0 w-full p-6 md:p-16 z-20 bg-gradient-to-t from-charcoal-ink via-charcoal-ink/80 to-transparent pt-40">
          <div className="max-w-4xl mx-auto flex flex-col gap-8">
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-heading font-medium text-pure-surface tracking-tighter leading-[1.05]">
              {artikel.judul}
            </h1>
            
            {/* Professional Byline */}
            <div className="flex flex-col md:flex-row md:items-center gap-6 pt-6 border-t border-white/20">
              <div className="flex items-center gap-4">
                {artikel.author_avatar ? (
                  <img src={artikel.author_avatar} alt={artikel.penulis} className="w-12 h-12 rounded-full object-cover border border-accent-gold/30" />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-accent-gold flex items-center justify-center text-charcoal-ink font-heading font-bold text-lg">
                    {artikel.penulis?.charAt(0) || 'T'}
                  </div>
                )}
                <div className="flex flex-col">
                  <span className="text-pure-surface font-heading font-medium tracking-wide">{artikel.penulis || 'Tim Redaksi'}</span>
                  <span className="text-accent-gold text-xs uppercase tracking-widest font-bold">{artikel.author_role || 'Editor Utama'}</span>
                </div>
              </div>
              
              <div className="hidden md:block w-px h-8 bg-white/20" />
              
              <div className="flex items-center gap-4 text-white/50 text-xs tracking-widest uppercase font-semibold">
                <span>{artikel.kategori}</span>
                <span className="w-1 h-1 rounded-full bg-accent-gold" />
                <span>{artikel.tanggal}</span>
                <span className="w-1 h-1 rounded-full bg-accent-gold" />
                <span>{artikel.waktu_baca || '5 Menit Baca'}</span>
              </div>
            </div>
          </div>
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
            <div className="absolute inset-0 z-0">
              <img 
                src={prevArtikel.image} 
                alt={prevArtikel.judul} 
                className="w-full h-full object-cover grayscale opacity-20 group-hover:scale-110 group-hover:opacity-40 transition-all duration-[1.5s] ease-[cubic-bezier(0.19,1,0.22,1)]"
              />
            </div>
            <div className="absolute inset-0 bg-charcoal-ink/80 group-hover:bg-charcoal-ink/60 transition-colors duration-[1s] z-10" />
            
            <div className="relative z-20 text-center flex flex-col items-center px-6">
              <span className="text-accent-gold text-xs uppercase tracking-[0.4em] font-semibold mb-6 block transform group-hover:-translate-y-2 transition-transform duration-700">
                Sebelumnya
              </span>
              <h2 className="text-2xl md:text-4xl font-heading text-pure-surface max-w-sm tracking-tighter leading-tight transform group-hover:scale-105 transition-transform duration-1000 ease-out">
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
            <div className="absolute inset-0 z-0">
              <img 
                src={nextArtikel.image} 
                alt={nextArtikel.judul} 
                className="w-full h-full object-cover grayscale opacity-20 group-hover:scale-110 group-hover:opacity-40 transition-all duration-[1.5s] ease-[cubic-bezier(0.19,1,0.22,1)]"
              />
            </div>
            <div className="absolute inset-0 bg-charcoal-ink/80 group-hover:bg-charcoal-ink/60 transition-colors duration-[1s] z-10" />
            
            <div className="relative z-20 text-center flex flex-col items-center px-6">
              <span className="text-accent-gold text-xs uppercase tracking-[0.4em] font-semibold mb-6 block transform group-hover:-translate-y-2 transition-transform duration-700">
                Selanjutnya
              </span>
              <h2 className="text-2xl md:text-4xl font-heading text-pure-surface max-w-sm tracking-tighter leading-tight transform group-hover:scale-105 transition-transform duration-1000 ease-out">
                {nextArtikel.judul}
              </h2>
            </div>
          </CurtainLink>
        )}
      </div>
    </main>
  );
}

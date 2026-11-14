import { GatePageV2 } from '@/components/sections/GatePageV2';
import { HeroCinematic } from '@/components/sections/HeroCinematic';

export default function TestGatePage() {
  return (
    <main className="bg-canvas-white text-charcoal-ink min-h-screen" data-theme="light">
      <GatePageV2 />
      <HeroCinematic />
      
      {/* Dummy content to test scroll after gate exits */}
      <section className="min-h-[100dvh] bg-chapter-sage text-cream flex items-center justify-center">
        <div className="text-center max-w-2xl mx-auto px-8">
          <h2 className="text-5xl md:text-7xl font-heading font-bold tracking-tighter mb-8">
            Seksi Berikutnya
          </h2>
          <p className="text-lg font-accent italic text-cream/70 leading-relaxed">
            Jika Anda melihat teks ini setelah animasi gate selesai, berarti transisi fly-through 
            dan split-screen berhasil dengan sempurna. Scroll juga sudah dipulihkan.
          </p>
        </div>
      </section>

      <section className="min-h-[100dvh] bg-ink text-cream flex items-center justify-center">
        <div className="text-center max-w-2xl mx-auto px-8">
          <h2 className="text-5xl md:text-7xl font-heading font-bold tracking-tighter mb-8 text-accent-gold">
            Seksi Gelap
          </h2>
          <p className="text-lg font-accent italic text-cream/60 leading-relaxed">
            Pengujian transisi warna latar dari sage ke ink gelap.
          </p>
        </div>
      </section>
    </main>
  );
}

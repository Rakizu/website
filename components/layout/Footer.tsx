import React from 'react';

export const Footer = () => {
  return (
    <footer className="bg-charcoal-ink text-pure-surface pt-32 pb-12 border-t border-whisper-border/10 overflow-hidden relative">
      <div className="max-w-[1400px] mx-auto px-6 md:px-16 flex flex-col items-center text-center relative z-10">
        
        {/* Massive Footer Typography */}
        <h2 className="text-[12vw] font-heading font-bold uppercase tracking-tighter leading-none mb-12 text-pure-surface opacity-90 mix-blend-overlay">
          Mari Melangkah
        </h2>
        
        <div className="flex flex-col md:flex-row justify-between w-full mt-24 pt-12 border-t border-pure-surface/10 gap-12 text-left">
          
          <div className="max-w-sm">
            <div className="font-heading font-bold text-2xl mb-4">SMPIT Thoriqul Jannah</div>
            <p className="text-muted-steel leading-relaxed mb-6">
              Mencetak Generasi Sholeh, Mandiri, Kreatif, dan Berprestasi. Sebuah langkah nyata untuk masa depan.
            </p>
            <div className="text-sm font-medium uppercase tracking-widest text-accent-gold">
              NPSN: 69947963
            </div>
          </div>

          <div className="flex gap-16 md:gap-24">
            <div className="flex flex-col gap-4">
              <h4 className="text-xs uppercase tracking-widest font-medium text-pure-surface/50 mb-2">Navigasi</h4>
              {['Visi Misi', 'Program', 'Guru', 'Fasilitas', 'Prestasi'].map(item => (
                <a key={item} href="#" className="hover:text-accent-gold transition-colors">{item}</a>
              ))}
            </div>
            <div className="flex flex-col gap-4">
              <h4 className="text-xs uppercase tracking-widest font-medium text-pure-surface/50 mb-2">Kontak</h4>
              <p className="text-muted-steel max-w-xs">
                Jl. Lamatti, Kel. Bongki, Kec. Sinjai Utara, Kode Pos 92615
              </p>
              <a href="#" className="hover:text-accent-gold transition-colors mt-2">admin@thoriquljannah.sch.id</a>
            </div>
          </div>
        </div>

        <div className="w-full flex flex-col md:flex-row items-center justify-between mt-24 text-sm text-pure-surface/40">
          <p>&copy; {new Date().getFullYear()} SMPIT Thoriqul Jannah. All rights reserved.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-pure-surface transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-pure-surface transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

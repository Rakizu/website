import React from 'react';
import { cookies } from 'next/headers';
import { IslamicPattern } from '@/components/ui/IslamicPattern';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const session = cookieStore.get('tj_session');
  const role = session?.value === 'writer' ? 'Writer (Penulis)' : 'Publisher (Admin)';
  const isWriter = session?.value === 'writer';

  return (
    <div className="relative w-full min-h-screen z-[2000] bg-ink text-cream flex flex-col items-center overflow-hidden">
      {/* Background Cinematic */}
      <IslamicPattern color="#c79a45" opacity={0.02} />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_20%,rgba(0,0,0,0.7)_100%)] pointer-events-none" />

      {/* Hide global footer and navbar while in admin mode */}
      <style>{`
        footer, nav.fixed { display: none !important; }
      `}</style>
      
      {/* Slim Cinematic Topbar */}
      <header id="admin-global-header" className="sticky top-0 w-full px-8 py-4 border-b border-white/5 bg-[#1A1A2E]/50 backdrop-blur-xl backdrop-saturate-200 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.05),0_10px_30px_rgba(0,0,0,0.5)] flex justify-between items-center z-50">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-sage flex items-center justify-center shadow-[0_0_15px_rgba(107,142,35,0.3)]">
            <span className="font-heading font-bold text-sm text-cream tracking-widest">TJ</span>
          </div>
          <div className="flex flex-col">
            <span className="font-heading font-bold text-sm tracking-wide text-cream">Workspace</span>
            <div className="flex items-center gap-2 mt-0.5">
              <span className={`w-1.5 h-1.5 rounded-full ${isWriter ? 'bg-blue-400 shadow-[0_0_10px_rgba(96,165,250,0.8)]' : 'bg-gold shadow-[0_0_10px_rgba(199,154,69,0.8)]'}`} />
              <span className="text-[10px] font-medium text-cream/50 uppercase tracking-widest">{role}</span>
            </div>
          </div>
        </div>
        
        <nav className="flex items-center gap-8">
          <a href="/admin/artikel" className="text-xs font-semibold text-cream/70 hover:text-gold transition-colors tracking-widest uppercase">Kelola Artikel</a>
          <div className="w-px h-4 bg-white/10" />
          <form action="/api/auth/logout" method="POST" className="m-0 p-0">
            <button type="submit" className="text-xs font-semibold text-cream/70 hover:text-red-400 transition-colors tracking-widest uppercase">Keluar</button>
          </form>
        </nav>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col relative w-full z-10">
        {children}
      </main>
    </div>
  );
}

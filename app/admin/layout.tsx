import React from 'react';
import { cookies } from 'next/headers';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const session = cookieStore.get('tj_session');
  const role = session?.value === 'writer' ? 'Writer (Penulis)' : 'Publisher (Admin)';
  const isWriter = session?.value === 'writer';

  return (
    <div className="relative w-full min-h-screen z-[2000] bg-[#FAFAFA] text-slate-900 flex flex-col items-center">
      {/* Hide global footer and navbar while in admin mode */}
      <style>{`
        footer, nav.fixed { display: none !important; }
      `}</style>
      
      {/* Premium SaaS Enterprise Ribbon */}
      <header id="admin-global-header" className="sticky top-0 w-full px-6 py-3 bg-white/80 backdrop-blur-xl border-b border-slate-200/60 shadow-[0_4px_24px_rgba(0,0,0,0.02)] flex justify-between items-center z-50">
        <div className="flex items-center gap-5">
          {/* Studio Badge */}
          <div className="flex items-center gap-3 pr-5 border-r border-slate-200/60">
            <div className="w-8 h-8 rounded-[8px] bg-gradient-to-tr from-slate-900 to-slate-800 flex items-center justify-center shadow-[0_2px_8px_rgba(0,0,0,0.15)] ring-1 ring-slate-900/10">
              <span className="font-heading font-bold text-xs text-white tracking-widest leading-none">TJ</span>
            </div>
            <span className="font-sans font-bold text-sm tracking-tight text-slate-800">Studio</span>
          </div>

          {/* Role Indicator */}
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200/80 px-2.5 py-1 rounded-full shadow-sm">
            <span className={`w-1.5 h-1.5 rounded-full ${isWriter ? 'bg-blue-500 shadow-[0_0_6px_rgba(59,130,246,0.6)]' : 'bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.6)]'}`} />
            <span className="text-[10px] font-semibold text-slate-600 uppercase tracking-widest">{role}</span>
          </div>
        </div>
        
        <nav className="flex items-center gap-2">
          <a 
            href="/admin/artikel" 
            className="px-4 py-2 rounded-lg text-[11px] font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-all tracking-wider uppercase"
          >
            Dashboard
          </a>
          <div className="w-px h-4 bg-slate-200 mx-2" />
          <form action="/api/auth/logout" method="POST" className="m-0 p-0">
            <button 
              type="submit" 
              className="px-4 py-2 rounded-lg text-[11px] font-semibold text-slate-500 hover:text-red-600 hover:bg-red-50 transition-all tracking-wider uppercase"
            >
              Log Out
            </button>
          </form>
        </nav>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col relative w-full z-10 selection:bg-slate-200 selection:text-slate-900">
        {children}
      </main>
    </div>
  );
}

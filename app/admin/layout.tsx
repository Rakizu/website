import React from 'react';
import { cookies } from 'next/headers';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const session = cookieStore.get('tj_session');
  const role = session?.value === 'writer' ? 'Writer (Penulis)' : 'Publisher (Admin)';
  const isWriter = session?.value === 'writer';

  return (
    <div className="relative w-full min-h-screen z-[2000] bg-[#F8F8FF] text-slate-800 flex flex-col items-center">
      {/* Hide global footer and navbar while in admin mode */}
      <style>{`
        footer, nav.fixed { display: none !important; }
      `}</style>
      
      {/* Slim Enterprise Topbar */}
      <header id="admin-global-header" className="sticky top-0 w-full px-8 py-4 border-b border-slate-200 bg-white/80 backdrop-blur-md flex justify-between items-center z-50">
        <div className="flex items-center gap-4">
          <div className="w-9 h-9 rounded-lg bg-slate-900 flex items-center justify-center shadow-sm">
            <span className="font-heading font-bold text-xs text-white tracking-widest">TJ</span>
          </div>
          <div className="flex flex-col">
            <span className="font-heading font-bold text-sm tracking-wide text-slate-900">Workspace</span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className={`w-1.5 h-1.5 rounded-full ${isWriter ? 'bg-blue-500' : 'bg-green-500'}`} />
              <span className="text-[10px] font-medium text-slate-500 uppercase tracking-widest">{role}</span>
            </div>
          </div>
        </div>
        
        <nav className="flex items-center gap-6">
          <a href="/admin/artikel" className="text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors tracking-wide">Kelola Artikel</a>
          <div className="w-px h-4 bg-slate-200" />
          <form action="/api/auth/logout" method="POST" className="m-0 p-0">
            <button type="submit" className="text-xs font-semibold text-slate-400 hover:text-red-500 transition-colors tracking-wide">Keluar</button>
          </form>
        </nav>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col relative w-full">
        {children}
      </main>
    </div>
  );
}

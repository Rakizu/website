'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { CurtainLink } from '@/components/ui/CurtainLink';

interface Artikel {
  id: string;
  judul: string;
  kategori: string;
  tanggal: string;
  excerpt?: string;
  penulis?: string;
  waktu_baca?: string;
  status?: string;
}

export default function AdminArtikelList() {
  const [articles, setArticles] = useState<Artikel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userRole, setUserRole] = useState('writer'); // default safe
  const router = useRouter();

  useEffect(() => {
    fetchAuth();
    fetchArticles();
  }, []);

  const fetchAuth = async () => {
    try {
      const res = await fetch('/api/auth/me');
      const json = await res.json();
      if (json.success) setUserRole(json.role);
    } catch (e) {
      console.error(e);
    }
  };

  const fetchArticles = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/artikel');
      const json = await res.json();
      if (json.success) setArticles(json.data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string, judul: string) => {
    if (!confirm(`Apakah Anda yakin ingin menghapus "${judul}"?`)) return;
    
    try {
      const res = await fetch(`/api/artikel/${id}`, { method: 'DELETE' });
      const json = await res.json();
      if (json.success) {
        setArticles(articles.filter(a => a.id !== id));
      } else {
        alert('Gagal menghapus: ' + json.message);
      }
    } catch (error) {
      alert('Terjadi kesalahan jaringan.');
    }
  };

  return (
    <div className="flex-1 w-full min-h-screen bg-chapter-cream cinematic-grain relative pb-32">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 pt-20">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 pb-12 border-b border-whisper-border gap-8">
          <div className="max-w-2xl">
            <span className="font-accent italic text-gold text-lg md:text-xl mb-4 block">Editorial Dashboard</span>
            <h2 className="text-5xl md:text-7xl font-heading font-bold text-charcoal-ink tracking-tighter leading-[0.9]">
              Studio Artikel
            </h2>
          </div>
          <div className="flex items-center gap-6">
            <p className="text-muted-steel font-body text-sm uppercase tracking-widest hidden md:block">
              Total {articles.length} Publikasi
            </p>
            <button 
              onClick={() => router.push('/admin/artikel/editor/new')}
              className="group relative px-8 py-4 bg-sage text-cream font-heading font-bold text-sm uppercase tracking-widest rounded-full hover:shadow-[0_10px_40px_rgba(107,142,35,0.3)] hover:-translate-y-1 transition-all duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] overflow-hidden flex items-center gap-3"
            >
              <span className="relative z-10 flex items-center gap-2">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M5 12h14"/></svg>
                Tulis Baru
              </span>
              <div className="absolute inset-0 bg-sage-deep transform translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)]" />
            </button>
          </div>
      </div>

      <div className="w-full">
        {isLoading ? (
          <div className="py-20 text-center text-slate-400 animate-pulse text-sm font-medium">Memuat database...</div>
        ) : articles.length === 0 ? (
          <div className="py-20 text-center text-slate-500 border border-slate-200 rounded-xl bg-white text-sm shadow-sm">
            Belum ada artikel. Mulailah menulis!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {articles.map((a, i) => (
              <div 
                key={a.id} 
                className="group relative flex flex-col justify-between h-[380px] p-8 rounded-[2.5rem] bg-pure-surface border border-whisper-border shadow-[0_4px_20px_rgb(0,0,0,0.02)] hover:border-gold-soft hover:shadow-[0_20px_60px_rgb(199,154,69,0.15)] hover:-translate-y-2 transition-all duration-700 ease-[cubic-bezier(0.19,1,0.22,1)] overflow-hidden cursor-pointer"
                onClick={(e) => {
                  // Prevent navigation if clicking action buttons
                  const target = e.target as HTMLElement;
                  if (!target.closest('.action-btns')) {
                    router.push(`/admin/artikel/editor/${a.id}`);
                  }
                }}
                style={{ animationDelay: `${i * 100}ms`, animationFillMode: 'both', animationName: 'fadeUp', animationDuration: '800ms' }}
              >
                {/* Cinematic Vignette on hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-gold-soft/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

                <div className="relative z-10 flex flex-col gap-6">
                  {/* Top Row: Category & Status */}
                  <div className="flex justify-between items-start">
                    <span className="inline-block px-4 py-1.5 rounded-full bg-canvas-white text-charcoal-ink font-heading text-[10px] uppercase tracking-widest font-bold border border-whisper-border group-hover:bg-gold-soft/10 group-hover:border-gold-soft transition-colors duration-500">
                      {a.kategori}
                    </span>
                    <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-whisper-border shadow-sm">
                      <span className={`w-2 h-2 rounded-full ${a.status === 'Published' ? 'bg-green-500' : 'bg-amber-500'}`}></span>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-muted-steel">{a.status}</span>
                    </div>
                  </div>
                  
                  {/* Title & Excerpt */}
                  <div>
                    <h3 className="text-2xl font-heading font-bold text-charcoal-ink mb-3 group-hover:text-sage-deep transition-colors duration-500 line-clamp-3 leading-tight">
                      {a.judul}
                    </h3>
                    <p className="text-sm font-body text-muted-steel line-clamp-2 leading-relaxed">
                      {a.excerpt || "Tidak ada ringkasan yang tersedia..."}
                    </p>
                  </div>
                </div>

                {/* Bottom Row: Date & Actions */}
                <div className="relative z-10 flex items-center justify-between border-t border-whisper-border pt-6 mt-4">
                  <span className="text-xs font-semibold font-body tracking-widest text-muted-steel uppercase">{a.tanggal}</span>
                  
                  <div className="action-btns flex items-center gap-2 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 ease-out">
                    <button 
                      onClick={(e) => { e.stopPropagation(); router.push(`/admin/artikel/editor/${a.id}`); }}
                      className="p-3 rounded-full bg-canvas-white border border-whisper-border text-charcoal-ink hover:bg-sage hover:border-sage hover:text-cream hover:shadow-lg transition-all duration-300"
                      title="Edit"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                    </button>
                    {userRole === 'publisher' && (
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleDelete(a.id, a.judul); }}
                        className="p-3 rounded-full bg-canvas-white border border-whisper-border text-red-400 hover:bg-red-500 hover:border-red-500 hover:text-white hover:shadow-lg transition-all duration-300"
                        title="Hapus"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      </div>
    </div>
  );
}

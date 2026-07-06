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
    <div className="flex-1 w-full max-w-6xl mx-auto px-6 py-10">
      <div className="flex justify-between items-center mb-10 border-b border-whisper-border pb-6">
        <div>
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-charcoal-ink tracking-tight mb-2">
            Studio Artikel
          </h2>
          <p className="text-muted-steel text-sm font-medium">Menampilkan {articles.length} publikasi dalam database.</p>
        </div>
        <button 
          onClick={() => router.push('/admin/artikel/editor/new')}
          className="px-6 py-2.5 rounded-full bg-sage text-cream font-semibold text-sm hover:bg-sage-deep hover:-translate-y-0.5 hover:shadow-lg hover:shadow-sage/20 active:scale-95 transition-all duration-300 ease-out flex items-center gap-2"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M5 12h14"/></svg>
          Tulis Baru
        </button>
      </div>

      <div className="w-full">
        {isLoading ? (
          <div className="py-20 text-center text-slate-400 animate-pulse text-sm font-medium">Memuat database...</div>
        ) : articles.length === 0 ? (
          <div className="py-20 text-center text-slate-500 border border-slate-200 rounded-xl bg-white text-sm shadow-sm">
            Belum ada artikel. Mulailah menulis!
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {/* Table Header */}
            <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-3 text-[11px] font-bold text-muted-steel uppercase tracking-widest border-b border-whisper-border mb-2">
               <div className="col-span-2">Status & Tanggal</div>
               <div className="col-span-6">Informasi Artikel</div>
               <div className="col-span-2">Kategori</div>
               <div className="col-span-2 text-right">Aksi</div>
            </div>

            {articles.map((a, i) => (
              <div 
                key={a.id} 
                className="group grid grid-cols-1 md:grid-cols-12 gap-4 items-center px-6 py-5 rounded-2xl bg-canvas-white border border-whisper-border shadow-[0_2px_10px_rgb(0,0,0,0.02)] hover:border-gold-soft hover:shadow-[0_8px_30px_rgb(199,154,69,0.1)] hover:-translate-y-1 transition-all duration-500 ease-[cubic-bezier(0.19,1,0.22,1)]"
              >
                <div className="col-span-2 flex items-center gap-3">
                  <div className="relative flex items-center justify-center w-2 h-2">
                    <span className={`relative w-2 h-2 rounded-full ${
                      a.status === 'Published' ? 'bg-green-500' : 'bg-amber-500'
                    }`}></span>
                  </div>
                  <span className="text-xs font-semibold font-body tracking-wider text-muted-steel uppercase">{a.tanggal}</span>
                </div>
                
                <div className="col-span-6 min-w-0 pr-4">
                  <h3 className="text-lg font-heading font-bold truncate text-charcoal-ink mb-1 group-hover:text-gold transition-colors duration-300">{a.judul}</h3>
                  <p className="text-sm font-body text-muted-steel truncate">
                    {a.excerpt || "Tidak ada ringkasan..."}
                  </p>
                </div>

                <div className="col-span-2">
                  <span className="inline-block px-3 py-1 rounded-full bg-cream text-charcoal-ink text-[10px] uppercase tracking-widest font-bold border border-whisper-border group-hover:bg-gold-soft/10 group-hover:border-gold-soft transition-colors duration-300">
                    {a.kategori}
                  </span>
                </div>
                
                <div className="col-span-2 flex items-center justify-end gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all duration-300 translate-x-2 md:group-hover:translate-x-0">
                  <button 
                    onClick={() => router.push(`/admin/artikel/editor/${a.id}`)}
                    className="p-3 rounded-full bg-cream text-charcoal-ink hover:bg-sage hover:text-cream hover:shadow-lg hover:shadow-sage/20 active:scale-90 transition-all duration-300 ease-out"
                    title="Edit"
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                  </button>
                  {userRole === 'publisher' && (
                    <button 
                      onClick={() => handleDelete(a.id, a.judul)}
                      className="p-3 rounded-full bg-red-50 text-red-600 hover:bg-red-500 hover:text-white hover:shadow-lg hover:shadow-red-500/20 active:scale-90 transition-all duration-300 ease-out"
                      title="Hapus"
                    >
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

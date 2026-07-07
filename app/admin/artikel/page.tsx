'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

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

  const glassBtnClass = "relative overflow-hidden group transition-all duration-500 hover:scale-105 hover:shadow-[0_0_25px_rgba(53,71,17,0.8)] border-0 bg-[#354711]/90 backdrop-blur-md backdrop-saturate-150 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.2),inset_1px_2px_0_-1px_rgba(255,255,255,0.4),inset_-1px_-1px_0_-1px_rgba(0,0,0,0.3),0_4px_15px_rgba(53,71,17,0.6)] text-white drop-shadow-md";

  return (
    <div className="w-full flex-1 p-6 md:p-10 font-sans text-cream max-w-7xl mx-auto z-10 relative">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
        <div>
          <h1 className="text-3xl font-heading font-bold text-cream tracking-tight mb-2">Dokumen Artikel</h1>
          <p className="text-sm font-medium text-cream/60 uppercase tracking-widest">Kelola dan publikasikan artikel (Total: {articles.length})</p>
        </div>
        <button 
          onClick={() => router.push('/admin/artikel/editor/new')}
          className={`flex items-center gap-2 px-6 py-3 rounded-full font-heading uppercase tracking-widest text-xs font-bold ${glassBtnClass}`}
        >
          <span className="relative z-10 flex items-center gap-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M5 12h14"/></svg>
            Tulis Baru
          </span>
          <div className="absolute top-0 -left-[150%] w-full h-full skew-x-[-25deg] transition-all duration-700 ease-in-out group-hover:left-[150%] bg-[linear-gradient(to_right,transparent,rgba(255,255,255,0.6),transparent)]" />
        </button>
      </div>

      {/* Data Table Area */}
      <div className="w-full bg-[#1A1A2E]/40 backdrop-blur-xl border border-white/10 rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.5)] overflow-hidden">
        {isLoading ? (
          <div className="py-24 flex items-center justify-center text-cream/40 animate-pulse text-sm font-medium tracking-widest uppercase">
            Memuat database...
          </div>
        ) : articles.length === 0 ? (
          <div className="py-24 flex flex-col items-center justify-center text-center">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="text-cream/20 mb-6"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
            <p className="text-cream/70 text-sm font-medium tracking-wide">Belum ada dokumen ditemukan.</p>
            <p className="text-cream/40 text-xs mt-2 uppercase tracking-widest">Klik "Tulis Baru" untuk membuat artikel pertama Anda.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white/5 border-b border-white/10 text-[10px] text-cream/50 font-bold uppercase tracking-[0.2em]">
                  <th className="px-8 py-5 whitespace-nowrap w-2/5">Judul Dokumen</th>
                  <th className="px-8 py-5 whitespace-nowrap">Kategori</th>
                  <th className="px-8 py-5 whitespace-nowrap">Status</th>
                  <th className="px-8 py-5 whitespace-nowrap">Tanggal</th>
                  <th className="px-8 py-5 whitespace-nowrap text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-sm">
                {articles.map((a) => (
                  <tr key={a.id} className="hover:bg-white/5 transition-colors group">
                    <td className="px-8 py-5">
                      <div className="font-heading font-semibold text-cream group-hover:text-gold transition-colors line-clamp-1">{a.judul}</div>
                      <div className="text-xs text-cream/40 mt-1.5 line-clamp-1">{a.excerpt || 'Tidak ada ringkasan...'}</div>
                    </td>
                    <td className="px-8 py-5 whitespace-nowrap">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-white/10 text-cream border border-white/10 shadow-sm">
                        {a.kategori}
                      </span>
                    </td>
                    <td className="px-8 py-5 whitespace-nowrap">
                      <div className="flex items-center gap-2.5">
                        <span className={`w-2 h-2 rounded-full shadow-[0_0_8px_currentColor] ${a.status === 'Published' ? 'bg-sage text-sage' : 'bg-cream/40 text-cream/40'}`}></span>
                        <span className="text-[11px] font-bold uppercase tracking-wider text-cream/70">{a.status}</span>
                      </div>
                    </td>
                    <td className="px-8 py-5 whitespace-nowrap text-cream/50 text-xs font-medium">
                      {a.tanggal}
                    </td>
                    <td className="px-8 py-5 whitespace-nowrap text-right">
                      <div className="flex justify-end gap-3">
                        <button 
                          onClick={() => router.push(`/admin/artikel/editor/${a.id}`)}
                          className="p-2 text-cream/40 hover:text-gold hover:bg-gold/10 rounded-lg transition-colors border border-transparent hover:border-gold/20"
                          title="Edit Dokumen"
                        >
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                        </button>
                        {userRole === 'publisher' && (
                          <button 
                            onClick={() => handleDelete(a.id, a.judul)}
                            className="p-2 text-cream/40 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors border border-transparent hover:border-red-400/20"
                            title="Hapus Dokumen"
                          >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

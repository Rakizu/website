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
  const [userRole, setUserRole] = useState('writer');
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
    <div className="w-full flex-1 p-6 md:p-8 font-sans text-slate-900 max-w-[1400px] mx-auto">
      {/* SaaS Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight mb-1">Dokumen Artikel</h1>
          <p className="text-sm font-medium text-slate-500">
            Kelola publikasi dan draf artikel (Total: {articles.length})
          </p>
        </div>
        <button 
          onClick={() => router.push('/admin/artikel/editor/new')}
          className="relative group overflow-hidden flex items-center gap-2 px-6 py-2.5 bg-slate-900 text-white text-[13px] font-bold tracking-wide rounded-full hover:bg-slate-800 transition-all shadow-[0_4px_12px_rgba(0,0,0,0.1)] active:scale-[0.98] border border-slate-900/50"
        >
          <span className="relative z-10 flex items-center gap-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M12 5v14M5 12h14"/></svg>
            Tulis Baru
          </span>
          <div className="absolute top-0 -left-[150%] w-full h-full skew-x-[-25deg] transition-all duration-700 ease-in-out group-hover:left-[150%] bg-[linear-gradient(to_right,transparent,rgba(255,255,255,0.15),transparent)]" />
        </button>
      </div>

      {/* Toolbar / Filters (Placeholder for Enterprise Look) */}
      <div className="w-full bg-white border border-slate-200/80 rounded-t-[24px] p-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <div className="relative">
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input type="text" placeholder="Cari dokumen..." className="pl-10 pr-4 py-2 text-sm font-medium bg-slate-50 border border-slate-200 rounded-full outline-none focus:ring-2 focus:ring-slate-200 w-64 placeholder-slate-400 text-slate-800 transition-all" />
          </div>
          <button className="px-4 py-2 text-sm font-bold text-slate-600 bg-white border border-slate-200 rounded-full hover:bg-slate-50 shadow-sm flex items-center gap-2 transition-all">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>
            Filter
          </button>
        </div>
      </div>

      {/* Enterprise Data Grid */}
      <div className="w-full bg-white border-x border-b border-slate-200/80 rounded-b-[24px] shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="py-32 flex items-center justify-center text-slate-400 animate-pulse text-sm font-semibold tracking-widest uppercase">
            Memuat database...
          </div>
        ) : articles.length === 0 ? (
          <div className="py-32 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-4 border border-slate-100">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-slate-400"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
            </div>
            <p className="text-slate-700 text-sm font-semibold">Belum ada dokumen ditemukan.</p>
            <p className="text-slate-500 text-xs mt-1 font-medium">Klik "Tulis Baru" untuk membuat artikel pertama Anda.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-200/80 text-[11px] text-slate-500 font-bold uppercase tracking-wider">
                  <th className="px-6 py-3.5 whitespace-nowrap w-2/5">Judul Dokumen</th>
                  <th className="px-6 py-3.5 whitespace-nowrap">Kategori</th>
                  <th className="px-6 py-3.5 whitespace-nowrap">Status</th>
                  <th className="px-6 py-3.5 whitespace-nowrap">Tanggal</th>
                  <th className="px-6 py-3.5 whitespace-nowrap text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {articles.map((a) => (
                  <tr key={a.id} className="hover:bg-slate-50/80 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1">{a.judul}</div>
                      <div className="text-[13px] font-medium text-slate-500 mt-1 line-clamp-1">{a.excerpt || 'Tidak ada ringkasan...'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-widest bg-slate-100 text-slate-700 border border-slate-200/80">
                        {a.kategori}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${a.status === 'Published' ? 'bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.4)]' : 'bg-slate-400'}`}></span>
                        <span className="text-[12px] font-semibold text-slate-700">{a.status}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-slate-500 text-[13px] font-medium">
                      {a.tanggal}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => router.push(`/admin/artikel/editor/${a.id}`)}
                          className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-all border border-transparent hover:border-blue-100 shadow-sm"
                          title="Edit Dokumen"
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                        </button>
                        {userRole === 'publisher' && (
                          <button 
                            onClick={() => handleDelete(a.id, a.judul)}
                            className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-all border border-transparent hover:border-red-100 shadow-sm"
                            title="Hapus Dokumen"
                          >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
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

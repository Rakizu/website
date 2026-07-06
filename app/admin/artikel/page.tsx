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

  return (
    <div className="w-full flex-1 p-6 md:p-10 font-sans text-gray-900 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Dokumen Artikel</h1>
          <p className="text-sm text-gray-500 mt-1">Kelola dan publikasikan artikel sekolah (Total: {articles.length})</p>
        </div>
        <button 
          onClick={() => router.push('/admin/artikel/editor/new')}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors shadow-sm"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M5 12h14"/></svg>
          Tulis Baru
        </button>
      </div>

      {/* Data Table Area */}
      <div className="w-full bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="py-24 flex items-center justify-center text-gray-400 animate-pulse text-sm font-medium">
            Memuat database...
          </div>
        ) : articles.length === 0 ? (
          <div className="py-24 flex flex-col items-center justify-center text-center">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="text-gray-300 mb-4"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
            <p className="text-gray-500 text-sm font-medium">Belum ada dokumen ditemukan.</p>
            <p className="text-gray-400 text-xs mt-1">Klik "Tulis Baru" untuk membuat artikel pertama Anda.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 text-xs text-gray-500 font-semibold uppercase tracking-wider">
                  <th className="px-6 py-4 whitespace-nowrap w-2/5">Judul Dokumen</th>
                  <th className="px-6 py-4 whitespace-nowrap">Kategori</th>
                  <th className="px-6 py-4 whitespace-nowrap">Status</th>
                  <th className="px-6 py-4 whitespace-nowrap">Tanggal</th>
                  <th className="px-6 py-4 whitespace-nowrap text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 text-sm">
                {articles.map((a) => (
                  <tr key={a.id} className="hover:bg-gray-50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-1">{a.judul}</div>
                      <div className="text-xs text-gray-500 mt-1 line-clamp-1">{a.excerpt || 'Tidak ada ringkasan...'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700 border border-gray-200">
                        {a.kategori}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${a.status === 'Published' ? 'bg-green-500' : 'bg-gray-400'}`}></span>
                        <span className="text-xs font-medium text-gray-600">{a.status}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-500 text-xs">
                      {a.tanggal}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex justify-end gap-2">
                        <button 
                          onClick={() => router.push(`/admin/artikel/editor/${a.id}`)}
                          className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                          title="Edit Dokumen"
                        >
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                        </button>
                        {userRole === 'publisher' && (
                          <button 
                            onClick={() => handleDelete(a.id, a.judul)}
                            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
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

'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

interface Ekskul {
  id: string;
  nama: string;
  kategori: string;
  deskripsi: string;
  mainImage: string;
  galleryImages: string[];
}

export default function AdminEkskulList() {
  const [ekskuls, setEkskuls] = useState<Ekskul[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userRole, setUserRole] = useState('writer');
  const router = useRouter();

  const fetchAuth = async () => {
    try {
      const res = await fetch('/api/auth/me');
      const json = await res.json();
      if (json.success) setUserRole(json.role);
    } catch (e) {
      console.error(e);
    }
  };

  const fetchEkskuls = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/ekskul');
      const json = await res.json();
      if (json.success) setEkskuls(json.data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAuth();
    fetchEkskuls();
  }, []);

  const handleDelete = async (id: string, nama: string) => {
    if (!confirm(`Apakah Anda yakin ingin menghapus ekstrakurikuler "${nama}"?`)) return;
    
    try {
      const res = await fetch(`/api/ekskul/${id}`, { method: 'DELETE' });
      const json = await res.json();
      if (json.success) {
        setEkskuls(ekskuls.filter(e => e.id !== id));
      } else {
        alert('Gagal menghapus: ' + json.message);
      }
    } catch {
      alert('Terjadi kesalahan jaringan.');
    }
  };

  return (
    <div className="w-full flex-1 p-6 md:p-8 font-sans text-slate-900 max-w-[1400px] mx-auto">
      {/* SaaS Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Manajemen Ekstrakurikuler</h1>
          <p className="text-sm text-slate-500 mt-1 font-medium">Kelola program kegiatan minat, bakat, dan karakter siswa.</p>
        </div>
        <button
          onClick={() => router.push('/admin/ekskul/editor/new')}
          className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg shadow-sm transition-all active:scale-[0.98]"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 5v14M5 12h14"/></svg>
          Tambah Baru
        </button>
      </div>

      {/* Main Data Card */}
      <div className="bg-white border border-slate-200/80 rounded-xl shadow-xs overflow-hidden">
        {isLoading ? (
          <div className="p-16 flex flex-col items-center justify-center text-center">
            <div className="w-6 h-6 border-2 border-slate-900 border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-slate-400 text-xs font-medium">Memuat data ekstrakurikuler...</p>
          </div>
        ) : ekskuls.length === 0 ? (
          <div className="py-32 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-4 border border-slate-100">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-slate-400"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
            </div>
            <p className="text-slate-700 text-sm font-semibold">Belum ada ekstrakurikuler ditemukan.</p>
            <p className="text-slate-500 text-xs mt-1 font-medium">Klik &ldquo;Tambah Baru&rdquo; untuk membuat ekskul pertama Anda.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-200/80 text-[11px] text-slate-500 font-bold uppercase tracking-wider">
                  <th className="px-6 py-3.5 whitespace-nowrap w-2/5">Nama Ekskul</th>
                  <th className="px-6 py-3.5 whitespace-nowrap">Kategori</th>
                  <th className="px-6 py-3.5 whitespace-nowrap">Galeri</th>
                  <th className="px-6 py-3.5 whitespace-nowrap text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {ekskuls.map((e) => (
                  <tr key={e.id} className="hover:bg-slate-50/80 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
                          {e.mainImage ? (
                            <Image src={e.mainImage} alt={e.nama} fill className="object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-400">
                              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">{e.nama}</div>
                          <div className="text-[13px] font-medium text-slate-500 mt-0.5 line-clamp-1">{e.deskripsi}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-widest border ${e.kategori === 'Akademik' ? 'bg-blue-50 text-blue-700 border-blue-200/80' : 'bg-emerald-50 text-emerald-700 border-emerald-200/80'}`}>
                        {e.kategori}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center -space-x-2">
                        {(e.galleryImages || []).slice(0, 4).map((img, i) => (
                          <div key={i} className="relative w-8 h-8 rounded-full border-2 border-white overflow-hidden bg-slate-100 shadow-sm">
                            <Image src={img} alt="gallery" fill className="object-cover" />
                          </div>
                        ))}
                        {(e.galleryImages?.length > 4) && (
                          <div className="relative w-8 h-8 rounded-full border-2 border-white bg-slate-100 text-[10px] font-bold flex items-center justify-center text-slate-600 shadow-sm">
                            +{e.galleryImages.length - 4}
                          </div>
                        )}
                        {(!e.galleryImages || e.galleryImages.length === 0) && (
                          <span className="text-[13px] text-slate-400 font-medium">Belum ada</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex justify-end gap-2 opacity-100 lg:opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => router.push(`/admin/ekskul/editor/${e.id}`)}
                          className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-all border border-transparent hover:border-blue-100 shadow-sm"
                          title="Edit"
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                        </button>
                        {userRole === 'publisher' && (
                          <button 
                            onClick={() => handleDelete(e.id, e.nama)}
                            className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-all border border-transparent hover:border-red-100 shadow-sm"
                            title="Hapus"
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

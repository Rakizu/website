'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface Fasilitas {
  id: string;
  nama: string;
  deskripsi: string;
  image: string;
}

export default function AdminFasilitas() {
  const [fasilitas, setFasilitas] = useState<Fasilitas[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchFasilitas = async () => {
    try {
      const res = await fetch('/api/fasilitas');
      const json = await res.json();
      if (json.success) {
        setFasilitas(json.data);
      }
    } catch (e) {
      console.error('Failed to fetch', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFasilitas();
  }, []);

  const deleteFasilitas = async (id: string) => {
    if (!confirm('Yakin ingin menghapus fasilitas ini?')) return;
    try {
      const res = await fetch(`/api/fasilitas/${id}`, { method: 'DELETE' });
      const json = await res.json();
      if (json.success) {
        setFasilitas(fasilitas.filter(f => f.id !== id));
      }
    } catch (e) {
      console.error(e);
      alert('Gagal menghapus');
    }
  };

  return (
    <div className="w-full flex-1 p-6 md:p-8 font-sans text-slate-900">
      <div className="max-w-[1200px] mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Fasilitas</h1>
            <p className="text-sm font-medium text-slate-500 mt-1">Kelola data fasilitas sekolah</p>
          </div>
          <Link 
            href="/admin/fasilitas/editor/new"
            className="px-6 py-2.5 bg-blue-600 text-white text-[13px] font-bold tracking-wide rounded-full hover:bg-blue-700 transition-all shadow-[0_4px_12px_rgba(37,99,235,0.2)] flex items-center gap-2"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
            Tambah Fasilitas
          </Link>
        </div>

        <div className="bg-white rounded-[24px] border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-200/80 text-[11px] font-bold text-slate-500 uppercase tracking-widest">
                  <th className="p-5 font-bold w-[300px]">Nama & Foto</th>
                  <th className="p-5 font-bold">Deskripsi</th>
                  <th className="p-5 font-bold text-right">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={3} className="p-10 text-center text-slate-500 text-sm font-medium">
                      Memuat data...
                    </td>
                  </tr>
                ) : fasilitas.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="p-10 text-center text-slate-500 text-sm font-medium">
                      Belum ada data fasilitas.
                    </td>
                  </tr>
                ) : (
                  fasilitas.map((f) => (
                    <tr key={f.id} className="border-b border-slate-100 last:border-none hover:bg-slate-50/50 transition-colors group">
                      <td className="p-5">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-lg overflow-hidden bg-slate-100 border border-slate-200 shadow-sm shrink-0">
                            {f.image && <Image src={f.image} alt={f.nama} width={48} height={48} className="w-full h-full object-cover" />}
                          </div>
                          <div>
                            <p className="font-bold text-slate-800 text-[14px] leading-snug">{f.nama}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-5">
                        <p className="text-[13px] text-slate-600 font-medium leading-relaxed max-w-[500px] truncate">
                          {f.deskripsi}
                        </p>
                      </td>
                      <td className="p-5 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Link 
                            href={`/admin/fasilitas/editor/${f.id}`}
                            className="px-4 py-1.5 rounded-full text-[12px] font-bold text-slate-600 bg-white border border-slate-200 hover:text-blue-600 hover:border-blue-200 hover:bg-blue-50 transition-all"
                          >
                            Edit
                          </Link>
                          <button 
                            onClick={() => deleteFasilitas(f.id)}
                            className="px-4 py-1.5 rounded-full text-[12px] font-bold text-red-500 bg-white border border-slate-200 hover:bg-red-50 hover:border-red-200 transition-all"
                          >
                            Hapus
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

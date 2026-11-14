'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Image from 'next/image';

export default function AdminGuruEditor() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;
  const isNew = id === 'new';

  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    nama: '',
    mapel: '',
    quote: '',
    image: ''
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchGuru = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/guru/${id}`);
      const json = await res.json();
      if (json.success) {
        setFormData(json.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (!isNew) {
      fetchGuru();
    }
  }, [isNew, fetchGuru]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const url = isNew ? '/api/guru' : `/api/guru/${id}`;
      const method = isNew ? 'POST' : 'PUT';
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      const json = await res.json();
      if (json.success) {
        router.push('/admin/guru');
      } else {
        alert(json.message);
      }
    } catch (e) {
      console.error(e);
      alert('Gagal menyimpan profil pendidik');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    setIsLoading(true);
    
    try {
      const file = e.target.files[0];
      const data = new FormData();
      data.append('file', file);
      
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: data,
      });
      
      const json = await res.json();
      if (json.success) {
        setFormData(prev => ({ ...prev, image: json.url }));
      }
    } catch (error) {
      console.error(error);
      alert('Gagal mengunggah foto');
    } finally {
      setIsLoading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const removeImage = () => {
    setFormData(prev => ({ ...prev, image: '' }));
  };

  return (
    <div className="w-full flex-1 p-6 md:p-8 font-sans text-slate-900 max-w-[1200px] mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => router.push('/admin/guru')}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-white border border-slate-200 hover:bg-slate-50 transition-all shadow-sm"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
          </button>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              {isNew ? 'Tambah Pendidik' : 'Edit Pendidik'}
            </h1>
            <p className="text-sm font-medium text-slate-500 mt-1">Konfigurasi profil dan kutipan inspiratif</p>
          </div>
        </div>

        <button 
          onClick={handleSave}
          disabled={isLoading}
          className="px-8 py-2.5 bg-blue-600 text-white text-[14px] font-bold tracking-wide rounded-full hover:bg-blue-700 transition-all shadow-[0_4px_12px_rgba(37,99,235,0.2)] disabled:opacity-50 flex items-center gap-2"
        >
          {isLoading ? (
            <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
          )}
          Simpan Data
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Form Info */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-[24px] border border-slate-200/80 p-6 shadow-sm">
            <h2 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
              <svg className="text-slate-400" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              Informasi Dasar
            </h2>
            
            <div className="space-y-5">
              <div>
                <label className="block text-[13px] font-bold text-slate-600 mb-2 uppercase tracking-wider">Nama Lengkap & Gelar</label>
                <input 
                  type="text" name="nama" value={formData.nama} onChange={handleChange}
                  placeholder="Contoh: Ahmad Fadillah, S.Pd., M.Pd."
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm font-medium"
                />
              </div>

              <div>
                <label className="block text-[13px] font-bold text-slate-600 mb-2 uppercase tracking-wider">Mata Pelajaran / Jabatan</label>
                <input 
                  type="text" name="mapel" value={formData.mapel} onChange={handleChange}
                  placeholder="Contoh: Matematika & Tahfidz"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm font-medium"
                />
              </div>

              <div>
                <label className="block text-[13px] font-bold text-slate-600 mb-2 uppercase tracking-wider">Kutipan Inspiratif (Quote)</label>
                <textarea 
                  name="quote" value={formData.quote} onChange={handleChange} rows={4}
                  placeholder="Tulis kutipan gaya editorial di sini..."
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm font-medium resize-none leading-relaxed"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Photo Upload */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-[24px] border border-slate-200/80 p-6 shadow-sm h-full flex flex-col">
            <h2 className="text-lg font-bold text-slate-800 mb-2 flex items-center gap-2">
              <svg className="text-slate-400" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
              Foto Pendidik
            </h2>
            <p className="text-xs font-medium text-slate-500 mb-6">Unggah foto beresolusi tinggi dengan rasio potrait (3:4).</p>
            
            <input 
              type="file" accept="image/*" className="hidden"
              ref={fileInputRef} onChange={handleFileUpload}
            />

            {formData.image === '' ? (
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="w-full flex-1 min-h-[350px] border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center text-slate-400 bg-slate-50/50 hover:bg-slate-50 hover:border-blue-400 transition-colors cursor-pointer group"
              >
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm border border-slate-100 mb-4 group-hover:scale-110 transition-transform">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                </div>
                <p className="text-sm font-bold text-slate-600">Klik untuk memilih foto</p>
              </div>
            ) : (
              <div className="relative w-full aspect-[3/4] rounded-2xl overflow-hidden border-2 border-slate-200 group">
                <Image src={formData.image} alt="Foto Pendidik" fill className="object-cover" />
                
                {/* Overlay Controls */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-3">
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="px-4 py-2 bg-white/90 text-slate-800 text-xs font-bold rounded-full hover:bg-white transition-colors shadow-sm"
                  >
                    Ganti Foto
                  </button>
                  <button 
                    onClick={removeImage}
                    className="px-4 py-2 bg-red-500/90 text-white text-xs font-bold rounded-full hover:bg-red-500 transition-colors shadow-sm"
                  >
                    Hapus Foto
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

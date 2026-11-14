'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Image from 'next/image';

export default function AdminPrestasiEditor() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;
  const isNew = id === 'new';

  const [isLoading, setIsLoading] = useState(!isNew);
  const [formData, setFormData] = useState({
    nama: '',
    judul: '',
    tingkat: 'Nasional',
    tahun: new Date().getFullYear().toString(),
    kutipan: '',
    image: ''
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchPrestasi = useCallback(async () => {
    try {
      const res = await fetch(`/api/prestasi/${id}`);
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
      fetchPrestasi();
    }
  }, [isNew, fetchPrestasi]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const url = isNew ? '/api/prestasi' : `/api/prestasi/${id}`;
      const method = isNew ? 'POST' : 'PUT';
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      const json = await res.json();
      if (json.success) {
        router.push('/admin/prestasi');
      } else {
        alert(json.message);
      }
    } catch (e) {
      console.error(e);
      alert('Gagal menyimpan prestasi');
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
        setFormData({ ...formData, image: json.url });
      }
    } catch (error) {
      console.error(error);
      alert('Gagal mengunggah gambar');
    } finally {
      setIsLoading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const removeImage = () => {
    setFormData({ ...formData, image: '' });
  };

  return (
    <div className="w-full flex-1 p-6 md:p-8 font-sans text-slate-900 max-w-[1200px] mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => router.push('/admin/prestasi')}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-white border border-slate-200 hover:bg-slate-50 transition-all shadow-sm"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
          </button>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              {isNew ? 'Catat Prestasi Baru' : 'Edit Prestasi'}
            </h1>
            <p className="text-sm font-medium text-slate-500 mt-1">Konfigurasi data Hall of Fame</p>
          </div>
        </div>

        <button 
          onClick={handleSave}
          disabled={isLoading || !formData.nama || !formData.judul}
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
              Detail Prestasi
            </h2>
            
            <div className="space-y-5">
              <div>
                <label className="block text-[13px] font-bold text-slate-600 mb-2 uppercase tracking-wider">Nama Siswa <span className="text-red-500">*</span></label>
                <input 
                  type="text" name="nama" value={formData.nama} onChange={handleChange}
                  placeholder="Contoh: Ahmad Fauzi"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm font-medium"
                />
              </div>

              <div>
                <label className="block text-[13px] font-bold text-slate-600 mb-2 uppercase tracking-wider">Judul Prestasi <span className="text-red-500">*</span></label>
                <input 
                  type="text" name="judul" value={formData.judul} onChange={handleChange}
                  placeholder="Contoh: Juara 1 Olimpiade Sains Nasional"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[13px] font-bold text-slate-600 mb-2 uppercase tracking-wider">Tingkat</label>
                  <div className="relative">
                    <select 
                      name="tingkat" value={formData.tingkat} onChange={handleChange}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all appearance-none text-sm font-medium"
                    >
                      <option value="Kabupaten">Kabupaten</option>
                      <option value="Provinsi">Provinsi</option>
                      <option value="Nasional">Nasional</option>
                      <option value="Internasional">Internasional</option>
                    </select>
                    <svg className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg>
                  </div>
                </div>
                <div>
                  <label className="block text-[13px] font-bold text-slate-600 mb-2 uppercase tracking-wider">Tahun</label>
                  <input 
                    type="number" name="tahun" value={formData.tahun} onChange={handleChange}
                    placeholder="2025"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[13px] font-bold text-slate-600 mb-2 uppercase tracking-wider">Kutipan / Testimoni</label>
                <textarea 
                  name="kutipan" value={formData.kutipan} onChange={handleChange} rows={4}
                  placeholder="Kutipan inspiratif dari siswa..."
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm font-medium resize-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Photo */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-[24px] border border-slate-200/80 p-6 shadow-sm h-full">
            <h2 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
              <svg className="text-slate-400" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
              Foto Siswa
            </h2>
            
            <input 
              type="file" accept="image/*" className="hidden"
              ref={fileInputRef} onChange={handleFileUpload}
            />

            {!formData.image ? (
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="w-full aspect-[3/4] border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center text-slate-400 bg-slate-50/50 hover:bg-slate-50 hover:border-blue-400 transition-colors cursor-pointer group"
              >
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm border border-slate-100 mb-4 group-hover:scale-110 transition-transform">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                </div>
                <p className="text-sm font-bold text-slate-600">Unggah Foto Siswa</p>
                <p className="text-xs font-medium mt-1">Rekomendasi rasio 3:4</p>
              </div>
            ) : (
              <div className="relative w-full aspect-[3/4] rounded-2xl overflow-hidden border-2 border-slate-200 group">
                <Image src={formData.image} alt="Preview" fill className="object-cover" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                  <button 
                    onClick={removeImage}
                    className="w-10 h-10 bg-white/90 text-red-500 rounded-full flex items-center justify-center hover:bg-red-500 hover:text-white transition-colors shadow-sm"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                  </button>
                  <span className="text-white text-xs font-bold mt-2 tracking-wider uppercase">Hapus Foto</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

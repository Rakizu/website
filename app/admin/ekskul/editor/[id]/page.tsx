'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Image from 'next/image';

export default function AdminEkskulEditor() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;
  const isNew = id === 'new';

  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    nama: '',
    kategori: 'Non-Akademik',
    deskripsi: '',
    mainImage: '',
    galleryImages: [] as string[]
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchEkskul = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/ekskul/${id}`);
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
      fetchEkskul();
    }
  }, [isNew, fetchEkskul]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const url = isNew ? '/api/ekskul' : `/api/ekskul/${id}`;
      const method = isNew ? 'POST' : 'PUT';
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      const json = await res.json();
      if (json.success) {
        router.push('/admin/ekskul');
      } else {
        alert(json.message);
      }
    } catch (e) {
      console.error(e);
      alert('Gagal menyimpan ekskul');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    setIsLoading(true);
    
    try {
      const files = Array.from(e.target.files);
      const newUrls: string[] = [];

      // Loop through selected files
      for (const file of files) {
        const data = new FormData();
        data.append('file', file);
        
        const res = await fetch('/api/upload', {
          method: 'POST',
          body: data,
        });
        
        const json = await res.json();
        if (json.success) {
          newUrls.push(json.url);
        }
      }

      setFormData(prev => {
        const updatedGallery = [...prev.galleryImages, ...newUrls];
        // If there's no main image yet, set the first uploaded one as main automatically
        const newMain = prev.mainImage === '' && updatedGallery.length > 0 ? updatedGallery[0] : prev.mainImage;
        return {
          ...prev,
          galleryImages: updatedGallery,
          mainImage: newMain
        };
      });

    } catch (error) {
      console.error(error);
      alert('Gagal mengunggah gambar');
    } finally {
      setIsLoading(false);
      // Reset input
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const setAsMain = (url: string) => {
    setFormData({ ...formData, mainImage: url });
  };

  const removeImage = (url: string) => {
    setFormData(prev => {
      const newGallery = prev.galleryImages.filter(img => img !== url);
      // If the removed image was the main image, pick another one or clear it
      const newMain = prev.mainImage === url 
        ? (newGallery.length > 0 ? newGallery[0] : '') 
        : prev.mainImage;
        
      return {
        ...prev,
        galleryImages: newGallery,
        mainImage: newMain
      };
    });
  };

  return (
    <div className="w-full flex-1 p-6 md:p-8 font-sans text-slate-900 max-w-[1200px] mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => router.push('/admin/ekskul')}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-white border border-slate-200 hover:bg-slate-50 transition-all shadow-sm"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
          </button>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              {isNew ? 'Tambah Ekskul' : 'Edit Ekskul'}
            </h1>
            <p className="text-sm font-medium text-slate-500 mt-1">Konfigurasi data dan galeri kegiatan</p>
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
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-[24px] border border-slate-200/80 p-6 shadow-sm">
            <h2 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
              <svg className="text-slate-400" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              Informasi Dasar
            </h2>
            
            <div className="space-y-5">
              <div>
                <label className="block text-[13px] font-bold text-slate-600 mb-2 uppercase tracking-wider">Nama Ekskul</label>
                <input 
                  type="text" name="nama" value={formData.nama} onChange={handleChange}
                  placeholder="Contoh: Panahan"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm font-medium"
                />
              </div>

              <div>
                <label className="block text-[13px] font-bold text-slate-600 mb-2 uppercase tracking-wider">Kategori</label>
                <div className="relative">
                  <select 
                    name="kategori" value={formData.kategori} onChange={handleChange}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all appearance-none text-sm font-medium"
                  >
                    <option value="Akademik">Akademik</option>
                    <option value="Non-Akademik">Non-Akademik</option>
                  </select>
                  <svg className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg>
                </div>
              </div>

              <div>
                <label className="block text-[13px] font-bold text-slate-600 mb-2 uppercase tracking-wider">Deskripsi Singkat</label>
                <textarea 
                  name="deskripsi" value={formData.deskripsi} onChange={handleChange} rows={4}
                  placeholder="Jelaskan secara singkat manfaat ekskul ini..."
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm font-medium resize-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Smart Gallery */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-[24px] border border-slate-200/80 p-6 shadow-sm h-full">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                  <svg className="text-slate-400" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                  Media Galeri
                </h2>
                <p className="text-xs font-medium text-slate-500 mt-1">Unggah beberapa foto sekaligus. Pilih 1 (bintang) sebagai sampul.</p>
              </div>
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2 bg-slate-100 text-slate-700 text-sm font-bold rounded-full hover:bg-slate-200 transition-colors flex items-center gap-2"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                Upload Foto
              </button>
              <input 
                type="file" multiple accept="image/*" className="hidden"
                ref={fileInputRef} onChange={handleFileUpload}
              />
            </div>

            {formData.galleryImages.length === 0 ? (
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="w-full h-64 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center text-slate-400 bg-slate-50/50 hover:bg-slate-50 hover:border-blue-400 transition-colors cursor-pointer group"
              >
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm border border-slate-100 mb-4 group-hover:scale-110 transition-transform">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                </div>
                <p className="text-sm font-bold text-slate-600">Seret foto ke sini atau Klik untuk memilih</p>
                <p className="text-xs font-medium mt-1">Dukung pemilihan banyak file (Multi-upload)</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {/* Ensure unique gallery images to avoid react key duplicates if same image is pushed multiple times */}
                {Array.from(new Set(formData.galleryImages)).map((url, i) => {
                  const isMain = formData.mainImage === url;
                  return (
                    <div key={i} className={`relative aspect-square rounded-2xl overflow-hidden border-2 transition-all group ${isMain ? 'border-amber-400 shadow-[0_0_15px_rgba(251,191,36,0.3)]' : 'border-slate-200 hover:border-slate-300'}`}>
                      <Image src={url} alt={`Gallery ${i}`} fill className="object-cover" />
                      
                      {/* Overlay Controls */}
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                        {!isMain && (
                          <button 
                            onClick={() => setAsMain(url)}
                            className="px-3 py-1.5 bg-white/90 text-slate-800 text-[11px] font-bold rounded-full hover:bg-amber-400 hover:text-amber-900 transition-colors shadow-sm flex items-center gap-1"
                          >
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                            Jadikan Sampul
                          </button>
                        )}
                        <button 
                          onClick={() => removeImage(url)}
                          className="w-8 h-8 bg-white/90 text-red-500 rounded-full flex items-center justify-center hover:bg-red-500 hover:text-white transition-colors shadow-sm"
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                        </button>
                      </div>

                      {/* Main Image Badge */}
                      {isMain && (
                        <div className="absolute top-2 right-2 w-7 h-7 bg-amber-400 text-amber-900 rounded-full flex items-center justify-center shadow-md">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                        </div>
                      )}
                    </div>
                  );
                })}

                {/* Add More Button inside Grid */}
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="relative aspect-square rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400 hover:bg-slate-50 hover:border-blue-400 hover:text-blue-500 transition-colors cursor-pointer"
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mb-2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                  <span className="text-xs font-bold">Tambah</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

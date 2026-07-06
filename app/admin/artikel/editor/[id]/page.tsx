'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { use } from 'react';

export default function ArticleEditor({ params }: { params: Promise<{ id: string }> }) {
  // Gunakan 'use' untuk unwrap Promise (Next.js 15 req)
  const resolvedParams = use(params);
  const { id } = resolvedParams;
  const isNew = id === 'new';
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(!isNew);
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState({
    judul: '',
    kategori: 'Edukasi',
    excerpt: '',
    image: '',
    content: '',
    penulis: 'Tim Redaksi',
    author_role: 'Editor Utama',
    tags: '',
    status: 'Published'
  });

  const [userRole, setUserRole] = useState('writer');
  const predefinedCategories = ['Edukasi', 'Berita', 'Kegiatan', 'Pengumuman', 'Prestasi'];
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    fetchAuth();
    if (!isNew) {
      fetchArticle();
    }
  }, [id, isNew]);

  const fetchAuth = async () => {
    try {
      const res = await fetch('/api/auth/me');
      const json = await res.json();
      if (json.success) {
        setUserRole(json.role);
        if (json.role === 'writer' && isNew) {
          setFormData(prev => ({ ...prev, status: 'Draft' }));
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [formData.content]);

  const fetchArticle = async () => {
    try {
      const res = await fetch(`/api/artikel/${id}`);
      const json = await res.json();
      if (json.success) {
        setFormData({
          judul: json.data.judul || '',
          kategori: json.data.kategori || 'Edukasi',
          excerpt: json.data.excerpt || '',
          image: json.data.image || '',
          content: json.data.content || '',
          penulis: json.data.penulis || 'Tim Redaksi',
          author_role: json.data.author_role || 'Editor Utama',
          tags: Array.isArray(json.data.tags) ? json.data.tags.join(', ') : '',
          status: json.data.status || 'Published'
        });
      } else {
        alert('Artikel tidak ditemukan');
        router.push('/admin/artikel');
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!formData.judul.trim() || !formData.content.trim()) {
      alert('Judul dan konten utama tidak boleh kosong.');
      return;
    }

    setIsSaving(true);
    const method = isNew ? 'POST' : 'PUT';
    const url = isNew ? '/api/artikel' : `/api/artikel/${id}`;

    // Siapkan payload dengan tag array
    const payload = {
      ...formData,
      tags: formData.tags.split(',').map(t => t.trim()).filter(t => t !== '')
    };

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const json = await res.json();
      
      if (json.success) {
        if (isNew) {
          router.replace(`/admin/artikel/editor/${json.data.id}`);
        }
        alert('Dokumen berhasil disimpan!');
      } else {
        alert('Gagal menyimpan: ' + json.message);
      }
    } catch (error) {
      alert('Terjadi kesalahan jaringan.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <div className="flex-1 flex items-center justify-center min-h-screen bg-slate-100 text-slate-500 animate-pulse font-body">Memuat Dokumen...</div>;
  }

  return (
    <div className="flex-1 w-full min-h-screen bg-[#F3F4F6] flex flex-col font-body">
      {/* Ribbon / Toolbar Header (Office Style) */}
      <div className="w-full bg-white border-b border-slate-300 shadow-sm flex items-center justify-between px-4 py-2 sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => router.push('/admin/artikel')}
            className="p-2 text-slate-600 hover:bg-slate-100 rounded-md transition-colors flex items-center gap-2"
            title="Kembali"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
            <span className="text-sm font-semibold hidden md:block">Beranda</span>
          </button>
          
          <div className="h-6 w-px bg-slate-300 mx-2"></div>
          
          <button
            disabled={userRole === 'writer'}
            onClick={() => setFormData({ ...formData, status: formData.status === 'Published' ? 'Draft' : 'Published' })}
            className={`px-3 py-1.5 rounded text-xs font-semibold flex items-center gap-2 border transition-all ${
              formData.status === 'Published' 
                ? 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100' 
                : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
            } ${userRole === 'writer' ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <span className={`w-2 h-2 rounded-full ${formData.status === 'Published' ? 'bg-blue-600' : 'bg-slate-400'}`}></span>
            {userRole === 'writer' ? 'DRAFT (Terkunci)' : formData.status}
          </button>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={handleSave}
            disabled={isSaving}
            className="px-4 py-1.5 bg-[#005A9E] text-white text-sm font-semibold rounded hover:bg-[#004578] active:bg-[#003359] transition-colors disabled:opacity-50 flex items-center gap-2 shadow-sm"
          >
            {isSaving ? (
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/></svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
            )}
            {isSaving ? 'Menyimpan...' : 'Simpan'}
          </button>
        </div>
      </div>

      {/* Workspace Area */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">
        
        {/* Document Canvas (A4 format) */}
        <div className="flex-1 overflow-y-auto p-6 md:p-12 pb-32 flex justify-center bg-[#F3F4F6]">
          <div className="w-full max-w-[210mm] min-h-[297mm] bg-white shadow-[0_4px_12px_rgba(0,0,0,0.05)] border border-slate-200 px-10 py-16 md:px-16 md:py-20 flex flex-col">
            {/* Title */}
            <textarea
              rows={1}
              placeholder="Judul Dokumen"
              value={formData.judul}
              onChange={(e) => setFormData({ ...formData, judul: e.target.value })}
              className="w-full bg-transparent border-none outline-none font-heading font-bold text-3xl md:text-4xl text-slate-900 placeholder-slate-300 resize-none overflow-hidden leading-tight mb-6"
              onInput={(e) => {
                const target = e.target as HTMLTextAreaElement;
                target.style.height = 'auto';
                target.style.height = `${target.scrollHeight}px`;
              }}
            />
            
            {/* Divider */}
            <hr className="border-slate-100 mb-8" />

            {/* Content Editor */}
            <textarea
              ref={textareaRef}
              placeholder="Mulai mengetik isi dokumen di sini..."
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              className="flex-1 w-full bg-transparent border-none outline-none text-slate-800 font-body text-base leading-relaxed resize-none placeholder-slate-300"
            />
          </div>
        </div>

        {/* Properties Sidebar (Office Style) */}
        <div className="w-full lg:w-[320px] bg-white border-l border-slate-300 shadow-sm overflow-y-auto h-auto lg:h-[calc(100vh-53px)] shrink-0">
          <div className="p-4 bg-slate-50 border-b border-slate-200">
            <h3 className="text-sm font-semibold text-slate-700">Properti Dokumen</h3>
          </div>
          
          <div className="p-5 space-y-6">
            {/* Kategori */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-600">Kategori</label>
              <select
                value={formData.kategori}
                onChange={(e) => setFormData({ ...formData, kategori: e.target.value })}
                className="w-full bg-white border border-slate-300 rounded px-3 py-1.5 text-sm outline-none focus:border-[#005A9E] focus:ring-1 focus:ring-[#005A9E] text-slate-800"
              >
                {predefinedCategories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Excerpt */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-600">Ringkasan (Excerpt)</label>
              <textarea
                placeholder="Ringkasan singkat..."
                value={formData.excerpt}
                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                className="w-full bg-white border border-slate-300 rounded px-3 py-2 text-sm outline-none focus:border-[#005A9E] focus:ring-1 focus:ring-[#005A9E] resize-none h-20 text-slate-800"
              />
            </div>

            {/* Cover Image */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-600">URL Gambar Cover</label>
              <input
                type="text"
                placeholder="https://..."
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                className="w-full bg-white border border-slate-300 rounded px-3 py-1.5 text-sm outline-none focus:border-[#005A9E] focus:ring-1 focus:ring-[#005A9E] text-slate-800"
              />
            </div>

            {/* Penulis */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-600">Penulis</label>
              <input
                type="text"
                placeholder="Nama Penulis"
                value={formData.penulis}
                onChange={(e) => setFormData({ ...formData, penulis: e.target.value })}
                className="w-full bg-white border border-slate-300 rounded px-3 py-1.5 text-sm outline-none focus:border-[#005A9E] focus:ring-1 focus:ring-[#005A9E] text-slate-800"
              />
            </div>

            {/* Peran */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-600">Peran Penulis</label>
              <input
                type="text"
                placeholder="Peran"
                value={formData.author_role}
                onChange={(e) => setFormData({ ...formData, author_role: e.target.value })}
                className="w-full bg-white border border-slate-300 rounded px-3 py-1.5 text-sm outline-none focus:border-[#005A9E] focus:ring-1 focus:ring-[#005A9E] text-slate-800"
              />
            </div>

            {/* Tags */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-600">Tags</label>
              <input
                type="text"
                placeholder="Tag1, Tag2..."
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                className="w-full bg-white border border-slate-300 rounded px-3 py-1.5 text-sm outline-none focus:border-[#005A9E] focus:ring-1 focus:ring-[#005A9E] text-slate-800"
              />
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
}

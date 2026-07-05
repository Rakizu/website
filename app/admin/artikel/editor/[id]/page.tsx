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
        alert('Artikel berhasil disimpan!');
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
    return <div className="flex-1 flex items-center justify-center text-white/30 animate-pulse">Menyiapkan Ruang Tulis...</div>;
  }

  return (
    <div className="flex-1 w-full max-w-4xl mx-auto px-6 py-8 md:py-12 bg-white min-h-screen">
      <div className="flex justify-between items-center mb-10 pb-4 border-b border-slate-200">
        <button 
          onClick={() => router.push('/admin/artikel')}
          className="text-slate-500 hover:text-slate-900 hover:-translate-x-1 transition-all duration-300 flex items-center gap-2 text-sm font-semibold"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
          Kembali
        </button>
        <button 
          onClick={handleSave}
          disabled={isSaving}
          className="px-6 py-2.5 rounded-lg bg-slate-900 text-white font-semibold text-sm hover:bg-slate-800 hover:-translate-y-0.5 hover:shadow-md hover:shadow-slate-900/20 active:scale-95 transition-all duration-300 ease-out disabled:opacity-50 disabled:hover:translate-y-0 shadow-sm flex items-center gap-2"
        >
          {isSaving ? (
            <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/></svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
          )}
          {isSaving ? 'Menyimpan...' : (isNew ? 'Simpan Baru' : 'Simpan Perubahan')}
        </button>
      </div>

      <div className="space-y-10 pb-32">
        {/* Status Toggle & Title */}
        <div className="flex flex-col md:flex-row gap-6 md:items-center justify-between">
          <input
            type="text"
            placeholder="Judul Artikel Baru..."
            value={formData.judul}
            onChange={(e) => setFormData({ ...formData, judul: e.target.value })}
            className="flex-1 bg-transparent border-none outline-none font-heading font-semibold text-4xl md:text-5xl text-slate-900 placeholder-slate-300"
          />
          <div className="flex items-center gap-3 bg-slate-50 px-4 py-2 rounded-lg border border-slate-200">
            <span className="text-xs font-semibold text-slate-500">Status:</span>
            <button
              disabled={userRole === 'writer'}
              onClick={() => setFormData({ ...formData, status: formData.status === 'Published' ? 'Draft' : 'Published' })}
              className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all ${
                formData.status === 'Published' ? 'bg-green-100 text-green-700' : 'bg-slate-200 text-slate-600'
              } ${userRole === 'writer' ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105 shadow-sm'}`}
            >
              {userRole === 'writer' ? 'DRAFT (Terkunci)' : formData.status}
            </button>
          </div>
        </div>

        {/* Metadata Grid (Author, Tags, etc) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 rounded-xl bg-slate-50 border border-slate-200 shadow-sm">
          <div className="space-y-3 md:col-span-2">
            <label className="text-xs font-bold text-slate-500">Kategori Artikel</label>
            <div className="flex flex-wrap gap-2">
              {predefinedCategories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setFormData({ ...formData, kategori: cat })}
                  className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-300 ease-out border active:scale-95 ${
                    formData.kategori === cat 
                      ? 'bg-slate-900 text-white border-slate-900 shadow-md shadow-slate-900/20' 
                      : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
          <div className="col-span-1 md:col-span-2 space-y-2">
            <label className="text-xs font-bold text-slate-500">Cover Image URL</label>
            <input
              type="text"
              placeholder="https://images.unsplash.com/..."
              value={formData.image}
              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              className="w-full bg-white border border-slate-200 rounded-lg px-4 py-2 outline-none text-slate-900 focus:border-slate-400 focus:ring-4 focus:ring-slate-900/5 focus:-translate-y-0.5 hover:border-slate-300 transition-all duration-300 ease-out text-sm"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500">Ringkasan (Excerpt)</label>
            <textarea
              placeholder="Tulis ringkasan singkat untuk memancing pembaca..."
              value={formData.excerpt}
              onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
              className="w-full bg-white border border-slate-200 rounded-lg px-4 py-2 outline-none text-slate-900 focus:border-slate-400 focus:ring-4 focus:ring-slate-900/5 focus:-translate-y-0.5 hover:border-slate-300 transition-all duration-300 ease-out resize-none h-12 text-sm"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500">Penulis (Author)</label>
            <input
              type="text"
              placeholder="Contoh: Ustadz H. Fulan"
              value={formData.penulis}
              onChange={(e) => setFormData({ ...formData, penulis: e.target.value })}
              className="w-full bg-white border border-slate-200 rounded-lg px-4 py-2 outline-none text-slate-900 focus:border-slate-400 focus:ring-4 focus:ring-slate-900/5 focus:-translate-y-0.5 hover:border-slate-300 transition-all duration-300 ease-out text-sm"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500">Peran Penulis</label>
            <input
              type="text"
              placeholder="Contoh: Kepala Sekolah / Editor"
              value={formData.author_role}
              onChange={(e) => setFormData({ ...formData, author_role: e.target.value })}
              className="w-full bg-white border border-slate-200 rounded-lg px-4 py-2 outline-none text-slate-900 focus:border-slate-400 focus:ring-4 focus:ring-slate-900/5 focus:-translate-y-0.5 hover:border-slate-300 transition-all duration-300 ease-out text-sm"
            />
          </div>
          <div className="col-span-1 md:col-span-2 space-y-2">
            <label className="text-xs font-bold text-slate-500">Tags (Pisahkan dengan koma)</label>
            <input
              type="text"
              placeholder="Pendidikan, Agama, Prestasi..."
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              className="w-full bg-white border border-slate-200 rounded-lg px-4 py-2 outline-none text-slate-900 focus:border-slate-400 focus:ring-4 focus:ring-slate-900/5 focus:-translate-y-0.5 hover:border-slate-300 transition-all duration-300 ease-out text-sm"
            />
          </div>
        </div>

        {/* Content Editor */}
        <div className="space-y-2 group">
          <label className="text-xs font-bold text-slate-500 ml-2 group-focus-within:text-slate-900 transition-colors">Isi Artikel (Markdown Supported)</label>
          <textarea
            ref={textareaRef}
            placeholder="Mulai menulis artikel Anda di sini..."
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            className="w-full bg-white border border-slate-200 rounded-xl p-6 outline-none text-slate-900 focus:border-slate-400 focus:ring-4 focus:ring-slate-900/5 hover:border-slate-300 transition-all duration-300 ease-out font-body text-lg leading-relaxed resize-none min-h-[400px] placeholder-slate-300"
          />
        </div>
      </div>
    </div>
  );
}

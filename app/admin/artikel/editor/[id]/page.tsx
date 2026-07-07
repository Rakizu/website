'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { use } from 'react';

export default function ArticleEditor({ params }: { params: Promise<{ id: string }> }) {
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
    return (
      <div className="h-screen w-full flex items-center justify-center bg-[#FAFAFA] text-slate-400 font-semibold tracking-widest text-sm uppercase">
        <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/></svg>
        Memuat Data...
      </div>
    );
  }

  return (
    <div className="h-screen w-full bg-[#FAFAFA] flex flex-col font-sans text-slate-900 overflow-hidden">
      <style>{`#admin-global-header { display: none !important; }`}</style>
      
      {/* SaaS Editor Toolbar */}
      <header className="flex-shrink-0 h-14 bg-white/80 backdrop-blur-xl border-b border-slate-200/60 shadow-[0_4px_24px_rgba(0,0,0,0.02)] flex items-center justify-between px-6 z-20">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => router.push('/admin/artikel')}
            className="flex items-center justify-center w-8 h-8 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-full transition-colors border border-transparent hover:border-slate-200"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
          </button>
          
          <div className="h-4 w-px bg-slate-200"></div>
          
          <div className="text-[13px] font-semibold text-slate-500">
            {isNew ? 'New Draft' : 'Editing Article'}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200/80 px-2 py-1.5 rounded-full">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest pl-2">Status</span>
            <button
              disabled={userRole === 'writer'}
              onClick={() => setFormData({ ...formData, status: formData.status === 'Published' ? 'Draft' : 'Published' })}
              className={`px-4 py-1 text-[11px] font-bold uppercase tracking-wider rounded-full border transition-all shadow-sm ${
                formData.status === 'Published' 
                  ? 'bg-emerald-500 text-white border-emerald-600 hover:bg-emerald-600' 
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              } ${userRole === 'writer' ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {userRole === 'writer' ? 'DRAFT (Locked)' : formData.status}
            </button>
          </div>

          <button 
            onClick={handleSave}
            disabled={isSaving}
            className="relative group overflow-hidden flex items-center gap-2 px-6 py-2.5 bg-slate-900 text-white text-[13px] font-bold tracking-wide rounded-full hover:bg-slate-800 transition-all shadow-[0_4px_12px_rgba(0,0,0,0.1)] active:scale-[0.98] border border-slate-900/50 disabled:opacity-70 disabled:active:scale-100"
          >
            <span className="relative z-10 flex items-center gap-2">
              {isSaving ? (
                <svg className="animate-spin h-3.5 w-3.5" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/></svg>
              ) : (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
              )}
              {isSaving ? 'Menyimpan...' : 'Simpan Perubahan'}
            </span>
            {!isSaving && <div className="absolute top-0 -left-[150%] w-full h-full skew-x-[-25deg] transition-all duration-700 ease-in-out group-hover:left-[150%] bg-[linear-gradient(to_right,transparent,rgba(255,255,255,0.15),transparent)]" />}
          </button>
        </div>
      </header>

      {/* Main Workspace: 2 Columns */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Left Column: Premium Document Canvas */}
        <div className="flex-1 overflow-y-auto bg-slate-50/50 flex justify-center pb-32 pt-8 scrollbar-hide">
          <div className="w-full max-w-3xl px-12 py-16 bg-white border border-slate-200/60 rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.02)] min-h-[800px]">
            
            <textarea
              rows={1}
              placeholder="Ketik Judul Besar di Sini..."
              value={formData.judul}
              onChange={(e) => setFormData({ ...formData, judul: e.target.value })}
              className="w-full bg-transparent border-none outline-none font-heading font-bold text-4xl text-slate-900 placeholder-slate-300 resize-none overflow-hidden leading-tight mb-8"
              onInput={(e) => {
                const target = e.target as HTMLTextAreaElement;
                target.style.height = 'auto';
                target.style.height = `${target.scrollHeight}px`;
              }}
            />
            
            <textarea
              ref={textareaRef}
              placeholder="Mulai menulis cerita Anda yang luar biasa..."
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              className="w-full bg-transparent border-none outline-none font-sans font-medium text-slate-700 text-lg leading-[1.8] resize-none min-h-[500px] placeholder-slate-300"
            />
          </div>
        </div>

        {/* Right Column: Premium Properties Sidebar */}
        <aside className="w-[250px] flex-shrink-0 bg-white border-l border-slate-200/60 overflow-y-auto hidden lg:block z-10 shadow-[-4px_0_24px_rgba(0,0,0,0.01)]">
          <div className="sticky top-0 p-3 border-b border-slate-100 bg-white/80 backdrop-blur-md">
            <h2 className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Properties</h2>
          </div>
          
          <div className="p-4 space-y-4">
            
            {/* Input Group: Kategori */}
            <div className="space-y-1">
              <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-widest">Kategori</label>
              <select
                value={formData.kategori}
                onChange={(e) => setFormData({ ...formData, kategori: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200/80 rounded-full px-3 py-1.5 outline-none text-slate-900 focus:border-slate-400 focus:ring-4 focus:ring-slate-100 transition-all text-xs font-medium shadow-sm appearance-none cursor-pointer"
              >
                {predefinedCategories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Input Group: Excerpt */}
            <div className="space-y-1">
              <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-widest">Ringkasan</label>
              <textarea
                placeholder="Tulis ringkasan..."
                value={formData.excerpt}
                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200/80 rounded-[16px] px-3 py-2 outline-none text-slate-900 focus:border-slate-400 focus:ring-4 focus:ring-slate-100 transition-all text-xs font-medium placeholder-slate-400 shadow-sm resize-none h-20 leading-relaxed"
              />
            </div>

            {/* Input Group: Image */}
            <div className="space-y-1">
              <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-widest">URL Gambar</label>
              <input
                type="text"
                placeholder="https://..."
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200/80 rounded-full px-3 py-1.5 outline-none text-slate-900 focus:border-slate-400 focus:ring-4 focus:ring-slate-100 transition-all text-xs font-medium placeholder-slate-400 shadow-sm"
              />
              {formData.image && (
                <div className="mt-2 w-full h-20 rounded-lg bg-slate-100 border border-slate-200/80 overflow-hidden relative shadow-inner">
                  <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                </div>
              )}
            </div>

            <div className="h-px w-full bg-slate-100 my-2" />

            {/* Input Group: Penulis */}
            <div className="space-y-1">
              <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-widest">Penulis</label>
              <input
                type="text"
                placeholder="Budi Santoso"
                value={formData.penulis}
                onChange={(e) => setFormData({ ...formData, penulis: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200/80 rounded-full px-3 py-1.5 outline-none text-slate-900 focus:border-slate-400 focus:ring-4 focus:ring-slate-100 transition-all text-xs font-medium placeholder-slate-400 shadow-sm"
              />
            </div>

            {/* Input Group: Peran */}
            <div className="space-y-1">
              <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-widest">Peran</label>
              <input
                type="text"
                placeholder="Editor Utama"
                value={formData.author_role}
                onChange={(e) => setFormData({ ...formData, author_role: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200/80 rounded-full px-3 py-1.5 outline-none text-slate-900 focus:border-slate-400 focus:ring-4 focus:ring-slate-100 transition-all text-xs font-medium placeholder-slate-400 shadow-sm"
              />
            </div>

            <div className="h-px w-full bg-slate-100 my-2" />

            {/* Input Group: Tags */}
            <div className="space-y-1 pb-4">
              <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-widest">Tags</label>
              <input
                type="text"
                placeholder="Acara, Sekolah..."
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200/80 rounded-full px-3 py-1.5 outline-none text-slate-900 focus:border-slate-400 focus:ring-4 focus:ring-slate-100 transition-all text-xs font-medium placeholder-slate-400 shadow-sm"
              />
              <p className="mt-1 text-[9px] font-medium text-slate-400 leading-tight">Pisahkan dengan koma.</p>
            </div>
            
          </div>
        </aside>
      </div>
    </div>
  );
}

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
    <div className="flex-1 w-full min-h-screen bg-chapter-cream cinematic-grain relative pb-32">
      <div className="max-w-4xl mx-auto px-6 pt-12 md:pt-20">
      <div className="flex justify-between items-center mb-16 pb-6 border-b border-whisper-border">
        <button 
          onClick={() => router.push('/admin/artikel')}
          className="group text-muted-steel hover:text-charcoal-ink transition-all duration-300 flex items-center gap-3 text-xs md:text-sm font-heading font-bold uppercase tracking-[0.2em]"
        >
          <span className="p-2 rounded-full border border-whisper-border group-hover:border-charcoal-ink group-hover:-translate-x-1 transition-all">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
          </span>
          Kembali ke Studio
        </button>
        <button 
          onClick={handleSave}
          disabled={isSaving}
          className="group relative px-6 md:px-10 py-3 rounded-full bg-sage text-cream font-heading font-bold text-xs md:text-sm tracking-[0.2em] uppercase hover:shadow-[0_10px_40px_rgba(107,142,35,0.3)] hover:-translate-y-1 active:scale-95 transition-all duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] disabled:opacity-50 disabled:hover:translate-y-0 flex items-center gap-3 overflow-hidden"
        >
          <span className="relative z-10 flex items-center gap-3">
            {isSaving ? (
              <svg className="animate-spin h-4 w-4 text-cream" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/></svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
            )}
            {isSaving ? 'Menyimpan...' : (isNew ? 'Publish' : 'Simpan')}
          </span>
          <div className="absolute inset-0 bg-sage-deep transform translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)]" />
        </button>
      </div>

      <div className="space-y-16">
        {/* Status Toggle & Title */}
        <div className="flex flex-col gap-8 relative">
          {/* Status Badge floating */}
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-heading font-bold uppercase tracking-widest text-muted-steel">Status Publikasi:</span>
            <button
              disabled={userRole === 'writer'}
              onClick={() => setFormData({ ...formData, status: formData.status === 'Published' ? 'Draft' : 'Published' })}
              className={`px-4 py-1.5 rounded-full text-[10px] font-heading font-bold uppercase tracking-widest transition-all duration-300 ${
                formData.status === 'Published' ? 'bg-gold text-ink border border-gold-soft' : 'bg-canvas-white text-muted-steel border border-whisper-border'
              } ${userRole === 'writer' ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105 shadow-[0_4px_20px_rgb(0,0,0,0.05)]'}`}
            >
              {userRole === 'writer' ? 'DRAFT (Terkunci)' : formData.status}
            </button>
          </div>

          <textarea
            rows={2}
            placeholder="Ketik Judul Raksasa Di Sini..."
            value={formData.judul}
            onChange={(e) => setFormData({ ...formData, judul: e.target.value })}
            className="w-full bg-transparent border-none outline-none font-heading font-bold text-5xl md:text-6xl lg:text-7xl xl:text-[5rem] tracking-tighter text-charcoal-ink placeholder-muted-steel/40 transition-all resize-none overflow-hidden leading-[1.05]"
            onInput={(e) => {
              const target = e.target as HTMLTextAreaElement;
              target.style.height = 'auto';
              target.style.height = `${target.scrollHeight}px`;
            }}
          />
        </div>

        {/* Bento Grid Metadata */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 p-8 md:p-10 rounded-[2.5rem] bg-pure-surface border border-whisper-border shadow-[0_4px_30px_rgb(0,0,0,0.02)]">
          
          <div className="md:col-span-12 space-y-4 border-b border-whisper-border pb-8">
            <label className="text-[10px] font-heading font-bold text-muted-steel uppercase tracking-[0.2em]">Kategori Artikel</label>
            <div className="flex flex-wrap gap-3">
              {predefinedCategories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setFormData({ ...formData, kategori: cat })}
                  className={`px-6 py-2.5 rounded-full text-xs font-heading font-bold tracking-widest uppercase transition-all duration-300 ease-out border active:scale-95 ${
                    formData.kategori === cat 
                      ? 'bg-ink text-cream border-ink shadow-[0_4px_20px_rgb(0,0,0,0.15)]' 
                      : 'bg-canvas-white text-charcoal-ink border-whisper-border hover:border-gold-soft hover:bg-gold-soft/10'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
          
          <div className="md:col-span-12 space-y-2 pt-2">
            <label className="text-[10px] font-heading font-bold text-muted-steel uppercase tracking-[0.2em]">Ringkasan (Excerpt)</label>
            <textarea
              placeholder="Tulis ringkasan tajam untuk memancing pembaca..."
              value={formData.excerpt}
              onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
              className="w-full bg-transparent border-b border-whisper-border py-4 outline-none text-charcoal-ink focus:border-gold-soft hover:border-gold-soft transition-all duration-500 ease-out resize-none h-16 font-accent italic text-xl placeholder-muted-steel/50"
            />
          </div>

          <div className="md:col-span-12 space-y-2 mt-4">
            <label className="text-[10px] font-heading font-bold text-muted-steel uppercase tracking-[0.2em]">Cover Image URL</label>
            <input
              type="text"
              placeholder="https://images.unsplash.com/..."
              value={formData.image}
              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              className="w-full bg-canvas-white border border-whisper-border rounded-xl px-6 py-4 outline-none text-charcoal-ink focus:border-gold-soft focus:ring-4 focus:ring-gold-soft/10 hover:border-gold-soft transition-all duration-300 font-body text-sm"
            />
          </div>

          <div className="md:col-span-4 space-y-2 mt-4">
            <label className="text-[10px] font-heading font-bold text-muted-steel uppercase tracking-[0.2em]">Penulis</label>
            <input
              type="text"
              placeholder="Contoh: Ustadz H. Fulan"
              value={formData.penulis}
              onChange={(e) => setFormData({ ...formData, penulis: e.target.value })}
              className="w-full bg-canvas-white border border-whisper-border rounded-xl px-6 py-4 outline-none text-charcoal-ink focus:border-gold-soft focus:ring-4 focus:ring-gold-soft/10 hover:border-gold-soft transition-all duration-300 font-body text-sm"
            />
          </div>

          <div className="md:col-span-4 space-y-2 mt-4">
            <label className="text-[10px] font-heading font-bold text-muted-steel uppercase tracking-[0.2em]">Peran Penulis</label>
            <input
              type="text"
              placeholder="Contoh: Editor Utama"
              value={formData.author_role}
              onChange={(e) => setFormData({ ...formData, author_role: e.target.value })}
              className="w-full bg-canvas-white border border-whisper-border rounded-xl px-6 py-4 outline-none text-charcoal-ink focus:border-gold-soft focus:ring-4 focus:ring-gold-soft/10 hover:border-gold-soft transition-all duration-300 font-body text-sm"
            />
          </div>

          <div className="md:col-span-4 space-y-2 mt-4">
            <label className="text-[10px] font-heading font-bold text-muted-steel uppercase tracking-[0.2em]">Tags (Pisahkan koma)</label>
            <input
              type="text"
              placeholder="Pendidikan, Agama..."
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              className="w-full bg-canvas-white border border-whisper-border rounded-xl px-6 py-4 outline-none text-charcoal-ink focus:border-gold-soft focus:ring-4 focus:ring-gold-soft/10 hover:border-gold-soft transition-all duration-300 font-body text-sm"
            />
          </div>
        </div>

        {/* Pure Canvas Content Editor */}
        <div className="space-y-4 group mt-16 pb-32">
          <textarea
            ref={textareaRef}
            placeholder="Mulai menggoreskan pena Anda di sini..."
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            className="w-full bg-transparent border-none outline-none text-charcoal-ink transition-all duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] font-accent text-2xl md:text-[1.75rem] leading-[1.8] resize-none min-h-[600px] placeholder-muted-steel/30"
          />
        </div>
      </div>
      </div>
    </div>
  );
}

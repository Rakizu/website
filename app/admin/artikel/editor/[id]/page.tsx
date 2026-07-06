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
    return <div className="h-screen w-full flex items-center justify-center bg-gray-50 text-gray-500 animate-pulse text-sm font-medium">Memuat Data...</div>;
  }

  return (
    <div className="h-screen w-full bg-white flex flex-col font-sans text-gray-900 overflow-hidden">
      {/* Unified Full-Width Header */}
      <header className="flex-shrink-0 h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 z-10">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => router.push('/admin/artikel')}
            className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
            Kembali
          </button>
          
          <div className="h-5 w-px bg-gray-300"></div>
          
          <div className="text-sm font-medium text-gray-400">
            {isNew ? 'Membuat Artikel Baru' : 'Mengedit Artikel'}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">Status:</span>
            <button
              disabled={userRole === 'writer'}
              onClick={() => setFormData({ ...formData, status: formData.status === 'Published' ? 'Draft' : 'Published' })}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md border transition-colors ${
                formData.status === 'Published' 
                  ? 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100' 
                  : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
              } ${userRole === 'writer' ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {userRole === 'writer' ? 'DRAFT (Terkunci)' : formData.status}
            </button>
          </div>

          <button 
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-50"
          >
            {isSaving ? (
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/></svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
            )}
            {isSaving ? 'Menyimpan...' : 'Simpan'}
          </button>
        </div>
      </header>

      {/* Main Workspace: 2 Columns */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Left Column: Document Canvas */}
        <div className="flex-1 overflow-y-auto bg-white flex justify-center pb-32">
          <div className="w-full max-w-3xl px-8 py-12 md:py-16">
            
            <textarea
              rows={1}
              placeholder="Judul Artikel..."
              value={formData.judul}
              onChange={(e) => setFormData({ ...formData, judul: e.target.value })}
              className="w-full bg-transparent border-none outline-none font-bold text-4xl text-gray-900 placeholder-gray-300 resize-none overflow-hidden leading-tight mb-6"
              onInput={(e) => {
                const target = e.target as HTMLTextAreaElement;
                target.style.height = 'auto';
                target.style.height = `${target.scrollHeight}px`;
              }}
            />
            
            <textarea
              ref={textareaRef}
              placeholder="Ketik konten utama di sini..."
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              className="w-full bg-transparent border-none outline-none text-gray-800 text-lg leading-relaxed resize-none min-h-[500px] placeholder-gray-300"
            />
          </div>
        </div>

        {/* Right Column: Properties Sidebar */}
        <aside className="w-80 flex-shrink-0 bg-gray-50 border-l border-gray-200 overflow-y-auto hidden lg:block">
          <div className="p-4 border-b border-gray-200 bg-gray-100/50">
            <h2 className="text-sm font-semibold text-gray-700">Pengaturan Dokumen</h2>
          </div>
          
          <div className="p-5 space-y-5">
            {/* Kategori */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Kategori</label>
              <select
                value={formData.kategori}
                onChange={(e) => setFormData({ ...formData, kategori: e.target.value })}
                className="w-full bg-white border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
              >
                {predefinedCategories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Excerpt */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Ringkasan Singkat</label>
              <textarea
                placeholder="Deskripsi singkat..."
                value={formData.excerpt}
                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                className="w-full bg-white border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow resize-none h-24"
              />
            </div>

            {/* Cover Image */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Gambar Sampul (URL)</label>
              <input
                type="text"
                placeholder="https://..."
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                className="w-full bg-white border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
              />
            </div>

            <hr className="border-gray-200" />

            {/* Penulis */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Nama Penulis</label>
              <input
                type="text"
                placeholder="Contoh: Budi Santoso"
                value={formData.penulis}
                onChange={(e) => setFormData({ ...formData, penulis: e.target.value })}
                className="w-full bg-white border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
              />
            </div>

            {/* Peran Penulis */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Peran Penulis</label>
              <input
                type="text"
                placeholder="Contoh: Editor Utama"
                value={formData.author_role}
                onChange={(e) => setFormData({ ...formData, author_role: e.target.value })}
                className="w-full bg-white border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
              />
            </div>

            <hr className="border-gray-200" />

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Tags</label>
              <input
                type="text"
                placeholder="Pendidikan, Sekolah..."
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                className="w-full bg-white border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
              />
              <p className="mt-1.5 text-xs text-gray-500">Pisahkan dengan koma.</p>
            </div>
            
          </div>
        </aside>
      </div>
    </div>
  );
}

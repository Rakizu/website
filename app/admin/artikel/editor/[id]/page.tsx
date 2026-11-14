'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { use } from 'react';
import { ImageEditorModal } from '@/components/admin/ImageEditorModal';
import { RichToolbar } from '@/components/admin/RichToolbar';
import { ArticleLivePreview } from '@/components/admin/ArticleLivePreview';
import { SeoSocialPreviewModal } from '@/components/admin/SeoSocialPreviewModal';
import { 
  Sparkles, 
  Crop, 
  PenTool, 
  Columns, 
  Eye, 
  Check, 
  AlertCircle, 
  Settings, 
  X, 
  ArrowLeft,
  Maximize2,
  Minimize2,
  Globe,
  Tag as TagIcon,
  Search,
  Plus
} from 'lucide-react';

export default function ArticleEditor({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const { id } = resolvedParams;
  const isNew = id === 'new';
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(!isNew);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isPropertiesOpen, setIsPropertiesOpen] = useState(true);
  const [isImageEditorOpen, setIsImageEditorOpen] = useState(false);
  const [isSeoModalOpen, setIsSeoModalOpen] = useState(false);
  const [isZenMode, setIsZenMode] = useState(false);
  const [tagInput, setTagInput] = useState('');
  const [isVisualMode, setIsVisualMode] = useState(true);
  const contentEditableRef = useRef<HTMLDivElement>(null);
  const isEditorInitialized = useRef(false);

  // Multi-view states: 'write' | 'split' | 'preview'
  const [viewMode, setViewMode] = useState<'write' | 'split' | 'preview'>('write');

  // LocalStorage Auto-save states
  const [lastAutoSaved, setLastAutoSaved] = useState<string | null>(null);
  const [hasRecoverableDraft, setHasRecoverableDraft] = useState(false);
  const [recoverableData, setRecoverableData] = useState<any>(null);

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
  const suggestedTags = ['Pendidikan', 'Prestasi', 'Tahfidz', 'Kegiatan', 'Karakter', 'Parenting'];
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Zen Mode Esc key listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsZenMode(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Tag helper functions
  const handleAddTag = (tagToAdd: string) => {
    const clean = tagToAdd.trim().replace(/^#/, '');
    if (!clean) return;
    const existing = formData.tags ? formData.tags.split(',').map(t => t.trim()).filter(Boolean) : [];
    if (!existing.includes(clean)) {
      const updated = [...existing, clean].join(', ');
      setFormData(prev => ({ ...prev, tags: updated }));
    }
    setTagInput('');
  };

  const handleRemoveTag = (tagToRemove: string) => {
    const existing = formData.tags ? formData.tags.split(',').map(t => t.trim()).filter(Boolean) : [];
    const updated = existing.filter(t => t !== tagToRemove).join(', ');
    setFormData(prev => ({ ...prev, tags: updated }));
  };

  const convertToHtml = useCallback((raw: string): string => {
    if (!raw) return '<p style="text-align: justify"><br></p>';
    if (/<(p|div|h[1-6]|blockquote|ul|ol|figure|table)/i.test(raw)) {
      return raw;
    }

    const paragraphs = raw.split(/\n\n+/);
    return paragraphs.map(p => {
      const trimmed = p.trim();
      if (!trimmed) return '';
      
      if (trimmed.startsWith('## ')) {
        return `<h2 class="text-2xl font-bold font-heading text-slate-900 mt-6 mb-3 pb-1 border-b border-slate-200">${trimmed.slice(3)}</h2>`;
      }
      if (trimmed.startsWith('### ')) {
        return `<h3 class="text-xl font-bold font-heading text-[#6B8E23] mt-5 mb-2">${trimmed.slice(4)}</h3>`;
      }
      if (trimmed.startsWith('> ')) {
        const isHikmah = trimmed.includes('Mutiara Hikmah') || trimmed.includes('💡');
        const cleanQuote = trimmed.replace(/^>\s*/gm, '');
        if (isHikmah) {
          return `<div class="my-5 p-4 border-l-4 border-[#6B8E23] bg-[#6B8E23]/10 rounded-r-2xl font-sans text-slate-800">
            <div class="font-bold text-xs uppercase tracking-wider text-[#6B8E23] mb-1">💡 Mutiara Hikmah</div>
            <div>${cleanQuote.replace(/💡 \*\*Mutiara Hikmah:\*\*\s*/, '')}</div>
          </div><p><br></p>`;
        }
        return `<blockquote class="my-5 p-4 border-l-4 border-[#C79A45] bg-[#C79A45]/10 rounded-r-2xl italic font-serif text-slate-800">${cleanQuote}</blockquote><p><br></p>`;
      }
      const imgMatch = trimmed.match(/^!\[(.*?)\]\((.*?)\)/);
      if (imgMatch) {
        const alt = imgMatch[1];
        const src = imgMatch[2];
        const caption = trimmed.replace(imgMatch[0], '').replace(/^\n\*(.*?)\*$/, '$1').trim();
        return `<figure class="my-6">
          <img src="${src}" alt="${alt}" class="w-full rounded-2xl shadow-md max-h-[480px] object-cover" />
          ${caption ? `<figcaption class="text-center text-xs text-slate-500 italic mt-2">${caption.replace(/\*/g, '')}</figcaption>` : ''}
        </figure><p><br></p>`;
      }
      if (trimmed.startsWith('- ')) {
        const items = trimmed.split('\n').filter(l => l.startsWith('- '));
        return `<ul class="list-disc list-inside my-4 space-y-1 text-slate-700">${items.map(it => `<li>${it.slice(2)}</li>`).join('')}</ul><p><br></p>`;
      }
      if (trimmed === '---') {
        return `<hr class="my-8 border-slate-200" /><p><br></p>`;
      }

      const formatted = trimmed
        .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
        .replace(/(?<!\*)\*([^*]+)\*(?!\*)/g, '<em>$1</em>');

      return `<p style="text-align: justify">${formatted}</p>`;
    }).filter(Boolean).join('\n\n');
  }, []);

  const handleEditorInput = () => {
    if (contentEditableRef.current) {
      const html = contentEditableRef.current.innerHTML;
      setFormData(prev => ({ ...prev, content: html }));
    }
  };

  const handleEditorKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.ctrlKey || e.metaKey) {
      if (e.key.toLowerCase() === 'j') {
        e.preventDefault();
        document.execCommand('justifyFull', false);
        handleEditorInput();
      }
    }
  };

  const fetchAuth = useCallback(async () => {
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
  }, [isNew]);

  const fetchArticle = useCallback(async () => {
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
        if (contentEditableRef.current && !isEditorInitialized.current) {
          contentEditableRef.current.innerHTML = convertToHtml(json.data.content || '');
          isEditorInitialized.current = true;
        }
      } else {
        alert('Artikel tidak ditemukan');
        router.push('/admin/artikel');
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, [id, router]);

  useEffect(() => {
    fetchAuth();
    if (!isNew) {
      fetchArticle();
    } else if (contentEditableRef.current && !isEditorInitialized.current) {
      if (!formData.content) {
        contentEditableRef.current.innerHTML = '<p style="text-align: justify"><br></p>';
      } else {
        contentEditableRef.current.innerHTML = convertToHtml(formData.content);
      }
      isEditorInitialized.current = true;
    }
  }, [isNew, fetchAuth, fetchArticle, convertToHtml, formData.content]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [formData.content, viewMode]);

  // Check for local draft on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(`tj_editor_draft_${id}`);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed?.data?.judul || parsed?.data?.content) {
          setRecoverableData(parsed);
          setHasRecoverableDraft(true);
        }
      }
    } catch (e) {
      console.warn('LocalStorage error', e);
    }
  }, [id]);

  // Debounced auto-save to localStorage
  useEffect(() => {
    if (!formData.judul && !formData.content) return;
    const timer = setTimeout(() => {
      try {
        const timeStr = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
        localStorage.setItem(`tj_editor_draft_${id}`, JSON.stringify({
          data: formData,
          savedAt: timeStr,
        }));
        setLastAutoSaved(timeStr);
      } catch (e) {
        console.warn('Draft save error', e);
      }
    }, 2500);

    return () => clearTimeout(timer);
  }, [formData, id]);

  const handleRestoreDraft = () => {
    if (recoverableData?.data) {
      setFormData(recoverableData.data);
      if (contentEditableRef.current && recoverableData.data.content) {
        contentEditableRef.current.innerHTML = convertToHtml(recoverableData.data.content);
      }
    }
    setHasRecoverableDraft(false);
  };

  const handleDismissDraft = () => {
    try {
      localStorage.removeItem(`tj_editor_draft_${id}`);
    } catch (e) {}
    setHasRecoverableDraft(false);
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
        try {
          localStorage.removeItem(`tj_editor_draft_${id}`);
          setLastAutoSaved(null);
        } catch (e) {}

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

  const handleUploadImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('File harus berupa gambar (JPG, PNG, GIF, WebP)');
      return;
    }

    setIsUploading(true);
    const data = new FormData();
    data.append('file', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: data,
      });
      const json = await res.json();
      
      if (json.success) {
        setFormData(prev => ({ ...prev, image: json.url }));
      } else {
        alert('Gagal mengunggah gambar: ' + json.message);
      }
    } catch (error) {
      console.error(error);
      alert('Terjadi kesalahan saat mengunggah.');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
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

  // Zen Focus Mode (Distraction-free Fullscreen Writing)
  if (isZenMode) {
    const wordCount = formData.content.trim() ? formData.content.trim().split(/\s+/).filter(Boolean).length : 0;
    const readingTime = Math.max(1, Math.ceil(wordCount / 200));

    return (
      <div className="fixed inset-0 z-[200] bg-[#FAF8F5] text-slate-900 flex flex-col font-sans overflow-hidden animate-in fade-in duration-300">
        <style>{`#admin-global-header { display: none !important; }`}</style>
        
        {/* Floating Top Bar */}
        <div className="h-14 flex items-center justify-between px-6 sm:px-12 bg-transparent">
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono tracking-widest uppercase text-slate-400 font-bold">
              Zen Focus Mode
            </span>
            <span className="text-slate-300">•</span>
            <span className="text-xs font-medium text-slate-500">
              {wordCount} Kata · {readingTime} Menit Baca
            </span>
            {lastAutoSaved && (
              <>
                <span className="text-slate-300">•</span>
                <span className="text-xs text-emerald-600 font-medium">
                  Auto-saved {lastAutoSaved}
                </span>
              </>
            )}
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden sm:inline text-[11px] font-mono text-slate-400 bg-slate-200/60 px-2 py-0.5 rounded">
              ESC untuk keluar
            </span>
            <button
              type="button"
              onClick={() => setIsZenMode(false)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-slate-900 text-white rounded-full text-xs font-bold shadow-md hover:bg-slate-800 transition-all cursor-pointer"
            >
              <Minimize2 size={13} />
              <span>Keluar Zen</span>
            </button>
          </div>
        </div>

        {/* Focused Pure Document Canvas */}
        <div className="flex-1 overflow-y-auto flex justify-center px-6 sm:px-16 py-8 scrollbar-hide">
          <div className="w-full max-w-3xl min-h-full">
            <textarea
              rows={1}
              placeholder="Ketik Judul Cerita Anda..."
              value={formData.judul}
              onChange={(e) => setFormData({ ...formData, judul: e.target.value })}
              className="w-full bg-transparent border-none outline-none font-heading font-bold text-4xl sm:text-5xl text-slate-900 placeholder-slate-300 resize-none overflow-hidden leading-tight mb-8"
              onInput={(e) => {
                const target = e.target as HTMLTextAreaElement;
                target.style.height = 'auto';
                target.style.height = `${target.scrollHeight}px`;
              }}
            />

            {isVisualMode ? (
              <div
                ref={contentEditableRef}
                contentEditable
                suppressContentEditableWarning
                onInput={handleEditorInput}
                onKeyDown={handleEditorKeyDown}
                data-placeholder="Mulai menulis cerita Anda dengan tenang..."
                className="w-full min-h-[600px] outline-none text-slate-800 text-lg sm:text-xl leading-[2] font-sans prose prose-slate max-w-none empty:before:content-[attr(data-placeholder)] empty:before:text-slate-300 empty:before:pointer-events-none focus:outline-none"
                style={{ textAlign: 'justify' }}
              />
            ) : (
              <textarea
                ref={textareaRef}
                placeholder="Mulai menulis cerita Anda dengan tenang..."
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                className="w-full bg-transparent border-none outline-none font-sans font-medium text-slate-800 text-lg sm:text-xl leading-[2] resize-none min-h-[600px] placeholder-slate-300"
              />
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-full bg-[#FAFAFA] flex flex-col font-sans text-slate-900 overflow-hidden">
      <style>{`#admin-global-header { display: none !important; }`}</style>
      
      {/* SaaS Editor Toolbar */}
      <header className="flex-shrink-0 h-14 bg-white/80 backdrop-blur-xl border-b border-slate-200/60 shadow-[0_4px_24px_rgba(0,0,0,0.02)] flex items-center justify-between px-4 sm:px-6 z-20">
        <div className="flex items-center gap-3 sm:gap-4">
          <button 
            onClick={() => router.push('/admin/artikel')}
            className="flex items-center justify-center w-8 h-8 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-full transition-colors border border-transparent hover:border-slate-200 cursor-pointer"
            title="Kembali ke Daftar Artikel"
          >
            <ArrowLeft size={16} />
          </button>
          
          <div className="h-4 w-px bg-slate-200 hidden sm:block"></div>
          
          <div className="text-[13px] font-semibold text-slate-600 hidden sm:block">
            {isNew ? 'Draf Baru' : 'Edit Artikel'}
          </div>

          {/* Auto-save status telemetry */}
          {lastAutoSaved && (
            <div className="hidden xl:flex items-center gap-1.5 text-[11px] font-medium text-emerald-600 bg-emerald-50 border border-emerald-200/80 px-2.5 py-1 rounded-full">
              <Check size={11} className="stroke-[3]" />
              <span>Draf tersimpan {lastAutoSaved}</span>
            </div>
          )}
        </div>

        {/* Center: View Mode Segmented Control (Write / Split / Preview) */}
        <div className="flex items-center p-1 bg-slate-100 rounded-xl border border-slate-200/80 shadow-inner">
          <button
            type="button"
            onClick={() => setViewMode('write')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              viewMode === 'write'
                ? 'bg-white text-slate-900 shadow-sm border border-slate-200/60'
                : 'text-slate-500 hover:text-slate-900 hover:bg-white/50'
            }`}
          >
            <PenTool size={13} />
            <span className="hidden xs:inline sm:inline">Tulis</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode('split')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              viewMode === 'split'
                ? 'bg-white text-slate-900 shadow-sm border border-slate-200/60'
                : 'text-slate-500 hover:text-slate-900 hover:bg-white/50'
            }`}
          >
            <Columns size={13} />
            <span className="hidden xs:inline sm:inline">Split</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode('preview')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              viewMode === 'preview'
                ? 'bg-white text-slate-900 shadow-sm border border-slate-200/60'
                : 'text-slate-500 hover:text-slate-900 hover:bg-white/50'
            }`}
          >
            <Eye size={13} />
            <span className="hidden xs:inline sm:inline">Pratinjau</span>
          </button>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200/80 px-2 py-1.5 rounded-full">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest pl-2 hidden md:inline">Status</span>
            <button
              disabled={userRole === 'writer'}
              onClick={() => setFormData({ ...formData, status: formData.status === 'Published' ? 'Draft' : 'Published' })}
              className={`px-3 sm:px-4 py-1 text-[11px] font-bold uppercase tracking-wider rounded-full border transition-all shadow-sm ${
                formData.status === 'Published' 
                  ? 'bg-emerald-500 text-white border-emerald-600 hover:bg-emerald-600' 
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              } ${userRole === 'writer' ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
            >
              {userRole === 'writer' ? 'DRAFT (Locked)' : formData.status}
            </button>
          </div>

          {/* Mode Zen Button */}
          <button
            type="button"
            onClick={() => setIsZenMode(true)}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-full border border-slate-200/80 bg-white text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-all cursor-pointer shadow-2xs"
            title="Masuk ke Mode Zen (Fokus Menulis Penuh)"
          >
            <Maximize2 size={13} />
            <span className="hidden xl:inline">Mode Zen</span>
          </button>

          <button
            type="button"
            onClick={() => setIsPropertiesOpen(prev => !prev)}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-full border transition-all cursor-pointer ${
              isPropertiesOpen
                ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
            title="Buka/Tutup Properti Artikel"
          >
            <Settings size={14} />
            <span className="hidden md:inline">Properti</span>
          </button>

          <button 
            onClick={handleSave}
            disabled={isSaving}
            className="relative group overflow-hidden flex items-center gap-2 px-3.5 sm:px-5 py-2 sm:py-2.5 bg-slate-900 text-white text-[11px] sm:text-[13px] font-bold tracking-wide rounded-full hover:bg-slate-800 transition-all shadow-[0_4px_12px_rgba(0,0,0,0.1)] active:scale-[0.98] border border-slate-900/50 disabled:opacity-70 disabled:active:scale-100 cursor-pointer"
          >
            <span className="relative z-10 flex items-center gap-1.5 sm:gap-2">
              {isSaving ? (
                <svg className="animate-spin h-3.5 w-3.5" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/></svg>
              ) : (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
              )}
              <span className="hidden sm:inline">{isSaving ? 'Menyimpan...' : 'Simpan Perubahan'}</span>
              <span className="sm:hidden">{isSaving ? 'Tunggu...' : 'Simpan'}</span>
            </span>
            {!isSaving && <div className="absolute top-0 -left-[150%] w-full h-full skew-x-[-25deg] transition-all duration-700 ease-in-out group-hover:left-[150%] bg-[linear-gradient(to_right,transparent,rgba(255,255,255,0.15),transparent)]" />}
          </button>
        </div>
      </header>

      {/* Local Draft Recovery Banner */}
      {hasRecoverableDraft && (
        <div className="flex-shrink-0 bg-amber-50 border-b border-amber-200 px-4 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-2 z-10 transition-all">
          <div className="flex items-center gap-2.5 text-xs text-amber-900 font-medium">
            <AlertCircle size={16} className="text-amber-600 flex-shrink-0" />
            <span>
              Ditemukan draf lokal belum tersimpan {recoverableData?.savedAt ? `(tersimpan ${recoverableData.savedAt})` : ''}. Ingin memulihkan teks tersebut?
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleRestoreDraft}
              className="px-3 py-1 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-full transition-colors shadow-sm cursor-pointer"
            >
              Pulihkan Draf
            </button>
            <button
              type="button"
              onClick={handleDismissDraft}
              className="px-3 py-1 text-amber-700 hover:text-amber-900 hover:bg-amber-100 rounded-full text-xs font-semibold transition-colors cursor-pointer"
            >
              Abaikan
            </button>
          </div>
        </div>
      )}

      {/* Main Workspace Container */}
      <div className="flex-1 flex overflow-hidden relative">
        
        {/* VIEW MODE: WRITE */}
        {viewMode === 'write' && (
          <div className="flex-1 flex flex-col overflow-hidden bg-slate-50/50">
            {/* Sticky Rich Formatting Toolbar */}
            <RichToolbar
              content={formData.content}
              onContentChange={(newContent) => {
                setFormData(prev => ({ ...prev, content: newContent }));
                if (contentEditableRef.current && contentEditableRef.current.innerHTML !== newContent) {
                  contentEditableRef.current.innerHTML = newContent;
                }
              }}
              editorRef={contentEditableRef}
              textareaRef={textareaRef}
              isVisualMode={isVisualMode}
              onToggleVisualMode={() => {
                setIsVisualMode(prev => {
                  const next = !prev;
                  if (next && contentEditableRef.current) {
                    contentEditableRef.current.innerHTML = convertToHtml(formData.content);
                  }
                  return next;
                });
              }}
            />

            {/* Scrollable Document Paper */}
            <div className="flex-1 overflow-y-auto flex justify-center pb-32 pt-8 px-4 sm:px-6 scrollbar-hide">
              <div className="w-full max-w-3xl px-8 sm:px-14 py-12 sm:py-16 bg-white border border-slate-200/60 rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.02)] min-h-[800px] h-fit">
                
                <textarea
                  rows={1}
                  placeholder="Ketik Judul Besar di Sini..."
                  value={formData.judul}
                  onChange={(e) => setFormData({ ...formData, judul: e.target.value })}
                  className="w-full bg-transparent border-none outline-none font-heading font-bold text-3xl sm:text-4xl text-slate-900 placeholder-slate-300 resize-none overflow-hidden leading-tight mb-8"
                  onInput={(e) => {
                    const target = e.target as HTMLTextAreaElement;
                    target.style.height = 'auto';
                    target.style.height = `${target.scrollHeight}px`;
                  }}
                />
                
                {isVisualMode ? (
                  <div
                    ref={contentEditableRef}
                    contentEditable
                    suppressContentEditableWarning
                    onInput={handleEditorInput}
                    onKeyDown={handleEditorKeyDown}
                    data-placeholder="Mulai menulis cerita Anda di sini... (Klik tombol Justify untuk rata kanan-kiri, Tebal, Miring, atau Sisipkan Foto)"
                    className="w-full min-h-[550px] outline-none text-slate-800 text-base sm:text-lg leading-[1.85] font-sans prose prose-slate max-w-none empty:before:content-[attr(data-placeholder)] empty:before:text-slate-300 empty:before:pointer-events-none focus:outline-none"
                    style={{ textAlign: 'justify' }}
                  />
                ) : (
                  <textarea
                    ref={textareaRef}
                    placeholder="Mulai menulis cerita Anda yang luar biasa... (Dukung format Markdown, Heading, Kutipan Hadits, & Sisip Foto)"
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    className="w-full bg-transparent border-none outline-none font-mono text-sm text-slate-800 leading-[1.8] resize-none min-h-[500px] placeholder-slate-300"
                  />
                )}
              </div>
            </div>
          </div>
        )}

        {/* VIEW MODE: SPLIT */}
        {viewMode === 'split' && (
          <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
            {/* Left Pane: Editor */}
            <div className="w-full lg:w-1/2 flex flex-col border-b lg:border-b-0 lg:border-r border-slate-200/70 overflow-hidden bg-slate-50/50">
              <RichToolbar
                content={formData.content}
                onContentChange={(newContent) => {
                  setFormData(prev => ({ ...prev, content: newContent }));
                  if (contentEditableRef.current && contentEditableRef.current.innerHTML !== newContent) {
                    contentEditableRef.current.innerHTML = newContent;
                  }
                }}
                editorRef={contentEditableRef}
                textareaRef={textareaRef}
                isVisualMode={isVisualMode}
                onToggleVisualMode={() => {
                  setIsVisualMode(prev => {
                    const next = !prev;
                    if (next && contentEditableRef.current) {
                      contentEditableRef.current.innerHTML = convertToHtml(formData.content);
                    }
                    return next;
                  });
                }}
              />
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 scrollbar-hide">
                <div className="w-full bg-white border border-slate-200/60 rounded-2xl p-6 sm:p-10 shadow-sm min-h-[650px]">
                  <textarea
                    rows={1}
                    placeholder="Judul Artikel..."
                    value={formData.judul}
                    onChange={(e) => setFormData({ ...formData, judul: e.target.value })}
                    className="w-full bg-transparent border-none outline-none font-heading font-bold text-2xl sm:text-3xl text-slate-900 placeholder-slate-300 resize-none overflow-hidden leading-tight mb-6"
                    onInput={(e) => {
                      const target = e.target as HTMLTextAreaElement;
                      target.style.height = 'auto';
                      target.style.height = `${target.scrollHeight}px`;
                    }}
                  />
                  {isVisualMode ? (
                    <div
                      ref={contentEditableRef}
                      contentEditable
                      suppressContentEditableWarning
                      onInput={handleEditorInput}
                      onKeyDown={handleEditorKeyDown}
                      data-placeholder="Tulis konten artikel di sini..."
                      className="w-full min-h-[450px] outline-none text-slate-800 text-base leading-[1.8] font-sans prose prose-slate max-w-none empty:before:content-[attr(data-placeholder)] empty:before:text-slate-300 empty:before:pointer-events-none focus:outline-none"
                      style={{ textAlign: 'justify' }}
                    />
                  ) : (
                    <textarea
                      ref={textareaRef}
                      placeholder="Tulis konten artikel di sini..."
                      value={formData.content}
                      onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                      className="w-full bg-transparent border-none outline-none font-mono text-sm text-slate-800 leading-[1.8] resize-none min-h-[450px] placeholder-slate-300"
                    />
                  )}
                </div>
              </div>
            </div>

            {/* Right Pane: Live Preview */}
            <div className="w-full lg:w-1/2 flex flex-col overflow-hidden bg-[#f6efe2]">
              <div className="flex-shrink-0 h-10 bg-[#ebe2d3] border-b border-[#2a201a]/10 px-5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs font-bold uppercase tracking-wider text-[#4a3e35]">
                    Pratinjau Publik Real-time
                  </span>
                </div>
                <span className="text-[11px] font-mono text-[#8a7968]">Live Sync</span>
              </div>
              <div className="flex-1 overflow-y-auto">
                <ArticleLivePreview {...formData} />
              </div>
            </div>
          </div>
        )}

        {/* VIEW MODE: PREVIEW (Full Width) */}
        {viewMode === 'preview' && (
          <div className="flex-1 flex flex-col overflow-hidden bg-[#f6efe2]">
            <div className="flex-shrink-0 h-11 bg-[#ebe2d3] border-b border-[#2a201a]/10 px-6 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-bold uppercase tracking-wider text-[#4a3e35]">
                  Mode Pratinjau Publik Penuh — Sesuai Tampilan Pembaca Website
                </span>
              </div>
              <button
                type="button"
                onClick={() => setViewMode('write')}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-white text-slate-800 hover:bg-slate-50 rounded-full text-xs font-bold border border-slate-200/80 shadow-sm transition-all cursor-pointer"
              >
                <PenTool size={12} />
                <span>Kembali ke Mode Tulis</span>
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">
              <ArticleLivePreview {...formData} />
            </div>
          </div>
        )}

        {/* Mobile / Slide-over Backdrop Overlay */}
        {isPropertiesOpen && (
          <div 
            className={`fixed inset-0 bg-slate-900/25 backdrop-blur-sm z-[99] ${
              viewMode === 'write' ? 'lg:hidden' : 'block'
            }`}
            onClick={() => setIsPropertiesOpen(false)}
          />
        )}

        {/* Premium Properties Sidebar */}
        <aside className={`
          ${viewMode === 'write' 
            ? (isPropertiesOpen ? 'fixed inset-y-0 right-0 z-[100] lg:relative lg:z-10 w-[320px] max-w-[85vw] flex-shrink-0 translate-x-0' : 'fixed inset-y-0 right-0 z-[100] lg:hidden w-[320px] max-w-[85vw] translate-x-full')
            : (isPropertiesOpen ? 'fixed inset-y-0 right-0 z-[100] w-[320px] max-w-[85vw] translate-x-0 shadow-2xl' : 'fixed inset-y-0 right-0 z-[100] w-[320px] max-w-[85vw] translate-x-full shadow-2xl')
          }
          bg-white border-l border-slate-200/60 overflow-y-auto transition-transform duration-300 ease-in-out flex flex-col
        `}>
          <div className="sticky top-0 p-3.5 flex items-center justify-between border-b border-slate-100 bg-white/80 backdrop-blur-md z-10">
            <div className="flex items-center gap-2">
              <Settings size={14} className="text-slate-500" />
              <h2 className="text-[11px] font-bold uppercase tracking-widest text-slate-600">Properti Dokumen</h2>
            </div>
            <button 
              type="button"
              onClick={() => setIsPropertiesOpen(false)}
              className="p-1 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
              title="Tutup Panel"
            >
              <X size={16} />
            </button>
          </div>
          
          <div className="p-4 space-y-4">
            
            {/* Input Group: Kategori */}
            <div className="space-y-1">
              <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-widest">Kategori</label>
              <select
                value={formData.kategori}
                onChange={(e) => setFormData({ ...formData, kategori: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200/80 rounded-full px-3.5 py-1.5 outline-none text-slate-900 focus:border-slate-400 focus:ring-4 focus:ring-slate-100 transition-all text-xs font-medium shadow-sm appearance-none cursor-pointer"
              >
                {predefinedCategories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Interactive Tag Chips Manager */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-widest">Tags Artikel</label>
                <span className="text-[10px] text-slate-400 font-mono">
                  {formData.tags ? formData.tags.split(',').filter(Boolean).length : 0} tag
                </span>
              </div>

              {/* Tag Chips List */}
              <div className="flex flex-wrap gap-1.5 min-h-[32px] p-2 bg-slate-50/80 border border-slate-200/80 rounded-xl">
                {(formData.tags ? formData.tags.split(',').map(t => t.trim()).filter(Boolean) : []).map(tag => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white text-slate-800 border border-slate-200 text-xs font-medium shadow-2xs group"
                  >
                    <span>#{tag}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="text-slate-400 hover:text-rose-500 transition-colors cursor-pointer"
                      title={`Hapus tag ${tag}`}
                    >
                      <X size={11} />
                    </button>
                  </span>
                ))}

                {/* Inline Tag Input */}
                <input
                  type="text"
                  placeholder="Ketik &amp; tekan Enter..."
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ',') {
                      e.preventDefault();
                      handleAddTag(tagInput);
                    }
                  }}
                  className="flex-1 min-w-[100px] bg-transparent border-none outline-none text-xs text-slate-800 placeholder-slate-400 font-medium py-0.5 px-1"
                />
              </div>

              {/* Tag Suggestions */}
              <div className="flex flex-wrap items-center gap-1 pt-0.5">
                <span className="text-[10px] text-slate-400 font-medium mr-0.5">Saran:</span>
                {suggestedTags.map(st => {
                  const isAdded = (formData.tags ? formData.tags.split(',').map(t => t.trim()) : []).includes(st);
                  if (isAdded) return null;
                  return (
                    <button
                      key={st}
                      type="button"
                      onClick={() => handleAddTag(st)}
                      className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer"
                    >
                      +{st}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Grid 2 Columns for Penulis & Peran */}
            <div className="grid grid-cols-2 gap-3">
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
            </div>

            {/* Input Group: Image */}
            <div className="space-y-1.5">
              <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-widest">Gambar Sampul</label>
              
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none">
                    <svg className="w-3.5 h-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"/></svg>
                  </div>
                  <input
                    type="text"
                    placeholder="Atau paste URL..."
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200/80 rounded-full pl-7 pr-3 py-1.5 outline-none text-slate-900 focus:border-slate-400 focus:ring-4 focus:ring-slate-100 transition-all text-xs font-medium placeholder-slate-400 shadow-sm"
                  />
                </div>
                
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                  className="flex-shrink-0 flex items-center justify-center w-[30px] h-[30px] rounded-full bg-slate-900 text-white hover:bg-slate-800 transition-colors shadow-sm disabled:opacity-50"
                  title="Unggah dari perangkat"
                >
                  {isUploading ? (
                    <svg className="animate-spin w-3.5 h-3.5" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/></svg>
                  ) : (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                  )}
                </button>
                <input 
                  type="file" 
                  accept="image/*" 
                  className="hidden" 
                  ref={fileInputRef}
                  onChange={handleUploadImage}
                />
              </div>

              {formData.image && (
                <div className="mt-2 w-full rounded-2xl bg-slate-100 border border-slate-200/80 overflow-hidden relative group shadow-sm">
                  <div className="h-32 w-full relative bg-slate-900">
                    <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-2">
                      <button
                        type="button"
                        onClick={() => setIsImageEditorOpen(true)}
                        className="px-3.5 py-2 rounded-full bg-white text-slate-900 text-[11px] font-bold shadow-lg hover:bg-slate-50 transition-all flex items-center gap-1.5 hover:scale-105 active:scale-95"
                      >
                        <Sparkles size={13} className="text-amber-500" />
                        <span>Buka Studio Gambar</span>
                      </button>
                    </div>
                  </div>
                  <div className="px-3 py-2 bg-white flex items-center justify-between border-t border-slate-100 text-[11px]">
                    <span className="text-slate-500 font-medium truncate max-w-[150px]">
                      {formData.image.split('/').pop()}
                    </span>
                    <button
                      type="button"
                      onClick={() => setIsImageEditorOpen(true)}
                      className="text-slate-800 font-bold hover:text-slate-900 hover:underline flex items-center gap-1"
                    >
                      <Crop size={12} />
                      <span>Crop &amp; Edit</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Input Group: Excerpt */}
            <div className="space-y-1">
              <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-widest">Ringkasan</label>
              <textarea
                placeholder="Tulis ringkasan..."
                value={formData.excerpt}
                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200/80 rounded-[16px] px-3 py-2 outline-none text-slate-900 focus:border-slate-400 focus:ring-4 focus:ring-slate-100 transition-all text-xs font-medium placeholder-slate-400 shadow-sm resize-none h-24 leading-relaxed"
              />
            </div>

            {/* SEO & Social Share Preview Button Card */}
            <div className="p-3 bg-gradient-to-br from-slate-50 to-slate-100/70 border border-slate-200/80 rounded-2xl space-y-2 shadow-2xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Globe size={13} className="text-blue-600" />
                  <span className="text-[11px] font-bold text-slate-800">SEO &amp; Medsos</span>
                </div>
                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60">
                  Pratinjau
                </span>
              </div>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Lihat simulasi artikel di Google &amp; kartu tautan WhatsApp sebelum dipublikasikan.
              </p>
              <button
                type="button"
                onClick={() => setIsSeoModalOpen(true)}
                className="w-full py-2 px-3 bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 rounded-xl text-xs font-bold transition-all shadow-2xs flex items-center justify-center gap-1.5 cursor-pointer hover:border-slate-300"
              >
                <Search size={13} className="text-slate-500" />
                <span>Buka Simulator SEO &amp; Share</span>
              </button>
            </div>
            
          </div>
        </aside>
      </div>

      {/* Image Editor Modal Studio */}
      <ImageEditorModal
        isOpen={isImageEditorOpen}
        imageUrl={formData.image}
        onClose={() => setIsImageEditorOpen(false)}
        onSave={(newImageUrl) => setFormData(prev => ({ ...prev, image: newImageUrl }))}
      />

      {/* SEO & Social Share Previewer Modal */}
      <SeoSocialPreviewModal
        isOpen={isSeoModalOpen}
        onClose={() => setIsSeoModalOpen(false)}
        judul={formData.judul}
        excerpt={formData.excerpt}
        image={formData.image}
      />
    </div>
  );
}

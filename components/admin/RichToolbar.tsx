'use client';

import React, { useRef, useState } from 'react';
import { 
  Bold, 
  Italic, 
  Underline,
  Heading2, 
  Heading3, 
  Quote, 
  List, 
  ListOrdered, 
  Minus, 
  Link as LinkIcon, 
  ImagePlus, 
  BookOpen, 
  Code,
  Eye,
  Clock,
  FileText,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify
} from 'lucide-react';

interface RichToolbarProps {
  content: string;
  onContentChange: (newContent: string) => void;
  editorRef?: React.RefObject<HTMLDivElement | null>;
  textareaRef?: React.RefObject<HTMLTextAreaElement | null>;
  isVisualMode?: boolean;
  onToggleVisualMode?: () => void;
  onOpenImageStudioForUpload?: (insertedUrlCallback: (url: string) => void) => void;
}

export function RichToolbar({
  content,
  onContentChange,
  editorRef,
  textareaRef,
  isVisualMode = true,
  onToggleVisualMode,
}: RichToolbarProps) {
  const inlineFileInputRef = useRef<HTMLInputElement>(null);
  const [isUploadingInline, setIsUploadingInline] = useState(false);

  // 1. WYSIWYG Visual Command Execution
  const executeVisualCommand = (command: string, value: string | undefined = undefined) => {
    if (!editorRef?.current) return;
    editorRef.current.focus();
    document.execCommand(command, false, value);
    if (editorRef.current) {
      onContentChange(editorRef.current.innerHTML);
    }
  };

  // Helper to insert formatted HTML into contentEditable
  const insertHtmlSnippet = (html: string) => {
    if (!editorRef?.current) return;
    editorRef.current.focus();
    document.execCommand('insertHTML', false, html);
    if (editorRef.current) {
      onContentChange(editorRef.current.innerHTML);
    }
  };

  // 2. Markdown Fallback Formatting (for Code Mode)
  const applyMarkdownFormatting = (prefix: string, suffix: string = '', defaultPlaceholder: string = '') => {
    const textarea = textareaRef?.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);
    const textToInsert = selectedText || defaultPlaceholder;

    const newContent = 
      content.substring(0, start) + 
      prefix + 
      textToInsert + 
      suffix + 
      content.substring(end);

    onContentChange(newContent);

    setTimeout(() => {
      textarea.focus();
      const newCursorPos = start + prefix.length + textToInsert.length + suffix.length;
      if (selectedText) {
        textarea.setSelectionRange(start + prefix.length, start + prefix.length + selectedText.length);
      } else {
        textarea.setSelectionRange(start + prefix.length, start + prefix.length + defaultPlaceholder.length);
      }
    }, 10);
  };

  // 3. Inline Image Upload Handler
  const handleInlineImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('File harus berupa gambar (JPG, PNG, WebP)');
      return;
    }

    setIsUploadingInline(true);
    const data = new FormData();
    data.append('file', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: data,
      });
      const json = await res.json();

      if (json.success && json.url) {
        if (isVisualMode) {
          const imgSnippet = `<figure class="my-6 block"><img src="${json.url}" alt="${file.name.split('.')[0]}" class="w-full rounded-2xl shadow-md max-h-[480px] object-cover" /><figcaption class="text-center text-xs text-slate-500 italic mt-2">Keterangan foto: ${file.name.split('.')[0]}</figcaption></figure><p><br></p>`;
          insertHtmlSnippet(imgSnippet);
        } else {
          applyMarkdownFormatting(`\n\n![${file.name.split('.')[0]}](${json.url})\n*Keterangan gambar...*\n\n`);
        }
      } else {
        alert('Gagal mengunggah gambar inline: ' + json.message);
      }
    } catch (error) {
      console.error(error);
      alert('Terjadi kesalahan saat mengunggah.');
    } finally {
      setIsUploadingInline(false);
      if (inlineFileInputRef.current) inlineFileInputRef.current.value = '';
    }
  };

  // Clean Telemetry: Calculate plain text words and reading time without HTML tags
  const plainText = content
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  const words = plainText ? plainText.split(' ').filter(Boolean).length : 0;
  const readingTime = Math.max(1, Math.ceil(words / 200));

  return (
    <div className="sticky top-0 z-10 w-full bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-3 sm:px-4 py-2 flex flex-wrap items-center justify-between gap-2 shadow-[0_2px_10px_rgba(0,0,0,0.02)] select-none">
      
      {/* Action Buttons Cluster */}
      <div className="flex items-center flex-wrap gap-1 text-slate-700">
        
        {/* Formatting Group: Bold, Italic, Underline */}
        <div className="flex items-center gap-0.5 bg-slate-100/80 p-0.5 rounded-xl border border-slate-200/60">
          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              if (isVisualMode) executeVisualCommand('bold');
              else applyMarkdownFormatting('**', '**', 'teks tebal');
            }}
            className="p-1.5 rounded-lg hover:bg-white hover:text-slate-900 hover:shadow-2xs transition-all cursor-pointer"
            title="Tebal (Bold) - Ctrl+B"
          >
            <Bold size={15} />
          </button>

          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              if (isVisualMode) executeVisualCommand('italic');
              else applyMarkdownFormatting('*', '*', 'teks miring');
            }}
            className="p-1.5 rounded-lg hover:bg-white hover:text-slate-900 hover:shadow-2xs transition-all cursor-pointer"
            title="Miring (Italic) - Ctrl+I"
          >
            <Italic size={15} />
          </button>

          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              if (isVisualMode) executeVisualCommand('underline');
              else applyMarkdownFormatting('<u>', '</u>', 'teks bergaris bawah');
            }}
            className="p-1.5 rounded-lg hover:bg-white hover:text-slate-900 hover:shadow-2xs transition-all cursor-pointer"
            title="Garis Bawah (Underline) - Ctrl+U"
          >
            <Underline size={15} />
          </button>
        </div>

        {/* Alignment & Justify Group */}
        <div className="flex items-center gap-0.5 bg-slate-100/80 p-0.5 rounded-xl border border-slate-200/60">
          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              if (isVisualMode) executeVisualCommand('justifyLeft');
              else applyMarkdownFormatting('<div align="left">\n', '\n</div>\n', 'Teks rata kiri');
            }}
            className="p-1.5 rounded-lg hover:bg-white hover:text-slate-900 hover:shadow-2xs transition-all cursor-pointer"
            title="Rata Kiri (Align Left)"
          >
            <AlignLeft size={15} />
          </button>

          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              if (isVisualMode) executeVisualCommand('justifyCenter');
              else applyMarkdownFormatting('<div align="center">\n', '\n</div>\n', 'Teks rata tengah');
            }}
            className="p-1.5 rounded-lg hover:bg-white hover:text-slate-900 hover:shadow-2xs transition-all cursor-pointer"
            title="Rata Tengah (Align Center)"
          >
            <AlignCenter size={15} />
          </button>

          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              if (isVisualMode) executeVisualCommand('justifyRight');
              else applyMarkdownFormatting('<div align="right">\n', '\n</div>\n', 'Teks rata kanan');
            }}
            className="p-1.5 rounded-lg hover:bg-white hover:text-slate-900 hover:shadow-2xs transition-all cursor-pointer"
            title="Rata Kanan (Align Right)"
          >
            <AlignRight size={15} />
          </button>

          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              if (isVisualMode) executeVisualCommand('justifyFull');
              else applyMarkdownFormatting('<div align="justify">\n', '\n</div>\n', 'Teks rata kanan-kiri (justify)');
            }}
            className="p-1.5 rounded-lg hover:bg-white hover:text-slate-900 hover:shadow-2xs transition-all cursor-pointer bg-amber-500/10 text-amber-900 font-bold"
            title="Rata Kanan-Kiri (Justify) - Ctrl+J"
          >
            <AlignJustify size={15} />
          </button>
        </div>

        {/* Headings Group */}
        <div className="flex items-center gap-0.5 bg-slate-100/80 p-0.5 rounded-xl border border-slate-200/60">
          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              if (isVisualMode) executeVisualCommand('formatBlock', '<h2>');
              else applyMarkdownFormatting('\n\n## ', '\n', 'Sub-Judul Bahasan');
            }}
            className="p-1.5 rounded-lg hover:bg-white hover:text-slate-900 hover:shadow-2xs transition-all cursor-pointer flex items-center gap-0.5"
            title="Heading 2 (Sub-bab)"
          >
            <Heading2 size={15} />
          </button>

          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              if (isVisualMode) executeVisualCommand('formatBlock', '<h3>');
              else applyMarkdownFormatting('\n\n### ', '\n', 'Poin Bahasan');
            }}
            className="p-1.5 rounded-lg hover:bg-white hover:text-slate-900 hover:shadow-2xs transition-all cursor-pointer flex items-center gap-0.5"
            title="Heading 3 (Poin)"
          >
            <Heading3 size={15} />
          </button>
        </div>

        {/* Islamic Quote & Hikmah Group */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              if (isVisualMode) {
                const quoteHtml = `<blockquote class="my-6 p-5 border-l-4 border-[#C79A45] bg-[#C79A45]/10 rounded-r-2xl italic font-serif text-[#2a201a]">“Tuliskan hadits, ayat, atau kutipan mutiara hikmah di sini...”<br><small class="font-sans font-semibold text-xs text-[#C79A45]">— (Nama Perawi / Tokoh)</small></blockquote><p><br></p>`;
                insertHtmlSnippet(quoteHtml);
              } else {
                applyMarkdownFormatting('\n\n> “', '”\n> — *(Perawi / Tokoh)*\n\n', 'Tuliskan hadits, ayat, atau kutipan mutiara hikmah di sini...');
              }
            }}
            className="px-2.5 py-1.5 rounded-xl hover:bg-amber-50 text-amber-700 bg-amber-50/60 border border-amber-200/80 transition-all flex items-center gap-1 cursor-pointer"
            title="Kutipan Hadits / Mutiara Hikmah"
          >
            <Quote size={14} className="text-[#C79A45]" />
            <span className="text-xs font-bold hidden sm:inline">Kutipan</span>
          </button>

          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              if (isVisualMode) {
                const hikmahHtml = `<div class="my-6 p-5 border-l-4 border-[#6B8E23] bg-[#6B8E23]/10 rounded-r-2xl font-sans text-[#2a201a]"><div class="font-bold text-xs uppercase tracking-wider text-[#6B8E23] mb-1">💡 Mutiara Hikmah</div><div>Adab mendahului ilmu, dan keikhlasan menyempurnakan amal kebaikan.</div></div><p><br></p>`;
                insertHtmlSnippet(hikmahHtml);
              } else {
                applyMarkdownFormatting('\n\n> 💡 **Mutiara Hikmah:**\n> ', '\n\n', 'Adab mendahului ilmu, dan keikhlasan menyempurnakan amal.');
              }
            }}
            className="px-2.5 py-1.5 rounded-xl hover:bg-emerald-50 text-emerald-700 bg-emerald-50/60 border border-emerald-200/80 transition-all flex items-center gap-1 cursor-pointer"
            title="Kotak Hikmah Islami"
          >
            <BookOpen size={14} className="text-[#6B8E23]" />
            <span className="text-xs font-bold hidden sm:inline">Hikmah</span>
          </button>
        </div>

        {/* Lists & Divider */}
        <div className="flex items-center gap-0.5 bg-slate-100/80 p-0.5 rounded-xl border border-slate-200/60">
          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              if (isVisualMode) executeVisualCommand('insertUnorderedList');
              else applyMarkdownFormatting('\n- ', '\n', 'Poin daftar');
            }}
            className="p-1.5 rounded-lg hover:bg-white hover:text-slate-900 hover:shadow-2xs transition-all cursor-pointer"
            title="Daftar Berpoin"
          >
            <List size={15} />
          </button>

          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              if (isVisualMode) executeVisualCommand('insertOrderedList');
              else applyMarkdownFormatting('\n1. ', '\n', 'Poin nomor');
            }}
            className="p-1.5 rounded-lg hover:bg-white hover:text-slate-900 hover:shadow-2xs transition-all cursor-pointer"
            title="Daftar Bernomor"
          >
            <ListOrdered size={15} />
          </button>

          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              if (isVisualMode) executeVisualCommand('insertHorizontalRule');
              else applyMarkdownFormatting('\n\n---\n\n', '', '');
            }}
            className="p-1.5 rounded-lg hover:bg-white hover:text-slate-900 hover:shadow-2xs transition-all cursor-pointer"
            title="Garis Pembatas (Divider)"
          >
            <Minus size={15} />
          </button>
        </div>

        {/* Sisipkan Foto Inline */}
        <button
          type="button"
          disabled={isUploadingInline}
          onClick={() => inlineFileInputRef.current?.click()}
          className="px-2.5 py-1.5 rounded-xl bg-slate-900 text-white hover:bg-slate-800 transition-all flex items-center gap-1.5 text-xs font-bold shadow-2xs cursor-pointer disabled:opacity-50"
          title="Unggah dan sisipkan foto ke artikel"
        >
          {isUploadingInline ? (
            <>
              <svg className="animate-spin h-3.5 w-3.5 text-amber-400" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/></svg>
              <span>Mengunggah...</span>
            </>
          ) : (
            <>
              <ImagePlus size={14} className="text-amber-400" />
              <span>Sisipkan Foto</span>
            </>
          )}
        </button>

        <input 
          type="file" 
          accept="image/*" 
          ref={inlineFileInputRef} 
          onChange={handleInlineImageUpload}
          className="hidden" 
        />
      </div>

      {/* Right Side: Mode Switcher & Telemetry */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Visual vs Code Mode Toggle */}
        {onToggleVisualMode && (
          <button
            type="button"
            onClick={onToggleVisualMode}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border transition-all cursor-pointer ${
              isVisualMode 
                ? 'bg-slate-100 text-slate-800 border-slate-300 hover:bg-slate-200' 
                : 'bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100'
            }`}
            title={isVisualMode ? 'Beralih ke Mode Kode Sumber' : 'Beralih ke Mode Visual WYSIWYG'}
          >
            {isVisualMode ? <Eye size={13} className="text-emerald-600" /> : <Code size={13} className="text-indigo-600" />}
            <span>{isVisualMode ? 'Mode Visual' : 'Mode Kode'}</span>
          </button>
        )}

        {/* Productivity Telemetry */}
        <div className="hidden md:flex items-center gap-2.5 text-[11px] font-mono text-slate-500 bg-slate-50 border border-slate-200/60 px-3 py-1 rounded-full">
          <span className="flex items-center gap-1 text-slate-700 font-semibold">
            <FileText size={12} className="text-slate-400" />
            <span>{words}</span>
            <span className="font-normal text-slate-400">kata</span>
          </span>

          <span className="w-1 h-1 rounded-full bg-slate-300" />

          <span className="flex items-center gap-1 text-emerald-700 font-semibold">
            <Clock size={12} className="text-emerald-500" />
            <span>{readingTime} menit</span>
          </span>
        </div>
      </div>

    </div>
  );
}

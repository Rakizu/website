'use client';

import React, { useState } from 'react';
import { 
  Search, 
  Share2, 
  X, 
  Smartphone, 
  Monitor, 
  CheckCircle2, 
  AlertTriangle, 
  MessageCircle
} from 'lucide-react';

interface SeoSocialPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  judul: string;
  excerpt: string;
  image: string;
}

export function SeoSocialPreviewModal({
  isOpen,
  onClose,
  judul,
  excerpt,
  image,
}: SeoSocialPreviewModalProps) {
  const [activeTab, setActiveTab] = useState<'google' | 'social'>('google');
  const [deviceView, setDeviceView] = useState<'desktop' | 'mobile'>('mobile');

  if (!isOpen) return null;

  // Clean data fallbacks
  const displayTitle = judul.trim() || 'Judul Artikel Belum Diisi';
  const displayExcerpt = excerpt.trim() || 'Tambahkan ringkasan artikel pada panel Properti agar muncul sebagai deskripsi yang menarik di Google dan media sosial...';
  const slug = judul
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .slice(0, 40) || 'baca-artikel';

  const fullUrl = `https://sekolahthoriquljannah.sch.id/artikel/${slug}`;

  // SEO Health Calculations
  const titleLen = displayTitle.length;
  const isTitleGood = titleLen >= 30 && titleLen <= 65;
  const isTitleTooLong = titleLen > 65;

  const descLen = displayExcerpt.length;
  const isDescGood = descLen >= 100 && descLen <= 165;
  const isDescTooShort = descLen < 100;
  const isDescTooLong = descLen > 165;

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200/80 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/70">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-slate-900 text-white flex items-center justify-center shadow-sm">
              <Search size={16} />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">SEO &amp; Pratinjau Berbagi Sosial</h2>
              <p className="text-[11px] text-slate-500 font-medium">Simulasi nyata saat artikel ditemukan di Google &amp; dibagikan ke WhatsApp</p>
            </div>
          </div>
          
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors cursor-pointer"
            title="Tutup Modal"
          >
            <X size={18} />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex items-center justify-between px-6 pt-3 pb-2 border-b border-slate-100 bg-white">
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl border border-slate-200/70">
            <button
              onClick={() => setActiveTab('google')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'google'
                  ? 'bg-white text-slate-900 shadow-sm border border-slate-200/60'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <Search size={13} className="text-blue-600" />
              <span>Google SERP</span>
            </button>
            <button
              onClick={() => setActiveTab('social')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'social'
                  ? 'bg-white text-slate-900 shadow-sm border border-slate-200/60'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <Share2 size={13} className="text-emerald-600" />
              <span>WhatsApp &amp; Medsos</span>
            </button>
          </div>

          {activeTab === 'google' && (
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200/70">
              <button
                onClick={() => setDeviceView('mobile')}
                className={`p-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                  deviceView === 'mobile' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-700'
                }`}
                title="Tampilan Mobile"
              >
                <Smartphone size={14} />
              </button>
              <button
                onClick={() => setDeviceView('desktop')}
                className={`p-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                  deviceView === 'desktop' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-700'
                }`}
                title="Tampilan Desktop"
              >
                <Monitor size={14} />
              </button>
            </div>
          )}
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/50">
          
          {/* TAB 1: GOOGLE SERP PREVIEW */}
          {activeTab === 'google' && (
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Simulasi Tampilan di Google ({deviceView === 'mobile' ? 'Ponsel' : 'Desktop'})
                </span>
                <span className="text-[11px] font-mono text-slate-400">google.co.id</span>
              </div>

              {/* Google Result Box */}
              <div className={`p-4 bg-white border border-slate-200 rounded-xl shadow-sm font-sans ${
                deviceView === 'mobile' ? 'max-w-md mx-auto' : 'w-full'
              }`}>
                {/* Google Snippet Header */}
                <div className="flex items-center gap-2 mb-1.5">
                  <div className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px] font-bold">
                    TJ
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs text-slate-800 font-medium leading-none">Sekolah Thoriqul Jannah</span>
                    <span className="text-[11px] text-slate-500 leading-tight truncate max-w-[280px]">
                      {fullUrl}
                    </span>
                  </div>
                </div>

                {/* Google Blue Link Title */}
                <h3 className="text-base sm:text-lg font-medium text-[#1a0dab] hover:underline cursor-pointer leading-snug mb-1">
                  {displayTitle} | Thoriqul Jannah
                </h3>

                {/* Google Description Snippet */}
                <p className="text-xs sm:text-sm text-[#4d5156] leading-relaxed line-clamp-2">
                  {displayExcerpt}
                </p>
              </div>

              {/* SEO Health Metrics */}
              <div className="bg-white border border-slate-200/80 rounded-xl p-4 space-y-3 shadow-xs">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600">Evaluasi Kualitas SEO</h4>
                
                {/* Title Length Meter */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-700 flex items-center gap-1.5">
                      {isTitleGood ? (
                        <CheckCircle2 size={13} className="text-emerald-500" />
                      ) : (
                        <AlertTriangle size={13} className="text-amber-500" />
                      )}
                      Panjang Judul Artikel
                    </span>
                    <span className={`font-mono font-bold ${isTitleGood ? 'text-emerald-600' : 'text-amber-600'}`}>
                      {titleLen} / 65 karakter
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                    <div 
                      className={`h-full transition-all ${
                        isTitleGood ? 'bg-emerald-500' : isTitleTooLong ? 'bg-rose-500' : 'bg-amber-400'
                      }`}
                      style={{ width: `${Math.min(100, (titleLen / 65) * 100)}%` }}
                    />
                  </div>
                  <p className="text-[10px] text-slate-400">
                    {isTitleGood ? 'Panjang judul sangat pas untuk tidak terpotong di Google.' : isTitleTooLong ? 'Judul terlalu panjang, mungkin terpotong (...) di hasil pencarian.' : 'Judul agak pendek, manfaatkan kata kunci sekolah agar lebih informatif.'}
                  </p>
                </div>

                {/* Excerpt Length Meter */}
                <div className="space-y-1 pt-2 border-t border-slate-100">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-700 flex items-center gap-1.5">
                      {isDescGood ? (
                        <CheckCircle2 size={13} className="text-emerald-500" />
                      ) : (
                        <AlertTriangle size={13} className="text-amber-500" />
                      )}
                      Panjang Ringkasan (Meta Description)
                    </span>
                    <span className={`font-mono font-bold ${isDescGood ? 'text-emerald-600' : 'text-amber-600'}`}>
                      {descLen} / 160 karakter
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                    <div 
                      className={`h-full transition-all ${
                        isDescGood ? 'bg-emerald-500' : isDescTooLong ? 'bg-rose-500' : 'bg-amber-400'
                      }`}
                      style={{ width: `${Math.min(100, (descLen / 160) * 100)}%` }}
                    />
                  </div>
                  <p className="text-[10px] text-slate-400">
                    {isDescGood ? 'Ringkasan memiliki panjang ideal untuk menarik minat klik pengunjung.' : isDescTooShort ? 'Ringkasan terlalu singkat. Tambahkan sedikit penjelasan di panel Properti.' : 'Ringkasan melebihi 160 karakter dan akan terpotong oleh Google.'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: WHATSAPP & SOCIAL SHARE PREVIEW */}
          {activeTab === 'social' && (
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Simulasi Kartu Bagikan WhatsApp &amp; Medsos
                </span>
                <span className="text-[11px] font-mono text-emerald-600 font-semibold flex items-center gap-1">
                  <MessageCircle size={13} />
                  WhatsApp Open Graph
                </span>
              </div>

              {/* WhatsApp Chat Simulation Container */}
              <div className="p-4 sm:p-6 bg-[#efeae2] rounded-2xl border border-slate-200/80 shadow-inner flex justify-center">
                
                {/* Chat Bubble */}
                <div className="max-w-sm w-full bg-white rounded-2xl p-2 shadow-sm border border-slate-200/60 overflow-hidden font-sans">
                  
                  {/* Share Card Thumbnail */}
                  {image ? (
                    <div className="w-full h-44 rounded-xl overflow-hidden bg-slate-900 relative">
                      <img src={image} alt="Cover Preview" className="w-full h-full object-cover" />
                    </div>
                  ) : (
                    <div className="w-full h-36 rounded-xl bg-slate-100 border border-dashed border-slate-300 flex flex-col items-center justify-center text-slate-400 text-xs">
                      <span>Belum ada gambar sampul</span>
                      <span className="text-[10px] text-slate-400 mt-1">Unggah sampul di panel Properti</span>
                    </div>
                  )}

                  {/* Share Card Content */}
                  <div className="p-2.5 space-y-1">
                    <span className="text-[10px] font-mono uppercase font-semibold text-slate-400 tracking-wider">
                      SEKOLAHTHORIQULJANNAH.SCH.ID
                    </span>
                    <h4 className="text-sm font-bold text-slate-900 line-clamp-2 leading-snug">
                      {displayTitle}
                    </h4>
                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {displayExcerpt}
                    </p>
                  </div>

                  {/* Chat Metadata */}
                  <div className="px-2 pt-1 pb-1 flex justify-end items-center gap-1 text-[10px] text-slate-400">
                    <span>14:30</span>
                    <span className="text-blue-500 font-bold">✓✓</span>
                  </div>
                </div>

              </div>

              {/* Sharing Advice Box */}
              <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-xl p-4 text-xs text-emerald-900 space-y-1.5">
                <div className="flex items-center gap-2 font-bold text-emerald-800">
                  <CheckCircle2 size={14} className="text-emerald-600" />
                  <span>Tips Agar Tautan Ramai Diklik Wali Murid:</span>
                </div>
                <ul className="list-disc list-inside space-y-1 text-emerald-800/90 text-[11px] pl-1">
                  <li>Gunakan gambar sampul horizontal (rasio 16:9) yang sudah dipotong di Studio Gambar.</li>
                  <li>Tulis ringkasan yang memicu rasa ingin tahu tentang prestasi atau kegiatan islami santri.</li>
                </ul>
              </div>

            </div>
          )}

        </div>

        {/* Footer */}
        <div className="flex items-center justify-end px-6 py-3.5 border-t border-slate-100 bg-white">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-full transition-all shadow-sm cursor-pointer"
          >
            Tutup Pratinjau
          </button>
        </div>

      </div>
    </div>
  );
}

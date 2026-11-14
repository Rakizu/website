'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  X, 
  RotateCw, 
  FlipHorizontal, 
  Crop, 
  Sliders, 
  Sparkles, 
  Check, 
  Undo,
  ZoomIn,
  ZoomOut,
  Maximize2
} from 'lucide-react';

interface ImageEditorModalProps {
  isOpen: boolean;
  imageUrl: string;
  onClose: () => void;
  onSave: (newImageUrl: string) => void;
}

type AspectRatio = 'free' | '16:9' | '4:3' | '1:1' | '3:2';
type FilterPreset = 'normal' | 'warm' | 'gold' | 'bw' | 'vivid';

export function ImageEditorModal({ isOpen, imageUrl, onClose, onSave }: ImageEditorModalProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [activeTab, setActiveTab] = useState<'adjust' | 'filter' | 'crop'>('crop');
  
  // Transformation states
  const [rotation, setRotation] = useState(0);
  const [isFlippedH, setIsFlippedH] = useState(false);
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('16:9');
  
  // Adjustment states
  const [brightness, setBrightness] = useState(0); // -50 to 50
  const [contrast, setContrast] = useState(0);     // -50 to 50
  const [saturation, setSaturation] = useState(100); // 0 to 200
  const [sepia, setSepia] = useState(0);           // 0 to 100

  // Active filter
  const [activeFilter, setActiveFilter] = useState<FilterPreset>('normal');

  // Processing state
  const [isProcessing, setIsProcessing] = useState(false);
  const [sourceImage, setSourceImage] = useState<HTMLImageElement | null>(null);

  // Load source image when URL changes or modal opens
  useEffect(() => {
    if (!isOpen || !imageUrl) return;

    const img = new window.Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      setSourceImage(img);
      resetAllAdjustments();
    };
    img.src = imageUrl;
  }, [isOpen, imageUrl]);

  const resetAllAdjustments = () => {
    setRotation(0);
    setIsFlippedH(false);
    setBrightness(0);
    setContrast(0);
    setSaturation(100);
    setSepia(0);
    setActiveFilter('normal');
  };

  // Preset Filters
  const applyPreset = (preset: FilterPreset) => {
    setActiveFilter(preset);
    switch (preset) {
      case 'normal':
        setBrightness(0);
        setContrast(0);
        setSaturation(100);
        setSepia(0);
        break;
      case 'warm':
        setBrightness(4);
        setContrast(8);
        setSaturation(105);
        setSepia(22);
        break;
      case 'gold':
        setBrightness(6);
        setContrast(14);
        setSaturation(118);
        setSepia(35);
        break;
      case 'bw':
        setBrightness(0);
        setContrast(22);
        setSaturation(0);
        setSepia(0);
        break;
      case 'vivid':
        setBrightness(4);
        setContrast(24);
        setSaturation(145);
        setSepia(0);
        break;
    }
  };

  // Render Canvas with all modifications
  const renderCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !sourceImage) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const origW = sourceImage.naturalWidth;
    const origH = sourceImage.naturalHeight;

    // Calculate crop box based on aspect ratio
    let cropW = origW;
    let cropH = origH;
    let cropX = 0;
    let cropY = 0;

    if (aspectRatio !== 'free') {
      let targetRatio = 1;
      if (aspectRatio === '16:9') targetRatio = 16 / 9;
      if (aspectRatio === '4:3') targetRatio = 4 / 3;
      if (aspectRatio === '1:1') targetRatio = 1;
      if (aspectRatio === '3:2') targetRatio = 3 / 2;

      const currentRatio = origW / origH;
      if (currentRatio > targetRatio) {
        // Image is wider than target ratio
        cropW = Math.round(origH * targetRatio);
        cropH = origH;
        cropX = Math.round((origW - cropW) / 2);
      } else {
        // Image is taller than target ratio
        cropW = origW;
        cropH = Math.round(origW / targetRatio);
        cropY = Math.round((origH - cropH) / 2);
      }
    }

    // Determine canvas dimensions based on rotation (90, 180, 270)
    const isSideways = rotation % 180 !== 0;
    const finalW = isSideways ? cropH : cropW;
    const finalH = isSideways ? cropW : cropH;

    canvas.width = finalW;
    canvas.height = finalH;

    ctx.save();

    // 1. Move origin to center for rotation & flip
    ctx.translate(finalW / 2, finalH / 2);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.scale(isFlippedH ? -1 : 1, 1);

    // 2. Apply CSS filters directly to canvas context
    const bVal = 100 + brightness;
    const cVal = 100 + contrast;
    const sVal = saturation;
    const sepiaVal = sepia;
    ctx.filter = `brightness(${bVal}%) contrast(${cVal}%) saturate(${sVal}%) sepia(${sepiaVal}%)`;

    // 3. Draw cropped portion centered
    ctx.drawImage(
      sourceImage,
      cropX,
      cropY,
      cropW,
      cropH,
      -cropW / 2,
      -cropH / 2,
      cropW,
      cropH
    );

    ctx.restore();
  }, [sourceImage, aspectRatio, rotation, isFlippedH, brightness, contrast, saturation, sepia]);

  // Re-render canvas whenever any setting changes
  useEffect(() => {
    if (sourceImage) {
      renderCanvas();
    }
  }, [sourceImage, renderCanvas]);

  // Handle Save & Upload to Server
  const handleSaveAndUpload = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    setIsProcessing(true);

    canvas.toBlob(async (blob) => {
      if (!blob) {
        alert('Gagal memproses gambar dari kanvas');
        setIsProcessing(false);
        return;
      }

      try {
        const file = new File([blob], `edited-${Date.now()}.jpg`, { type: 'image/jpeg' });
        const formData = new FormData();
        formData.append('file', file);

        const res = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        const json = await res.json();
        if (json.success && json.url) {
          onSave(json.url);
          onClose();
        } else {
          alert('Gagal mengunggah gambar yang telah diedit: ' + json.message);
        }
      } catch (err) {
        console.error(err);
        alert('Terjadi kesalahan jaringan saat menyimpan gambar.');
      } finally {
        setIsProcessing(false);
      }
    }, 'image/jpeg', 0.92);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[5000] flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-200">
      
      {/* Studio Modal Window */}
      <div className="relative w-full max-w-5xl h-[85vh] max-h-[820px] bg-white rounded-3xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden">
        
        {/* Modal Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-white z-10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-slate-900 text-white flex items-center justify-center shadow-sm">
              <Sparkles size={16} />
            </div>
            <div>
              <h3 className="font-sans font-bold text-sm text-slate-900 leading-tight">Studio Editor Gambar</h3>
              <p className="text-[11px] text-slate-500 font-medium">Crop presisi, filter sinematik, dan optimasi instan</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={resetAllAdjustments}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              title="Reset ke Asli"
            >
              <Undo size={13} />
              <span>Reset</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Studio Workspace (Center Canvas + Right Control Panel) */}
        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden bg-slate-50">
          
          {/* Main Canvas Display Area */}
          <div className="flex-1 flex items-center justify-center p-6 overflow-hidden relative">
            <div className="relative max-w-full max-h-full flex items-center justify-center rounded-2xl shadow-[0_12px_40px_rgba(0,0,0,0.08)] bg-black/5 overflow-hidden border border-slate-200/80">
              <canvas 
                ref={canvasRef} 
                className="max-w-full max-h-[50vh] lg:max-h-[60vh] object-contain block"
              />
            </div>

            {/* Canvas Quick Tools (Rotate & Flip) */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2 px-3 py-1.5 bg-white/90 backdrop-blur-md rounded-full border border-slate-200/80 shadow-lg text-xs font-semibold text-slate-700">
              <button
                type="button"
                onClick={() => setRotation((prev) => (prev + 90) % 360)}
                className="p-2 hover:bg-slate-100 rounded-full transition-colors flex items-center gap-1.5"
                title="Putar 90 Derajat"
              >
                <RotateCw size={14} />
                <span className="text-[11px]">Putar</span>
              </button>

              <div className="w-px h-3.5 bg-slate-200" />

              <button
                type="button"
                onClick={() => setIsFlippedH((prev) => !prev)}
                className="p-2 hover:bg-slate-100 rounded-full transition-colors flex items-center gap-1.5"
                title="Flip Horizontal"
              >
                <FlipHorizontal size={14} />
                <span className="text-[11px]">Cermin</span>
              </button>
            </div>
          </div>

          {/* Right Control Sidebar */}
          <div className="w-full lg:w-80 bg-white border-t lg:border-t-0 lg:border-l border-slate-200 flex flex-col">
            
            {/* Tool Category Tabs */}
            <div className="flex border-b border-slate-100 p-1.5 gap-1 bg-slate-50/70">
              <button
                type="button"
                onClick={() => setActiveTab('crop')}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'crop' 
                    ? 'bg-white text-slate-900 shadow-sm' 
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <Crop size={14} />
                <span>Rasio Potong</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('filter')}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'filter' 
                    ? 'bg-white text-slate-900 shadow-sm' 
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <Sparkles size={14} />
                <span>Preset Filter</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('adjust')}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'adjust' 
                    ? 'bg-white text-slate-900 shadow-sm' 
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <Sliders size={14} />
                <span>Cahaya</span>
              </button>
            </div>

            {/* Tab Contents */}
            <div className="flex-1 p-5 overflow-y-auto space-y-5">
              
              {/* TAB 1: CROP & ASPECT RATIOS */}
              {activeTab === 'crop' && (
                <div className="space-y-4">
                  <div>
                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-2">
                      Pilih Rasio Aspek
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { id: '16:9', label: '16:9', desc: 'Widescreen Berita' },
                        { id: '4:3', label: '4:3', desc: 'Editorial Standar' },
                        { id: '1:1', label: '1:1', desc: 'Persegi / Avatar' },
                        { id: '3:2', label: '3:2', desc: 'Fotografi' },
                        { id: 'free', label: 'Asli', desc: 'Tanpa Potongan' },
                      ].map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setAspectRatio(item.id as AspectRatio)}
                          className={`p-3 rounded-2xl border text-left transition-all ${
                            aspectRatio === item.id
                              ? 'border-slate-900 bg-slate-900 text-white shadow-sm'
                              : 'border-slate-200 bg-white hover:border-slate-300 text-slate-800'
                          }`}
                        >
                          <p className="font-bold text-xs">{item.label}</p>
                          <p className={`text-[10px] mt-0.5 ${aspectRatio === item.id ? 'text-slate-300' : 'text-slate-400'}`}>
                            {item.desc}
                          </p>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="p-3.5 bg-amber-50 border border-amber-200/70 rounded-2xl">
                    <p className="text-[11px] text-amber-800 leading-relaxed font-medium">
                      💡 <strong>Tips:</strong> Rasio <strong>16:9</strong> sangat direkomendasikan untuk gambar sampul berita agar proporsional di semua layar laptop &amp; smartphone.
                    </p>
                  </div>
                </div>
              )}

              {/* TAB 2: PRESET FILTERS */}
              {activeTab === 'filter' && (
                <div className="space-y-3">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-2">
                    Grading Warna Sekolah
                  </label>
                  {[
                    { id: 'normal', name: 'Original Clean', desc: 'Tanpa efek tambahan' },
                    { id: 'warm', name: 'Warm Editorial', desc: 'Kesan hangat ala majalah cetak' },
                    { id: 'gold', name: 'Islamic Gold', desc: 'Nuansa keemasan khas Thoriqul Jannah' },
                    { id: 'bw', name: 'Classic Monochrome', desc: 'Hitam putih berbobot seni' },
                    { id: 'vivid', name: 'Vivid Clarity', desc: 'Warna cerah dan kontras tajam' },
                  ].map((filter) => (
                    <button
                      key={filter.id}
                      type="button"
                      onClick={() => applyPreset(filter.id as FilterPreset)}
                      className={`w-full p-3 rounded-2xl border text-left flex items-center justify-between transition-all ${
                        activeFilter === filter.id
                          ? 'border-[#C79A45] bg-[#C79A45]/10 text-slate-900 shadow-sm'
                          : 'border-slate-200 bg-white hover:border-slate-300 text-slate-700'
                      }`}
                    >
                      <div>
                        <p className="font-bold text-xs text-slate-900">{filter.name}</p>
                        <p className="text-[10px] text-slate-500 mt-0.5">{filter.desc}</p>
                      </div>
                      {activeFilter === filter.id && (
                        <div className="w-5 h-5 rounded-full bg-[#C79A45] text-white flex items-center justify-center">
                          <Check size={12} strokeWidth={3} />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              )}

              {/* TAB 3: ADJUSTMENTS (SLIDERS) */}
              {activeTab === 'adjust' && (
                <div className="space-y-4">
                  {/* Brightness */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs font-semibold text-slate-700">
                      <span>Kecerahan (Brightness)</span>
                      <span className="font-mono text-slate-400">{brightness > 0 ? `+${brightness}` : brightness}</span>
                    </div>
                    <input
                      type="range"
                      min="-50"
                      max="50"
                      value={brightness}
                      onChange={(e) => setBrightness(Number(e.target.value))}
                      className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-slate-900"
                    />
                  </div>

                  {/* Contrast */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs font-semibold text-slate-700">
                      <span>Kontras (Contrast)</span>
                      <span className="font-mono text-slate-400">{contrast > 0 ? `+${contrast}` : contrast}</span>
                    </div>
                    <input
                      type="range"
                      min="-50"
                      max="50"
                      value={contrast}
                      onChange={(e) => setContrast(Number(e.target.value))}
                      className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-slate-900"
                    />
                  </div>

                  {/* Saturation */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs font-semibold text-slate-700">
                      <span>Saturasi Warna</span>
                      <span className="font-mono text-slate-400">{saturation}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="200"
                      value={saturation}
                      onChange={(e) => setSaturation(Number(e.target.value))}
                      className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-slate-900"
                    />
                  </div>

                  {/* Sepia */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs font-semibold text-slate-700">
                      <span>Efek Hangat (Warmth/Sepia)</span>
                      <span className="font-mono text-slate-400">{sepia}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={sepia}
                      onChange={(e) => setSepia(Number(e.target.value))}
                      className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-slate-900"
                    />
                  </div>
                </div>
              )}

            </div>

            {/* Sidebar Footer Action */}
            <div className="p-4 border-t border-slate-200 bg-white">
              <button
                type="button"
                onClick={handleSaveAndUpload}
                disabled={isProcessing}
                className="w-full py-3 rounded-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs tracking-wider uppercase flex items-center justify-center gap-2 transition-all shadow-md active:scale-98 disabled:opacity-50"
              >
                {isProcessing ? (
                  <>
                    <svg className="animate-spin h-3.5 w-3.5 text-white" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/></svg>
                    <span>Memproses &amp; Mengunggah...</span>
                  </>
                ) : (
                  <>
                    <Check size={14} />
                    <span>Terapkan &amp; Simpan Gambar</span>
                  </>
                )}
              </button>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

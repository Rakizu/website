'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();

      if (data.success) {
        router.push('/admin/artikel');
        router.refresh();
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Terjadi kesalahan jaringan.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-[#FAFAFA] flex items-center justify-center overflow-hidden z-[3000]">
      {/* Hide global footer/header if leaked */}
      <style>{`
        footer, nav.fixed { display: none !important; }
      `}</style>
      
      {/* Subtle Mesh / Noise Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(0,0,0,0.03),transparent_50%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(0,0,0,0.02),transparent_50%)] pointer-events-none" />

      {/* Premium Enterprise Login Card (macOS / Linear style) */}
      <div className="relative z-20 w-full max-w-[380px] p-8 rounded-3xl bg-white border border-slate-200/60 shadow-[0_8px_40px_rgba(0,0,0,0.04),0_1px_3px_rgba(0,0,0,0.02)]">
        <div className="flex flex-col mb-8">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-slate-900 to-slate-800 flex items-center justify-center mb-5 shadow-[0_2px_8px_rgba(0,0,0,0.15)] ring-1 ring-slate-900/10">
            <span className="font-heading font-bold text-sm text-white tracking-widest">TJ</span>
          </div>
          <h1 className="font-sans font-bold text-xl tracking-tight text-slate-900 mb-1.5">Sign in to Studio</h1>
          <p className="text-xs text-slate-500 font-medium">
            Enter your credentials to access the workspace
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div className="space-y-2">
            <label className="text-[11px] font-semibold text-slate-600 uppercase tracking-widest">Username</label>
            <input
              type="text"
              placeholder="admin / writer"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200/80 rounded-full px-5 py-3 outline-none text-slate-900 focus:border-slate-400 focus:ring-4 focus:ring-slate-100 transition-all text-sm font-medium placeholder-slate-400 shadow-sm"
              required
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-[11px] font-semibold text-slate-600 uppercase tracking-widest">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200/80 rounded-full px-5 py-3 outline-none text-slate-900 focus:border-slate-400 focus:ring-4 focus:ring-slate-100 transition-all text-sm tracking-widest font-medium placeholder-slate-400 shadow-sm"
              required
            />
          </div>

          {error && (
            <div className="p-3 rounded-xl border border-red-200 bg-red-50 text-red-600 text-xs text-center font-medium shadow-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="relative w-full py-3 mt-2 rounded-full bg-slate-900 text-white font-bold tracking-wide text-sm hover:bg-slate-800 transition-all disabled:opacity-50 shadow-[0_4px_12px_rgba(0,0,0,0.1)] active:scale-[0.98] group overflow-hidden border border-slate-900/50"
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              {isLoading ? (
                <>
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/></svg>
                  Signing in...
                </>
              ) : 'Continue to Dashboard'}
            </span>
            <div className="absolute top-0 -left-[150%] w-full h-full skew-x-[-25deg] transition-all duration-700 ease-in-out group-hover:left-[150%] bg-[linear-gradient(to_right,transparent,rgba(255,255,255,0.15),transparent)]" />
          </button>
        </form>
        
        <div className="mt-8 pt-6">
          <p className="text-[10px] text-slate-400 font-medium tracking-wide">
            Protected by internal access policy.
          </p>
        </div>
      </div>
    </div>
  );
}

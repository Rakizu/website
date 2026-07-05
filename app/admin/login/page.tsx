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
    <div className="relative min-h-screen w-full bg-[#F8F8FF] text-slate-800 flex items-center justify-center overflow-hidden z-[3000]">
      {/* Hide global footer/header if leaked */}
      <style>{`
        footer, nav.fixed { display: none !important; }
      `}</style>

      {/* Enterprise Login Card */}
      <div className="relative z-20 w-full max-w-[400px] p-8 md:p-10 rounded-2xl bg-white border border-slate-200 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
        <div className="flex flex-col items-center mb-8">
          <div className="w-10 h-10 rounded-lg bg-slate-900 flex items-center justify-center mb-4 shadow-sm">
            <span className="font-heading font-bold text-sm text-white tracking-widest">TJ</span>
          </div>
          <h1 className="font-heading font-semibold text-2xl tracking-tight text-slate-900 mb-1">Sign in to Workspace</h1>
          <p className="text-xs text-slate-500 font-medium">
            Enter your credentials to continue
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold text-slate-700 ml-1">Username</label>
            <input
              type="text"
              placeholder="admin / writer"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-lg px-4 py-2.5 outline-none text-slate-900 focus:border-slate-900 focus:ring-1 focus:ring-slate-900 transition-shadow text-sm font-medium placeholder-slate-400"
              required
            />
          </div>
          
          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold text-slate-700 ml-1">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-lg px-4 py-2.5 outline-none text-slate-900 focus:border-slate-900 focus:ring-1 focus:ring-slate-900 transition-shadow text-sm tracking-widest font-medium placeholder-slate-400"
              required
            />
          </div>

          {error && (
            <div className="p-3 rounded border border-red-200 bg-red-50 text-red-600 text-xs text-center font-medium">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 mt-2 rounded-lg bg-slate-900 text-white font-semibold text-sm hover:bg-slate-800 transition-colors disabled:opacity-50 shadow-sm"
          >
            {isLoading ? 'Signing in...' : 'Continue'}
          </button>
        </form>
        
        <div className="mt-8 text-center border-t border-slate-100 pt-6">
          <p className="text-[10px] text-slate-400 font-medium tracking-wide">
            Internal Access Only.
          </p>
        </div>
      </div>
    </div>
  );
}

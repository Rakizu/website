'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { IslamicPattern } from '@/components/ui/IslamicPattern';

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

  const glassBtnClass = "relative overflow-hidden group transition-all duration-500 hover:scale-105 hover:shadow-[0_0_25px_rgba(53,71,17,0.8)] border-0 bg-[#354711]/90 backdrop-blur-md backdrop-saturate-150 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.2),inset_1px_2px_0_-1px_rgba(255,255,255,0.4),inset_-1px_-1px_0_-1px_rgba(0,0,0,0.3),0_4px_15px_rgba(53,71,17,0.6)] text-white drop-shadow-md";

  return (
    <div className="relative min-h-screen w-full bg-ink text-cream flex items-center justify-center overflow-hidden z-[3000]">
      {/* Hide global footer/header if leaked */}
      <style>{`
        footer, nav.fixed { display: none !important; }
      `}</style>
      
      <IslamicPattern color="#c79a45" opacity={0.03} />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_20%,rgba(0,0,0,0.8)_100%)] pointer-events-none" />

      {/* Cinematic Ultra-Glassmorphism Login Card */}
      <div className="relative z-20 w-full max-w-[420px] p-10 rounded-[2rem] border border-white/5 bg-[#1A1A2E]/40 backdrop-blur-2xl backdrop-saturate-200 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08),0_20px_60px_rgba(0,0,0,0.6)]">
        <div className="flex flex-col items-center mb-10">
          <div className="w-12 h-12 rounded-xl bg-sage flex items-center justify-center mb-5 shadow-[0_0_20px_rgba(107,142,35,0.4)]">
            <span className="font-heading font-bold text-lg text-cream tracking-widest">TJ</span>
          </div>
          <h1 className="font-heading font-semibold text-2xl tracking-tight text-cream mb-2">Workspace</h1>
          <p className="text-xs text-cream/50 font-medium tracking-wide uppercase">
            Restricted Access
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-widest font-bold text-cream/70 ml-1">Username</label>
            <input
              type="text"
              placeholder="admin / writer"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none text-cream focus:border-accent-gold focus:ring-1 focus:ring-accent-gold/50 transition-all text-sm font-medium placeholder-cream/20 backdrop-blur-md"
              required
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-widest font-bold text-cream/70 ml-1">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none text-cream focus:border-accent-gold focus:ring-1 focus:ring-accent-gold/50 transition-all text-sm tracking-widest font-medium placeholder-cream/20 backdrop-blur-md"
              required
            />
          </div>

          {error && (
            <div className="p-3 rounded-xl border border-red-500/30 bg-red-500/10 text-red-200 text-xs text-center font-medium backdrop-blur-md">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-4 mt-4 rounded-full font-heading uppercase tracking-widest text-xs font-bold disabled:opacity-50 ${glassBtnClass}`}
          >
            <span className="relative z-10">{isLoading ? 'AUTHENTICATING...' : 'SECURE LOGIN'}</span>
            <div className="absolute top-0 -left-[150%] w-full h-full skew-x-[-25deg] transition-all duration-700 ease-in-out group-hover:left-[150%] bg-[linear-gradient(to_right,transparent,rgba(255,255,255,0.6),transparent)]" />
          </button>
        </form>
      </div>
    </div>
  );
}

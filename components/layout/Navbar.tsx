'use client';

import React, { useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

const navLinks = [
  { label: 'Visi', href: '#visi' },
  { label: 'Fasilitas', href: '#fasilitas' },
  { label: 'Program', href: '#program' },
  { label: 'Guru', href: '#guru' },
  { label: 'Alumni', href: '#alumni' },
];

export const Navbar = () => {
  const navRef = useRef<HTMLElement>(null);
  const [isScrolled, setIsScrolled] = useState(false);

  useGSAP(() => {
    ScrollTrigger.create({
      start: "top -50px",
      onEnter: () => setIsScrolled(true),
      onLeaveBack: () => setIsScrolled(false),
    });
  }, { scope: navRef });

  const handleNav = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <header
      ref={navRef}
      className="fixed top-2 left-0 w-full z-[100] px-4 md:px-8 pointer-events-none flex justify-center"
    >
      <div 
        className="pointer-events-auto flex items-center justify-between relative h-[56px] rounded-full border overflow-hidden transition-all duration-[600ms]"
        style={{
          transitionTimingFunction: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
          width: '100%',
          maxWidth: isScrolled ? '900px' : '1400px',
          padding: isScrolled ? '0 0.5rem 0 1.5rem' : '0 1rem 0 2rem',
          background: isScrolled ? 'rgba(255, 255, 255, 0.25)' : 'rgba(255, 255, 255, 0.08)',
          backdropFilter: isScrolled ? 'blur(24px) saturate(150%)' : 'blur(12px) saturate(120%)',
          WebkitBackdropFilter: isScrolled ? 'blur(24px) saturate(150%)' : 'blur(12px) saturate(120%)',
          borderColor: isScrolled ? 'rgba(255, 255, 255, 0.5)' : 'rgba(255, 255, 255, 0.15)',
          boxShadow: isScrolled ? '0 10px 40px -10px rgba(0,0,0,0.1)' : '0 4px 20px -5px rgba(0,0,0,0.05)',
        }}
      >
        {/* Left: Logo */}
        <a 
          href="#" 
          className="relative flex shrink-0 w-10 h-10 rounded-full items-center justify-center transition-colors duration-500 z-20 group"
          style={{
            border: `1px solid ${isScrolled ? 'rgba(42, 32, 26, 0.15)' : 'rgba(253, 246, 236, 0.25)'}`,
            color: isScrolled ? '#2A201A' : '#FDF6EC'
          }}
        >
          <span className="font-heading font-bold text-sm tracking-tighter group-hover:scale-110 transition-transform">TJ</span>
        </a>

        {/* Center: Navigation Links */}
        <nav 
          className="absolute left-1/2 -translate-x-1/2 h-full hidden md:flex items-center gap-1 lg:gap-2 z-10 transition-colors duration-700"
          style={{ color: isScrolled ? '#2A201A' : '#FDF6EC' }}
        >
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => handleNav(e, link.href)}
              className="px-4 py-2 text-sm font-heading font-semibold uppercase tracking-wider opacity-90 hover:opacity-100 rounded-full transition-all duration-300"
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = isScrolled ? 'rgba(42, 32, 26, 0.05)' : 'rgba(253, 246, 236, 0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Right: Solid CTA */}
        <a
          href="#daftar"
          onClick={(e) => handleNav(e, '#daftar')}
          className="relative px-8 py-3 rounded-full overflow-hidden group shrink-0 flex items-center justify-center transition-all duration-500 z-20 hover:scale-105"
          style={{
            background: isScrolled ? '#2A201A' : 'rgba(253, 246, 236, 0.12)',
            border: `1px solid ${isScrolled ? '#2A201A' : 'rgba(253, 246, 236, 0.25)'}`,
            color: '#FDF6EC',
          }}
        >
          <span className="relative z-10 text-sm font-heading font-bold uppercase tracking-widest">
            Daftar
          </span>
          <div 
            className="absolute inset-0 transform translate-y-[101%] group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)]" 
            style={{ background: isScrolled ? '#B8860B' : 'rgba(253, 246, 236, 0.2)' }}
          />
        </a>
      </div>
    </header>
  );
};

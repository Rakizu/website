import type { Metadata } from 'next';
import { Plus_Jakarta_Sans, Outfit, Lora } from 'next/font/google';
import './globals.css';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { SmoothScroll } from '@/components/layout/SmoothScroll';
import { IslamicPattern } from '@/components/ui/IslamicPattern';

const plusJakartaSans = Plus_Jakarta_Sans({ 
  subsets: ['latin'],
  variable: '--font-jakarta',
  display: 'swap',
});

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  display: 'swap',
});

const lora = Lora({
  subsets: ['latin'],
  variable: '--font-lora',
  style: ['normal', 'italic'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'SMPIT Thoriqul Jannah',
  description: 'Mencetak Generasi Sholeh, Mandiri, Kreatif, dan Berprestasi.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${plusJakartaSans.variable} ${outfit.variable} ${lora.variable}`}>
      <body className="antialiased selection:bg-accent-gold selection:text-white relative">
        <div className="fixed inset-0 pointer-events-none z-40" style={{ opacity: 0.2 }}>
          <IslamicPattern color="var(--gold-soft)" opacity={0.06} />
        </div>
        <div className="relative z-10">
          <Navbar />
          <SmoothScroll />
          {children}
          <Footer />
        </div>
      </body>
    </html>
  );
}

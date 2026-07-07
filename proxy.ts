import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Lindungi semua rute /admin kecuali halaman login
  if (pathname.startsWith('/admin') && !pathname.startsWith('/admin/login')) {
    const session = request.cookies.get('tj_session');

    // Verifikasi sederhana: token harus ada dan memiliki panjang yang wajar
    // (Idealnya ini divalidasi dengan library JWT seperti 'jose')
    const isValidSession = session?.value && session.value.length > 20;

    if (!isValidSession) {
      const loginUrl = new URL('/admin/login', request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Jika sudah login dan mencoba mengakses /admin/login, alihkan ke dashboard
  if (pathname.startsWith('/admin/login')) {
    const session = request.cookies.get('tj_session');
    if (session) {
      return NextResponse.redirect(new URL('/admin/artikel', request.url));
    }
  }

  return NextResponse.next();
}

// Hanya jalankan proxy ini pada rute admin
export const config = {
  matcher: ['/admin/:path*'],
};

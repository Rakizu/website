import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Lindungi semua rute /admin kecuali halaman login
  if (pathname.startsWith('/admin') && !pathname.startsWith('/admin/login')) {
    const session = request.cookies.get('tj_session');

    // Jika tidak ada sesi, tendang kembali ke halaman login
    if (!session) {
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

// Hanya jalankan middleware ini pada rute admin
export const config = {
  matcher: ['/admin/:path*'],
};

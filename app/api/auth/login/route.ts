import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    // Akun Hardcoded untuk keperluan demonstrasi/sekolah statis
    const users = [
      { username: 'admin', password: '123', role: 'publisher' },
      { username: 'writer', password: '123', role: 'writer' }
    ];

    const user = users.find(u => u.username === username && u.password === password);

    if (user) {
      // Set sesi cookie yang aman
      const cookieStore = await cookies();
      cookieStore.set('tj_session', user.role, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 7 // 1 Minggu
      });

      return NextResponse.json({ success: true, role: user.role }, { status: 200 });
    }

    return NextResponse.json({ success: false, message: 'Kredensial tidak valid' }, { status: 401 });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Terjadi kesalahan internal' }, { status: 500 });
  }
}

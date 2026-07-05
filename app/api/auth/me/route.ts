import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET() {
  const cookieStore = await cookies();
  const session = cookieStore.get('tj_session');
  
  if (session) {
    return NextResponse.json({ success: true, role: session.value }, { status: 200 });
  }
  
  return NextResponse.json({ success: false, role: 'guest' }, { status: 401 });
}

import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const dataPath = path.join(process.cwd(), 'content/data.json');

export async function GET() {
  try {
    const file = fs.readFileSync(dataPath, 'utf-8');
    const data = JSON.parse(file);
    return NextResponse.json({ success: true, data: data.fasilitas || [] });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to read data' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const file = fs.readFileSync(dataPath, 'utf-8');
    const data = JSON.parse(file);

    if (!data.fasilitas) data.fasilitas = [];
    
    const newFasilitas = {
      id: 'f' + Date.now(),
      nama: body.nama || '',
      deskripsi: body.deskripsi || '',
      image: body.image || '',
    };

    data.fasilitas.push(newFasilitas);
    fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));

    return NextResponse.json({ success: true, data: newFasilitas });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to create facility' }, { status: 500 });
  }
}

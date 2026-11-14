import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const dataFilePath = path.join(process.cwd(), 'content', 'data.json');

async function readData() {
  const fileContents = await fs.readFile(dataFilePath, 'utf8');
  return JSON.parse(fileContents);
}

async function writeData(data: unknown) {
  await fs.writeFile(dataFilePath, JSON.stringify(data, null, 2), 'utf8');
}

// GET all prestasi
export async function GET() {
  try {
    const data = await readData();
    return NextResponse.json({ success: true, data: data.prestasi || [] }, { status: 200 });
  } catch (error) {
    console.error('Error reading prestasi:', error);
    return NextResponse.json({ success: false, message: 'Gagal mengambil data prestasi' }, { status: 500 });
  }
}

// POST new prestasi
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const data = await readData();
    
    if (!body.nama || !body.judul) {
      return NextResponse.json({ success: false, message: 'Nama dan judul prestasi wajib diisi' }, { status: 400 });
    }

    const newId = `p${Date.now()}`;
    
    const newPrestasi = {
      id: newId,
      nama: body.nama,
      judul: body.judul,
      tingkat: body.tingkat || 'Sekolah',
      tahun: body.tahun || new Date().getFullYear().toString(),
      kutipan: body.kutipan || '',
      image: body.image || ''
    };

    if (!data.prestasi) data.prestasi = [];
    data.prestasi.push(newPrestasi);
    
    await writeData(data);
    
    return NextResponse.json({ success: true, data: newPrestasi }, { status: 201 });
  } catch (error) {
    console.error('Error creating prestasi:', error);
    return NextResponse.json({ success: false, message: 'Gagal menyimpan prestasi' }, { status: 500 });
  }
}

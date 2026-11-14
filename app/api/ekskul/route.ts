import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const dataFilePath = path.join(process.cwd(), 'content', 'data.json');

async function readData() {
  const fileContents = await fs.readFile(dataFilePath, 'utf8');
  return JSON.parse(fileContents);
}

async function writeData(data: any) {
  await fs.writeFile(dataFilePath, JSON.stringify(data, null, 2), 'utf8');
}

// GET all ekskul
export async function GET() {
  try {
    const data = await readData();
    return NextResponse.json({ success: true, data: data.ekskul }, { status: 200 });
  } catch (error) {
    console.error('Error reading ekskul:', error);
    return NextResponse.json({ success: false, message: 'Gagal mengambil data ekskul' }, { status: 500 });
  }
}

// POST new ekskul
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const data = await readData();
    
    if (!body.nama || !body.kategori) {
      return NextResponse.json({ success: false, message: 'Nama dan kategori wajib diisi' }, { status: 400 });
    }

    const newId = `e${Date.now()}`;
    
    const newEkskul = {
      id: newId,
      nama: body.nama,
      kategori: body.kategori,
      deskripsi: body.deskripsi || '',
      mainImage: body.mainImage || '',
      galleryImages: body.galleryImages || []
    };

    data.ekskul.push(newEkskul);
    await writeData(data);
    
    return NextResponse.json({ success: true, data: newEkskul }, { status: 201 });
  } catch (error) {
    console.error('Error creating ekskul:', error);
    return NextResponse.json({ success: false, message: 'Gagal menyimpan ekskul' }, { status: 500 });
  }
}

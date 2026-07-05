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

// GET all articles
export async function GET() {
  try {
    const data = await readData();
    return NextResponse.json({ success: true, data: data.artikel }, { status: 200 });
  } catch (error) {
    console.error('Error reading articles:', error);
    return NextResponse.json({ success: false, message: 'Gagal mengambil data artikel' }, { status: 500 });
  }
}

// POST new article
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const data = await readData();
    
    // Validasi data dasar
    if (!body.judul || !body.content) {
      return NextResponse.json({ success: false, message: 'Judul dan konten wajib diisi' }, { status: 400 });
    }

    // Buat ID baru (ar + angka unik)
    const newId = `ar${Date.now()}`;
    
    // Gunakan tanggal saat ini jika tidak ada
    const today = new Date();
    const formattedDate = new Intl.DateTimeFormat('id-ID', { day: '2-digit', month: 'long', year: 'numeric' }).format(today);

    // Hitung waktu baca (asumsi rata-rata kecepatan baca 200 kata/menit)
    const wordCount = body.content.trim().split(/\s+/).length;
    const readingTime = Math.max(1, Math.ceil(wordCount / 200));

    const newArticle = {
      id: newId,
      judul: body.judul,
      kategori: body.kategori || 'Edukasi',
      tanggal: body.tanggal || formattedDate,
      excerpt: body.excerpt || body.content.substring(0, 100) + '...',
      image: body.image || 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?q=80&w=800&auto=format&fit=crop',
      content: body.content,
      penulis: body.penulis || 'Tim Redaksi',
      author_role: body.author_role || 'Editor Utama',
      author_avatar: body.author_avatar || '',
      tags: body.tags || [],
      status: body.status || 'Published',
      waktu_baca: `${readingTime} Menit Baca`
    };

    // Tambahkan di urutan paling awal
    data.artikel.unshift(newArticle);
    
    await writeData(data);
    
    return NextResponse.json({ success: true, data: newArticle }, { status: 201 });
  } catch (error) {
    console.error('Error creating article:', error);
    return NextResponse.json({ success: false, message: 'Gagal menyimpan artikel' }, { status: 500 });
  }
}

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

// GET single article
export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const data = await readData();
    const article = data.artikel.find((a: any) => a.id === id);
    
    if (!article) {
      return NextResponse.json({ success: false, message: 'Artikel tidak ditemukan' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true, data: article }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Gagal mengambil data' }, { status: 500 });
  }
}

// PUT (Update) article
export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const data = await readData();
    
    const index = data.artikel.findIndex((a: any) => a.id === id);
    if (index === -1) {
      return NextResponse.json({ success: false, message: 'Artikel tidak ditemukan' }, { status: 404 });
    }
    
    // Hitung ulang waktu baca jika konten berubah
    const contentToUse = body.content !== undefined ? body.content : data.artikel[index].content;
    const wordCount = contentToUse.trim().split(/\s+/).length;
    const readingTime = Math.max(1, Math.ceil(wordCount / 200));
    
    // Update the article
    data.artikel[index] = {
      ...data.artikel[index],
      judul: body.judul !== undefined ? body.judul : data.artikel[index].judul,
      kategori: body.kategori !== undefined ? body.kategori : data.artikel[index].kategori,
      tanggal: body.tanggal !== undefined ? body.tanggal : data.artikel[index].tanggal,
      excerpt: body.excerpt !== undefined ? body.excerpt : data.artikel[index].excerpt,
      image: body.image !== undefined ? body.image : data.artikel[index].image,
      content: contentToUse,
      penulis: body.penulis !== undefined ? body.penulis : data.artikel[index].penulis || 'Tim Redaksi',
      author_role: body.author_role !== undefined ? body.author_role : data.artikel[index].author_role || 'Editor Utama',
      author_avatar: body.author_avatar !== undefined ? body.author_avatar : data.artikel[index].author_avatar || '',
      tags: body.tags !== undefined ? body.tags : data.artikel[index].tags || [],
      status: body.status !== undefined ? body.status : data.artikel[index].status || 'Published',
      waktu_baca: `${readingTime} Menit Baca`
    };
    
    await writeData(data);
    
    return NextResponse.json({ success: true, data: data.artikel[index] }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Gagal memperbarui artikel' }, { status: 500 });
  }
}

// DELETE article
export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const data = await readData();
    
    const index = data.artikel.findIndex((a: any) => a.id === id);
    if (index === -1) {
      return NextResponse.json({ success: false, message: 'Artikel tidak ditemukan' }, { status: 404 });
    }
    
    // Remove from array
    data.artikel.splice(index, 1);
    await writeData(data);
    
    return NextResponse.json({ success: true, message: 'Artikel berhasil dihapus' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Gagal menghapus artikel' }, { status: 500 });
  }
}

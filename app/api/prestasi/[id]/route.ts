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

// GET single prestasi
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const data = await readData();
    const prestasi = (data.prestasi || []).find((p: { id: string }) => p.id === id);
    
    if (!prestasi) {
      return NextResponse.json({ success: false, message: 'Prestasi tidak ditemukan' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true, data: prestasi }, { status: 200 });
  } catch {
    return NextResponse.json({ success: false, message: 'Gagal mengambil prestasi' }, { status: 500 });
  }
}

// PUT update prestasi
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const data = await readData();
    
    const index = (data.prestasi || []).findIndex((p: { id: string }) => p.id === id);
    if (index === -1) {
      return NextResponse.json({ success: false, message: 'Prestasi tidak ditemukan' }, { status: 404 });
    }

    data.prestasi[index] = {
      ...data.prestasi[index],
      ...body
    };

    await writeData(data);
    return NextResponse.json({ success: true, data: data.prestasi[index] }, { status: 200 });
  } catch {
    return NextResponse.json({ success: false, message: 'Gagal update prestasi' }, { status: 500 });
  }
}

// DELETE prestasi
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const data = await readData();
    
    const index = (data.prestasi || []).findIndex((p: { id: string }) => p.id === id);
    if (index === -1) {
      return NextResponse.json({ success: false, message: 'Prestasi tidak ditemukan' }, { status: 404 });
    }

    data.prestasi.splice(index, 1);
    await writeData(data);
    
    return NextResponse.json({ success: true, message: 'Prestasi berhasil dihapus' }, { status: 200 });
  } catch {
    return NextResponse.json({ success: false, message: 'Gagal menghapus prestasi' }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const dataFilePath = path.join(process.cwd(), 'content/data.json');

async function readData() {
  const fileContents = await fs.readFile(dataFilePath, 'utf8');
  return JSON.parse(fileContents);
}

export async function GET(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const data = await readData();
    const id = (await context.params).id;
    const guru = data.guru?.find((g: any) => g.id === id);
    
    if (guru) {
      return NextResponse.json({ success: true, data: guru });
    }
    return NextResponse.json({ success: false, message: 'Guru tidak ditemukan' }, { status: 404 });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Gagal mengambil data' }, { status: 500 });
  }
}

export async function PUT(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const body = await request.json();
    const data = await readData();
    const id = (await context.params).id;
    
    const index = data.guru?.findIndex((g: any) => g.id === id);
    
    if (index !== -1 && index !== undefined) {
      data.guru[index] = { ...data.guru[index], ...body };
      await fs.writeFile(dataFilePath, JSON.stringify(data, null, 2), 'utf8');
      return NextResponse.json({ success: true, data: data.guru[index] });
    }
    return NextResponse.json({ success: false, message: 'Guru tidak ditemukan' }, { status: 404 });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Gagal memperbarui guru' }, { status: 500 });
  }
}

export async function DELETE(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const data = await readData();
    const id = (await context.params).id;
    
    const index = data.guru?.findIndex((g: any) => g.id === id);
    
    if (index !== -1 && index !== undefined) {
      data.guru.splice(index, 1);
      await fs.writeFile(dataFilePath, JSON.stringify(data, null, 2), 'utf8');
      return NextResponse.json({ success: true });
    }
    return NextResponse.json({ success: false, message: 'Guru tidak ditemukan' }, { status: 404 });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Gagal menghapus guru' }, { status: 500 });
  }
}

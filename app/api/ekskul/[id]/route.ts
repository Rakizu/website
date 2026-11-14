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

export async function GET(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const data = await readData();
    const id = (await context.params).id;
    const item = data.ekskul.find((e: any) => e.id === id);
    
    if (!item) {
      return NextResponse.json({ success: false, message: 'Data tidak ditemukan' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true, data: item }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Gagal mengambil data' }, { status: 500 });
  }
}

export async function PUT(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const body = await request.json();
    const data = await readData();
    const id = (await context.params).id;
    
    const index = data.ekskul.findIndex((e: any) => e.id === id);
    if (index === -1) {
      return NextResponse.json({ success: false, message: 'Data tidak ditemukan' }, { status: 404 });
    }
    
    data.ekskul[index] = {
      ...data.ekskul[index],
      ...body
    };
    
    await writeData(data);
    return NextResponse.json({ success: true, data: data.ekskul[index] }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Gagal update data' }, { status: 500 });
  }
}

export async function DELETE(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const data = await readData();
    const id = (await context.params).id;
    
    const initialLength = data.ekskul.length;
    data.ekskul = data.ekskul.filter((e: any) => e.id !== id);
    
    if (data.ekskul.length === initialLength) {
      return NextResponse.json({ success: false, message: 'Data tidak ditemukan' }, { status: 404 });
    }
    
    await writeData(data);
    return NextResponse.json({ success: true, message: 'Data berhasil dihapus' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Gagal menghapus data' }, { status: 500 });
  }
}

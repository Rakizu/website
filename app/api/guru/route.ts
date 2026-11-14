import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const dataFilePath = path.join(process.cwd(), 'content/data.json');

async function readData() {
  const fileContents = await fs.readFile(dataFilePath, 'utf8');
  return JSON.parse(fileContents);
}

export async function GET() {
  try {
    const data = await readData();
    return NextResponse.json({ success: true, data: data.guru || [] });
  } catch {
    return NextResponse.json({ success: false, message: 'Gagal mengambil data' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const data = await readData();
    
    const newGuru = {
      id: 'g' + Date.now(),
      ...body
    };

    if (!data.guru) data.guru = [];
    data.guru.push(newGuru);

    await fs.writeFile(dataFilePath, JSON.stringify(data, null, 2), 'utf8');
    return NextResponse.json({ success: true, data: newGuru });
  } catch {
    return NextResponse.json({ success: false, message: 'Gagal menambah guru' }, { status: 500 });
  }
}

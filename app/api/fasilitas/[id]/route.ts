import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const dataPath = path.join(process.cwd(), 'content/data.json');

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const file = fs.readFileSync(dataPath, 'utf-8');
    const data = JSON.parse(file);
    const facility = data.fasilitas?.find((f: any) => f.id === id);

    if (!facility) {
      return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: facility });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed' }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const body = await request.json();
    const file = fs.readFileSync(dataPath, 'utf-8');
    const data = JSON.parse(file);
    
    if (!data.fasilitas) data.fasilitas = [];

    const index = data.fasilitas.findIndex((f: any) => f.id === id);
    if (index === -1) {
      return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 });
    }

    data.fasilitas[index] = { ...data.fasilitas[index], ...body, id };
    fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));

    return NextResponse.json({ success: true, data: data.fasilitas[index] });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const file = fs.readFileSync(dataPath, 'utf-8');
    const data = JSON.parse(file);
    
    if (!data.fasilitas) data.fasilitas = [];

    const index = data.fasilitas.findIndex((f: any) => f.id === id);
    if (index === -1) {
      return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 });
    }

    data.fasilitas.splice(index, 1);
    fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed' }, { status: 500 });
  }
}

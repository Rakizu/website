import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ success: false, message: 'Tidak ada file yang diunggah' }, { status: 400 });
    }

    // Prepare buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Create unique filename
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    // Extract extension or fallback to jpg
    const ext = file.name.split('.').pop() || 'jpg';
    const filename = `image-${uniqueSuffix}.${ext}`;

    // Define upload path
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    
    // Ensure upload directory exists
    try {
      await fs.access(uploadDir);
    } catch {
      await fs.mkdir(uploadDir, { recursive: true });
    }

    // Write file
    const filePath = path.join(uploadDir, filename);
    await fs.writeFile(filePath, buffer);

    // Return the URL
    const fileUrl = `/uploads/${filename}`;

    return NextResponse.json({ success: true, url: fileUrl }, { status: 200 });
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json({ success: false, message: 'Gagal mengunggah file' }, { status: 500 });
  }
}

import fs from 'fs';
import path from 'path';
import { EkskulGalleryTest } from '@/components/sections/EkskulGalleryTest';

function getData() {
  const filePath = path.join(process.cwd(), 'content/data.json');
  const fileContents = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(fileContents);
}

export default function TestEkskulPage() {
  const data = getData();
  const ekskulNonAkademik = data.ekskul.filter((e: any) => e.kategori === 'Non-Akademik');

  return (
    <main className="min-h-screen bg-charcoal-ink">
      <EkskulGalleryTest ekskul={ekskulNonAkademik} />
    </main>
  );
}

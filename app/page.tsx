import fs from 'fs';
import path from 'path';
import { GatePageV2 } from '@/components/sections/GatePageV2';
import { HeroCinematicV2 } from '@/components/sections/HeroCinematicV2';
import { StoryVisionMission } from '@/components/sections/StoryVisionMission';
import { FacilityGrid } from '@/components/sections/FacilityGrid';
import { EditorialTeachers } from '@/components/sections/EditorialTeachers';
import { CurriculumTree } from '@/components/sections/CurriculumTree';
import { EkskulNonAkademik } from '@/components/sections/EkskulNonAkademik';
import { EkskulAkademik } from '@/components/sections/EkskulAkademik';
import { HallOfFameCrown } from '@/components/sections/HallOfFameCrown';
import { ArticleHighlight } from '@/components/sections/ArticleHighlight';
import { AdmissionForm } from '@/components/sections/AdmissionForm';

// Simulate CMS fetch
function getData() {
  const filePath = path.join(process.cwd(), 'content/data.json');
  const fileContents = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(fileContents);
}

// Revalidate every 60 seconds (ISR) - useful when this is migrated to Sanity fetch
export const revalidate = 60;

export default function Home() {
  const data = getData();
  const publishedArticles = (data.artikel || []).filter((a: { status?: string }) => a.status !== 'Draft');

  return (
    <main className="bg-canvas-white text-charcoal-ink min-h-screen" data-theme="light">
      <GatePageV2 />
      <HeroCinematicV2 />
      
      {/* 1. TENTANG KAMI (Profil) */}
      <StoryVisionMission />
      <EditorialTeachers guru={data.guru} />

      {/* 2. PROGRAM */}
      <CurriculumTree kurikulum={data.kurikulum} />
      <EkskulAkademik programs={data.ekskul.filter((e: { kategori: string }) => e.kategori === 'Akademik')} />
      <EkskulNonAkademik ekskul={data.ekskul.filter((e: { kategori: string }) => e.kategori === 'Non-Akademik')} />

      {/* 3. FASILITAS */}
      <FacilityGrid fasilitas={data.fasilitas} />

      {/* 4. PRESTASI (The Proof / Climax) */}
      <HallOfFameCrown prestasi={data.prestasi} />

      {/* 5. BERITA & DAFTAR */}
      <ArticleHighlight artikel={publishedArticles} />
      <AdmissionForm />
    </main>
  );
}

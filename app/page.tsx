import fs from 'fs';
import path from 'path';
import { GatePage } from '@/components/sections/GatePage';
import { HeroCinematic } from '@/components/sections/HeroCinematic';
import { StoryVisionMission } from '@/components/sections/StoryVisionMission';
import { FacilityGrid } from '@/components/sections/FacilityGrid';
import { EditorialTeachers } from '@/components/sections/EditorialTeachers';
import { CurriculumTree } from '@/components/sections/CurriculumTree';
import { HorizontalExtracurriculars } from '@/components/sections/HorizontalExtracurriculars';
import { FeaturedPrograms } from '@/components/sections/FeaturedPrograms';
import { AlumniGallery } from '@/components/sections/AlumniGallery';
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

  return (
    <main className="bg-canvas-white text-charcoal-ink min-h-screen" data-theme="light">
      <GatePage />
      <HeroCinematic />
      
      {/* 1. TENTANG KAMI (Profil) */}
      <StoryVisionMission />
      <EditorialTeachers guru={data.guru} />
      <AlumniGallery alumni={data.alumni} />

      {/* 2. PROGRAM */}
      <CurriculumTree kurikulum={data.kurikulum} />
      <FeaturedPrograms programs={data.kurikulum.programUnggulan} />
      <HorizontalExtracurriculars ekskul={data.ekskul} />

      {/* 3. FASILITAS */}
      <FacilityGrid fasilitas={data.fasilitas} />

      {/* 4. BERITA & DAFTAR */}
      <ArticleHighlight artikel={data.artikel} />
      <AdmissionForm />
    </main>
  );
}

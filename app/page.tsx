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
      <section id="visi" data-theme="light">
        <StoryVisionMission />
      </section>
      <section id="guru" data-theme="dark">
        <EditorialTeachers guru={data.guru} />
      </section>
      <section id="alumni" data-theme="light">
        <AlumniGallery alumni={data.alumni} />
      </section>

      {/* 2. PROGRAM */}
      <section id="kurikulum" data-theme="light">
        <CurriculumTree kurikulum={data.kurikulum} />
      </section>
      <div data-theme="dark">
        <FeaturedPrograms programs={data.kurikulum.programUnggulan} />
        <section id="ekskul">
          <HorizontalExtracurriculars ekskul={data.ekskul} />
        </section>
      </div>

      {/* 3. FASILITAS */}
      <section id="fasilitas" data-theme="light">
        <FacilityGrid fasilitas={data.fasilitas} />
      </section>

      {/* 4. BERITA & DAFTAR */}
      <section id="artikel" data-theme="dark">
        <ArticleHighlight artikel={data.artikel} />
      </section>
      <section id="daftar" data-theme="dark">
        <AdmissionForm />
      </section>
    </main>
  );
}

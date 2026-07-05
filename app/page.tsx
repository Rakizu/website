import fs from 'fs';
import path from 'path';
import { GatePage } from '@/components/sections/GatePage';
import { HeroCinematic } from '@/components/sections/HeroCinematic';
import { StoryVisiMisi } from '@/components/sections/StoryVisiMisi';
import { FasilitasGrid } from '@/components/sections/FasilitasGrid';
import { EditorialGuru } from '@/components/sections/EditorialGuru';
import { KurikulumTree } from '@/components/sections/KurikulumTree';
import { HorizontalEkskul } from '@/components/sections/HorizontalEkskul';
import { ProgramUnggulan } from '@/components/sections/ProgramUnggulan';
import { AlumniGallery } from '@/components/sections/AlumniGallery';
import { ArtikelHighlight } from '@/components/sections/ArtikelHighlight';
import { FormSPMB } from '@/components/sections/FormSPMB';

// Simulate CMS fetch
function getData() {
  const filePath = path.join(process.cwd(), 'content/data.json');
  const fileContents = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(fileContents);
}

export default function Home() {
  const data = getData();

  return (
    <main className="bg-canvas-white text-charcoal-ink min-h-screen">
      <div data-theme="dark">
        <GatePage />
      </div>
      <HeroCinematic />
      <section id="visi" data-theme="light">
        <StoryVisiMisi />
      </section>
      <section id="fasilitas" data-theme="light">
        <FasilitasGrid fasilitas={data.fasilitas} />
      </section>
      <section id="guru" data-theme="dark">
        <EditorialGuru guru={data.guru} />
      </section>
      <section id="kurikulum" data-theme="light">
        <KurikulumTree kurikulum={data.kurikulum} />
      </section>
      <div data-theme="dark">
        <ProgramUnggulan programs={data.kurikulum.programUnggulan} />
        <section id="ekskul">
          <HorizontalEkskul ekskul={data.ekskul} />
        </section>
      </div>
      <div data-theme="light">
        <AlumniGallery alumni={data.alumni} />
      </div>
      <div data-theme="dark">
        <ArtikelHighlight artikel={data.artikel} />
      </div>
      <section id="daftar" data-theme="dark">
        <FormSPMB />
      </section>
    </main>
  );
}

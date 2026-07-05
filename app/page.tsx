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
import { AlumniStack } from '@/components/sections/AlumniStack';
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
      <GatePage />
      <HeroCinematic />
      <section id="visi">
        <StoryVisiMisi />
      </section>
      <section id="fasilitas">
        <FasilitasGrid fasilitas={data.fasilitas} />
      </section>
      <section id="guru">
        <EditorialGuru guru={data.guru} />
      </section>
      <section id="program">
        <KurikulumTree kurikulum={data.kurikulum} />
        <ProgramUnggulan programs={data.kurikulum.programUnggulan} />
        <HorizontalEkskul ekskul={data.ekskul} />
      </section>
      <AlumniStack alumni={data.alumni} />
      <ArtikelHighlight artikel={data.artikel} />
      <section id="daftar">
        <FormSPMB />
      </section>
    </main>
  );
}

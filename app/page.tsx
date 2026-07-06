import fs from 'fs';
import path from 'path';
import { GatePage } from '@/components/sections/GatePage';
import { HeroCinematic } from '@/components/sections/HeroCinematic';
import dynamic from 'next/dynamic';

const StoryVisiMisi = dynamic(() => import('@/components/sections/StoryVisiMisi').then(mod => mod.StoryVisiMisi));
const FasilitasGrid = dynamic(() => import('@/components/sections/FasilitasGrid').then(mod => mod.FasilitasGrid));
const EditorialGuru = dynamic(() => import('@/components/sections/EditorialGuru').then(mod => mod.EditorialGuru));
const KurikulumTree = dynamic(() => import('@/components/sections/KurikulumTree').then(mod => mod.KurikulumTree));
const HorizontalEkskul = dynamic(() => import('@/components/sections/HorizontalEkskul').then(mod => mod.HorizontalEkskul));
const ProgramUnggulan = dynamic(() => import('@/components/sections/ProgramUnggulan').then(mod => mod.ProgramUnggulan));
const AlumniGallery = dynamic(() => import('@/components/sections/AlumniGallery').then(mod => mod.AlumniGallery));
const ArtikelHighlight = dynamic(() => import('@/components/sections/ArtikelHighlight').then(mod => mod.ArtikelHighlight));
const FormSPMB = dynamic(() => import('@/components/sections/FormSPMB').then(mod => mod.FormSPMB));

// Simulate CMS fetch
function getData() {
  const filePath = path.join(process.cwd(), 'content/data.json');
  const fileContents = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(fileContents);
}

export default function Home() {
  const data = getData();

  return (
    <main className="bg-canvas-white text-charcoal-ink min-h-screen" data-theme="light">
      <GatePage />
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

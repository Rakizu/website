export const extracurricular = {
  name: 'extracurricular',
  title: 'Ekstrakurikuler',
  type: 'document',
  fields: [
    {
      name: 'nama',
      title: 'Nama Ekstrakurikuler',
      type: 'string',
    },
    {
      name: 'deskripsi',
      title: 'Deskripsi Singkat',
      type: 'text',
    },
    {
      name: 'foto',
      title: 'Foto Kegiatan',
      type: 'image',
      options: {
        hotspot: true,
      },
    }
  ]
};

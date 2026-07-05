export const teacher = {
  name: 'teacher',
  title: 'Guru',
  type: 'document',
  fields: [
    {
      name: 'nama',
      title: 'Nama Lengkap (dengan gelar)',
      type: 'string',
    },
    {
      name: 'mapel',
      title: 'Mata Pelajaran',
      type: 'string',
    },
    {
      name: 'quote',
      title: 'Kutipan / Motto',
      type: 'text',
    },
    {
      name: 'foto',
      title: 'Foto Guru',
      type: 'image',
      options: {
        hotspot: true,
      },
    }
  ]
};

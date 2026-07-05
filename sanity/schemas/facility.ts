export const facility = {
  name: 'facility',
  title: 'Fasilitas',
  type: 'document',
  fields: [
    {
      name: 'nama',
      title: 'Nama Fasilitas',
      type: 'string',
    },
    {
      name: 'deskripsi',
      title: 'Deskripsi',
      type: 'text',
    },
    {
      name: 'foto',
      title: 'Foto Fasilitas',
      type: 'image',
      options: {
        hotspot: true,
      },
    }
  ]
};

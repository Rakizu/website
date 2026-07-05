import { type SchemaTypeDefinition } from 'sanity'
import { teacher } from './schemas/teacher'
import { facility } from './schemas/facility'
import { extracurricular } from './schemas/extracurricular'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [teacher, facility, extracurricular],
}

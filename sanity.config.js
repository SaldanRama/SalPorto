import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { schemaTypes } from './src/sanity/schemas';

const projectId =
  import.meta.env.VITE_SANITY_PROJECT_ID ||
  'wt1wcbf0';

const dataset =
  import.meta.env.VITE_SANITY_DATASET ||
  'production';

export default defineConfig({
  name: 'default',
  title: 'SalPorto Studio',
  projectId,
  dataset,
  basePath: '/admin/studio',
  plugins: [structureTool()],
  schema: {
    types: schemaTypes,
  },
});

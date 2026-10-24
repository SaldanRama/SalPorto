import { createClient } from '@sanity/client';

const client = createClient({
  projectId: 'wt1wcbf0',
  dataset: 'production',
  apiVersion: '2024-10-24',
  useCdn: false,
});

async function main() {
  const exps = await client.fetch('*[_type == "experience"] | order(sortOrder asc)');
  console.log(`\n=== Total Experiences di Sanity: ${exps.length} ===`);
  exps.forEach((e, idx) => {
    console.log(`${idx + 1}. [Order ${e.sortOrder}] ${e.role} @ ${e.organization} (${e.images?.length || 0} foto, ${e.tools?.length || 0} tools)`);
  });

  const projs = await client.fetch('*[_type == "project"] | order(sortOrder asc)');
  console.log(`\n=== Total Projects di Sanity: ${projs.length} ===`);
  projs.forEach((p, idx) => {
    console.log(`${idx + 1}. ${p.title} (${p.category}) - ${p.year}`);
  });
}

main().catch(console.error);

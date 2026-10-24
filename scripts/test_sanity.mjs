import { createClient } from '@sanity/client';

const client = createClient({
  projectId: 'wt1wcbf0',
  dataset: 'production',
  apiVersion: '2024-10-24',
  useCdn: false,
});

async function run() {
  try {
    const docs = await client.fetch('*');
    console.log('Total documents in Sanity:', docs.length);
    console.log('Doc types:', docs.map(d => ({ id: d._id, type: d._type, title: d.title || d.role })));
  } catch (err) {
    console.error('Fetch error:', err.message);
  }
}

run();

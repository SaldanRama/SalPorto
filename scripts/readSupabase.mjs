const supabaseUrl = 'https://qarvsujzxunsyktofquu.supabase.co';
const supabaseKey = 'sb_publishable_Wux1sgLxGOKDuue1wKCB3Q_xQNFMsQ8';

async function fetchTable(table) {
  const url = `${supabaseUrl}/rest/v1/${table}?select=*`;
  const res = await fetch(url, {
    headers: {
      apikey: supabaseKey,
      Authorization: `Bearer ${supabaseKey}`,
    },
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Failed to fetch ${table}: ${res.status} ${text}`);
  }
  return await res.json();
}

async function main() {
  try {
    const experiences = await fetchTable('experiences');
    console.log(`\n=== EXPERIENCES FROM SUPABASE (${experiences.length} items) ===`);
    console.log(JSON.stringify(experiences, null, 2));

    const projects = await fetchTable('projects');
    console.log(`\n=== PROJECTS FROM SUPABASE (${projects.length} items) ===`);
    console.log(JSON.stringify(projects, null, 2));
  } catch (err) {
    console.error('Error querying Supabase:', err.message);
  }
}

main();

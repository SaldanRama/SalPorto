import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';

const liveClient = createClient({
  projectId: 'wt1wcbf0',
  dataset: 'production',
  apiVersion: '2024-10-24',
  useCdn: false,
});

const builder = imageUrlBuilder(liveClient);

async function main() {
  const doc = await liveClient.fetch('*[_type == "experience" && role match "dasdas*"][0]');
  console.log('Document found:', {
    id: doc._id,
    role: doc.role,
    organization: doc.organization,
    sortOrder: doc.sortOrder,
    imagesCount: doc.images?.length,
  });
  if (doc.images && doc.images[0]) {
    const imgObj = doc.images[0];
    const assetRef = imgObj.image || imgObj;
    const url = builder.image(assetRef).url();
    console.log('Generated image url:', url);
  }
}

main().catch(console.error);

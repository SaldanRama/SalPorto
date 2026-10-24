import React from 'react';
import { Studio } from 'sanity';
import sanityConfig from '../../../sanity.config';

export function StudioPage() {
  return (
    <div style={{ height: '100vh', width: '100vw', overflow: 'hidden' }}>
      <Studio config={sanityConfig} />
    </div>
  );
}

export default StudioPage;

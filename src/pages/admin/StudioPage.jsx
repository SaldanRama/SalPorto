import React from 'react';
import { Studio } from 'sanity';
import sanityConfig from '../../../sanity.config';

export function StudioPage() {
  return (
    <div
      style={{
        height: '100vh',
        width: '100vw',
        position: 'fixed',
        inset: 0,
        zIndex: 99999,
        background: '#101112',
      }}
    >
      <Studio config={sanityConfig} />
    </div>
  );
}

export default StudioPage;

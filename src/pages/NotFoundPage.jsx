import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export function NotFoundPage() {
  return (
    <div className="section" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
      <div className="container" style={{ textAlign: 'center', maxWidth: '600px' }}>
        <span className="font-serif" style={{ fontSize: 'clamp(5rem, 12vw, 9rem)', lineHeight: 1, color: 'var(--accent-strong)', display: 'block', marginBottom: '1rem' }}>
          404
        </span>
        <h1 className="font-serif" style={{ fontSize: 'var(--text-h2)', marginBottom: '1rem' }}>
          Page Not Found
        </h1>
        <p style={{ color: 'var(--muted)', fontSize: '1.05rem', marginBottom: '2.5rem' }}>
          The page you are looking for doesn’t exist or has moved. Let’s guide you back to familiar ground.
        </p>
        <Button to="/" variant="primary" size="lg">
          <ArrowLeft size={16} />
          <span>Return Home</span>
        </Button>
      </div>
    </div>
  );
}

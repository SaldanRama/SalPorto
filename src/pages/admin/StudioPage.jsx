import React from 'react';
import { Studio } from 'sanity';
import { Link } from 'react-router-dom';
import { ArrowLeft, ExternalLink, Sparkles } from 'lucide-react';
import sanityConfig from '../../../sanity.config';
import './StudioPage.css';

export function StudioPage() {
  return (
    <div style={{ minHeight: '100vh', width: '100vw', overflow: 'hidden', backgroundColor: '#111210' }}>
      {/* SalPorto CMS Topbar */}
      <header className="salporto-admin-topbar">
        <div className="salporto-admin-left">
          <Link to="/" className="salporto-back-btn" title="Kembali ke Beranda SalPorto">
            <ArrowLeft size={15} />
            <span>Website SalPorto</span>
          </Link>
          <div className="salporto-status-pill">
            <span className="salporto-status-dot" />
            <span>SalPorto Studio Live</span>
          </div>
        </div>

        <div className="salporto-admin-right">
          <a
            href="/experience"
            target="_blank"
            rel="noopener noreferrer"
            className="salporto-preview-link"
            title="Lihat halaman Timeline Pengalaman di tab baru"
          >
            <Sparkles size={14} />
            <span>Live Experience ↗</span>
          </a>
          <a
            href="/work"
            target="_blank"
            rel="noopener noreferrer"
            className="salporto-preview-link"
            title="Lihat halaman Proyek / Karya di tab baru"
          >
            <ExternalLink size={14} />
            <span>Live Work ↗</span>
          </a>
        </div>
      </header>

      {/* Embedded Sanity Studio Canvas */}
      <main className="salporto-studio-wrapper">
        <Studio config={sanityConfig} />
      </main>
    </div>
  );
}

export default StudioPage;

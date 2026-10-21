import React, { useState } from 'react';
import { Download, ArrowUpRight, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import './BiographyBento.css';

export function BiographyBento() {
  const [downloaded, setDownloaded] = useState(false);

  const handleDownloadCV = () => {
    setDownloaded(true);
    const link = document.createElement('a');
    link.href = '/resume/CV-SaldanRama.pdf';
    link.download = 'CV_Saldan_Rama.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => setDownloaded(false), 3000);
  };

  return (
    <div className="editorial-resume-stage" data-reveal="fade-up">
      {/* TOP ROW: [PHOTO] [NAME + BIO + BUTTONS] [EXPERIENCE] [EDUCATION] */}
      <div className="resume-top-grid">
        {/* COLUMN 1: PHOTO */}
        <div className="resume-col-photo">
          <div className="resume-photo-card">
            <img
              src="/images/sal.png"
              alt="Saldan Rama"
              className="resume-photo-img"
              onError={(e) => {
                e.currentTarget.src = '/images/portrait.png';
              }}
            />
          </div>
          <div className="resume-brand-tag">
            <div className="brand-mark-box">
              <span>SR</span>
            </div>
            <div className="brand-text-block">
              <span className="brand-name">saldan rama</span>
              <span className="brand-sub">Based in Makassar</span>
            </div>
          </div>
        </div>

        {/* COLUMN 2: NAME + BIO NARRATIVE + HORIZONTAL ACTION BUTTONS */}
        <div className="resume-col-bio">
          <div className="resume-name-block">
            <span className="resume-name-saldan">Saldan</span>
            <span className="resume-name-rama"> Rama</span>
          </div>

          <p className="resume-bio-paragraph">
            A graduate of Information Systems at Hasanuddin University, focusing on Graphic Design and UI/UX Design,
            with supporting skills in Front-End Development. Passionate about creating creative, functional, and
            user-centered visual designs and digital products.
          </p>

          <div className="resume-actions-horizontal">
            <Button
              variant="primary"
              size="md"
              onClick={handleDownloadCV}
              title="Download Curriculum Vitae"
            >
              {downloaded ? <CheckCircle2 size={16} /> : <Download size={16} />}
              <span>{downloaded ? 'CV Downloaded' : 'Download CV'}</span>
            </Button>
            <Button to="/contact" variant="secondary" size="md">
              <span>Contact me</span>
              <ArrowUpRight size={15} />
            </Button>
          </div>
        </div>

        {/* COLUMN 3: EXPERIENCE */}
        <div className="resume-col-experience">
          <div className="resume-section-eyebrow">
            <span>E X P E R I E N C E</span>
          </div>

          <div className="resume-track-items">
            <div className="track-card-row">
              <div className="track-logo-shield" title="BPJS KESEHATAN Makassar">
                <img src="/images/BpjsLogo.png" alt="BPJS Kesehatan" className="track-logo-img" />
              </div>
              <div className="track-details">
                <div className="track-title">BPJS KESEHATAN Makassar</div>
                <div className="track-desc">Pelayanan Fasilitas Kesehatan (YanFaskes) • Jan - Mei 2025</div>
              </div>
            </div>

            <div className="track-card-row">
              <div className="track-logo-shield" title="Diskominfo Makassar">
                <img
                  src="/images/Kominfo.png"
                  alt="Diskominfo Makassar"
                  className="track-logo-img"
                  onError={(e) => { e.currentTarget.src = '/images/KominfoLogo.png'; }}
                />
              </div>
              <div className="track-details">
                <div className="track-title">Diskominfo Makassar</div>
                <div className="track-desc">UI/UX Designer • Mei - Juni 2025</div>
              </div>
            </div>
          </div>
        </div>

        {/* COLUMN 4: EDUCATION */}
        <div className="resume-col-education">
          <div className="resume-section-eyebrow">
            <span>E D U C A T I O N</span>
          </div>

          <div className="resume-track-items">
            <div className="track-card-row">
              <div className="track-logo-shield" title="Universitas Hasanuddin">
                <img src="/images/UnhasLogo.png" alt="Universitas Hasanuddin" className="track-logo-img" />
              </div>
              <div className="track-details">
                <div className="track-title">Universitas Hasanuddin</div>
                <div className="track-desc">Information System - 3.78 • 2022 - 2026</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* BOTTOM ROW: CONTACT */}
      <div className="resume-bottom-row">
        <div className="resume-section-eyebrow" style={{ marginBottom: '1.25rem' }}>
          <span>C O N T A C T</span>
        </div>

        <div className="contact-items-grid">
          <div>
            <div className="contact-item-label">Email</div>
            <a href="mailto:saldanrama13@gmail.com" className="contact-item-val">
              saldanrama13@gmail.com
            </a>
          </div>

          <div>
            <div className="contact-item-label">Location</div>
            <span className="contact-item-val">Makassar, Indonesia</span>
          </div>

          <div>
            <div className="contact-item-label">LinkedIn</div>
            <a
              href="https://linkedin.com/in/saldanrama"
              target="_blank"
              rel="noopener noreferrer"
              className="contact-item-val"
            >
              linkedin.com/in/saldanrama
            </a>
          </div>

          <div>
            <div className="contact-item-label">GitHub</div>
            <a
              href="https://github.com/SaldanRama"
              target="_blank"
              rel="noopener noreferrer"
              className="contact-item-val"
            >
              github.com/SaldanRama
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

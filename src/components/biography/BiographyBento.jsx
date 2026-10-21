import React, { useState } from 'react';
import { Download, ArrowUpRight, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import './BiographyBento.css';

export function BiographyBento() {
  const [downloaded, setDownloaded] = useState(false);
  const [isRevealing, setIsRevealing] = useState(false);
  const photoRef = React.useRef(null);
  const baseRef = React.useRef(null);
  const spiderRef = React.useRef(null);

  const updateRevealSpot = (clientX, clientY) => {
    if (!photoRef.current || !spiderRef.current || !baseRef.current) return;
    const rect = photoRef.current.getBoundingClientRect();
    const x = Math.round(clientX - rect.left);
    const y = Math.round(clientY - rect.top);
    // Radius diperbesar 10% (71px)
    const r = 71;

    // Gambar 2 (Spider-Man) muncul di dalam radius kursor
    const spiderMask = `radial-gradient(circle ${r}px at ${x}px ${y}px, black 0%, black 50%, transparent 100%)`;
    spiderRef.current.style.maskImage = spiderMask;
    spiderRef.current.style.webkitMaskImage = spiderMask;

    // Gambar 1 (Foto awal) menghilang di dalam radius kursor digantikan gambar 2
    const baseMask = `radial-gradient(circle ${r}px at ${x}px ${y}px, transparent 0%, transparent 50%, black 100%)`;
    baseRef.current.style.maskImage = baseMask;
    baseRef.current.style.webkitMaskImage = baseMask;
  };

  const handleMouseMove = (e) => {
    updateRevealSpot(e.clientX, e.clientY);
  };

  const handleMouseEnter = (e) => {
    setIsRevealing(true);
    updateRevealSpot(e.clientX, e.clientY);
  };

  const handleMouseLeave = () => {
    setIsRevealing(false);
    if (baseRef.current) {
      baseRef.current.style.maskImage = '';
      baseRef.current.style.webkitMaskImage = '';
    }
  };

  const handleTouchMove = (e) => {
    if (e.touches && e.touches[0]) {
      updateRevealSpot(e.touches[0].clientX, e.touches[0].clientY);
    }
  };

  const handleTouchStart = (e) => {
    setIsRevealing(true);
    if (e.touches && e.touches[0]) {
      updateRevealSpot(e.touches[0].clientX, e.touches[0].clientY);
    }
  };

  const handleTouchEnd = () => {
    setIsRevealing(false);
  };

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
        {/* COLUMN 1: PHOTO (PURE CUTOUT WITH SPIDER-MAN HOVER SPOTLIGHT) */}
        <div className="resume-col-photo">
          <div
            ref={photoRef}
            className={`sal-photo-stage ${isRevealing ? 'is-revealing' : ''}`}
            onMouseEnter={handleMouseEnter}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            title="Hover cursor to reveal Spider-Man costume"
          >
            {/* Normal / Base Photo */}
            <img
              ref={baseRef}
              src="/images/sal.png"
              alt="Saldan Rama"
              className="sal-photo-layer sal-photo-base"
              onError={(e) => {
                e.currentTarget.src = '/images/portrait.png';
              }}
              draggable="false"
            />

            {/* Spider-Man reveal layer */}
            <img
              ref={spiderRef}
              src="/images/spiderman.png"
              alt="Saldan Rama Spider-Man"
              className="sal-photo-layer sal-photo-spiderman"
              draggable="false"
            />
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

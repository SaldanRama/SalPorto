import React, { useState } from 'react';
import { Download, ArrowUpRight, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import './BiographyBento.css';

// Realistic Mechanical Keyboard Switch Click Sound Synthesis (Web Audio API)
function playMechanicalClick(pitchModifier = 1) {
  try {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();

    // Primary tactile click
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(175 * pitchModifier, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(35, ctx.currentTime + 0.035);

    gain.gain.setValueAtTime(0.2, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.035);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.035);

    // Deep bottom-out thump
    const subOsc = ctx.createOscillator();
    const subGain = ctx.createGain();
    subOsc.type = 'sine';
    subOsc.frequency.setValueAtTime(90, ctx.currentTime + 0.005);
    subOsc.frequency.linearRampToValueAtTime(35, ctx.currentTime + 0.045);
    subGain.gain.setValueAtTime(0.14, ctx.currentTime + 0.005);
    subGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.045);

    subOsc.connect(subGain);
    subGain.connect(ctx.destination);
    subOsc.start(ctx.currentTime + 0.005);
    subOsc.stop(ctx.currentTime + 0.045);
  } catch (e) {
    // Audio context may be restricted before user gesture
  }
}

export function BiographyBento() {
  const [activeKey, setActiveKey] = useState(null);
  const [downloaded, setDownloaded] = useState(false);

  // Close-up mechanical keyboard keycaps layout matching reference
  const keyboardGrid = [
    // Row 1
    [
      { id: 'lego', type: 'brick', isLego: true, pitch: 1.25 },
      { id: 'ps', type: 'tool', label: 'Ps', icon: '/images/PhotoshopLogo.png', isDark: true, pitch: 1.0 },
      { id: 'k1', type: 'blank', isBlank: true, pitch: 1.05 },
      { id: 'k2', type: 'blank', isBlank: true, pitch: 1.1 },
    ],
    // Row 2
    [
      { id: 'accent-red', type: 'accent', label: 'Ai', isRed: true, pitch: 1.15 },
      { id: 'affinity', type: 'tool', label: 'Affinity', icon: '/images/AffinityLogo.png', isDark: true, pitch: 1.1 },
      { id: 'k3', type: 'blank', isBlank: true, pitch: 1.08 },
      { id: 'k4', type: 'blank', isBlank: true, pitch: 1.12 },
    ],
    // Row 3
    [
      { id: 'figma', type: 'tool', label: 'Figma', icon: '/images/FigmaLogo.png', isWhite: true, pitch: 1.2 },
      { id: 'vscode', type: 'tool', label: 'Code', icon: '/images/VSCODELogo.png', isDark: true, pitch: 1.05 },
      { id: 'k5', type: 'blank', isBlank: true, pitch: 1.06 },
      { id: 'k6', type: 'blank', isBlank: true, pitch: 1.14 },
    ],
    // Row 4
    [
      { id: 'canva', type: 'tool', label: 'Canva', icon: '/images/CanvaLogo.png', isDark: true, pitch: 1.02 },
      { id: 'capcut', type: 'tool', label: 'CapCut', icon: '/images/CapcutLogo.png', isDark: true, pitch: 1.18 },
      { id: 'k7', type: 'blank', isBlank: true, pitch: 1.04 },
      { id: 'k8', type: 'blank', isBlank: true, pitch: 1.1 },
    ],
  ];

  const handleKeyPress = (keyId, pitch = 1) => {
    setActiveKey(keyId);
    playMechanicalClick(pitch);
    setTimeout(() => {
      setActiveKey((current) => (current === keyId ? null : current));
    }, 110);
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
      {/* ====================================================================
          TOP ROW: 4 COLUMNS LAYOUT MATCHING REFERENCE
          [PHOTO] [BIO NARRATIVE] [EXPERIENCE] [EDUCATION]
          ==================================================================== */}
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
              <span className="brand-sub">Based on Makassar</span>
            </div>
          </div>
        </div>

        {/* COLUMN 2: BIO NARRATIVE & HORIZONTAL ACTION BUTTONS */}
        <div className="resume-col-bio">
          <p className="resume-bio-paragraph">
            A graduate of Information Systems at Hasanuddin University, focusing on Graphic Design and UI/UX Design, with supporting skills in Front-End Development. Passionate about creating creative, functional, and user-centered visual designs and digital products.
          </p>

          <p className="resume-bio-subparagraph">
            Specialized in digital products, design systems, and web architecture with an emphasis on clarity and user impact.
          </p>

          {/* Horizontal buttons side-by-side as requested */}
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

        {/* COLUMN 3: EXPERIENCE (INTERN) */}
        <div className="resume-col-experience">
          <div className="resume-section-eyebrow">
            <span>E X P E R I E N C E</span>
          </div>

          <div className="resume-track-items">
            {/* BPJS KESEHATAN Makassar */}
            <div className="track-card-row">
              <div className="track-logo-shield" title="BPJS KESEHATAN Makassar">
                <img
                  src="/images/BpjsLogo.png"
                  alt="BPJS Kesehatan"
                  className="track-logo-img"
                />
              </div>
              <div className="track-details">
                <div className="track-title">BPJS KESEHATAN Makassar</div>
                <div className="track-desc">Pelayanan Fasilitas Kesehatan (YanFaskes) • Jan - Mei 2025</div>
              </div>
            </div>

            {/* Diskominfo Makassar */}
            <div className="track-card-row">
              <div className="track-logo-shield" title="Diskominfo Makassar">
                <img
                  src="/images/Kominfo.png"
                  alt="Diskominfo Makassar"
                  className="track-logo-img"
                  onError={(e) => {
                    e.currentTarget.src = '/images/KominfoLogo.png';
                  }}
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
            {/* Universitas Hasanuddin */}
            <div className="track-card-row">
              <div className="track-logo-shield" title="Universitas Hasanuddin">
                <img
                  src="/images/UnhasLogo.png"
                  alt="Universitas Hasanuddin"
                  className="track-logo-img"
                />
              </div>
              <div className="track-details">
                <div className="track-title">Universitas Hasanuddin</div>
                <div className="track-desc">Information System - 3.78 • 2022 - 2026</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ====================================================================
          BOTTOM ROW: CONTACT DETAILS (LEFT) & CLOSE-UP 3D KEYBOARD (RIGHT CORNER)
          ==================================================================== */}
      <div className="resume-bottom-row">
        {/* Contact Strip */}
        <div className="resume-contact-block">
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
                href="https://linkedin.com"
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

        {/* ====================================================================
            CLOSE-UP 3D MECHANICAL KEYBOARD (MATCHING REFERENCE ANGLE & PROPORTION)
            ==================================================================== */}
        <div className="corner-keyboard-container">
          {/* Angled curved label running diagonally along the top bezel of the keyboard */}
          <div className="keyboard-tilted-banner" aria-hidden="true">
            <span>S O F T W A R E &nbsp; P R O F I C I E N C Y</span>
          </div>

          <div
            className="mechanical-corner-keyboard"
            title="Interactive 3D mechanical keyboard - click any keycap"
            role="region"
            aria-label="Interactive 3D Mechanical Keyboard"
          >
            {keyboardGrid.map((row, rIdx) => (
              <div key={`kb-row-${rIdx}`} className="kb-corner-row">
                {row.map((k) => (
                  <button
                    key={k.id}
                    type="button"
                    className={`corner-keycap ${k.isRed ? 'cap-red-accent' : ''} ${
                      k.isWhite ? 'cap-white-accent' : ''
                    } ${k.isLego ? 'cap-lego-brick' : ''} ${
                      activeKey === k.id ? 'is-cap-pressed' : ''
                    }`}
                    onClick={() => handleKeyPress(k.id, k.pitch)}
                    aria-label={k.label || k.id}
                  >
                    <div className="corner-keycap-surface">
                      {k.isLego ? (
                        <div className="lego-studs-grid" aria-hidden="true">
                          <span className="lego-stud" />
                          <span className="lego-stud" />
                          <span className="lego-stud" />
                          <span className="lego-stud" />
                        </div>
                      ) : k.icon ? (
                        <img src={k.icon} alt={k.label} className="corner-keycap-logo" />
                      ) : (
                        <span className="corner-keycap-text">{k.label}</span>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

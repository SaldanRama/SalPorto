import React, { useState } from 'react';
import { Download, MapPin, Sparkles, CheckCircle2 } from 'lucide-react';
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
    osc.frequency.setValueAtTime(160 * pitchModifier, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(30, ctx.currentTime + 0.035);

    gain.gain.setValueAtTime(0.18, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.035);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.035);

    // Subtle bottom-out thump
    const subOsc = ctx.createOscillator();
    const subGain = ctx.createGain();
    subOsc.type = 'sine';
    subOsc.frequency.setValueAtTime(80, ctx.currentTime + 0.005);
    subOsc.frequency.linearRampToValueAtTime(35, ctx.currentTime + 0.045);
    subGain.gain.setValueAtTime(0.12, ctx.currentTime + 0.005);
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

  // Keycap data featuring Saldan's real tools
  const keycaps = [
    { id: 'figma', label: 'Figma', icon: '/images/FigmaLogo.png', pitch: 1.1 },
    { id: 'photoshop', label: 'Ps', icon: '/images/PhotoshopLogo.png', pitch: 1.0 },
    { id: 'affinity', label: 'Affinity', icon: '/images/AffinityLogo.png', pitch: 1.15 },
    { id: 'vscode', label: 'VS Code', icon: '/images/VSCODELogo.png', pitch: 0.95 },
    { id: 'canva', label: 'Canva', icon: '/images/CanvaLogo.png', pitch: 1.05 },
    { id: 'capcut', label: 'CapCut', icon: '/images/CapcutLogo.png', pitch: 1.2 },
    { id: 'esc', label: 'ESC', isAccent: true, pitch: 1.3 },
    { id: 'design', label: 'UI/UX', pitch: 0.9 },
    { id: 'code', label: 'DEV', pitch: 1.05 },
  ];

  const handleKeyPress = (keyId, pitch) => {
    setActiveKey(keyId);
    playMechanicalClick(pitch);
    setTimeout(() => {
      setActiveKey((current) => (current === keyId ? null : current));
    }, 120);
  };

  const handleDownloadCV = () => {
    setDownloaded(true);
    // Provide user feedback & trigger download or sample CV
    const link = document.createElement('a');
    link.href = '/resume/CV-SaldanRama.pdf';
    link.download = 'CV_Saldan_Rama.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => setDownloaded(false), 3000);
  };

  return (
    <div className="biography-bento-card" data-reveal="fade-up">
      <div className="bento-main-grid">
        {/* COLUMN 1: PHOTO & BIOGRAPHY */}
        <div className="bento-profile-col">
          <div className="bento-profile-header">
            {/* User Photo sal.png */}
            <div className="bento-photo-wrap">
              <img
                src="/images/sal.png"
                alt="Saldan Rama"
                className="bento-photo-img"
                onError={(e) => {
                  e.currentTarget.src = '/images/portrait.png';
                }}
              />
            </div>

            {/* Name & Title */}
            <div className="bento-name-block">
              <div className="bento-location-tag">
                <MapPin size={13} color="var(--accent-strong)" />
                <span>Based in Makassar, ID</span>
              </div>
              <h2 className="bento-name-title">
                Saldan <span className="name-italic">Rama</span>
              </h2>
            </div>
          </div>

          {/* Factual Biography Paragraph */}
          <p className="bento-bio-text">
            A graduate of Information Systems at Hasanuddin University, focusing on Graphic Design and UI/UX Design, with supporting skills in Front-End Development. Passionate about creating creative, functional, and user-centered visual designs and digital products.
          </p>

          {/* Download CV Action */}
          <div className="bento-cv-actions">
            <Button
              variant="primary"
              size="md"
              onClick={handleDownloadCV}
              title="Download formal Curriculum Vitae"
            >
              {downloaded ? <CheckCircle2 size={16} /> : <Download size={16} />}
              <span>{downloaded ? 'CV Downloaded' : 'Download CV'}</span>
            </Button>
            <Button to="/contact" variant="secondary" size="md">
              <span>Get in touch</span>
            </Button>
          </div>
        </div>

        {/* COLUMN 2: EXPERIENCE & EDUCATION */}
        <div className="bento-track-col">
          {/* Experience Intern */}
          <div>
            <div className="bento-section-header">
              <span>E X P E R I E N C E</span>
            </div>
            <div className="bento-track-list">
              {/* BPJS Kesehatan Makassar */}
              <div className="bento-track-item">
                <div className="org-logo-badge" title="BPJS Kesehatan Makassar">
                  <img
                    src="/images/BpjsLogo.png"
                    alt="BPJS Kesehatan"
                    className="org-logo-img"
                  />
                </div>
                <div className="org-info">
                  <div className="org-name">BPJS KESEHATAN Makassar</div>
                  <div className="org-role-meta">Pelayanan Fasilitas Kesehatan (YanFaskes)</div>
                  <div className="org-role-meta" style={{ color: 'var(--muted)', fontSize: '0.75rem' }}>
                    Jan – Mei 2025
                  </div>
                </div>
              </div>

              {/* Diskominfo Makassar */}
              <div className="bento-track-item">
                <div className="org-logo-badge" title="Diskominfo Makassar">
                  <img
                    src="/images/Kominfo.png"
                    alt="Diskominfo Makassar"
                    className="org-logo-img"
                    onError={(e) => {
                      e.currentTarget.src = '/images/KominfoLogo.png';
                    }}
                  />
                </div>
                <div className="org-info">
                  <div className="org-name">Diskominfo Makassar</div>
                  <div className="org-role-meta">UI/UX Designer</div>
                  <div className="org-role-meta" style={{ color: 'var(--muted)', fontSize: '0.75rem' }}>
                    Mei – Juni 2025
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Education */}
          <div style={{ borderTop: '1px solid var(--line)', paddingTop: '1.5rem' }}>
            <div className="bento-section-header">
              <span>E D U C A T I O N</span>
            </div>
            <div className="bento-track-list">
              {/* Universitas Hasanuddin */}
              <div className="bento-track-item">
                <div className="org-logo-badge" title="Universitas Hasanuddin">
                  <img
                    src="/images/UnhasLogo.png"
                    alt="Universitas Hasanuddin"
                    className="org-logo-img"
                  />
                </div>
                <div className="org-info">
                  <div className="org-name">Universitas Hasanuddin</div>
                  <div className="org-role-meta">Program Studi Sistem Informasi</div>
                  <span className="org-badge-highlight">IPK 3.78</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* COLUMN 3: SOFTWARE PROFICIENCY - 3D INTERACTIVE MECHANICAL KEYBOARD */}
        <div className="bento-keyboard-col">
          <div className="bento-section-header">
            <span>S O F T W A R E &nbsp; P R O F I C I E N C Y</span>
          </div>

          <div className="keyboard-stage-wrap">
            <div
              className="mechanical-keyboard-base"
              title="Click keys to feel mechanical switches"
              role="region"
              aria-label="Interactive 3D Mechanical Keyboard with Tool Keycaps"
            >
              <div className="keyboard-keys-grid">
                {keycaps.map((k) => (
                  <button
                    key={k.id}
                    type="button"
                    className={`keyboard-keycap ${k.isAccent ? 'key-accent-red' : ''} ${
                      activeKey === k.id ? 'is-pressed' : ''
                    }`}
                    onClick={() => handleKeyPress(k.id, k.pitch)}
                    aria-label={`Key ${k.label}`}
                  >
                    <div className="keycap-body">
                      {k.icon ? (
                        <img src={k.icon} alt={k.label} className="keycap-logo-img" />
                      ) : (
                        <span style={{ fontWeight: 800, fontSize: '0.75rem' }}>{k.label}</span>
                      )}
                      <span className="keycap-label">{k.label}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="keyboard-interaction-hint">
              <span className="pulse-dot" aria-hidden="true" />
              <span>Interactive 3D Mechanical Keyboard • Click switches</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

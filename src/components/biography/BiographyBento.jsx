import React, { useState } from 'react';
import { Download, MapPin, CheckCircle2, ArrowUpRight } from 'lucide-react';
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
    osc.frequency.setValueAtTime(170 * pitchModifier, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(32, ctx.currentTime + 0.035);

    gain.gain.setValueAtTime(0.18, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.035);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.035);

    // Bottom-out thump
    const subOsc = ctx.createOscillator();
    const subGain = ctx.createGain();
    subOsc.type = 'sine';
    subOsc.frequency.setValueAtTime(85, ctx.currentTime + 0.005);
    subOsc.frequency.linearRampToValueAtTime(35, ctx.currentTime + 0.045);
    subGain.gain.setValueAtTime(0.12, ctx.currentTime + 0.005);
    subGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.045);

    subOsc.connect(subGain);
    subGain.connect(ctx.destination);
    subOsc.start(ctx.currentTime + 0.005);
    subOsc.stop(ctx.currentTime + 0.045);
  } catch (e) {
    // Audio context may be restricted before user interaction
  }
}

export function BiographyBento() {
  const [activeKey, setActiveKey] = useState(null);
  const [downloaded, setDownloaded] = useState(false);

  // Standard 60% keyboard layout rows with custom tool keycaps
  const keyboardRows = [
    // Row 1
    [
      { id: 'esc', label: 'ESC', isAccent: true, pitch: 1.3 },
      { id: '1', label: '1', pitch: 1.0 },
      { id: '2', label: '2', pitch: 1.02 },
      { id: '3', label: '3', pitch: 1.04 },
      { id: '4', label: '4', pitch: 1.06 },
      { id: '5', label: '5', pitch: 1.08 },
      { id: '6', label: '6', pitch: 1.1 },
      { id: '7', label: '7', pitch: 1.12 },
      { id: '8', label: '8', pitch: 1.14 },
      { id: '9', label: '9', pitch: 1.16 },
      { id: '0', label: '0', pitch: 1.18 },
      { id: 'backspace', label: '⌫', width: 'wide-sm', pitch: 0.9 },
    ],
    // Row 2
    [
      { id: 'tab', label: 'TAB', width: 'wide-sm', pitch: 0.95 },
      { id: 'q', label: 'Q', pitch: 1.02 },
      { id: 'w', label: 'W', pitch: 1.04 },
      { id: 'e', label: 'E', pitch: 1.06 },
      { id: 'r', label: 'R', pitch: 1.08 },
      { id: 't', label: 'T', pitch: 1.1 },
      { id: 'y', label: 'Y', pitch: 1.12 },
      { id: 'u', label: 'U', pitch: 1.14 },
      { id: 'i', label: 'I', pitch: 1.16 },
      { id: 'o', label: 'O', pitch: 1.18 },
      { id: 'p', label: 'P', pitch: 1.2 },
      { id: 'figma', label: 'Figma', icon: '/images/FigmaLogo.png', isTool: true, pitch: 1.25 },
    ],
    // Row 3
    [
      { id: 'caps', label: 'CAPS', width: 'wide-md', pitch: 0.9 },
      { id: 'a', label: 'A', pitch: 1.0 },
      { id: 's', label: 'S', pitch: 1.02 },
      { id: 'd', label: 'D', pitch: 1.04 },
      { id: 'f', label: 'F', pitch: 1.06 },
      { id: 'g', label: 'G', pitch: 1.08 },
      { id: 'h', label: 'H', pitch: 1.1 },
      { id: 'j', label: 'J', pitch: 1.12 },
      { id: 'k', label: 'K', pitch: 1.14 },
      { id: 'l', label: 'L', pitch: 1.16 },
      { id: 'ps', label: 'Ps', icon: '/images/PhotoshopLogo.png', isTool: true, pitch: 1.22 },
      { id: 'enter', label: 'ENTER', width: 'wide-md', pitch: 0.85 },
    ],
    // Row 4
    [
      { id: 'shift-l', label: 'SHIFT', width: 'wide-lg', pitch: 0.88 },
      { id: 'z', label: 'Z', pitch: 1.0 },
      { id: 'x', label: 'X', pitch: 1.02 },
      { id: 'c', label: 'C', pitch: 1.04 },
      { id: 'v', label: 'V', pitch: 1.06 },
      { id: 'b', label: 'B', pitch: 1.08 },
      { id: 'n', label: 'N', pitch: 1.1 },
      { id: 'm', label: 'M', pitch: 1.12 },
      { id: 'affinity', label: 'Affinity', icon: '/images/AffinityLogo.png', isTool: true, pitch: 1.2 },
      { id: 'vscode', label: 'VS Code', icon: '/images/VSCODELogo.png', isTool: true, pitch: 1.15 },
      { id: 'shift-r', label: 'SHIFT', width: 'wide-md', pitch: 0.88 },
    ],
    // Row 5
    [
      { id: 'ctrl-l', label: 'CTRL', width: 'wide-sm', pitch: 0.9 },
      { id: 'win', label: 'WIN', pitch: 0.95 },
      { id: 'alt-l', label: 'ALT', pitch: 0.98 },
      { id: 'space', label: '', width: 'spacebar', pitch: 0.8 },
      { id: 'canva', label: 'Canva', icon: '/images/CanvaLogo.png', isTool: true, pitch: 1.1 },
      { id: 'capcut', label: 'CapCut', icon: '/images/CapcutLogo.png', isTool: true, pitch: 1.18 },
      { id: 'ctrl-r', label: 'CTRL', width: 'wide-sm', pitch: 0.9 },
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
    <div className="biography-bento-card" data-reveal="fade-up">
      <div className="bento-layout-wrapper">
        {/* ====================================================================
            LEFT REGION: PHOTO + BIO CONTENT (Side-by-side as in reference)
            ==================================================================== */}
        <div className="bento-left-cluster">
          {/* Photo column */}
          <div className="bento-photo-column">
            <div className="bento-main-photo-wrap">
              <img
                src="/images/sal.png"
                alt="Saldan Rama"
                className="bento-main-photo-img"
                onError={(e) => {
                  e.currentTarget.src = '/images/portrait.png';
                }}
              />
            </div>
            <div className="bento-photo-caption">
              <span className="caption-bold">Saldan Rama</span>
              <span className="caption-meta">Based on Makassar</span>
            </div>
          </div>

          {/* Name & Bio paragraph column */}
          <div className="bento-bio-column">
            <h2 className="bento-hero-name">
              Saldan <span className="name-italic">Rama</span>
            </h2>

            <p className="bento-narrative-p">
              A graduate of Information Systems at Hasanuddin University, focusing on Graphic Design and UI/UX Design, with supporting skills in Front-End Development. Passionate about creating creative, functional, and user-centered visual designs and digital products.
            </p>

            <div className="bento-actions-row">
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
                <span>Contact me</span>
                <ArrowUpRight size={15} />
              </Button>
            </div>
          </div>
        </div>

        {/* ====================================================================
            MIDDLE REGION: EXPERIENCE & EDUCATION
            ==================================================================== */}
        <div className="bento-center-cluster">
          {/* Experience Intern */}
          <div className="bento-track-group">
            <div className="bento-group-heading">
              <span>E X P E R I E N C E</span>
            </div>
            <div className="bento-entries-list">
              {/* BPJS KESEHATAN Makassar */}
              <div className="bento-entry-item">
                <div className="org-logo-shield" title="BPJS KESEHATAN Makassar">
                  <img
                    src="/images/BpjsLogo.png"
                    alt="BPJS Kesehatan"
                    className="org-logo-graphic"
                  />
                </div>
                <div className="org-entry-meta">
                  <div className="org-title-text">BPJS KESEHATAN Makassar</div>
                  <div className="org-role-text">Pelayanan Fasilitas Kesehatan (YanFaskes) • Jan - Mei 2025</div>
                </div>
              </div>

              {/* Diskominfo Makassar */}
              <div className="bento-entry-item">
                <div className="org-logo-shield" title="Diskominfo Makassar">
                  <img
                    src="/images/Kominfo.png"
                    alt="Diskominfo Makassar"
                    className="org-logo-graphic"
                    onError={(e) => {
                      e.currentTarget.src = '/images/KominfoLogo.png';
                    }}
                  />
                </div>
                <div className="org-entry-meta">
                  <div className="org-title-text">Diskominfo Makassar</div>
                  <div className="org-role-text">UI/UX Designer • Mei - Juni 2025</div>
                </div>
              </div>
            </div>
          </div>

          {/* Education */}
          <div className="bento-track-group" style={{ borderTop: '1px solid var(--line)', paddingTop: '1.75rem' }}>
            <div className="bento-group-heading">
              <span>E D U C A T I O N</span>
            </div>
            <div className="bento-entries-list">
              {/* Universitas Hasanuddin */}
              <div className="bento-entry-item">
                <div className="org-logo-shield" title="Universitas Hasanuddin">
                  <img
                    src="/images/UnhasLogo.png"
                    alt="Universitas Hasanuddin"
                    className="org-logo-graphic"
                  />
                </div>
                <div className="org-entry-meta">
                  <div className="org-title-text">Universitas Hasanuddin</div>
                  <div className="org-role-text">Information System - 3.78 • 2022 - 2026</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ====================================================================
            RIGHT REGION: SOFTWARE PROFICIENCY - 3D STANDARD MECHANICAL KEYBOARD
            ==================================================================== */}
        <div className="bento-right-cluster">
          <div className="bento-group-heading" style={{ justifyContent: 'center' }}>
            <span>S O F T W A R E &nbsp; P R O F I C I E N C Y</span>
          </div>

          <div className="standard-keyboard-viewport">
            <div
              className="standard-keyboard-case"
              title="Click any key on the mechanical keyboard"
              role="region"
              aria-label="Standard Mechanical Keyboard with Tool Keycaps"
            >
              {keyboardRows.map((row, rIdx) => (
                <div key={`row-${rIdx}`} className="keyboard-row">
                  {row.map((k) => (
                    <button
                      key={k.id}
                      type="button"
                      className={`std-keycap ${k.width ? `key-${k.width}` : ''} ${
                        k.isAccent ? 'key-esc-red' : ''
                      } ${k.isTool ? 'key-tool-accent' : ''} ${
                        activeKey === k.id ? 'is-active-pressed' : ''
                      }`}
                      onClick={() => handleKeyPress(k.id, k.pitch)}
                      aria-label={k.label || k.id}
                    >
                      <div className="std-keycap-surface">
                        {k.icon ? (
                          <img src={k.icon} alt={k.label} className="std-keycap-icon" />
                        ) : (
                          <span className="std-keycap-legend">{k.label}</span>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              ))}
            </div>

            <div className="keyboard-tactile-note">
              <span className="live-dot" aria-hidden="true" />
              <span>Full 60% Mechanical Keyboard • Interactive audio switches</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

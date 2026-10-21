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
  } catch (e) {}
}

export function BiographyBento() {
  const [activeKey, setActiveKey] = useState(null);
  const [downloaded, setDownloaded] = useState(false);

  // Full mechanical keyboard layout — TKL style (tenkeyless)
  // Each key: { id, label, sub?, width?, variant?, icon?, pitch }
  const keyboardRows = [
    // Row 0: Function keys (Esc + F1–F12)
    [
      { id: 'esc',  label: 'Esc',  width: 1,    pitch: 1.3 },
      { id: 'f1',   label: 'F1',   width: 1,    pitch: 1.1 },
      { id: 'f2',   label: 'F2',   width: 1,    pitch: 1.15 },
      { id: 'f3',   label: 'F3',   width: 1,    pitch: 1.05 },
      { id: 'f4',   label: 'F4',   width: 1,    pitch: 1.2 },
      { id: 'f5',   label: 'F5',   width: 1,    pitch: 0.95 },
      { id: 'f6',   label: 'F6',   width: 1,    pitch: 1.0 },
      { id: 'f7',   label: 'F7',   width: 1,    pitch: 1.1 },
      { id: 'f8',   label: 'F8',   width: 1,    pitch: 0.9 },
      { id: 'f9',   label: 'F9',   width: 1,    pitch: 1.05 },
      { id: 'f10',  label: 'F10',  width: 1,    pitch: 1.15 },
      { id: 'f11',  label: 'F11',  width: 1,    pitch: 1.2 },
      { id: 'f12',  label: 'F12',  width: 1,    pitch: 1.08 },
    ],
    // Row 1: Number row
    [
      { id: 'tilde', label: '`',  sub: '~', width: 1,    pitch: 1.0 },
      { id: 'n1',   label: '1',  sub: '!', width: 1,    pitch: 1.05 },
      { id: 'n2',   label: '2',  sub: '@', width: 1,    pitch: 1.1 },
      { id: 'n3',   label: '3',  sub: '#', width: 1,    pitch: 0.95 },
      { id: 'n4',   label: '4',  sub: '$', width: 1,    pitch: 1.2 },
      { id: 'n5',   label: '5',  sub: '%', width: 1,    pitch: 1.15 },
      { id: 'n6',   label: '6',  sub: '^', width: 1,    pitch: 1.0 },
      { id: 'n7',   label: '7',  sub: '&', width: 1,    pitch: 1.05 },
      // TOOL KEYS replacing numbers — with logos
      { id: 'ps',   label: 'Ps', icon: '/images/PhotoshopLogo.png', variant: 'tool-dark', width: 1, pitch: 1.1 },
      { id: 'ai',   label: 'Ai', icon: '/images/AffinityLogo.png',  variant: 'tool-dark', width: 1, pitch: 1.05 },
      { id: 'n0',   label: '0',  sub: ')', width: 1,    pitch: 1.0 },
      { id: 'minus',label: '-',  sub: '_', width: 1,    pitch: 0.9 },
      { id: 'eq',   label: '=',  sub: '+', width: 1,    pitch: 1.1 },
      { id: 'bksp', label: '⌫',           width: 1.5,  pitch: 0.85, variant: 'key-wide' },
    ],
    // Row 2: QWERTY
    [
      { id: 'tab',  label: 'Tab', width: 1.5, pitch: 1.0, variant: 'key-wide' },
      { id: 'q',    label: 'Q',   width: 1,   pitch: 1.1 },
      { id: 'w',    label: 'W',   width: 1,   pitch: 1.05 },
      { id: 'e',    label: 'E',   width: 1,   pitch: 1.0 },
      { id: 'r',    label: 'R',   width: 1,   pitch: 1.15 },
      { id: 't',    label: 'T',   width: 1,   pitch: 1.2 },
      { id: 'y',    label: 'Y',   width: 1,   pitch: 0.95 },
      { id: 'u',    label: 'U',   width: 1,   pitch: 1.1 },
      // TOOL KEY — Figma
      { id: 'fig',  label: 'Fg', icon: '/images/FigmaLogo.png', variant: 'tool-white', width: 1, pitch: 1.05 },
      // TOOL KEY — VS Code
      { id: 'vsc',  label: 'VS', icon: '/images/VSCODELogo.png', variant: 'tool-dark', width: 1, pitch: 1.1 },
      { id: 'p',    label: 'P',   width: 1,   pitch: 1.0 },
      { id: 'lbr',  label: '[',  sub: '{', width: 1, pitch: 0.95 },
      { id: 'rbr',  label: ']',  sub: '}', width: 1, pitch: 1.05 },
      { id: 'bksl', label: '\\', sub: '|', width: 1.5, pitch: 0.9, variant: 'key-wide' },
    ],
    // Row 3: Home row
    [
      { id: 'caps',  label: 'Caps', width: 1.75, pitch: 1.0, variant: 'key-wide key-red' },
      { id: 'a',     label: 'A',    width: 1,    pitch: 1.1 },
      { id: 's',     label: 'S',    width: 1,    pitch: 1.05 },
      { id: 'd',     label: 'D',    width: 1,    pitch: 1.0 },
      { id: 'f',     label: 'F',    width: 1,    pitch: 1.15 },
      { id: 'g',     label: 'G',    width: 1,    pitch: 1.2 },
      { id: 'h',     label: 'H',    width: 1,    pitch: 0.95 },
      // TOOL KEY — Canva
      { id: 'can',   label: 'Cv', icon: '/images/CanvaLogo.png', variant: 'tool-dark', width: 1, pitch: 1.1 },
      // TOOL KEY — CapCut
      { id: 'cap',   label: 'Cp', icon: '/images/CapcutLogo.png', variant: 'tool-dark', width: 1, pitch: 1.05 },
      { id: 'k',     label: 'K',    width: 1,    pitch: 1.0 },
      { id: 'l',     label: 'L',    width: 1,    pitch: 0.95 },
      { id: 'semi',  label: ';',   sub: ':', width: 1, pitch: 1.1 },
      { id: 'apos',  label: "'",   sub: '"', width: 1, pitch: 1.05 },
      { id: 'enter', label: 'Enter', width: 1.75, pitch: 0.85, variant: 'key-wide key-enter' },
    ],
    // Row 4: Shift row
    [
      { id: 'lshift', label: 'Shift', width: 2.25, pitch: 1.0, variant: 'key-wide' },
      { id: 'z',     label: 'Z',    width: 1,    pitch: 1.1 },
      { id: 'x',     label: 'X',    width: 1,    pitch: 1.05 },
      { id: 'c',     label: 'C',    width: 1,    pitch: 1.0 },
      { id: 'v',     label: 'V',    width: 1,    pitch: 1.15 },
      { id: 'b',     label: 'B',    width: 1,    pitch: 1.2 },
      { id: 'n',     label: 'N',    width: 1,    pitch: 0.95 },
      { id: 'm',     label: 'M',    width: 1,    pitch: 1.1 },
      { id: 'comma', label: ',',   sub: '<', width: 1, pitch: 1.0 },
      { id: 'dot',   label: '.',   sub: '>', width: 1, pitch: 0.9 },
      { id: 'slash', label: '/',   sub: '?', width: 1, pitch: 1.05 },
      { id: 'rshift', label: 'Shift', width: 1.75, pitch: 1.0, variant: 'key-wide' },
    ],
    // Row 5: Bottom row
    [
      { id: 'lctrl', label: 'Ctrl', width: 1.25, pitch: 1.0, variant: 'key-wide' },
      { id: 'lalt',  label: 'Alt',  width: 1,    pitch: 1.1 },
      { id: 'lwin',  label: '⊞',   width: 1,    pitch: 1.05 },
      { id: 'space', label: '',     width: 5.5,  pitch: 0.9, variant: 'key-space' },
      { id: 'rwin',  label: '⊞',   width: 1,    pitch: 1.05 },
      { id: 'ralt',  label: 'Alt',  width: 1,    pitch: 1.1 },
      { id: 'rfn',   label: 'Fn',   width: 1,    pitch: 1.15 },
      { id: 'rctrl', label: 'Ctrl', width: 1.25, pitch: 1.0, variant: 'key-wide' },
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
          TOP ROW: 4 COLUMNS LAYOUT
          [PHOTO] [NAME + BIO + BUTTONS] [EXPERIENCE] [EDUCATION]
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
            A graduate of Information Systems at Hasanuddin University, focusing on Graphic Design and UI/UX Design, with supporting skills in Front-End Development. Passionate about creating creative, functional, and user-centered visual designs and digital products.
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
          BOTTOM ROW: CONTACT DETAILS (LEFT) + FULL TKL MECHANICAL KEYBOARD (RIGHT)
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

        {/* ====================================================================
            FULL TKL MECHANICAL KEYBOARD — CLOSE-UP ANGLED VIEW
            ==================================================================== */}
        <div className="corner-keyboard-container">
          <div className="keyboard-label-banner" aria-hidden="true">
            <span>S O F T W A R E &nbsp; P R O F I C I E N C Y</span>
          </div>

          <div
            className="mechanical-keyboard-shell"
            title="Interactive mechanical keyboard — click any keycap"
            role="region"
            aria-label="Interactive Mechanical Keyboard"
          >
            {/* Keyboard top bezel with brand mark */}
            <div className="keyboard-bezel-top" aria-hidden="true">
              <span className="keyboard-brand-mark">SR•DEV</span>
              <div className="keyboard-status-leds">
                <span className="led led-on" />
                <span className="led" />
                <span className="led led-on" />
              </div>
            </div>

            {/* Key rows */}
            <div className="keyboard-keys-area">
              {keyboardRows.map((row, rIdx) => (
                <div key={`row-${rIdx}`} className={`kb-row kb-row-${rIdx}`}>
                  {row.map((k) => (
                    <button
                      key={k.id}
                      type="button"
                      className={[
                        'keycap',
                        k.variant || '',
                        activeKey === k.id ? 'is-pressed' : '',
                      ].join(' ')}
                      style={k.width && k.width !== 1 ? { '--key-width': k.width } : undefined}
                      onClick={() => handleKeyPress(k.id, k.pitch)}
                      aria-label={k.label || k.id}
                    >
                      <div className="keycap-top">
                        {k.icon ? (
                          <img src={k.icon} alt={k.label} className="keycap-tool-icon" />
                        ) : (
                          <>
                            {k.sub && <span className="keycap-sub">{k.sub}</span>}
                            <span className="keycap-label">{k.label}</span>
                          </>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              ))}
            </div>

            {/* Bottom bezel with feet indicators */}
            <div className="keyboard-bezel-bottom" aria-hidden="true">
              <div className="keyboard-foot-left" />
              <div className="keyboard-foot-right" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

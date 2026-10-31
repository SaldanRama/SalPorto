import React, { useState } from 'react';
import { Download, ArrowUpRight, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import './BiographyBento.css';

// Synthesized mechanical keyboard switch "clack / thock" sound
function playKeyClickSound() {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const now = ctx.currentTime;

    // Switch actuation click
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(360, now);
    osc.frequency.exponentialRampToValueAtTime(70, now + 0.035);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1400, now);

    gain.gain.setValueAtTime(0.35, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.045);

    // Bottom-out thock
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(140, now + 0.01);
    osc2.frequency.exponentialRampToValueAtTime(45, now + 0.055);

    gain2.gain.setValueAtTime(0.22, now + 0.01);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

    osc2.connect(gain2);
    gain2.connect(ctx.destination);

    osc2.start(now + 0.01);
    osc2.stop(now + 0.065);
  } catch {
    // Audio safe fallback
  }
}

const userTools = [
  {
    name: 'Figma',
    role: 'UI/UX Design',
    iconSrc: '/images/FigmaKeycaps.webp',
  },
  {
    name: 'Photoshop',
    role: 'Graphic & Retouch',
    iconSrc: '/images/PhotoshopKeycaps.webp',
  },
  {
    name: 'Affinity',
    role: 'Vector Systems',
    iconSrc: '/images/AffinityKeycaps.webp',
  },
  {
    name: 'Canva',
    role: 'Brand & Content',
    iconSrc: '/images/CanvaKeycaps.webp',
  },
  {
    name: 'CapCut',
    role: 'Motion & Video',
    iconSrc: '/images/CapcutKeycaps.webp',
  },
  {
    name: 'VS Code',
    role: 'Front-End Dev',
    iconSrc: '/images/VSCODEKeycaps.webp',
  },
  {
    name: 'Notion',
    role: 'Productivity & Notes',
    iconSrc: '/images/NotionKeycaps.webp',
  },
];

export function BiographyBento() {
  const [downloaded, setDownloaded] = useState(false);
  const [isRevealing, setIsRevealing] = useState(false);
  const [activeKey, setActiveKey] = useState(null);
  const photoRef = React.useRef(null);
  const baseRef = React.useRef(null);
  const spiderRef = React.useRef(null);

  // Staggered Text Reveal (on scroll & idle 3s loop) State & Refs
  const [animKey, setAnimKey] = useState(0);
  const nameBlockRef = React.useRef(null);
  const isInViewRef = React.useRef(false);
  const idleTimerRef = React.useRef(null);
  const lastScrollTriggerRef = React.useRef(0);

  const triggerReveal = React.useCallback(() => {
    setAnimKey((prev) => prev + 1);
  }, []);

  const scheduleNextIdle = React.useCallback(() => {
    if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    idleTimerRef.current = setTimeout(() => {
      if (isInViewRef.current) {
        triggerReveal();
        scheduleNextIdle();
      }
    }, 3000);
  }, [triggerReveal]);

  // 1. Intersection Observer: detect visibility in viewport
  React.useEffect(() => {
    const el = nameBlockRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        isInViewRef.current = entry.isIntersecting;
        if (entry.isIntersecting) {
          triggerReveal();
          scheduleNextIdle();
        } else {
          if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
        }
      },
      { threshold: 0.2 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [triggerReveal, scheduleNextIdle]);

  // 2. Scroll Listener: triggers immediately when scrolling, resets 3s idle counter
  React.useEffect(() => {
    const handleScroll = () => {
      if (!isInViewRef.current) return;

      const now = Date.now();
      // Trigger immediately when scrolling (throttled to 750ms during continuous scroll)
      if (now - lastScrollTriggerRef.current > 750) {
        lastScrollTriggerRef.current = now;
        triggerReveal();
      }

      // Reset the 3-second idle timer so it starts counting after scrolling ceases
      scheduleNextIdle();
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    };
  }, [triggerReveal, scheduleNextIdle]);

  const handleKeyClick = (name) => {
    playKeyClickSound();
    setActiveKey(name);
    setTimeout(() => {
      setActiveKey((curr) => (curr === name ? null : curr));
    }, 160);
  };

  const updateRevealSpot = (clientX, clientY) => {
    if (!photoRef.current || !spiderRef.current || !baseRef.current) return;
    const rect = photoRef.current.getBoundingClientRect();
    const x = Math.round(clientX - rect.left);
    const y = Math.round(clientY - rect.top);
    // Radius diperkecil (~52px)
    const r = 52;

    // Gambar 2 (Ultraman) muncul di dalam radius kursor
    const costumeMask = `radial-gradient(circle ${r}px at ${x}px ${y}px, black 0%, black 50%, transparent 100%)`;
    spiderRef.current.style.maskImage = costumeMask;
    spiderRef.current.style.webkitMaskImage = costumeMask;

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
            title="Hover cursor to reveal Ultraman costume"
          >
            {/* Normal / Base Photo */}
            <img
              ref={baseRef}
              src="/images/sal.webp"
              alt="Saldan Rama"
              className="sal-photo-layer sal-photo-base"
              fetchpriority="high"
              decoding="async"
              onError={(e) => {
                e.currentTarget.src = '/images/sal.png';
              }}
              draggable="false"
            />

            {/* Ultraman reveal layer */}
            <img
              ref={spiderRef}
              src="/images/salUltraman.webp"
              alt="Saldan Rama Ultraman"
              className="sal-photo-layer sal-photo-spiderman"
              decoding="async"
              onError={(e) => {
                e.currentTarget.src = '/images/salUltraman.png';
              }}
              draggable="false"
            />
          </div>
        </div>

        {/* COLUMN 2: NAME + BIO NARRATIVE + HORIZONTAL ACTION BUTTONS */}
        <div className="resume-col-bio">
          <div ref={nameBlockRef} className="resume-name-block" aria-label="Saldan Rama">
            <div key={animKey} className="stagger-split-container">
              <span className="resume-name-saldan split-word">
                {'Saldan'.split('').map((char, index) => (
                  <span key={`s-${index}`} className="split-char-mask">
                    <span
                      className="split-char"
                      style={{ animationDelay: `${index * 42}ms` }}
                    >
                      {char}
                    </span>
                  </span>
                ))}
              </span>
              <span className="split-space">&nbsp;</span>
              <span className="resume-name-rama split-word">
                {'Rama'.split('').map((char, index) => (
                  <span key={`r-${index}`} className="split-char-mask">
                    <span
                      className="split-char"
                      style={{ animationDelay: `${(6 + 1 + index) * 42}ms` }}
                    >
                      {char}
                    </span>
                  </span>
                ))}
              </span>
            </div>
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

      {/* TOOLS & SOFTWARE ROW (3D KEYCAPS ONLY, BORDERLESS & CLICKABLE) */}
      <div className="resume-tools-row">
        <div className="resume-section-eyebrow" style={{ marginBottom: '1.5rem' }}>
          <span>T O O L S  &  S O F T W A R E</span>
        </div>

        <div className="resume-keycaps-row">
          {userTools.map((tool) => {
            const isPressed = activeKey === tool.name;
            return (
              <button
                type="button"
                key={tool.name}
                className={`resume-keycap-btn ${isPressed ? 'is-pressed' : ''}`}
                onClick={() => handleKeyClick(tool.name)}
                title={`${tool.name} keycap • Click to press`}
                aria-label={`${tool.name} keycap`}
              >
                <img
                  src={tool.iconSrc}
                  alt={`${tool.name} Keycap`}
                  className="resume-keycap-img"
                  loading="lazy"
                  decoding="async"
                  onError={(e) => {
                    e.currentTarget.src = tool.iconSrc.replace('.webp', '.png');
                  }}
                  draggable="false"
                />
              </button>
            );
          })}
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

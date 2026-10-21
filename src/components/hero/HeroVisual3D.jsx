import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, User, Layers } from 'lucide-react';
import './HeroVisual3D.css';

export function HeroVisual3D() {
  const [imageError, setImageError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [rotationAngle, setRotationAngle] = useState(0);
  const animFrameRef = useRef(null);
  const lastTimeRef = useRef(performance.now());
  
  // Rotating font families for "Folio" changing every 1.5s
  const folioFonts = [
    { id: 'instrument', family: "'Instrument Serif', Georgia, serif" },
    { id: 'playfair', family: "'Playfair Display', serif" },
    { id: 'bodoni', family: "'Bodoni Moda', serif" },
    { id: 'cormorant', family: "'Cormorant Garamond', Georgia, serif" },
    { id: 'newsreader', family: "'Newsreader', serif" },
  ];
  const [folioFontIndex, setFolioFontIndex] = useState(0);
  const [fontFading, setFontFading] = useState(false);

  // Interval switching font every 0.8 seconds (800ms)
  useEffect(() => {
    const timer = setInterval(() => {
      setFontFading(true);
      setTimeout(() => {
        setFolioFontIndex((prev) => (prev + 1) % folioFonts.length);
        setFontFading(false);
      }, 120);
    }, 800);

    return () => clearInterval(timer);
  }, [folioFonts.length]);

  // Calmer, luxurious rotation speed
  const defaultSpeed = 0.0075;
  const hoverSpeed = 0.0016;
  const speedRef = useRef(defaultSpeed);

  // 6 tools configured from updated uniform user files in public/images/
  const tools = [
    {
      id: 'photoshop',
      name: 'Photoshop',
      role: 'Retouch & Edit',
      iconSrc: '/images/PhotoshopLogo.png',
      baseAngle: 0,
    },
    {
      id: 'affinity',
      name: 'Affinity',
      role: 'Vector Systems',
      iconSrc: '/images/AffinityLogo.png',
      baseAngle: (2 * Math.PI) / 6,
    },
    {
      id: 'canva',
      name: 'Canva',
      role: 'Brand Assets',
      iconSrc: '/images/CanvaLogo.png',
      baseAngle: (4 * Math.PI) / 6,
    },
    {
      id: 'capcut',
      name: 'CapCut',
      role: 'Motion & Reels',
      iconSrc: '/images/CapcutLogo.png',
      baseAngle: (6 * Math.PI) / 6,
    },
    {
      id: 'vscode',
      name: 'VS Code',
      role: 'Code & Web Dev',
      iconSrc: '/images/VSCODELogo.png',
      baseAngle: (8 * Math.PI) / 6,
    },
    {
      id: 'figma',
      name: 'Figma',
      role: 'UI/UX Prototypes',
      iconSrc: '/images/FigmaLogo.png',
      baseAngle: (10 * Math.PI) / 6,
    },
  ];

  // Animation loop with gentle deceleration on hover
  useEffect(() => {
    const animate = (currentTime) => {
      const delta = currentTime - lastTimeRef.current;
      lastTimeRef.current = currentTime;

      const targetSpeed = isHovered ? hoverSpeed : defaultSpeed;
      speedRef.current += (targetSpeed - speedRef.current) * 0.05;

      setRotationAngle((prev) => (prev + (speedRef.current * delta) / 16.66) % (2 * Math.PI));

      animFrameRef.current = requestAnimationFrame(animate);
    };

    animFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [isHovered]);

  // Tighter orbit radius so tools stay close together around the head
  const isDesktop = typeof window !== 'undefined' && window.innerWidth >= 768;
  const radiusX = isDesktop ? 240 : 160;
  const radiusY = isDesktop ? 52 : 36;
  const maxScale = 1.05;
  const minScale = 0.84;

  const currentFolioFont = folioFonts[folioFontIndex];

  const portraitStageRef = useRef(null);
  const spiderPortraitRef = useRef(null);
  const [isSpiderHover, setIsSpiderHover] = useState(false);

  const updateSpiderSpot = (clientX, clientY) => {
    if (!portraitStageRef.current || !spiderPortraitRef.current) return;
    const rect = portraitStageRef.current.getBoundingClientRect();
    const x = Math.round(clientX - rect.left);
    const y = Math.round(clientY - rect.top);
    // Radius spotlight untuk hero portrait (circle 80px)
    const mask = `radial-gradient(circle 80px at ${x}px ${y}px, black 0%, black 45%, transparent 100%)`;
    spiderPortraitRef.current.style.maskImage = mask;
    spiderPortraitRef.current.style.webkitMaskImage = mask;
  };

  const handlePortraitMouseMove = (e) => {
    updateSpiderSpot(e.clientX, e.clientY);
  };

  const handlePortraitMouseEnter = (e) => {
    setIsSpiderHover(true);
    updateSpiderSpot(e.clientX, e.clientY);
  };

  const handlePortraitMouseLeave = () => {
    setIsSpiderHover(false);
  };

  const handlePortraitTouchMove = (e) => {
    if (e.touches && e.touches[0]) {
      updateSpiderSpot(e.touches[0].clientX, e.touches[0].clientY);
    }
  };

  const handlePortraitTouchStart = (e) => {
    setIsSpiderHover(true);
    if (e.touches && e.touches[0]) {
      updateSpiderSpot(e.touches[0].clientX, e.touches[0].clientY);
    }
  };

  const handlePortraitTouchEnd = () => {
    setIsSpiderHover(false);
  };

  return (
    <div
      className="hero-composition-wrap"
      aria-label="Interactive 3D tool showcase revolving around Saldan Rama"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Background Radial Glow */}
      <div className="hero-portrait-glow" aria-hidden="true" />

      {/* Dynamic Background Watermark Typography: Porto (Regular) + Folio (Dynamic Italic) */}
      <div className="hero-bg-watermark" aria-hidden="true">
        <span className="watermark-porto">Porto</span>
        <span
          className={`watermark-folio ${fontFading ? 'fading' : ''}`}
          style={{ fontFamily: currentFolioFont.family }}
        >
          Folio
        </span>
      </div>

      {/* SVG Connecting Lines (inspired by Mindly reference) */}
      <svg className="hero-connecting-lines" viewBox="0 0 1280 720" fill="none" aria-hidden="true">
        <path d="M 220 250 C 400 270, 470 380, 520 390" />
        <path d="M 1060 300 C 880 280, 810 380, 760 390" />
      </svg>

      {/* Left Floating Panel */}
      <div className="floating-side-card floating-card-left">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.35rem' }}>
          <Layers size={14} color="var(--accent-strong)" />
          <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--muted)', fontWeight: 600 }}>
            Toolchain
          </span>
        </div>
        <div className="floating-card-title">Turn concepts into digital craft.</div>
        <div className="floating-card-caption">Combining design synthesis with production agility.</div>
      </div>

      {/* Right Floating Panel */}
      <div className="floating-side-card floating-card-right">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.35rem' }}>
          <Sparkles size={14} color="var(--accent-strong)" />
          <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--muted)', fontWeight: 600 }}>
            Discipline
          </span>
        </div>
        <div className="floating-card-title">Creative & Technical.</div>
        <div className="floating-card-caption">Prototyping, visual identity, and clean web engineering.</div>
      </div>

      {/* Central Portrait Stage (with interactive Spider-Man costume hover spotlight) */}
      <div className="hero-stage-center">
        {!imageError ? (
          <div
            ref={portraitStageRef}
            className={`hero-portrait-stage ${isSpiderHover ? 'is-revealing' : ''}`}
            onMouseEnter={handlePortraitMouseEnter}
            onMouseMove={handlePortraitMouseMove}
            onMouseLeave={handlePortraitMouseLeave}
            onTouchStart={handlePortraitTouchStart}
            onTouchMove={handlePortraitTouchMove}
            onTouchEnd={handlePortraitTouchEnd}
            title="Hover cursor to reveal Spider-Man costume"
          >
            {/* Base Graduation Suit Portrait */}
            <img
              src="/images/portrait.png"
              alt="Saldan Rama"
              className="hero-portrait-img hero-portrait-base"
              onError={() => setImageError(true)}
              draggable="false"
            />

            {/* Spider-Man Reveal Costume */}
            <img
              ref={spiderPortraitRef}
              src="/images/portraitSpider.png"
              alt="Saldan Rama Spider-Man"
              className="hero-portrait-img hero-portrait-spider"
              draggable="false"
            />
          </div>
        ) : (
          <div className="hero-portrait-placeholder">
            <User size={64} strokeWidth={1.5} style={{ marginBottom: '0.75rem', color: 'var(--muted)' }} />
            <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1.6rem', color: 'var(--text)', marginBottom: '0.25rem' }}>
              Saldan Rama
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--muted)', maxWidth: '240px' }}>
              Letakkan foto di <code>public/images/portrait.png</code>
            </div>
          </div>
        )}

        {/* Orbiting Tools: Passes in front (z-index: 10) and behind (z-index: 2) */}
        <div className="orbit-tools-container" aria-hidden="true">
          {tools.map((tool) => {
            const currentAngle = (rotationAngle + tool.baseAngle) % (2 * Math.PI);
            
            const x = Math.sin(currentAngle) * radiusX;
            const y = Math.cos(currentAngle) * radiusY;
            const depth = Math.cos(currentAngle);
            const isFront = depth > 0;

            const normalizedDepth = (depth + 1) / 2;
            const scale = minScale + normalizedDepth * (maxScale - minScale);
            const opacity = 0.52 + normalizedDepth * 0.48;
            const tiltDeg = Math.sin(currentAngle) * 4;

            return (
              <div
                key={tool.id}
                className={`orbit-tool-card ${isFront ? 'is-front' : 'is-back'}`}
                style={{
                  transform: `translate3d(${x}px, ${y}px, 0) scale(${scale}) rotate(${tiltDeg}deg)`,
                  zIndex: isFront ? 10 : 2,
                  opacity: opacity,
                  filter: isFront ? 'none' : 'blur(0.8px)',
                }}
                title={`${tool.name} — ${tool.role}`}
              >
                <div className="orbit-tool-icon-wrap">
                  <img
                    src={tool.iconSrc}
                    alt={tool.name}
                    className="orbit-tool-icon-img"
                    loading="eager"
                  />
                </div>
                <div className="orbit-tool-info">
                  <span className="orbit-tool-name">{tool.name}</span>
                  <span className="orbit-tool-role">{tool.role}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Subtle Corner Markers matching reference */}
      <div className="hero-bottom-left-badge">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--success)', display: 'inline-block' }} />
          <span>Open to select creative roles & projects</span>
        </div>
      </div>

      <div className="hero-bottom-right-badge">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          <span className="font-serif-italic">Less chaos.</span>
          <span>More clarity.</span>
        </div>
      </div>
    </div>
  );
}

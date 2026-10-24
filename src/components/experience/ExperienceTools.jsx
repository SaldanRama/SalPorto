import React from 'react';
import './ExperienceTools.css';

/**
 * Returns matching image or SVG logo for a given tool/technology name
 */
export function getToolLogo(toolName) {
  if (!toolName) return null;
  const name = toolName.toLowerCase().trim();

  // 1. Matched with existing local files in /images/
  if (name.includes('figma')) {
    return <img src="/images/FigmaLogo.webp" alt="Figma" className="tool-pill-logo" loading="lazy" decoding="async" />;
  }
  if (name.includes('vscode') || name.includes('vs code') || name.includes('visual studio code')) {
    return <img src="/images/VSCODELogo.webp" alt="VS Code" className="tool-pill-logo" loading="lazy" decoding="async" />;
  }
  if (name.includes('photoshop')) {
    return <img src="/images/PhotoshopLogo.webp" alt="Photoshop" className="tool-pill-logo" loading="lazy" decoding="async" />;
  }
  if (name.includes('affinity')) {
    return <img src="/images/AffinityLogo.webp" alt="Affinity" className="tool-pill-logo" loading="lazy" decoding="async" />;
  }
  if (name.includes('canva')) {
    return <img src="/images/CanvaLogo.webp" alt="Canva" className="tool-pill-logo" loading="lazy" decoding="async" />;
  }
  if (name.includes('capcut')) {
    return <img src="/images/CapcutLogo.webp" alt="Capcut" className="tool-pill-logo" loading="lazy" decoding="async" />;
  }
  if (name.includes('notion')) {
    return <img src="/images/NotionKeycaps.webp" alt="Notion" className="tool-pill-logo" loading="lazy" decoding="async" />;
  }

  // 2. High-fidelity SVGs for modern Web Development & Data Stack
  if (name.includes('react')) {
    return (
      <svg className="tool-pill-logo svg" viewBox="-11.5 -10.23174 23 20.46348" fill="none">
        <circle cx="0" cy="0" r="2.05" fill="#61DAFB" />
        <g stroke="#61DAFB" strokeWidth="1" fill="none">
          <ellipse rx="11" ry="4.2" />
          <ellipse rx="11" ry="4.2" transform="rotate(60)" />
          <ellipse rx="11" ry="4.2" transform="rotate(120)" />
        </g>
      </svg>
    );
  }
  if (name.includes('javascript') || name === 'js') {
    return (
      <svg className="tool-pill-logo svg" viewBox="0 0 24 24" fill="none">
        <rect width="24" height="24" rx="4" fill="#F7DF1E" />
        <path d="M7 17.5C8 18 9 18 9 16.5V10H11.5V16.5C11.5 19.5 9.5 20 7.5 19L7 17.5ZM13.5 17.5C14.5 18.2 15.7 18.5 16.8 18.5C18.2 18.5 19 17.8 19 16.8C19 14.8 16.2 14.8 16.2 13.5C16.2 13 16.6 12.6 17.5 12.6C18.3 12.6 19.2 12.9 19.8 13.3L20.3 11.5C19.5 11.2 18.5 11 17.5 11C15.8 11 14 11.9 14 13.6C14 15.6 16.8 15.7 16.8 17C16.8 17.5 16.2 17.8 15.2 17.8C14.3 17.8 13.5 17.4 13 16.8L13.5 17.5Z" fill="#000000" />
      </svg>
    );
  }
  if (name.includes('php')) {
    return (
      <svg className="tool-pill-logo svg" viewBox="0 0 24 24" fill="none">
        <rect width="24" height="24" rx="4" fill="#777BB4" />
        <path d="M4 14.5H6.2L7 10.5H5.8L6.2 8.5H9.5C11 8.5 11.8 9.3 11.5 11C11.2 12.7 10 14.5 8 14.5H6.2L4 14.5ZM7.5 10.5L7 13H8C9 13 9.7 12.2 9.8 11.2C9.9 10.5 9.5 10.5 8.8 10.5H7.5Z" fill="white" />
        <path d="M12 14.5H14L15.3 8.5H13.3L12 14.5Z" fill="white" />
      </svg>
    );
  }
  if (name.includes('laravel')) {
    return (
      <svg className="tool-pill-logo svg" viewBox="0 0 24 24" fill="none">
        <rect width="24" height="24" rx="4" fill="#FF2D20" />
        <path d="M6 16L12 8L18 16H6Z" fill="white" />
      </svg>
    );
  }
  if (name.includes('css')) {
    return (
      <svg className="tool-pill-logo svg" viewBox="0 0 24 24" fill="none">
        <rect width="24" height="24" rx="4" fill="#1572B6" />
        <path d="M6 6L7 18L12 19.5L17 18L18 6H6Z" fill="#33A9DC" />
        <path d="M12 7.5V18.2L15.8 17.1L16.5 7.5H12Z" fill="white" />
      </svg>
    );
  }
  if (name.includes('html')) {
    return (
      <svg className="tool-pill-logo svg" viewBox="0 0 24 24" fill="none">
        <rect width="24" height="24" rx="4" fill="#E34F26" />
        <path d="M6 6L7 18L12 19.5L17 18L18 6H6Z" fill="#EF652A" />
        <path d="M12 7.5V18.2L15.8 17.1L16.5 7.5H12Z" fill="white" />
      </svg>
    );
  }
  if (name.includes('excel')) {
    return (
      <svg className="tool-pill-logo svg" viewBox="0 0 24 24" fill="none">
        <rect width="24" height="24" rx="4" fill="#107C41" />
        <path d="M7 8L11 12L7 16H9.5L12 13.2L14.5 16H17L13 12L17 8H14.5L12 10.8L9.5 8H7Z" fill="white" />
      </svg>
    );
  }
  if (name.includes('cinema') || name.includes('c4d')) {
    return (
      <svg className="tool-pill-logo svg" viewBox="0 0 24 24" fill="none">
        <rect width="24" height="24" rx="4" fill="#0E1A38" />
        <path d="M7 16C5.5 14.5 5.5 10.5 7 9C8.5 7.5 11 7.5 12 8.5L10.5 10C10 9.5 8.5 9.5 8 10C7.2 10.8 7.2 13.2 8 14C8.8 14.8 10.5 14.5 11 13.5L12.5 14.5C11.5 16 9 16.5 7 16ZM14 16V8H16V13H18.5V8H20.5V16H18.5V14.5H16V16H14Z" fill="#2EA5FF" />
      </svg>
    );
  }
  if (name.includes('davinci') || name.includes('resolve')) {
    return (
      <svg className="tool-pill-logo svg" viewBox="0 0 24 24" fill="none">
        <rect width="24" height="24" rx="4" fill="#1A1A1A" />
        <circle cx="12" cy="7" r="3" fill="#E83E4C" />
        <circle cx="7.5" cy="15" r="3" fill="#2E9BF5" />
        <circle cx="16.5" cy="15" r="3" fill="#F8B02B" />
      </svg>
    );
  }
  if (name.includes('blender')) {
    return (
      <svg className="tool-pill-logo svg" viewBox="0 0 24 24" fill="none">
        <rect width="24" height="24" rx="4" fill="#E87C24" />
        <circle cx="12" cy="13" r="3.5" fill="#255D85" />
        <circle cx="12" cy="13" r="1.5" fill="#FFFFFF" />
        <path d="M12 6L14 9H10L12 6Z" fill="#FFFFFF" />
      </svg>
    );
  }
  if (name.includes('premiere')) {
    return (
      <svg className="tool-pill-logo svg" viewBox="0 0 24 24" fill="none">
        <rect width="24" height="24" rx="4" fill="#00005B" />
        <path d="M7 17V8H11C12.5 8 13.5 9 13.5 10.5C13.5 12 12.5 13 11 13H9V17H7ZM9 11.3H10.8C11.3 11.3 11.7 11 11.7 10.5C11.7 10 11.3 9.7 10.8 9.7H9V11.3ZM14.5 17V10H16.2V11.2C16.6 10.4 17.5 10 18.5 10V11.8C17.3 11.8 16.5 12.4 16.5 13.7V17H14.5Z" fill="#EA77FF" />
      </svg>
    );
  }
  if (name.includes('after effects')) {
    return (
      <svg className="tool-pill-logo svg" viewBox="0 0 24 24" fill="none">
        <rect width="24" height="24" rx="4" fill="#00005B" />
        <path d="M6 16.5L8.5 8.5H10.5L13 16.5H11.2L10.7 14.8H8.3L7.8 16.5H6ZM8.7 13.3H10.3L9.5 10.2L8.7 13.3ZM14 13.8C14 11.8 15.3 10.5 17.2 10.5C19 10.5 20.2 11.8 20.2 13.7V14.2H15.6C15.7 15.2 16.5 15.8 17.5 15.8C18.3 15.8 19 15.4 19.3 14.8L20.5 15.6C19.9 16.6 18.8 17.2 17.4 17.2C15.3 17.2 14 15.8 14 13.8ZM18.7 13C18.7 12.2 18 11.8 17.2 11.8C16.3 11.8 15.7 12.3 15.6 13H18.7Z" fill="#9999FF" />
      </svg>
    );
  }
  if (name.includes('illustrator')) {
    return (
      <svg className="tool-pill-logo svg" viewBox="0 0 24 24" fill="none">
        <rect width="24" height="24" rx="4" fill="#330000" />
        <path d="M7 16.5L9.5 8.5H11.5L14 16.5H12.2L11.7 14.8H9.3L8.8 16.5H7ZM9.7 13.3H11.3L10.5 10.2L9.7 13.3ZM15.5 16.5V10.5H17.5V16.5H15.5ZM16.5 9.5C15.9 9.5 15.5 9.1 15.5 8.5C15.5 7.9 15.9 7.5 16.5 7.5C17.1 7.5 17.5 7.9 17.5 8.5C17.5 9.1 17.1 9.5 16.5 9.5Z" fill="#FF9A00" />
      </svg>
    );
  }
  if (name.includes('tailwind')) {
    return (
      <svg className="tool-pill-logo svg" viewBox="0 0 24 24" fill="none">
        <rect width="24" height="24" rx="4" fill="#0B1120" />
        <path d="M7 13.5C8 11.5 9.5 11 11.5 12C12.7 12.6 13.6 13.5 14.7 13.5C16.2 13.5 17.5 12.5 18 10.5C17 12.5 15.5 13 13.5 12C12.3 11.4 11.4 10.5 10.3 10.5C8.8 10.5 7.5 11.5 7 13.5Z" fill="#38BDF8" />
      </svg>
    );
  }
  if (name.includes('python')) {
    return (
      <svg className="tool-pill-logo svg" viewBox="0 0 24 24" fill="none">
        <rect width="24" height="24" rx="4" fill="#182736" />
        <path d="M11.8 6C9.2 6 9.3 7.1 9.3 7.1L9.3 8.3H12.3V8.8H7.7C6.4 8.8 6 9.7 6 11C6 12.5 6.7 12.8 7.4 12.8H8.3V11.6C8.3 10.3 9.4 10.3 9.4 10.3H12.4C13.5 10.3 14.4 9.4 14.4 8.3C14.4 7.2 13.6 6 11.8 6ZM10.5 6.9C10.8 6.9 11.1 7.2 11.1 7.5C11.1 7.8 10.8 8.1 10.5 8.1C10.2 8.1 9.9 7.8 9.9 7.5C9.9 7.2 10.2 6.9 10.5 6.9Z" fill="#387EB8" />
        <path d="M12.2 18C14.8 18 14.7 16.9 14.7 16.9L14.7 15.7H11.7V15.2H16.3C17.6 15.2 18 14.3 18 13C18 11.5 17.3 11.2 16.6 11.2H15.7V12.4C15.7 13.7 14.6 13.7 14.6 13.7H11.6C10.5 13.7 9.6 14.6 9.6 15.7C9.6 16.8 10.4 18 12.2 18ZM13.5 17.1C13.2 17.1 12.9 16.8 12.9 16.5C12.9 16.2 13.2 15.9 13.5 15.9C13.8 15.9 14.1 16.2 14.1 16.5C14.1 16.8 13.8 17.1 13.5 17.1Z" fill="#FFE052" />
      </svg>
    );
  }

  // Fallback badge icon with first 2 letters
  const initials = (toolName || 'TL').replace(/[^a-zA-Z0-9]/g, '').slice(0, 2).toUpperCase() || 'TL';
  return (
    <span className="tool-pill-custom-letter">
      {initials}
    </span>
  );
}

/**
 * ExperienceTools Component
 * Renders an aesthetic strip of tool badges with their logos underneath experience details.
 */
export function ExperienceTools({ tools = [], showLabel = true, label = 'Tools & Teknologi:' }) {
  if (!tools || tools.length === 0) return null;

  return (
    <div className={`experience-tools-strip ${!showLabel ? 'experience-tools-strip--bare' : ''}`}>
      {showLabel && <span className="experience-tools-label">{label}</span>}
      <div className="experience-tools-list">
        {tools.map((tool, idx) => (
          <div key={idx} className="experience-tool-chip">
            <span className="tool-chip-icon-box">
              {getToolLogo(tool)}
            </span>
            <span className="tool-chip-name">{tool}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

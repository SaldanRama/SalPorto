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
    return <img src="/images/FigmaLogo.png" alt="Figma" className="tool-pill-logo" />;
  }
  if (name.includes('vscode') || name.includes('vs code') || name.includes('visual studio code')) {
    return <img src="/images/VSCODELogo.png" alt="VS Code" className="tool-pill-logo" />;
  }
  if (name.includes('photoshop')) {
    return <img src="/images/PhotoshopLogo.png" alt="Photoshop" className="tool-pill-logo" />;
  }
  if (name.includes('affinity')) {
    return <img src="/images/AffinityLogo.png" alt="Affinity" className="tool-pill-logo" />;
  }
  if (name.includes('canva')) {
    return <img src="/images/CanvaLogo.png" alt="Canva" className="tool-pill-logo" />;
  }
  if (name.includes('capcut')) {
    return <img src="/images/CapcutLogo.png" alt="Capcut" className="tool-pill-logo" />;
  }
  if (name.includes('notion')) {
    return <img src="/images/NotionKeycaps.png" alt="Notion" className="tool-pill-logo" />;
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

  // Fallback badge icon
  return (
    <span className="tool-pill-default-dot" />
  );
}

/**
 * ExperienceTools Component
 * Renders an aesthetic strip of tool badges with their logos underneath experience details.
 */
export function ExperienceTools({ tools = [] }) {
  if (!tools || tools.length === 0) return null;

  return (
    <div className="experience-tools-strip">
      <span className="experience-tools-label">Tools &amp; Teknologi:</span>
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

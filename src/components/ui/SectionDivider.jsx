import React from 'react';
import './SectionDivider.css';

/**
 * SectionDivider Component
 * Renders a 32px technical architectural diagonal hatch pattern divider.
 * 
 * @param {'normal' | 'overlay' | 'absolute'} [position='normal'] - 'normal' (in layout flow) or 'overlay'/'absolute'
 * @param {string} [className=''] - Additional CSS classes
 * @param {React.CSSProperties} [style] - Custom inline styles
 */
export function SectionDivider({
  position = 'normal',
  className = '',
  style,
  ...restProps
}) {
  const isOverlay = position === 'overlay' || position === 'absolute';
  const classes = [
    'section-divider',
    isOverlay ? 'section-divider--overlay' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div
      className={classes}
      style={style}
      aria-hidden="true"
      role="separator"
      {...restProps}
    />
  );
}

export default SectionDivider;


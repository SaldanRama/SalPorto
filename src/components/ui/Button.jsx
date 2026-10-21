import React from 'react';
import { Link } from 'react-router-dom';
import './Button.css';

export function Button({
  children,
  to,
  href,
  variant = 'primary',
  size = 'md',
  pill = true,
  className = '',
  onClick,
  ...props
}) {
  const baseClasses = `btn btn-${variant} btn-${size} ${pill ? 'btn-pill' : ''} ${className}`.trim();

  if (to) {
    return (
      <Link to={to} className={baseClasses} {...props}>
        {children}
      </Link>
    );
  }

  if (href) {
    return (
      <a href={href} className={baseClasses} target="_blank" rel="noopener noreferrer" {...props}>
        {children}
      </a>
    );
  }

  return (
    <button type="button" className={baseClasses} onClick={onClick} {...props}>
      {children}
    </button>
  );
}

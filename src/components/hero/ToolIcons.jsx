import React from 'react';

export function ToolIcon({ name, size = 20 }) {
  switch (name) {
    case 'photoshop':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <rect width="24" height="24" rx="5" fill="#001E36" />
          <path
            d="M6 7.5H10.5C12.4 7.5 13.5 8.5 13.5 10.2C13.5 11.9 12.3 12.9 10.5 12.9H8V16.5H6V7.5ZM8 11.3H10.3C11.3 11.3 11.8 10.8 11.8 10.2C11.8 9.6 11.2 9.1 10.3 9.1H8V11.3Z"
            fill="#31A8FF"
          />
          <path
            d="M14.2 13.6C14.6 12.7 15.6 12.2 16.7 12.2C18.1 12.2 18.9 12.9 18.9 14.1V14.3C18.4 14.1 17.8 14 17.2 14C15.5 14 14.5 14.8 14.5 15.9C14.5 16.9 15.3 17.6 16.5 17.6C17.4 17.6 18.3 17.1 18.7 16.4V17.5H20.4V14.1C20.4 12.1 19 11 16.8 11C15.3 11 14.2 11.7 13.7 12.6L14.2 13.6Z"
            fill="#31A8FF"
          />
        </svg>
      );
    case 'affinity':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <rect width="24" height="24" rx="5" fill="#1C1E24" />
          <path
            d="M12 4L4 18H8.5L12 11.5L15.5 18H20L12 4Z"
            fill="url(#affinity-gradient)"
          />
          <defs>
            <linearGradient id="affinity-gradient" x1="4" y1="4" x2="20" y2="18" gradientUnits="userSpaceOnUse">
              <stop stopColor="#00A2FF" />
              <stop offset="0.5" stopColor="#30B9FF" />
              <stop offset="1" stopColor="#0066FF" />
            </linearGradient>
          </defs>
        </svg>
      );
    case 'canva':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <rect width="24" height="24" rx="5" fill="url(#canva-bg)" />
          <path
            d="M15.8 7.8C14.5 7.8 13.5 8.6 13 9.7C12.3 8.5 11.1 7.8 9.6 7.8C7.1 7.8 5.2 9.8 5.2 12.3C5.2 14.8 7.1 16.8 9.6 16.8C11.1 16.8 12.3 16 13 14.8C13.5 15.9 14.5 16.7 15.8 16.7C17.8 16.7 19.3 15.1 19.3 13.1H17.7C17.7 14.2 16.9 15.1 15.8 15.1C14.7 15.1 13.8 14.2 13.8 13.1C13.8 12 14.7 11.1 15.8 11.1C16.9 11.1 17.7 12 17.7 13.1H19.3C19.3 10.2 17.8 7.8 15.8 7.8ZM9.6 15.2C8 15.2 6.8 13.9 6.8 12.3C6.8 10.7 8 9.4 9.6 9.4C11.2 9.4 12.4 10.7 12.4 12.3C12.4 13.9 11.2 15.2 9.6 15.2Z"
            fill="white"
          />
          <defs>
            <linearGradient id="canva-bg" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse">
              <stop stopColor="#00C4CC" />
              <stop offset="1" stopColor="#7D2AE8" />
            </linearGradient>
          </defs>
        </svg>
      );
    case 'capcut':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <rect width="24" height="24" rx="5" fill="#000000" />
          <path
            d="M5 8.5L12 12L5 15.5V8.5Z"
            fill="#FFFFFF"
          />
          <path
            d="M19 8.5L12 12L19 15.5V8.5Z"
            fill="#FFFFFF"
          />
        </svg>
      );
    case 'vsco':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <rect width="24" height="24" rx="5" fill="#111111" />
          <circle cx="12" cy="12" r="6" stroke="#FFFFFF" strokeWidth="1.8" />
          <circle cx="12" cy="12" r="2.5" fill="#FFFFFF" />
        </svg>
      );
    case 'figma':
    default:
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <rect width="24" height="24" rx="5" fill="#1E1E1E" />
          <path d="M9 6H12V10H9C7.9 10 7 9.1 7 8C7 6.9 7.9 6 9 6Z" fill="#F24E1E" />
          <path d="M12 6H15C16.1 6 17 6.9 17 8C17 9.1 16.1 10 15 10H12V6Z" fill="#FF7262" />
          <path d="M9 10H12V14H9C7.9 14 7 13.1 7 12C7 10.9 7.9 10 9 10Z" fill="#A259FF" />
          <path d="M12 10H15C16.1 10 17 10.9 17 12C17 13.1 16.1 14 15 14C13.9 14 13 13.1 13 12C13 10.9 12 10 12 10Z" fill="#1ABCFE" />
          <path d="M9 14H12V16C12 17.1 11.1 18 10 18C8.9 18 8 17.1 8 16C8 14.9 8.9 14 9 14Z" fill="#0ACF83" />
        </svg>
      );
  }
}

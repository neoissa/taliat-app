import React from 'react';

export default function RankIcon({ rankId, className = 'w-6 h-6', size = 24 }) {
  const normalizedId = (rankId || '').toLowerCase().replace(/_/g, '').replace(/\s/g, '');

  switch (normalizedId) {
    case 'arrowoflight':
    case 'aol':
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`text-yellow-400 ${className}`}
        >
          {/* Sun Rays Arc */}
          <path d="M4 10A8 8 0 0 1 20 10" strokeDasharray="3 3" />
          <path d="M6 10A6 6 0 0 1 18 10" />
          {/* Arrow */}
          <line x1="3" y1="14" x2="21" y2="14" strokeWidth="2.5" />
          <polyline points="16 9 21 14 16 19" strokeWidth="2.5" />
          {/* Arrow feathers */}
          <line x1="5" y1="14" x2="3" y2="17" />
          <line x1="7" y1="14" x2="5" y2="17" />
          <line x1="5" y1="14" x2="3" y2="11" />
          <line x1="7" y1="14" x2="5" y2="11" />
        </svg>
      );

    case 'scout':
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`text-emerald-400 ${className}`}
        >
          {/* Fleur-de-lis Outline */}
          <path d="M12 2C10 5 8 8 8 11C8 14 10 16 12 18C14 16 16 14 16 11C16 8 14 5 12 2Z" fill="currentColor" fillOpacity="0.2" />
          <path d="M12 18C8 17 5 15 5 12C5 10 7 11 9 12C7 9 9 7 12 7C15 7 17 9 15 12C17 11 19 10 19 12C19 15 16 17 12 18Z" />
          {/* Bottom tie ribbon */}
          <rect x="10" y="18" width="4" height="2" rx="0.5" fill="currentColor" />
          <path d="M12 20C10 21.5 8 22 8 22M12 20C14 21.5 16 22 16 22" />
        </svg>
      );

    case 'tenderfoot':
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`text-teal-400 ${className}`}
        >
          {/* Tenderfoot Fleur-de-lis + Stars */}
          <path d="M12 3C10 6 8 9 8 12C8 14 10 16 12 18C14 16 16 14 16 12C16 9 14 6 12 3Z" fill="currentColor" fillOpacity="0.2" />
          <path d="M6 13C6 11 7.5 11.5 9 12.5C7.5 10 9 8 12 8C15 8 16.5 10 15 12.5C16.5 11.5 18 11 18 13C18 15.5 15.5 17 12 17.5" />
          {/* Shield/Eagle representation */}
          <path d="M10 12.5L12 14.5L14 12.5" />
          {/* Left Star */}
          <polygon points="6,9.5 6.5,10.5 7.5,10.5 6.7,11.2 7,12.2 6,11.5 5,12.2 5.3,11.2 4.5,10.5 5.5,10.5" fill="currentColor" />
          {/* Right Star */}
          <polygon points="18,9.5 18.5,10.5 19.5,10.5 18.7,11.2 19,12.2 18,11.5 17,12.2 17.3,11.2 16.5,10.5 17.5,10.5" fill="currentColor" />
        </svg>
      );

    case 'secondclass':
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`text-cyan-400 ${className}`}
        >
          {/* Fleur-de-lis with Scroll Banner underneath */}
          <path d="M12 4C10 7 8 9 8 12C8 14.5 10 16 12 17C14 16 16 14.5 16 12C16 9 14 7 12 4Z" fill="currentColor" fillOpacity="0.1" />
          <path d="M6 13C6 11 8 11.5 9.5 12.5C8 10 9.5 8 12 8C14.5 8 16 10 14.5 12.5C16 11.5 18 11 18 13" />
          {/* Scroll banner underneath */}
          <path d="M4 18C6 16.5 18 16.5 20 18C17 20.5 7 20.5 4 18Z" fill="currentColor" fillOpacity="0.3" />
          <path d="M4 18C7 19.5 17 19.5 20 18" />
          {/* Banner ends */}
          <path d="M4 18C3 18 3.5 16.5 4.5 17M20 18C21 18 20.5 16.5 19.5 17" />
        </svg>
      );

    case 'firstclass':
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`text-yellow-500 ${className}`}
        >
          {/* Full First Class Badge: Scroll banner + Fleur-de-lis + Eagle shape */}
          <path d="M12 2C10 5 8 8 8 11C8 13.5 10 15 12 16.5C14 15 16 13.5 16 11C16 8 14 5 12 2Z" fill="currentColor" fillOpacity="0.2" />
          <path d="M6 11C6 9 8 9.5 9.5 10.5C8 8 10 6 12 6C14 6 16 8 14.5 10.5C16 9.5 18 9 18 11" />
          {/* Eagle silhouette inside */}
          <path d="M10 11C11 10.5 13 10.5 14 11L12 13L10 11Z" fill="currentColor" />
          {/* Scroll banner underneath */}
          <path d="M3 17C6 15 18 15 21 17C18 20.5 6 20.5 3 17Z" fill="currentColor" fillOpacity="0.2" />
          <path d="M3 17C7 18.5 17 18.5 21 17" />
          <path d="M12 17.5V21M10 21H14" /> {/* Knot hanging below banner */}
          <circle cx="12" cy="21" r="1" fill="currentColor" />
        </svg>
      );

    case 'star':
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`text-orange-400 ${className}`}
        >
          {/* 5-pointed star */}
          <polygon
            points="12,2 15,9 22,9 17,14 19,21 12,17 5,21 7,14 2,9 9,9"
            fill="currentColor"
            fillOpacity="0.2"
            strokeWidth="2"
          />
          {/* Inner small Fleur-de-lis */}
          <path d="M12 8C11 10 10 11 10 12C10 13.5 11 14 12 14.5C13 14 14 13.5 14 12C14 11 13 10 12 8Z" fill="currentColor" />
        </svg>
      );

    case 'life':
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`text-red-400 ${className}`}
        >
          {/* Heart Emblem */}
          <path
            d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
            fill="currentColor"
            fillOpacity="0.2"
            strokeWidth="2"
          />
          {/* Inner small Fleur-de-lis outline */}
          <path d="M12 9C11 10.5 10 11.5 10 12.5C10 13.5 11 14 12 14.5C13 14 14 13.5 14 12.5C14 11.5 13 9.5 12 9Z" fill="currentColor" />
        </svg>
      );

    case 'eagle':
    case 'eaglescout':
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`text-purple-400 ${className}`}
        >
          {/* Majestic Eagle Crest */}
          <path d="M12 4C9 4 5 6 3 9C5 9.5 8 8 10 9.5C8 11 9 14 12 14C15 14 16 11 14 9.5C16 8 19 9.5 21 9C19 6 15 4 12 4Z" fill="currentColor" fillOpacity="0.2" />
          {/* Shield base */}
          <path d="M6 10V15C6 18.5 12 21 12 21C12 21 18 18.5 18 15V10" />
          {/* Eagle body lines inside shield */}
          <path d="M12 10V18M9 13L12 15L15 13" />
        </svg>
      );

    default:
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`text-slate-400 ${className}`}
        >
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
      );
  }
}

// src/components/branding/FalconLogo.tsx

import React from 'react';

type FalconLogoProps = {
  size?: number;
  variant?: 'full' | 'icon';
  className?: string;
};

export function FalconLogo({
  size = 120,
  variant = 'full',
  className = '',
}: FalconLogoProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 200 200"
      width={size}
      height={size}
      className={className}
    >
      <defs>
        <linearGradient id="falconGreen" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#16A34A" />
          <stop offset="100%" stopColor="#166534" />
        </linearGradient>
        <linearGradient id="falconWhite" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="100%" stopColor="#DCFCE7" />
        </linearGradient>
      </defs>

      <rect x="0" y="0" width="200" height="200" rx="40" fill="url(#falconGreen)" />

      <path
        d="M 100 40 C 120 40, 140 55, 145 80 C 150 105, 140 130, 120 145 C 110 152, 100 155, 100 155 C 100 155, 90 152, 80 145 C 60 130, 50 105, 55 80 C 60 55, 80 40, 100 40 Z"
        fill="url(#falconWhite)"
      />

      <path
        d="M 70 80 C 60 90, 55 110, 65 130 C 70 140, 80 148, 90 152 C 85 140, 82 120, 85 100 C 87 90, 80 85, 70 80 Z"
        fill="#166534"
      />

      <path
        d="M 130 80 C 140 90, 145 110, 135 130 C 130 140, 120 148, 110 152 C 115 140, 118 120, 115 100 C 113 90, 120 85, 130 80 Z"
        fill="url(#falconWhite)"
      />

      <circle cx="100" cy="75" r="6" fill="#166534" />
      <circle cx="102" cy="73" r="2" fill="#FFFFFF" />

      <path d="M 100 80 L 95 90 L 105 90 Z" fill="#F59E0B" />

      {variant === 'full' && (
        <text
          x="100"
          y="180"
          fontFamily="Arial, sans-serif"
          fontSize="14"
          fontWeight="bold"
          fill="#FFFFFF"
          textAnchor="middle"
          letterSpacing="2"
        >
          FALCON RIDER
        </text>
      )}
    </svg>
  );
}

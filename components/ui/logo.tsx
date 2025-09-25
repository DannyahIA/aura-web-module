import React from 'react';

interface LogoProps extends React.SVGProps<SVGSVGElement> {
  variant?: 'light' | 'dark';
}

export function Logo({ variant = 'dark', ...props }: LogoProps) {
  const isDark = variant === 'dark';
  const textColor = isDark ? '#1F2937' : '#FFFFFF';
  const hubColor = isDark ? '#6B7280' : '#D1D5DB';

  return (
    <svg
      width="160"
      height="40"
      viewBox="0 0 160 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Aura Hub Logo"
      {...props}
    >
      <defs>
        <linearGradient id="auragradient" x1="0" y1="0" x2="100%" y2="0">
          <stop offset="0%" stopColor="#22d3ee" />
          <stop offset="100%" stopColor="#a855f7" />
        </linearGradient>
      </defs>
      <text
        fontFamily="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'"
        fontSize="30"
        fontWeight="800"
        fill="url(#auragradient)"
        x="0"
        y="30"
      >
        Aura
        <tspan
          fill={hubColor}
          fontWeight="600"
          fontSize="28"
        >
          Hub
        </tspan>
      </text>
    </svg>
  );
}
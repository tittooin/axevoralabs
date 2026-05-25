import React from 'react';

interface BrandLogoProps {
  className?: string;
  variant?: 'full' | 'icon' | 'wordmark';
  color?: 'charcoal' | 'crimson' | 'dual' | 'white';
  height?: number | string;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  className = '',
  variant = 'full',
  color = 'dual',
  height = '100%',
}) => {
  // Color configuration
  const getColors = () => {
    switch (color) {
      case 'white':
        return { primary: '#FFFFFF', secondary: '#FFFFFF' };
      case 'charcoal':
        return { primary: '#121212', secondary: '#121212' };
      case 'crimson':
        return { primary: '#FF1E46', secondary: '#FF1E46' };
      case 'dual':
      default:
        return { primary: '#121212', secondary: '#FF1E46' }; // High-contrast charcoal and crimson
    }
  };

  const colors = getColors();

  // Geometric Monogram Icon SVG
  const renderIcon = () => (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ height }}
      className="inline-block align-middle transition-colors duration-300"
    >
      {/* Outer framing lines (Tactical HUD Vibe) */}
      <path
        d="M 5 25 L 5 5 L 25 5"
        stroke={colors.primary}
        strokeWidth="2.5"
        strokeLinecap="square"
      />
      <path
        d="M 95 75 L 95 95 L 75 95"
        stroke={colors.secondary}
        strokeWidth="2.5"
        strokeLinecap="square"
      />
      
      {/* Geometric 'A' and 'X' core fusion */}
      {/* Left wing of 'A/X' */}
      <path
        d="M 25 80 L 45 45 L 35 25 L 15 25 Z"
        fill={colors.primary}
      />
      {/* Right wing of 'A/X' */}
      <path
        d="M 75 80 L 55 45 L 65 25 L 85 25 Z"
        fill={colors.primary}
      />
      {/* Center structural Crimson Element */}
      <path
        d="M 50 15 L 60 32 L 40 32 Z"
        fill={colors.secondary}
      />
      {/* Dynamic diagonal bar (Techwear signature cut) */}
      <path
        d="M 30 65 L 70 65 L 75 73 L 25 73 Z"
        fill={colors.secondary}
      />
    </svg>
  );

  // Styled typographic Wordmark
  const renderWordmark = () => (
    <span
      className="font-mono font-bold tracking-[0.35em] text-lg select-none align-middle"
      style={{
        color: color === 'dual' ? '#121212' : colors.primary,
        display: 'inline-block',
      }}
    >
      AXE
      <span style={{ color: colors.secondary }}>VORA</span>
    </span>
  );

  return (
    <div className={`flex items-center gap-3.5 select-none ${className}`}>
      {(variant === 'full' || variant === 'icon') && (
        <div className="flex-shrink-0" style={{ height: height }}>
          {renderIcon()}
        </div>
      )}
      {(variant === 'full' || variant === 'wordmark') && (
        <div className="flex items-center">
          {renderWordmark()}
        </div>
      )}
    </div>
  );
};

export default BrandLogo;

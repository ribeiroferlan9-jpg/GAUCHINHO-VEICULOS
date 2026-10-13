import React from 'react';

interface BrandLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  className = '',
  size = 'md',
  showText = true,
}) => {
  const iconDimensions = {
    sm: { width: 36, height: 36 },
    md: { width: 44, height: 44 },
    lg: { width: 56, height: 56 },
  }[size];

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* Exact Gauchinho Veículos Monogram Emblem */}
      <div 
        className="relative shrink-0 flex items-center justify-center rounded-full overflow-hidden shadow-lg shadow-red-950/40 border border-red-500/30 transition-transform duration-300 hover:scale-105"
        style={{ width: iconDimensions.width, height: iconDimensions.height }}
      >
        <svg
          viewBox="0 0 200 200"
          className="w-full h-full"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Radial Red Gradient Brand Background identical to logo */}
          <defs>
            <radialGradient id="gvBgGrad" cx="35%" cy="30%" r="75%">
              <stop offset="0%" stopColor="#EE0000" />
              <stop offset="45%" stopColor="#C40000" />
              <stop offset="100%" stopColor="#750000" />
            </radialGradient>
            <linearGradient id="specularGlow" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Red Base Badge */}
          <rect width="200" height="200" fill="url(#gvBgGrad)" />

          {/* White Circular Field Masking the GV cut */}
          <circle cx="100" cy="100" r="56" fill="#FFFFFF" />

          {/* Stylized Red G & V Monogram */}
          {/* G arch and crossbar */}
          <path
            d="M 64 80 
               C 64 62, 80 54, 122 54 
               L 128 66 
               L 86 66 
               C 74 66, 74 74, 74 88 
               C 74 102, 74 110, 86 110 
               L 126 110 
               L 126 82 
               L 88 82 
               L 88 74 
               L 136 74 
               L 136 122 
               C 105 122, 90 122, 84 150 
               L 68 150 
               C 56 124, 52 108, 64 80 Z"
            fill="url(#gvBgGrad)"
          />

          {/* Stylized V dynamic diagonal arm */}
          <path
            d="M 126 100 
               L 140 100 
               L 110 150 
               L 96 150 
               Z"
            fill="url(#gvBgGrad)"
          />

          {/* Subtle glass reflection ring on edge */}
          <circle cx="100" cy="100" r="98" stroke="url(#specularGlow)" strokeWidth="3" fill="none" />
        </svg>
      </div>

      {showText && (
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5 leading-none">
            <span className="font-extrabold tracking-wider text-white text-base md:text-lg">
              GAUCHINHO
            </span>
            <span className="text-red-500 font-black text-base md:text-lg">
              VEÍCULOS
            </span>
          </div>
          <span className="text-[10px] md:text-[11px] tracking-widest uppercase font-semibold text-zinc-400 mt-1 flex items-center gap-1.5">
            <span>CARROS SEMINOVOS</span>
            <span className="w-1 h-1 rounded-full bg-red-600 inline-block" />
            <span className="text-zinc-300">PREMIUM</span>
          </span>
        </div>
      )}
    </div>
  );
};

import { useState } from "react";

interface LogoProps {
  size?: number;
  className?: string;
  variant?: "header" | "icon" | "full";
  alt?: string;
}

// SVG fallback that closely matches the uploaded RD logo
function LogoSVG({ size = 40, className = "" }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
      role="img"
    >
      <defs>
        <linearGradient id="rGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#e2e8f0" />
        </linearGradient>
        <linearGradient id="dGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#38bdf8" />
          <stop offset="100%" stopColor="#2563eb" />
        </linearGradient>
        <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#000" floodOpacity="0.12" />
        </filter>
        <filter id="innerShadow">
          <feOffset dx="0" dy="1" />
          <feGaussianBlur stdDeviation="1" result="offset-blur" />
          <feComposite operator="out" in="SourceGraphic" in2="offset-blur" result="inverse" />
          <feFlood floodColor="#000" floodOpacity="0.08" result="color" />
          <feComposite operator="in" in="color" in2="inverse" result="shadow" />
          <feComposite operator="over" in="shadow" in2="SourceGraphic" />
        </filter>
      </defs>
      
      {/* Blue D background */}
      <g filter="url(#shadow)">
        <path
          d="M 62 15 
             C 62 15, 105 15, 105 60
             C 105 105, 62 105, 62 105
             L 52 85
             C 52 85, 85 85, 85 60
             C 85 35, 52 35, 52 35
             Z"
          fill="url(#dGrad)"
        />
        {/* Dark navy inner shape */}
        <path
          d="M 52 35
             C 52 35, 85 35, 85 60
             C 85 85, 52 85, 52 85
             C 52 85, 62 75, 68 60
             C 74 45, 62 15, 62 15
             Z"
          fill="#0f172a"
        />
      </g>

      {/* White R */}
      <g filter="url(#shadow)">
        <path
          d="M 5 15
             L 42 15
             L 54 28
             L 42 42
             L 58 42
             L 58 42
             C 48 55, 38 68, 32 85
             L 70 85
             L 52 48
             L 62 48
             L 30 48
             L 30 68
             L 18 68
             L 18 42
             L 35 42
             C 28 42, 22 38, 22 32
             C 22 26, 28 22, 35 22
             L 18 22
             L 5 15
             Z"
          fill="url(#rGrad)"
          stroke="#f1f5f9"
          strokeWidth="0.5"
          strokeLinejoin="round"
        />
        {/* R leg detail for 3D */}
        <path
          d="M 32 85 L 70 85 L 52 48 L 42 48 L 30 72 Z"
          fill="url(#rGrad)"
        />
      </g>

      {/* Code symbol </> */}
      <g transform="translate(68, 58)">
        <text
          x="0"
          y="0"
          textAnchor="middle"
          dominantBaseline="middle"
          fontFamily="monospace"
          fontWeight="800"
          fontSize="22"
          fill="#38bdf8"
          letterSpacing="-1"
          style={{ filter: "drop-shadow(0 1px 2px rgba(56,189,248,0.3))" }}
        >
          &lt;/&gt;
        </text>
        {/* Slash accent */}
        <g transform="translate(1, -1) rotate(-12)">
          <rect x="-1.5" y="-12" width="3" height="24" rx="1.5" fill="#38bdf8" opacity="0.95" />
        </g>
      </g>
    </svg>
  );
}

// Main Logo Component
export default function Logo({ size = 40, className = "", variant = "header", alt = "Rachid DevWorks" }: LogoProps) {
  const [imgError, setImgError] = useState(false);
  const isHeader = variant === "header";

  if (imgError) {
    // Fallback to SVG if image fails
    return (
      <div
        className={`flex items-center justify-center bg-white rounded-xl border border-slate-100 shadow-md overflow-hidden ${className}`}
        style={{ width: size, height: size }}
        aria-label={alt}
      >
        <LogoSVG size={size - 6} />
      </div>
    );
  }

  return (
    <div
      className={`group relative flex items-center justify-center bg-white rounded-xl border border-slate-100 shadow-md shadow-slate-200/50 overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-indigo-100 hover:border-indigo-100 hover:scale-[1.02] ${className}`}
      style={{ width: size, height: size }}
    >
      <img
        src="/images/rd-logo.png"
        alt={alt}
        width={size}
        height={size}
        loading="eager"
        decoding="async"
        onError={() => setImgError(true)}
        className={`w-full h-full object-contain p-[3px] transition-transform duration-300 group-hover:scale-105 ${isHeader ? "" : ""}`}
      />
      {/* Subtle shine effect */}
      <div className="pointer-events-none absolute inset-0 rounded-xl bg-gradient-to-tr from-white/0 via-white/0 to-white/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </div>
  );
}

// Export SVG as separate for small icon usage without image load
export function LogoMark({ size = 32, className = "" }: { size?: number; className?: string }) {
  return <LogoSVG size={size} className={className} />;
}

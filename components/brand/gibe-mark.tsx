export function GibeMark({ className = "size-10" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <rect
        x="4"
        y="4"
        width="56"
        height="56"
        rx="18"
        fill="url(#gibe-panel)"
        stroke="rgba(255,255,255,0.22)"
      />
      <path
        d="M22 30.5C22 21.94 27.53 17 36.03 17C41.04 17 45.43 18.89 49.02 22.31L44.1 27.02C41.85 24.98 39.44 23.95 36.53 23.95C31.37 23.95 28.48 26.91 28.48 31.54C28.48 36.41 31.58 39.8 36.44 39.8C39.91 39.8 42.25 38.4 43.33 36.09H35.18V30.5H50.2C50.43 31.65 50.55 32.76 50.55 33.92C50.55 43.63 44.03 47.7 36.11 47.7C27.86 47.7 22 41.18 22 30.5Z"
        fill="url(#gibe-core)"
      />
      <defs>
        <linearGradient id="gibe-core" x1="20" y1="12" x2="52" y2="48" gradientUnits="userSpaceOnUse">
          <stop stopColor="#7CFFC5" />
          <stop offset="0.55" stopColor="#4DE2FF" />
          <stop offset="1" stopColor="#69A4FF" />
        </linearGradient>
        <linearGradient id="gibe-panel" x1="8" y1="6" x2="54" y2="60" gradientUnits="userSpaceOnUse">
          <stop stopColor="#142447" />
          <stop offset="1" stopColor="#08101F" />
        </linearGradient>
      </defs>
    </svg>
  );
}


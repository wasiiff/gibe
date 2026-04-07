export function PipelineGraphic({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 700 520"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="pipe-1" x1="90" y1="90" x2="250" y2="240" gradientUnits="userSpaceOnUse">
          <stop stopColor="#4DE2FF" />
          <stop offset="1" stopColor="#69A4FF" />
        </linearGradient>
        <linearGradient id="pipe-2" x1="430" y1="220" x2="610" y2="390" gradientUnits="userSpaceOnUse">
          <stop stopColor="#7CFFC5" />
          <stop offset="1" stopColor="#4DE2FF" />
        </linearGradient>
        <linearGradient id="pipe-3" x1="320" y1="60" x2="530" y2="150" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FFBE5C" />
          <stop offset="1" stopColor="#FF5FD2" />
        </linearGradient>
      </defs>

      <rect x="40" y="70" width="260" height="168" rx="28" fill="rgba(9,14,30,0.95)" stroke="rgba(121,177,255,0.28)" />
      <rect x="312" y="40" width="344" height="212" rx="30" fill="rgba(9,14,30,0.94)" stroke="rgba(255,255,255,0.12)" />
      <rect x="166" y="276" width="468" height="184" rx="30" fill="rgba(9,14,30,0.94)" stroke="rgba(255,255,255,0.12)" />

      <path d="M296 154H332" stroke="url(#pipe-1)" strokeWidth="6" strokeLinecap="round" />
      <path d="M486 252V286" stroke="url(#pipe-2)" strokeWidth="6" strokeLinecap="round" />

      <rect x="66" y="98" width="208" height="18" rx="9" fill="rgba(77,226,255,0.16)" />
      <rect x="66" y="132" width="152" height="14" rx="7" fill="rgba(255,255,255,0.14)" />
      <rect x="66" y="160" width="184" height="14" rx="7" fill="rgba(255,255,255,0.1)" />
      <rect x="66" y="192" width="124" height="14" rx="7" fill="rgba(124,255,197,0.18)" />

      <rect x="340" y="74" width="126" height="20" rx="10" fill="rgba(255,190,92,0.18)" />
      <rect x="340" y="114" width="286" height="96" rx="18" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.08)" />
      <path d="M366 162C394 125 454 118 492 148C520 170 558 179 602 146" stroke="url(#pipe-3)" strokeWidth="6" strokeLinecap="round" />
      <circle cx="396" cy="142" r="10" fill="#FFBE5C" />
      <circle cx="496" cy="150" r="12" fill="#FF5FD2" />
      <circle cx="588" cy="152" r="11" fill="#69A4FF" />

      <rect x="192" y="306" width="180" height="126" rx="20" fill="rgba(255,255,255,0.03)" stroke="rgba(77,226,255,0.18)" />
      <rect x="392" y="306" width="214" height="126" rx="20" fill="rgba(255,255,255,0.03)" stroke="rgba(124,255,197,0.18)" />
      <rect x="222" y="334" width="116" height="12" rx="6" fill="rgba(255,255,255,0.12)" />
      <rect x="222" y="358" width="82" height="12" rx="6" fill="rgba(77,226,255,0.18)" />
      <rect x="222" y="382" width="102" height="12" rx="6" fill="rgba(255,255,255,0.08)" />

      <rect x="422" y="332" width="154" height="74" rx="16" fill="url(#pipe-2)" fillOpacity="0.18" />
      <circle cx="470" cy="369" r="18" fill="rgba(77,226,255,0.9)" />
      <path d="M512 355H554" stroke="rgba(255,255,255,0.75)" strokeWidth="8" strokeLinecap="round" />
      <path d="M512 381H540" stroke="rgba(255,255,255,0.45)" strokeWidth="8" strokeLinecap="round" />
    </svg>
  );
}


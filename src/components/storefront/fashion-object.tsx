export function FashionObject({ kind = "cap", tone = "#111214", detail = "#ffffff", className = "" }: { kind?: "cap" | "tee" | "tote"; tone?: string; detail?: string; className?: string }) {
  if (kind === "tee") {
    return (
      <svg viewBox="0 0 320 260" aria-hidden="true" className={className}>
        <defs><filter id="tcc-tee-shadow"><feDropShadow dx="0" dy="13" stdDeviation="11" floodOpacity=".18" /></filter></defs>
        <g filter="url(#tcc-tee-shadow)">
          <path d="M112 42c18 14 78 14 96 0l51 28-26 50-31-15v116H118V105l-31 15-26-50 51-28Z" fill={tone}/>
          <path d="M132 43c8 22 48 22 56 0" fill="none" stroke={detail} strokeOpacity=".55" strokeWidth="5" strokeLinecap="round"/>
          <rect x="137" y="112" width="46" height="26" rx="4" fill={detail} fillOpacity=".95"/>
          <text x="160" y="129" textAnchor="middle" fontSize="11" fontWeight="800" fill={tone}>TCC</text>
        </g>
      </svg>
    );
  }

  if (kind === "tote") {
    return (
      <svg viewBox="0 0 320 260" aria-hidden="true" className={className}>
        <defs><filter id="tcc-tote-shadow"><feDropShadow dx="0" dy="13" stdDeviation="11" floodOpacity=".18" /></filter></defs>
        <g filter="url(#tcc-tote-shadow)">
          <path d="M91 79h138l14 142H77L91 79Z" fill={tone}/>
          <path d="M120 91c0-38 80-38 80 0" fill="none" stroke={tone} strokeWidth="13" strokeLinecap="round"/>
          <rect x="126" y="126" width="68" height="38" rx="5" fill={detail}/>
          <text x="160" y="151" textAnchor="middle" fontSize="16" fontWeight="900" fill={tone}>TCC</text>
        </g>
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 320 240" aria-hidden="true" className={className}>
      <defs>
        <linearGradient id="tcc-cap-hi" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#ffffff" stopOpacity=".28"/><stop offset="1" stopColor="#ffffff" stopOpacity="0"/></linearGradient>
        <filter id="tcc-cap-shadow"><feDropShadow dx="0" dy="15" stdDeviation="12" floodOpacity=".22" /></filter>
      </defs>
      <g filter="url(#tcc-cap-shadow)">
        <path d="M76 113c9-47 44-76 94-76 48 0 80 22 88 63 3 14 2 28-1 42l-158 14c-20 1-29-17-23-43Z" fill={tone}/>
        <path d="M78 113c9-47 44-76 94-76 30 0 55 9 71 27-21-5-53-2-76 10-27 14-48 35-61 74l-8 8c-20 1-29-17-20-43Z" fill="url(#tcc-cap-hi)"/>
        <path d="M102 147c46-12 128-14 174 1 14 5 17 14 6 23-26 20-108 28-174 11-24-6-26-27-6-35Z" fill={tone}/>
        <path d="M122 137c31-8 76-11 115-7" fill="none" stroke={detail} strokeOpacity=".18" strokeWidth="3" strokeLinecap="round"/>
        <rect x="130" y="87" width="64" height="34" rx="5" fill={detail} fillOpacity=".96"/>
        <text x="162" y="109" textAnchor="middle" fontSize="15" fontWeight="900" fill={tone}>THE CAP CITY</text>
      </g>
    </svg>
  );
}

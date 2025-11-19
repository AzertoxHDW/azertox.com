<svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="windowGradient" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:#3a3a3a;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#1a1a1a;stop-opacity:1" />
    </linearGradient>
  </defs>

  <!-- Window frame -->
  <rect x="6" y="8" width="36" height="32" rx="1" fill="url(#windowGradient)" stroke="#0a0a0a" stroke-width="1"/>

  <!-- Title bar -->
  <rect x="6" y="8" width="36" height="4" fill="#000080"/>

  <!-- Screen area -->
  <rect x="8" y="13" width="32" height="25" fill="#000000"/>

  <!-- Terminal text lines -->
  <text x="10" y="19" font-family="monospace" font-size="3" fill="#c0c0c0">C:\&gt; dir</text>
  <text x="10" y="23" font-family="monospace" font-size="2.5" fill="#c0c0c0">Volume in drive C</text>
  <text x="10" y="27" font-family="monospace" font-size="2.5" fill="#c0c0c0">Directory of C:\</text>

  <!-- Cursor -->
  <rect x="10" y="30" width="2" height="3" fill="#ffffff"/>

  <!-- Window border highlight -->
  <rect x="6" y="8" width="36" height="32" rx="1" fill="none" stroke="#4a4a4a" stroke-width="0.5"/>

  <!-- Shadow -->
  <ellipse cx="24" cy="41" rx="16" ry="2" fill="#000000" opacity="0.3"/>
</svg>

<style>
  svg {
    width: 100%;
    height: 100%;
  }
</style>

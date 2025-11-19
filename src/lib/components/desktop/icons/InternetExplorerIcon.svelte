<svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <!-- Gradient for the "e" -->
    <linearGradient id="blueGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#5daae5;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#1e5ba8;stop-opacity:1" />
    </linearGradient>

    <!-- Gradient for the orbit -->
    <linearGradient id="orbitGradient" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" style="stop-color:#ffde59;stop-opacity:1" />
      <stop offset="50%" style="stop-color:#ffc627;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#ff9a00;stop-opacity:1" />
    </linearGradient>
  </defs>

  <!-- Shadow -->
  <ellipse cx="25" cy="42" rx="18" ry="3" fill="#000000" opacity="0.2"/>

  <!-- Orbit ring -->
  <ellipse cx="24" cy="24" rx="20" ry="8" fill="none" stroke="url(#orbitGradient)" stroke-width="3" transform="rotate(-25 24 24)"/>

  <!-- "e" letter background circle -->
  <circle cx="24" cy="24" r="15" fill="url(#blueGradient)" stroke="#0d3c7a" stroke-width="1"/>

  <!-- "e" letter -->
  <path d="
    M 24 14
    Q 32 14, 32 22
    L 16 22
    Q 16 14, 24 14
    Z
  " fill="white"/>

  <rect x="16" y="22" width="16" height="4" fill="white"/>

  <path d="
    M 16 26
    L 32 26
    Q 32 34, 24 34
    Q 16 34, 16 30
    L 20 30
    Q 20 31, 24 31
    Q 28 31, 28 26
    Z
  " fill="white"/>

  <!-- Highlight on circle -->
  <ellipse cx="19" cy="18" rx="4" ry="5" fill="white" opacity="0.3"/>
</svg>

<style>
  svg {
    width: 100%;
    height: 100%;
  }
</style>

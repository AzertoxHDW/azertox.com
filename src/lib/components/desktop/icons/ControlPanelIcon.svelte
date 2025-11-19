<svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="panelGradient" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:#e8e8e8;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#b0b0b0;stop-opacity:1" />
    </linearGradient>
  </defs>

  <!-- Panel background -->
  <rect x="8" y="10" width="32" height="32" rx="2" fill="url(#panelGradient)" stroke="#5a5a5a" stroke-width="1"/>

  <!-- Panel inner border -->
  <rect x="10" y="12" width="28" height="28" rx="1" fill="#d4d0c8" stroke="#808080" stroke-width="0.5"/>

  <!-- Grid of control items -->
  <!-- Row 1 -->
  <g>
    <!-- Display/Monitor -->
    <rect x="13" y="15" width="7" height="6" rx="0.5" fill="#4a90e2" stroke="#2d5a8c" stroke-width="0.5"/>
    <rect x="14" y="16" width="5" height="3" fill="#87ceeb"/>

    <!-- Sound/Speaker -->
    <rect x="22" y="15" width="6" height="6" rx="0.5" fill="#ffa500" stroke="#cc8400" stroke-width="0.5"/>
    <polygon points="24,17 24,19 25.5,19 27,17" fill="#fff"/>
    <path d="M 27.5 17 Q 28 17.5, 28 18 Q 28 18.5, 27.5 19" stroke="#fff" fill="none" stroke-width="0.5"/>

    <!-- Network -->
    <rect x="30" y="15" width="6" height="6" rx="0.5" fill="#50c878" stroke="#3a9b5c" stroke-width="0.5"/>
    <circle cx="31.5" cy="17" r="0.8" fill="#fff"/>
    <circle cx="34.5" cy="17" r="0.8" fill="#fff"/>
    <circle cx="33" cy="19" r="0.8" fill="#fff"/>
    <line x1="31.5" y1="17" x2="33" y2="19" stroke="#fff" stroke-width="0.5"/>
    <line x1="34.5" y1="17" x2="33" y2="19" stroke="#fff" stroke-width="0.5"/>
  </g>

  <!-- Row 2 -->
  <g>
    <!-- User/Account -->
    <rect x="13" y="23" width="7" height="6" rx="0.5" fill="#9370db" stroke="#6a4ca3" stroke-width="0.5"/>
    <circle cx="16.5" cy="25" r="1" fill="#fff"/>
    <path d="M 14 28 Q 16.5 27, 19 28" stroke="#fff" fill="none" stroke-width="0.8"/>

    <!-- Date/Time -->
    <rect x="22" y="23" width="6" height="6" rx="0.5" fill="#ff6b6b" stroke="#cc5555" stroke-width="0.5"/>
    <circle cx="25" cy="26" r="2" fill="none" stroke="#fff" stroke-width="0.5"/>
    <line x1="25" y1="26" x2="25" y2="24.5" stroke="#fff" stroke-width="0.5"/>
    <line x1="25" y1="26" x2="26.2" y2="26.8" stroke="#fff" stroke-width="0.5"/>

    <!-- System -->
    <rect x="30" y="23" width="6" height="6" rx="0.5" fill="#ffd700" stroke="#ccac00" stroke-width="0.5"/>
    <rect x="31" y="24.5" width="4" height="3" rx="0.3" fill="#fff"/>
    <rect x="31.5" y="25" width="3" height="2" fill="#4a90e2"/>
  </g>

  <!-- Row 3 -->
  <g>
    <!-- Folder Options -->
    <rect x="13" y="31" width="7" height="6" rx="0.5" fill="#ffa07a" stroke="#cc7f61" stroke-width="0.5"/>
    <path d="M 14 33 L 15.5 33 L 16 32 L 19 32 L 19 36 L 14 36 Z" fill="#ffd966"/>

    <!-- Security/Lock -->
    <rect x="22" y="31" width="6" height="6" rx="0.5" fill="#20b2aa" stroke="#1a8f89" stroke-width="0.5"/>
    <rect x="23.5" y="34" width="3" height="2" rx="0.3" fill="#ffd700"/>
    <path d="M 24 34 L 24 32.5 Q 24 31.5, 25 31.5 Q 26 31.5, 26 32.5 L 26 34" stroke="#ffd700" fill="none" stroke-width="0.6"/>

    <!-- Accessibility -->
    <rect x="30" y="31" width="6" height="6" rx="0.5" fill="#87ceeb" stroke="#6baed6" stroke-width="0.5"/>
    <circle cx="33" cy="33" r="0.8" fill="#fff"/>
    <path d="M 33 34 L 33 36" stroke="#fff" stroke-width="0.8"/>
    <path d="M 31.5 34.5 L 34.5 34.5" stroke="#fff" stroke-width="0.8"/>
  </g>

  <!-- Panel shadow -->
  <rect x="8" y="42" width="32" height="1" fill="#000000" opacity="0.15"/>
</svg>

<style>
  svg {
    width: 100%;
    height: 100%;
  }
</style>

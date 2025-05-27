<script lang="ts">
    import { onMount, onDestroy } from 'svelte';
    import type { ThemeOption } from '$lib/themeStore'; // Import ThemeOption for type safety
  
    export let themeOption: ThemeOption; // Pass the whole theme option
    export let onComplete: () => void;
  
    let showContent = false;
    let audio: HTMLAudioElement | undefined;
    let progressXP = 0; // For XP progress bar specifically
  
    let animationTimer: number;
    let progressIntervalXP: number;
  
    onMount(() => {
      showContent = true;
  
      if (browser && themeOption.sound && audio) {
        audio.src = themeOption.sound; // Set src before playing
        audio.play().catch(e => console.warn(`${themeOption.label} sound autoplay failed:`, e));
      }
  
      const duration = themeOption.animationDuration || 3000; // Default if not specified
  
      // XP specific animation logic
      if (themeOption.value === 'xp') {
        progressIntervalXP = window.setInterval(() => {
          if (progressXP < 100) {
            progressXP += 10; // Faster fill for demo
          } else {
            clearInterval(progressIntervalXP);
          }
        }, 150); // Duration of progress bar fill
      }
  
      // --- TODO: Add specific animation logic for 'win98' and 'vista' ---
  
      animationTimer = window.setTimeout(() => {
        onComplete();
      }, duration);
  
      return () => {
        clearTimeout(animationTimer);
        if (progressIntervalXP) clearInterval(progressIntervalXP);
        if (audio) {
          audio.pause();
          audio.currentTime = 0;
        }
      };
    });
  
    // Helper to avoid SSR errors with audio
    import { browser } from '$app/environment';
  </script>
  
  <div
    class="fixed inset-0 z-[500] flex items-center justify-center transition-opacity duration-300 ease-in-out"
    class:opacity-100={showContent}
    class:opacity-0={!showContent}
    aria-live="assertive"
    aria-busy="true"
  >
    {#if themeOption.value === 'xp'}
      <div class="xp-boot-screen w-full h-full flex flex-col items-center justify-center text-center p-8">
        <div class="mb-12">
          <p class="xp-microsoft-text">Microsoft<sup class="text-xs">&reg;</sup></p>
          <h1 class="xp-windows-xp-text">Windows<sup class="text-xs">xp</sup></h1>
        </div>
        <div class="xp-progress-bar-indeterminate-container">
          <div class="xp-progress-slider">
            {#each Array(4) as _} <div class="xp-progress-block"></div> {/each}
          </div>
        </div>
      </div>
    {/if}
  
    {#if themeOption.value === 'win98'}
      <div class="win98-boot-screen w-full h-full flex flex-col items-center justify-center text-center p-8">
        <h1 class="win98-title-text">Microsoft<br />Windows 98</h1>
        <div class="win98-logo">
          <div class="flag-square red"></div>
          <div class="flag-square green"></div>
          <div class="flag-square blue"></div>
          <div class="flag-square yellow"></div>
        </div>
        <p class="mt-8 text-lg">Starting Windows 98...</p>
        <div class="win98-progress-bar-container mt-4">
          <div class="win98-progress-bar-fill"></div>
        </div>
      </div>
    {/if}
  
    {#if themeOption.value === 'vista'}
      <div class="vista-boot-screen w-full h-full flex flex-col items-center justify-center text-center p-8">
        <div class="vista-logo-placeholder mb-8">
          <p class="text-3xl font-light">Windows Vista<sup>&trade;</sup></p>
        </div>
        <div class="vista-progress-orb-container">
          <div class="vista-progress-orb"></div>
        </div>
      </div>
    {/if}
  </div>
  
  {#if browser}
    <audio bind:this={audio} preload="auto"></audio>
  {/if}
  
  <style lang="postcss">
    /* XP Styles (from previous iteration) */
    .xp-boot-screen {
      background-color: #000000;
      color: #E0E0E0;
      font-family: "Tahoma", "Verdana", sans-serif;
    }
    .xp-microsoft-text { @apply text-sm tracking-wider text-gray-300; }
    .xp-windows-xp-text {
      font-family: "Franklin Gothic Medium", "Arial Narrow", Arial, sans-serif;
      @apply text-4xl font-bold tracking-tight mt-1 text-white;
    }
    .xp-windows-xp-text sup { @apply text-xs align-super; }
    .xp-progress-bar-indeterminate-container {
      width: 200px; height: 16px; background-color: #333333;
      border: 1px solid #555555; border-radius: 1px;
      overflow: hidden; position: relative;
    }
    .xp-progress-slider {
      position: absolute; top: 0; left: 0; width: 100%; height: 100%;
      display: flex; animation: xp-slide 2s linear infinite;
    }
    .xp-progress-block {
      width: 8px; height: 100%; background-color: #39a93a;
      margin-right: 2px; flex-shrink: 0;
    }
    @keyframes xp-slide {
      0% { transform: translateX(-40%); }
      100% { transform: translateX(100%); }
    }
  
    /* Windows 98 Styles (Basic Placeholders) */
    .win98-boot-screen {
      background-color: #008080; /* Classic Teal */
      color: #FFFFFF;
      font-family: "MS Sans Serif", "Arial", sans-serif; /* MS Sans Serif is hard to get on web, Arial is fallback */
    }
    .win98-title-text {
      @apply text-4xl font-bold mb-8 leading-tight;
      text-shadow: 2px 2px #000000a0;
    }
    .win98-logo {
      @apply grid grid-cols-2 gap-0.5 w-16 h-16 mb-4;
    }
    .win98-logo .flag-square { @apply w-full h-full; }
    .win98-logo .red { background-color: #FF0000; }
    .win98-logo .green { background-color: #00FF00; }
    .win98-logo .blue { background-color: #0000FF; }
    .win98-logo .yellow { background-color: #FFFF00; }
    .win98-progress-bar-container {
      width: 250px; height: 20px; background-color: #808080; /* Gray track */
      border: 2px solid #FFFFFF; box-shadow: 2px 2px 0px #000000 inset, -2px -2px 0px #C0C0C0 inset;
      padding: 2px;
    }
    .win98-progress-bar-fill {
      width: 75%; /* Example fill */
      height: 100%; background-color: #000080; /* Dark Blue fill */
      /* TODO: Animate this if desired */
    }
  
  
    /* Windows Vista Styles (Basic Placeholders) */
    .vista-boot-screen {
      background-color: #000000;
      color: #FFFFFF;
      font-family: "Segoe UI", "Verdana", sans-serif;
    }
    .vista-logo-placeholder {
      /* Placeholder for Vista logo/text */
    }
    .vista-progress-orb-container {
      width: 80px;
      height: 80px;
      @apply mt-8;
      /* Placeholder for Vista's circular progress/aurora */
    }
    .vista-progress-orb {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      border: 4px solid transparent;
      border-top-color: #3498db; /* Light blue for spinner part */
      animation: vista-spin 1.5s linear infinite;
    }
    @keyframes vista-spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  </style>
  
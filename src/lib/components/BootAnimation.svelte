<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import type { ThemeOption } from '$lib/themeStore'; // Assumes this path is correct
  import { browser } from '$app/environment';

  export let themeOption: ThemeOption;
  export let onComplete: () => void;

  let showVisuals = false; // For initial fade-in of the boot screen itself
  let visualAnimationInProgress = true; // Tracks if the visual part of the animation is running
  
  // Sound-related state
  let soundIsPlaying = false; 
  let soundHasConcluded = !themeOption.sound; // True if no sound, or if sound ended/failed
  let playPromiseHasSettled = !themeOption.sound; // True if no sound, or if play() promise settled

  let audio: HTMLAudioElement | undefined;
  
  // Timers
  let visualAnimationTimer: number;
  let onCompleteDebounceTimer: number; // To give a slight grace period for audio to finish

  function tryToComplete() {
    if (browser) window.clearTimeout(onCompleteDebounceTimer);
    
    // Debugging log
    // console.log(`[BootAnimation] tryToComplete check: 
    //   visualInProgress=${visualAnimationInProgress}, 
    //   playPromiseSettled=${playPromiseHasSettled}, 
    //   soundConcluded=${soundHasConcluded}, 
    //   soundIsPlaying=${soundIsPlaying}`);
    
    if (!visualAnimationInProgress && playPromiseHasSettled && soundHasConcluded && !soundIsPlaying) {
      // console.log('[BootAnimation] All conditions met for onComplete, setting debounce timer.');
      if (browser) {
        onCompleteDebounceTimer = window.setTimeout(() => {
          // Re-check conditions in the timeout
          if (!visualAnimationInProgress && playPromiseHasSettled && soundHasConcluded && !soundIsPlaying) {
              // console.log('[BootAnimation] Debounced onComplete is being called.');
              onComplete();
          }
        }, 150); // Grace period for audio to fully stop before unmount
      }
    }
  }

  function playSoundIfNeeded() {
    if (browser && themeOption.sound) {
      if (!audio) {
        audio = new Audio(); 
      }
      audio.src = themeOption.sound;
      audio.preload = "auto";

      // Reset sound state flags before playing
      soundIsPlaying = false;
      soundHasConcluded = false;
      playPromiseHasSettled = false;

      audio.play()
        .then(() => {
          // console.log(`[BootAnimation] Sound '${themeOption.sound}' playback promise resolved.`);
          soundIsPlaying = true; // Sound is now actively playing
          playPromiseHasSettled = true; // Play attempt has settled
          // soundHasConcluded remains false until onended or onerror
        })
        .catch(e => {
          console.warn(`[BootAnimation] Sound '${themeOption.sound}' play() failed:`, e.message);
          soundIsPlaying = false;
          soundHasConcluded = true; // Playback failed, so sound part is "concluded"
          playPromiseHasSettled = true;
          tryToComplete(); // Check if we can complete now
        });

      audio.onended = () => {
        // console.log(`[BootAnimation] Sound '${themeOption.sound}' ended.`);
        soundIsPlaying = false;
        soundHasConcluded = true; // Playback ended naturally
        // playPromiseHasSettled should already be true
        tryToComplete();
      };

      audio.onerror = (e) => {
        console.error(`[BootAnimation] Audio element error for '${themeOption.sound}':`, e);
        soundIsPlaying = false;
        soundHasConcluded = true; // Treat as concluded on error
        playPromiseHasSettled = true;
        tryToComplete();
      };
    } else {
      // No sound for this theme, so sound part is immediately "settled" and "concluded"
      playPromiseHasSettled = true;
      soundHasConcluded = true;
      // tryToComplete() will be called when visual animation ends
    }
  }

  onMount(() => {
    showVisuals = true;
    
    // Initialize sound flags for themes without sound
    if (!themeOption.sound) {
        playPromiseHasSettled = true;
        soundHasConcluded = true;
    }

    // --- Visual Animation Handling ---
    const visualDuration = themeOption.animationDuration || 3000; // Default visual duration
    visualAnimationInProgress = true;

    // The Windows 2000 progress bar is CSS animated, so no specific JS interval needed here for it.
    // This timer is for the overall duration of the visual boot screen.

    if (browser) {
      visualAnimationTimer = window.setTimeout(() => {
        // console.log('[BootAnimation] Visual animation timer ended.');
        visualAnimationInProgress = false;
        
        // Now that visual animation is done, attempt to play the sound
        playSoundIfNeeded();
        
        // Check if we can complete (e.g., if there was no sound to begin with,
        // playSoundIfNeeded would have set soundHasConcluded and playPromiseHasSettled to true)
        tryToComplete(); 
      }, visualDuration);
    }

    // Initial check in case visual duration is 0 and there's no sound
    if (visualDuration === 0 && !themeOption.sound) {
        visualAnimationInProgress = false; // Ensure this is set
        tryToComplete();
    }

    return () => {
      // console.log('[BootAnimation] onDestroy cleanup.');
      if (browser) {
        window.clearTimeout(visualAnimationTimer);
        window.clearTimeout(onCompleteDebounceTimer);
      }
      if (audio) {
        audio.pause(); 
        audio.currentTime = 0;
        audio.onended = null; 
        audio.onerror = null;
        // console.log('[BootAnimation] Audio paused and listeners cleaned up on destroy.');
      }
      soundIsPlaying = false; // Reset state
    };
  });
</script>

<div
  class="fixed inset-0 z-[500] flex items-center justify-center transition-opacity duration-300 ease-in-out"
  class:opacity-100={showVisuals && !(!visualAnimationInProgress && soundHasConcluded && playPromiseHasSettled)} 
  class:opacity-0={!showVisuals || (!visualAnimationInProgress && soundHasConcluded && playPromiseHasSettled)}
  aria-live="assertive"
  aria-busy="true"
>
  {#if themeOption.value === 'win2000'}
    <div class="win2000-boot-screen w-full h-full flex flex-col items-center justify-center text-center p-8">
      <div class="win2000-logo-area mb-4">
        <span class="win2000-text-microsoft">Microsoft<sub>&reg;</sub></span>
        <span class="win2000-text-windows">Windows</span>
        <span class="win2000-text-2000">2000</span>
        <span class="win2000-text-edition">Professional</span>
      </div>
      <p class="win2000-text-starting mb-8">Starting up...</p>
      <div class="win2000-progress-bar-container">
        <div class="win2000-progress-slider">
          {#each Array(6) as _} <div class="win2000-progress-block"></div> {/each}
        </div>
      </div>
    </div>
  {/if}
  </div>

<style lang="postcss">
  /* Windows 2000 Boot Screen Styles */
  .win2000-boot-screen {
    background-color: #000000; /* Black background */
    color: #BCBCBC; /* Light gray text */
    font-family: "Lucida Console", "Courier New", monospace; /* Monospaced font */
    font-size: 14px; /* Or system default for terminals */
  }
  .win2000-logo-area {
    @apply flex flex-col items-center leading-none mb-6;
  }
  .win2000-text-microsoft {
    @apply text-xs text-gray-400 self-start ml-[20%]; /* Approximate position */
  }
  .win2000-text-windows {
    @apply text-4xl font-bold text-white;
  }
  .win2000-text-2000 {
    @apply text-4xl font-light text-white tracking-tight; /* 2000 was often lighter weight */
  }
  .win2000-text-edition {
    @apply text-xs text-gray-300 mt-1;
  }
  .win2000-text-starting {
    @apply text-sm text-gray-300;
  }
  .win2000-progress-bar-container {
    width: 220px; /* Width of the track */
    height: 18px; /* Height of the track */
    background-color: #181818; /* Dark gray track */
    border: 1px solid #5A5A5A; /* Mid-gray border */
    overflow: hidden;
    position: relative;
    padding: 2px; /* Inner padding for effect */
  }
  .win2000-progress-slider {
    position: absolute;
    top: 2px; bottom: 2px; left: 2px; /* Respect padding */
    width: 100%; /* Slider iterates across the container width */
    height: calc(100% - 4px);
    animation: win2000-slide 1.8s linear infinite;
    display: flex;
  }
  .win2000-progress-block {
    width: 10px; /* Width of each blue block */
    height: 100%;
    background-color: #0078D7; /* Windows Blue */
    margin-right: 3px; /* Space between blocks */
    flex-shrink: 0;
  }
  @keyframes win2000-slide {
    0% {
      transform: translateX(-60%); /* Start off-screen to the left (adjust based on number of blocks) */
    }
    100% {
      transform: translateX(110%); /* End off-screen to the right */
    }
  }

  /* Ensure styles for other themes (XP, 98, Vista) are removed or commented out */
</style>

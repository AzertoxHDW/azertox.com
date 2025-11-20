<script lang="ts">
  import { page } from '$app/stores';
  import { Button } from '$lib/components/ui/button';
  import { Home, Terminal, AlertTriangle } from 'lucide-svelte';
  import { currentTheme } from '$lib/themeStore';
  import StarField from '$lib/components/StarField.svelte';
  import { draggable } from '$lib/actions/draggable';
  import { onMount } from 'svelte';
  import { browser } from '$app/environment';

  let errorCode = $page.status;
  const errorObject = $page.error as Error & { stack?: string };
  let errorMessage = errorObject?.message || "Something went wrong";

  // BSOD error codes
  let stopCode = errorCode === 404 ? "0x00000404" : `0x${errorCode.toString(16).toUpperCase().padStart(8, '0')}`;
  let errorName = errorCode === 404 ? "PAGE_NOT_FOUND" : "KERNEL_MODE_EXCEPTION";

  // Individual ASCII art digits for draggable 404
  const digit4 = `
██╗  ██╗
██║  ██║
███████║
╚════██║
     ██║
     ╚═╝`;

  const digit0 = `
 ██████╗
██╔═████╗
██║██╔██║
████╔╝██║
╚██████╔╝
 ╚═════╝`;

  // Draggable element positions
  let terminalElement: HTMLElement;
  let digit1Element: HTMLElement;
  let digit2Element: HTMLElement;
  let digit3Element: HTMLElement;
  let errorTextElement: HTMLElement;

  let glitchOffset = 0;
  let glitchInterval: number;

  onMount(() => {
    // Add glitch effect for terminal view
    if ($currentTheme !== 'win2000') {
      glitchInterval = setInterval(() => {
        glitchOffset = Math.random() > 0.9 ? (Math.random() - 0.5) * 4 : 0;
      }, 100);
    }

    return () => {
      if (glitchInterval) clearInterval(glitchInterval);
    };
  });
</script>

<!-- StarField background for non-win2000 themes -->
{#if $currentTheme !== 'win2000'}
  <StarField />
{/if}

{#if $currentTheme === 'win2000'}
  <!-- Windows 2000 BSOD -->
  <div
    class="fixed inset-0 z-[999] flex flex-col items-center justify-center p-8 bg-[#0000AA] text-white font-['Lucida_Console',_'Courier_New',_monospace]"
    role="alert"
  >
    <div class="w-full max-w-3xl space-y-4 text-sm">
      <p class="text-lg font-bold">A problem has been detected and the page has been shut down to prevent damage.</p>

      <p class="text-2xl font-bold my-6">{errorName}</p>

      <p>The requested page could not be found or an error occurred while processing your request.</p>

      <div class="mt-6 space-y-1">
        <p>Technical information:</p>
        <p class="ml-4">*** STOP: {stopCode}</p>
        <p class="ml-4">*** {$page.url.pathname}</p>
        {#if errorObject?.message}
          <p class="ml-4">*** {errorObject.message}</p>
        {/if}
      </div>

      <div class="mt-8 pt-4 border-t border-white/30">
        <p class="text-xs opacity-80">Beginning dump of physical memory...</p>
        <p class="text-xs opacity-80">Physical memory dump complete.</p>
      </div>
    </div>

    <div class="mt-8">
      <Button
        href="/"
        variant="ghost"
        class="border-2 border-white bg-transparent hover:bg-white/20 text-white hover:text-white px-8 py-3"
      >
        <Home class="mr-2 h-5 w-5" /> Return to Home
      </Button>
      <p class="mt-4 text-xs text-center opacity-70">Press any key to continue... (or just click above)</p>
    </div>
  </div>
{:else}
  <!-- Terminal-Style 404 -->
  <div
    class="fixed inset-0 z-[999] overflow-hidden bg-background text-foreground"
    role="alert"
  >
    <!-- Draggable 404 Digits -->
    <div
      bind:this={digit1Element}
      class="absolute cursor-move select-none"
      use:draggable={{
        initialPosition: { x: browser ? window.innerWidth / 2 - 200 : 100, y: 100 }
      }}
    >
      <pre class="text-primary text-2xl md:text-3xl leading-tight" style="transform: translateX({glitchOffset}px)">{digit4}</pre>
    </div>

    <div
      bind:this={digit2Element}
      class="absolute cursor-move select-none"
      use:draggable={{
        initialPosition: { x: browser ? window.innerWidth / 2 - 50 : 250, y: 100 }
      }}
    >
      <pre class="text-primary text-2xl md:text-3xl leading-tight" style="transform: translateX({glitchOffset}px)">{digit0}</pre>
    </div>

    <div
      bind:this={digit3Element}
      class="absolute cursor-move select-none"
      use:draggable={{
        initialPosition: { x: browser ? window.innerWidth / 2 + 100 : 400, y: 100 }
      }}
    >
      <pre class="text-primary text-2xl md:text-3xl leading-tight" style="transform: translateX({glitchOffset}px)">{digit4}</pre>
    </div>

    <!-- Draggable Error Text -->
    <div
      bind:this={errorTextElement}
      class="absolute cursor-move select-none"
      use:draggable={{
        initialPosition: { x: browser ? window.innerWidth / 2 - 120 : 200, y: 250 }
      }}
    >
      <p class="text-destructive text-lg font-bold">⚠ ERROR: PAGE NOT FOUND ⚠</p>
    </div>

    <!-- Draggable Terminal Window -->
    <div
      bind:this={terminalElement}
      class="absolute cursor-move terminal-window border border-border rounded-lg overflow-hidden shadow-2xl w-full max-w-3xl"
      use:draggable={{
        handleSelector: '.terminal-header-drag',
        initialPosition: { x: browser ? (window.innerWidth - 800) / 2 : 50, y: 350 }
      }}
    >
        <!-- Terminal Header -->
        <div class="terminal-header-drag bg-muted border-b border-border px-4 py-2 flex items-center gap-2 cursor-move">
          <div class="flex gap-1.5">
            <div class="w-3 h-3 rounded-full bg-red-500"></div>
            <div class="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div class="w-3 h-3 rounded-full bg-green-500"></div>
          </div>
          <span class="text-sm text-muted-foreground font-mono ml-2">system@azertox:~/{errorCode} - Drag me around!</span>
        </div>

        <!-- Terminal Content -->
        <div class="bg-card p-6 md:p-8 font-mono text-sm min-h-[400px] flex flex-col">
          <div class="flex-1">
            <div class="space-y-3 text-muted-foreground">
              <p class="flex items-start gap-2">
                <Terminal class="h-4 w-4 mt-0.5 flex-shrink-0 text-primary" />
                <span>$ <span class="text-foreground">curl {$page.url.pathname}</span></span>
              </p>

              <p class="text-destructive flex items-start gap-2">
                <AlertTriangle class="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span>Error {errorCode}: The requested resource could not be found on this server.</span>
              </p>

              {#if errorMessage && errorMessage !== "Not Found"}
                <p class="ml-6 text-sm opacity-80">Message: {errorMessage}</p>
              {/if}

              <div class="mt-6 ml-6 space-y-1 text-xs opacity-60">
                <p>→ The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.</p>
                <p>→ If you typed the URL manually, please check your spelling and try again.</p>
                <p>→ If you followed a link from somewhere, please let us know.</p>
              </div>

              <div class="mt-6 pt-4 border-t border-border">
                <p class="text-xs">
                  <span class="text-muted-foreground">Request ID:</span>
                  <span class="text-primary">{Math.random().toString(36).substr(2, 9).toUpperCase()}</span>
                </p>
                <p class="text-xs">
                  <span class="text-muted-foreground">Timestamp:</span>
                  <span class="text-primary">{new Date().toISOString()}</span>
                </p>
              </div>
            </div>
          </div>

          <!-- Terminal prompt -->
          <div class="mt-8 flex items-center gap-2">
            <span class="text-primary">$</span>
            <span class="text-muted-foreground animate-pulse">_</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Draggable Home Button -->
    <div
      class="absolute cursor-move select-none"
      use:draggable={{
        initialPosition: { x: browser ? window.innerWidth / 2 - 100 : 300, y: browser ? window.innerHeight - 150 : 600 }
      }}
    >
      <Button
        href="/"
        variant="default"
        class="px-8 py-3 gap-2 shadow-2xl"
      >
        <Home class="h-5 w-5" /> Return to Home
      </Button>
    </div>

    <!-- Helpful hint -->
    <div class="absolute bottom-4 right-4 text-sm text-muted-foreground opacity-70 select-none">
      💡 Hint: Everything is draggable! Have fun!
    </div>
  </div>
{/if}

<style lang="postcss">
  .terminal-window {
    animation: fadeIn 0.3s ease-out;
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
</style>

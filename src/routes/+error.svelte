<script lang="ts">
  import { page } from '$app/stores';
  import { Button } from '$lib/components/ui/button';
  import { Home, Terminal, AlertTriangle } from 'lucide-svelte';
  import { currentTheme } from '$lib/themeStore';
  import StarField from '$lib/components/StarField.svelte';
  import { onMount } from 'svelte';

  let errorCode = $page.status;
  const errorObject = $page.error as Error & { stack?: string };
  let errorMessage = errorObject?.message || "Something went wrong";

  // BSOD error codes
  let stopCode = errorCode === 404 ? "0x00000404" : `0x${errorCode.toString(16).toUpperCase().padStart(8, '0')}`;
  let errorName = errorCode === 404 ? "PAGE_NOT_FOUND" : "KERNEL_MODE_EXCEPTION";

  // Terminal ASCII art for 404
  const ascii404 = `
    ▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
    █                                                  █
    █     ██╗  ██╗  ██████╗  ██╗  ██╗                █
    █     ██║  ██║ ██╔═████╗ ██║  ██║                █
    █     ███████║ ██║██╔██║ ███████║                █
    █     ╚════██║ ████╔╝██║ ╚════██║                █
    █          ██║ ╚██████╔╝      ██║                █
    █          ╚═╝  ╚═════╝       ╚═╝                █
    █                                                  █
    █         ⚠  ERROR: PAGE NOT FOUND  ⚠            █
    █                                                  █
    █   ┌─────────────────────────────────────────┐  █
    █   │  [FATAL] Resource unavailable           │  █
    █   │  [INFO]  404 :: Not Found                │  █
    █   │  [WARN]  Unable to locate requested path │  █
    █   └─────────────────────────────────────────┘  █
    █                                                  █
    ▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀
  `;

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
    class="fixed inset-0 z-[999] flex flex-col items-center justify-center p-4 bg-background text-foreground"
    role="alert"
  >
    <div class="w-full max-w-4xl">
      <!-- Terminal Window -->
      <div class="terminal-window border border-border rounded-lg overflow-hidden shadow-2xl">
        <!-- Terminal Header -->
        <div class="bg-muted border-b border-border px-4 py-2 flex items-center gap-2">
          <div class="flex gap-1.5">
            <div class="w-3 h-3 rounded-full bg-red-500"></div>
            <div class="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div class="w-3 h-3 rounded-full bg-green-500"></div>
          </div>
          <span class="text-sm text-muted-foreground font-mono ml-2">system@azertox:~/{errorCode}</span>
        </div>

        <!-- Terminal Content -->
        <div class="bg-card p-6 md:p-8 font-mono text-sm min-h-[500px] flex flex-col">
          <div class="flex-1">
            <!-- ASCII Art with glitch effect -->
            <pre class="text-primary text-[10px] leading-[1.2] mb-6 overflow-x-auto" style="transform: translateX({glitchOffset}px)">{ascii404}</pre>

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

      <!-- Action Button -->
      <div class="mt-6 text-center">
        <Button
          href="/"
          variant="default"
          class="px-8 py-3 gap-2"
        >
          <Home class="h-5 w-5" /> Return to Home
        </Button>
        <p class="mt-3 text-sm text-muted-foreground">or press Ctrl+C to abort (just kidding)</p>
      </div>
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

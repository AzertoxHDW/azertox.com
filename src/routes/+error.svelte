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

  // ASCII art for all digits 0-9
  const asciiDigits: { [key: string]: string } = {
    '0': `
 ██████╗
██╔═████╗
██║██╔██║
████╔╝██║
╚██████╔╝
 ╚═════╝`,
    '1': `
 ███╗
████║
╚██╔╝
 ██║
 ██║
 ╚═╝`,
    '2': `
██████╗
╚════██╗
 █████╔╝
██╔═══╝
███████╗
╚══════╝`,
    '3': `
██████╗
╚════██╗
 █████╔╝
 ╚═══██╗
██████╔╝
╚═════╝`,
    '4': `
██╗  ██╗
██║  ██║
███████║
╚════██║
     ██║
     ╚═╝`,
    '5': `
███████╗
██╔════╝
███████╗
╚════██║
███████║
╚══════╝`,
    '6': `
 ██████╗
██╔════╝
███████╗
██╔═══██╗
╚██████╔╝
 ╚═════╝`,
    '7': `
███████╗
╚════██║
    ██╔╝
   ██╔╝
   ██║
   ╚═╝`,
    '8': `
 █████╗
██╔══██╗
╚█████╔╝
██╔══██╗
╚█████╔╝
 ╚════╝`,
    '9': `
 █████╗
██╔══██╗
╚██████║
 ╚═══██║
 █████╔╝
 ╚════╝`
  };

  // Get error code digits dynamically
  const errorCodeString = errorCode.toString();
  const errorDigits = errorCodeString.split('').map(digit => asciiDigits[digit]);

  // BSOD error codes and names
  let stopCode = `0x${errorCode.toString(16).toUpperCase().padStart(8, '0')}`;

  // Map error codes to BSOD error names
  const errorNames: { [key: number]: string } = {
    400: 'BAD_REQUEST',
    401: 'UNAUTHORIZED_ACCESS',
    403: 'ACCESS_FORBIDDEN',
    404: 'PAGE_NOT_FOUND',
    405: 'METHOD_NOT_ALLOWED',
    408: 'REQUEST_TIMEOUT',
    418: 'IM_A_TEAPOT',
    429: 'TOO_MANY_REQUESTS',
    500: 'INTERNAL_SERVER_ERROR',
    501: 'NOT_IMPLEMENTED',
    502: 'BAD_GATEWAY',
    503: 'SERVICE_UNAVAILABLE',
    504: 'GATEWAY_TIMEOUT'
  };

  let errorName = errorNames[errorCode] || 'KERNEL_MODE_EXCEPTION';

  // Map error codes to user-friendly messages
  const errorDescriptions: { [key: number]: string } = {
    400: 'The request could not be understood by the server due to malformed syntax.',
    401: 'Authentication is required to access this resource.',
    403: 'You do not have permission to access this resource.',
    404: 'The requested resource could not be found on this server.',
    405: 'The request method is not supported for this resource.',
    408: 'The server timed out waiting for the request.',
    418: "I'm a teapot. This server refuses to brew coffee because it is, permanently, a teapot.",
    429: 'Too many requests. Please slow down and try again later.',
    500: 'The server encountered an internal error and could not complete your request.',
    501: 'The server does not support the functionality required to fulfill the request.',
    502: 'The server received an invalid response from an upstream server.',
    503: 'The service is temporarily unavailable. Please try again later.',
    504: 'The server did not receive a timely response from an upstream server.'
  };

  const errorDescription = errorDescriptions[errorCode] || 'An unexpected error occurred while processing your request.';

  // Map error codes to error labels
  const errorLabels: { [key: number]: string } = {
    400: 'BAD REQUEST',
    401: 'UNAUTHORIZED',
    403: 'FORBIDDEN',
    404: 'PAGE NOT FOUND',
    405: 'METHOD NOT ALLOWED',
    408: 'REQUEST TIMEOUT',
    418: "I'M A TEAPOT",
    429: 'TOO MANY REQUESTS',
    500: 'INTERNAL SERVER ERROR',
    501: 'NOT IMPLEMENTED',
    502: 'BAD GATEWAY',
    503: 'SERVICE UNAVAILABLE',
    504: 'GATEWAY TIMEOUT'
  };

  const errorLabel = errorLabels[errorCode] || 'ERROR';

  // Draggable element positions
  let terminalElement: HTMLElement;
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

      <p>{errorDescription}</p>

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
  <!-- Terminal-Style Error Page -->
  <div
    class="fixed inset-0 z-[999] overflow-hidden bg-background text-foreground"
    role="alert"
  >
    <!-- Draggable Error Code Digits -->
    {#each errorDigits as digit, i}
      <div
        class="absolute cursor-move select-none"
        use:draggable={{
          initialPosition: {
            x: browser ? window.innerWidth / 2 - (errorDigits.length * 75) + (i * 150) : 100 + (i * 150),
            y: 100
          }
        }}
      >
        <pre class="text-primary text-2xl md:text-3xl leading-tight" style="transform: translateX({glitchOffset}px)">{digit}</pre>
      </div>
    {/each}

    <!-- Draggable Error Text -->
    <div
      bind:this={errorTextElement}
      class="absolute cursor-move select-none"
      use:draggable={{
        initialPosition: { x: browser ? window.innerWidth / 2 - 120 : 200, y: 380 }
      }}
    >
      <p class="text-destructive text-lg font-bold">⚠ ERROR: {errorLabel} ⚠</p>
    </div>

    <!-- Draggable Terminal Window -->
    <div
      bind:this={terminalElement}
      class="absolute cursor-move terminal-window border border-border rounded-lg overflow-hidden shadow-2xl w-full max-w-3xl"
      use:draggable={{
        handleSelector: '.terminal-header-drag',
        initialPosition: { x: browser ? (window.innerWidth - 800) / 2 : 50, y: 450 }
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
                <span>Error {errorCode}: {errorDescription}</span>
              </p>

              {#if errorMessage && errorMessage !== "Not Found" && errorMessage !== "Something went wrong"}
                <p class="ml-6 text-sm opacity-80">Message: {errorMessage}</p>
              {/if}

              <div class="mt-6 ml-6 space-y-1 text-xs opacity-60">
                {#if errorCode >= 400 && errorCode < 500}
                  <p>→ Client error: The request contains bad syntax or cannot be fulfilled.</p>
                  <p>→ Please check the URL and try again, or contact support if the problem persists.</p>
                {:else if errorCode >= 500}
                  <p>→ Server error: The server failed to fulfill a valid request.</p>
                  <p>→ This is not your fault. Please try again later or contact support.</p>
                {:else}
                  <p>→ An unexpected error occurred while processing your request.</p>
                  <p>→ Please try again or contact support if the problem persists.</p>
                {/if}
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

    <!-- Draggable Home Button -->
    <div
      class="absolute select-none cursor-move"
      use:draggable={{
        initialPosition: { x: browser ? window.innerWidth / 2 - 100 : 300, y: browser ? window.innerHeight - 150 : 600 }
      }}
    >
      <Button
        href="/"
        variant="default"
        class="px-8 py-3 gap-2 shadow-2xl pointer-events-auto"
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

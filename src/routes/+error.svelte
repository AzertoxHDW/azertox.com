<script lang="ts">
    import { page } from '$app/stores';
    import { Button } from '$lib/components/ui/button'; //
    import { Home } from 'lucide-svelte';
    import { onMount } from 'svelte';
  
    let activeWindowsTheme = '';
    let bsodBackgroundColor = 'bg-blue-700'; 
    let bsodTextColor = 'text-white';
    let bsodFont = 'font-mono'; //
  
    onMount(() => {
      if (document.documentElement.classList.contains('theme-xp')) {
        activeWindowsTheme = 'xp';
        bsodBackgroundColor = 'bg-[#0000AA]'; 
        bsodFont = 'font-["Lucida_Console",_"Courier_New",_monospace]'; 
      } else if (document.documentElement.classList.contains('theme-win98')) {
        activeWindowsTheme = 'win98';
        bsodBackgroundColor = 'bg-blue-800'; 
        bsodFont = 'font-["Fixedsys",_"Terminal",_monospace]';
      } else if (document.documentElement.classList.contains('theme-vista')) {
        activeWindowsTheme = 'vista';
        bsodBackgroundColor = 'bg-sky-700'; 
        bsodFont = 'font-["Consolas",_"Lucida_Console",_monospace]';
      }
    });
  
    let errorCode = $page.status;
    // $page.error is of type App.Error. We cast it to the global Error type to access common properties.
    const errorObject = $page.error as Error & { stack?: string }; // Cast and assume stack might be there
  
    let errorMessage = errorObject?.message || "Quelque chose s'est mal passé.";
    let errorNameFromObject = errorObject?.name || 'N/A'; // Safely access name
  
    let stopCode = "0x000000404"; 
    let errorNameDisplay = "PAGE_NOT_FOUND_IN_NONPAGED_AREA";
  
    if (errorCode !== 404) {
      stopCode = `0xDEADBEEF${errorCode}`; 
      errorNameDisplay = "UNEXPECTED_KERNEL_MODE_TRAP";
    }
  </script>
  
  <div
    class="fixed inset-0 z-[999] flex flex-col items-center justify-center p-4 sm:p-8 transition-colors duration-300 {bsodFont} {bsodBackgroundColor} {bsodTextColor}"
    role="alert"
  >
    <div class="w-full max-w-2xl text-left space-y-3 sm:space-y-4 text-[10px] sm:text-xs md:text-sm leading-tight">
      <p>A problem has been detected and Azertox.com has been shut down to prevent damage to your Browse experience.</p>
  
      <p class="uppercase font-semibold text-lg sm:text-xl md:text-2xl my-2 sm:my-4">{errorNameDisplay}</p>
  
      <p>If this is the first time you've seen this Stop error screen, restart your navigation. If this screen appears again, follow these steps:</p>
  
      <p>Check to make sure any new hardware or software is properly installed. If this is a new installation, ask your hardware or software manufacturer for any Windows updates you might need. (Okay, maybe not Windows updates for a website!)</p>
  
      <p>If problems continue, disable or remove any newly installed hardware or software. Disable BIOS memory options such as caching or shadowing. If you need to use Safe Mode to remove or disable components, restart your computer, press F8 to select Advanced Startup Options, and then select Safe Mode. (Humorously anachronistic advice for a website error).</p>
  
      <p class="mt-2 sm:mt-4">Technical information:</p>
  
      <p class="uppercase">*** STOP: {stopCode} ({errorNameFromObject}, {$page.url.pathname}, 0x00000000, 0x00000000)</p>
      
      {#if errorObject?.stack}
          <p class="mt-2 sm:mt-4">*** STACK_TRACE (first line):</p>
          <p class="break-all">{errorObject.stack.split('\n')[0]}</p>
      {/if}
  
      <p class="mt-3 sm:mt-6">Attempting to dump physical memory to disk... (Not really!)</p>
      <p>Physical memory dump complete.</p>
      <p>Contact your system administrator or technical support group for further assistance. (That's me!)</p>
    </div>
  
    <div class="mt-6 sm:mt-8 text-center">
      <Button
        href="/"
        variant="outline"
        class="border-white/50 hover:bg-white/10 text-white hover:text-white px-6 py-3 text-base"
        on:click={() => {
          if (window.history.length > 1) {
            window.history.back();
          } else {
            window.location.href = '/';
          }
        }}
      >
        <Home class="mr-2 h-5 w-5" /> Retourner à l'accueil (ou Précédent)
      </Button>
      <p class="mt-4 text-xs opacity-70">Press any key to restart... (Just kidding, click the button!)</p>
    </div>
  </div>
  
  <style lang="postcss">
    /* Styles remain the same */
  </style>
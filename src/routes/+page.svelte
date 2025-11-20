<script lang="ts">
  // This page now just renders its content.
  // The boot animation is handled by the layout when a Windows theme is selected.
  import { Button } from "$lib/components/ui/button/index.js";
  import { Card, CardHeader, CardTitle, CardContent } from "$lib/components/ui/card/index.js";
  import { flyAndScale } from "$lib/utils.js";
  import { Terminal, UserCircle, ServerIcon, FolderGit2, ArrowRight, Gem } from "lucide-svelte";
  import StarField from '$lib/components/StarField.svelte';
  import HomeTerminal from '$lib/components/HomeTerminal.svelte';
  import { draggable } from '$lib/actions/draggable';
  import { writable } from 'svelte/store';
  import { onMount } from 'svelte';
  import { browser } from '$app/environment';
  import { currentTheme } from '$lib/themeStore';
  import { mobileTerminalTrigger } from '$lib/mobileMenuStore';

  const CARD_WIDTH = 450;
  const CARD_GAP = 40;

  // Dashboard links data
  const dashboardLinks = [
    {
        href: "/about",
        title: "Informations utilisateur",
        description: "Afficher les informations sur cet utilisateur.",
        icon: UserCircle,
        details: "Utilisateur: Az' (Administrateur)",
    },
    {
        href: "/infra",
        title: "Poste de travail",
        description: "Afficher les serveurs et l'infrastructure.",
        icon: ServerIcon,
        details: "Domaine: WORKGROUP | IP: Automatique",
    },
    {
        href: "/projects",
        title: "Mes projets",
        description: "Parcourir les projets et les développements en cours.",
        icon: FolderGit2,
        details: "Espace libre: 2.4TB",
    },
    {
        href: "/museum",
        title: "Archives",
        description: "Afficher les artefacts du musée.",
        icon: Gem,
        details: "Password: LOUVRE",
    }
  ];

  // Calculate centered initial positions
  function calculateInitialPositions() {
    if (!browser) {
      // Default positions for SSR
      return [
        { x: 100, y: 50 },
        { x: 550, y: 50 },
        { x: 100, y: 400 },
        { x: 550, y: 400 }
      ];
    }

    const viewportWidth = window.innerWidth;
    const totalWidth = (CARD_WIDTH * 2) + CARD_GAP;
    const startX = (viewportWidth - totalWidth) / 2;

    return [
      { x: startX, y: 50 },
      { x: startX + CARD_WIDTH + CARD_GAP, y: 50 },
      { x: startX, y: 400 },
      { x: startX + CARD_WIDTH + CARD_GAP, y: 400 }
    ];
  }

  let initialPositions = calculateInitialPositions();

  // Store DOM references for direct z-index manipulation
  let cardElements: (HTMLElement | null)[] = [];
  let terminalElement: HTMLElement | null = null;
  let highestZIndex = 200; // Start at 200 to be above header (z-100) and footer (z-100)
  let showTerminal = false;
  let activeWindowIndex: number | null = null;

  // Detect if we're on mobile
  let isMobile = false;

  function bringToFront(index: number) {
    const element = cardElements[index];
    if (element) {
      element.style.zIndex = String(++highestZIndex);
      activeWindowIndex = index;
    }
  }

  function bringTerminalToFront() {
    if (terminalElement) {
      terminalElement.style.zIndex = String(++highestZIndex);
      activeWindowIndex = -1; // Use -1 to indicate terminal is active
    }
  }

  function toggleTerminal() {
    showTerminal = !showTerminal;
  }

  function closeTerminal() {
    showTerminal = false;
  }

  function checkMobile() {
    if (browser) {
      isMobile = window.innerWidth < 1024; // lg breakpoint - includes tablets
    }
  }

  // Listen for mobile terminal trigger from hamburger menu
  $: if ($mobileTerminalTrigger && isMobile) {
    showTerminal = true;
    mobileTerminalTrigger.set(false); // Reset the trigger
  }

  onMount(() => {
    // Recalculate positions on mount to ensure proper centering
    initialPositions = calculateInitialPositions();
    checkMobile();

    // Listen for resize events
    const handleResize = () => {
      checkMobile();
      initialPositions = calculateInitialPositions();
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  });
</script>

<svelte:head>
    <title>Az'</title>
    <meta name="description" content="Salut ! Bienvenue sur mon site" />
</svelte:head>

<style lang="postcss">
  /* Styles for the icon wrappers in terminal cards */
  .icon-wrapper {
    @apply p-2 bg-primary/10 rounded-md text-primary inline-flex;
  }
</style>

{#if $currentTheme !== 'win2000'}
  <StarField />
{/if}
<div class="w-full min-h-screen flex flex-col text-foreground">
    <!-- Terminal Toggle Button (Desktop only) -->
    <button
      on:click={toggleTerminal}
      class="terminal-toggle-btn hidden lg:flex fixed top-4 right-4 lg:top-6 lg:right-6 z-[150] w-10 h-10 rounded-full bg-primary/10 hover:bg-primary/20 border border-primary/30 items-center justify-center transition-all hover:scale-110 backdrop-blur-sm"
      aria-label="{showTerminal ? 'Fermer' : 'Ouvrir'} Terminal"
    >
      <Terminal class="h-4 w-4 text-primary" />
    </button>

    <!-- Header -->
    <header class="text-center space-y-2 py-4 px-4 md:py-6 relative z-[100]" in:flyAndScale={{ y:0, duration:500, start:0.95}}>
      <h1 class="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight flex flex-col md:flex-row items-center justify-center gap-2 md:gap-0">
          <Terminal class="h-6 w-6 md:h-8 md:w-8 md:mr-2 text-primary" />
          <span class="flex items-center gap-2">Interface Système: <span class="text-primary">Az'</span></span>
      </h1>
      <p class="text-xs md:text-sm lg:text-base text-muted-foreground px-4">
        Tableau de bord opérationnel pour les ressources système et la navigation des projets.
      </p>
    </header>

    <!-- Mobile: Vertical Stack Layout -->
    {#if isMobile}
      <div class="px-4 pb-6 space-y-4">
        {#each dashboardLinks as item, i}
          <div
            class="terminal-window w-full"
            in:flyAndScale|global={{ y: 20, duration: 300, start: 0.98, delay: i * 100 }}
          >
            <!-- Terminal Title Bar -->
            <div class="terminal-titlebar">
              <div class="terminal-controls">
                <div class="terminal-btn close"></div>
                <div class="terminal-btn minimize"></div>
                <div class="terminal-btn maximize"></div>
              </div>
              <div class="terminal-title">~ {item.title.toLowerCase().replace(/\s+/g, '-')} ~</div>
            </div>

            <!-- Terminal Content -->
            <div class="terminal-content">
              <Card class="h-full flex flex-col !border-0 !shadow-none !rounded-none">
                <CardHeader class="pb-3">
                  <div class="flex items-center gap-2">
                    <div class="icon-wrapper">
                        <svelte:component this={item.icon} class="h-5 w-5" />
                    </div>
                    <CardTitle class="text-lg !mt-0">{item.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent class="flex-grow py-2">
                  <p class="text-muted-foreground text-xs mb-2">{item.description}</p>
                  <p class="text-xs font-mono text-primary/80 bg-muted/50 p-1.5 rounded">{item.details}</p>
                </CardContent>
                <div class="p-3 pt-2">
                  <Button href={item.href} class="w-full text-sm py-1.5" variant="outline">
                    Explorer <ArrowRight class="ml-2 h-3 w-3" />
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        {/each}
      </div>

      <!-- Mobile Terminal (Full Screen Overlay) -->
      {#if showTerminal}
        <div
          class="fixed inset-0 z-[200] bg-background/95 backdrop-blur-sm p-4 flex flex-col"
          in:flyAndScale|global={{ y: 20, duration: 500, start: 0.95 }}
        >
          <div class="terminal-window flex-1 flex flex-col mb-4">
            <HomeTerminal onClose={closeTerminal} />
          </div>

          <!-- Large Close Button at Bottom Center -->
          <button
            on:click={closeTerminal}
            class="w-full max-w-xs mx-auto py-4 rounded-lg bg-destructive/20 hover:bg-destructive/30 border-2 border-destructive/50 flex items-center justify-center gap-2 transition-all text-destructive font-semibold"
            aria-label="Fermer le terminal"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
            Fermer le terminal
          </button>
        </div>
      {/if}
    {:else}
      <!-- Desktop: Draggable Cards Container -->
      <div class="relative w-full" style="height: 750px;">
        {#each dashboardLinks as item, i}
          <div
            bind:this={cardElements[i]}
            class="terminal-window absolute {activeWindowIndex === i ? 'active' : ''}"
            style="z-index: {10 + i}; width: {CARD_WIDTH}px;"
            in:flyAndScale|global={{ y: 20, duration: 300, start: 0.98, delay: i * 100 }}
            use:draggable={{
              handleSelector: '.terminal-titlebar',
              initialPosition: { x: initialPositions[i].x, y: initialPositions[i].y },
              onDragStart: () => bringToFront(i)
            }}
          >
            <!-- Terminal Title Bar -->
            <div class="terminal-titlebar">
              <div class="terminal-controls">
                <div class="terminal-btn close"></div>
                <div class="terminal-btn minimize"></div>
                <div class="terminal-btn maximize"></div>
              </div>
              <div class="terminal-title">~ {item.title.toLowerCase().replace(/\s+/g, '-')} ~</div>
            </div>

            <!-- Terminal Content -->
            <div class="terminal-content" on:mousedown={() => bringToFront(i)}>
              <Card class="h-full flex flex-col !border-0 !shadow-none !rounded-none">
                <CardHeader class="pb-3">
                  <div class="flex items-center gap-2">
                    <div class="icon-wrapper">
                        <svelte:component this={item.icon} class="h-5 w-5" />
                    </div>
                    <CardTitle class="text-lg !mt-0 group-hover:text-primary">{item.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent class="flex-grow py-2">
                  <p class="text-muted-foreground text-xs mb-2">{item.description}</p>
                  <p class="text-xs font-mono text-primary/80 bg-muted/50 p-1.5 rounded">{item.details}</p>
                </CardContent>
                <div class="p-3 pt-2">
                  <Button href={item.href} target={item.external ? '_blank' : undefined} rel={item.external ? 'noopener noreferrer' : undefined} class="w-full text-sm py-1.5" variant="outline">
                    {item.external ? 'Accéder' : 'Explorer'} <ArrowRight class="ml-2 h-3 w-3" />
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        {/each}
      </div>

      <!-- Desktop: Terminal Window (Draggable) -->
      {#if showTerminal}
        <div
          bind:this={terminalElement}
          class="terminal-window absolute {activeWindowIndex === -1 ? 'active' : ''} w-[90vw] max-w-4xl"
          style="z-index: 200;"
          in:flyAndScale|global={{ y: 20, duration: 500, start: 0.95 }}
          use:draggable={{
            handleSelector: '.terminal-titlebar',
            initialPosition: { x: browser ? (window.innerWidth * 0.05) : 50, y: 300 },
            onDragStart: () => bringTerminalToFront()
          }}
          on:mousedown={() => bringTerminalToFront()}
        >
          <HomeTerminal onFocus={bringTerminalToFront} onClose={closeTerminal} />
        </div>
      {/if}
    {/if}

    <!-- Footer -->
    <footer class="text-center text-[10px] md:text-xs text-muted-foreground py-2 md:py-3 px-4 relative z-[100]">
        <p class="break-words">&copy; {new Date().getFullYear()} Dylan "Azertox" R. | Horloge système: {new Date().toLocaleTimeString('fr-BE')} | Source code: <a href="https://github.com/AzertoxHDW/azertox.com" class="text-primary hover:underline">Github</a></p>
        <p class="mt-1">Développé avec Svelte & TailwindCSS</p>
    </footer>
</div>

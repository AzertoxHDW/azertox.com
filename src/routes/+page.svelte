<script lang="ts">
  // This page now just renders its content.
  // The boot animation is handled by the layout when a Windows theme is selected.
  import { Button } from "$lib/components/ui/button/index.js";
  import { Card, CardHeader, CardTitle, CardContent } from "$lib/components/ui/card/index.js";
  import { flyAndScale } from "$lib/utils.js";
  import { Terminal, UserCircle, ServerIcon, FolderGit2, ArrowRight, Gem } from "lucide-svelte";
  import StarField from '$lib/components/StarField.svelte';
  import { draggable } from '$lib/actions/draggable';
  import { writable } from 'svelte/store';
  import { onMount } from 'svelte';
  import { browser } from '$app/environment';

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
  let highestZIndex = 10 + dashboardLinks.length;

  function bringToFront(index: number) {
    const element = cardElements[index];
    if (element) {
      element.style.zIndex = String(++highestZIndex);
    }
  }

  onMount(() => {
    // Recalculate positions on mount to ensure proper centering
    initialPositions = calculateInitialPositions();
  });
</script>

<svelte:head>
    <title>Az'</title>
    <meta name="description" content="Salut ! Bienvenue sur mon site" />
</svelte:head>

<style lang="postcss">
  /* Styles for the icon wrappers in terminal cards */
  .icon-wrapper {
    @apply p-3 bg-primary/10 rounded-lg text-primary inline-flex;
  }
</style>

<StarField />
<div class="w-full min-h-screen flex flex-col text-foreground">
    <!-- Header -->
    <header class="text-center space-y-2 py-8 relative z-[100]" in:flyAndScale={{ y:0, duration:500, start:0.95}}>
      <h1 class="text-4xl md:text-5xl font-bold tracking-tight flex items-center justify-center">
          <Terminal class="h-10 w-10 mr-3 text-primary" /> Interface Système: <span class="ml-2 text-primary">Az'</span>
      </h1>
      <p class="text-muted-foreground md:text-lg">
        Tableau de bord opérationnel pour les ressources système et la navigation des projets.
      </p>
    </header>

    <!-- Draggable Cards Container -->
    <div class="flex-1 relative w-full" style="min-height: calc(100vh - 200px);">
      {#each dashboardLinks as item, i}
        <div
          bind:this={cardElements[i]}
          class="terminal-window absolute"
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
              <CardHeader>
                <div class="flex items-center gap-3">
                  <div class="icon-wrapper">
                      <svelte:component this={item.icon} class="h-7 w-7" />
                  </div>
                  <CardTitle class="text-xl !mt-0 group-hover:text-primary">{item.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent class="flex-grow">
                <p class="text-muted-foreground text-sm mb-3">{item.description}</p>
                <p class="text-xs font-mono text-primary/80 bg-muted/50 p-2 rounded">{item.details}</p>
              </CardContent>
              <div class="p-4 pt-2">
                <Button href={item.href} target={item.external ? '_blank' : undefined} rel={item.external ? 'noopener noreferrer' : undefined} class="w-full" variant="outline">
                  {item.external ? 'Accéder' : 'Explorer'} <ArrowRight class="ml-2 h-4 w-4" />
                </Button>
              </div>
            </Card>
          </div>
        </div>
      {/each}
    </div>

    <!-- Footer -->
    <footer class="text-center text-sm text-muted-foreground py-8 relative z-[100]">
        <p>&copy; {new Date().getFullYear()} Dylan "Azertox" R. | Horloge système: {new Date().toLocaleTimeString('fr-BE')} | Source code: <a href="https://github.com/AzertoxHDW/azertox.com">Github</a></p>
        <p class="mt-1">Développé avec Svelte & TailwindCSS</p>
    </footer>
</div>

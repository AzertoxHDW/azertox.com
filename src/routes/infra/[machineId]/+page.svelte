<script lang="ts">
  import type { PageData } from './$types';
  import { infrastructure, type Machine, type MachineSpec } from '$lib/infra-data';
  import { rackDevices, TOTAL_U_SLOTS } from '$lib/rack-data';
  import { Badge } from "$lib/components/ui/badge"; //
  import { Button } from "$lib/components/ui/button"; //
  import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "$lib/components/ui/card"; //
  // Added Laptop to the import list
  import { ArrowLeft, ExternalLink, Activity, CalendarDays, Info, ListChecks, ImageIcon, Laptop, Server, Cpu, MemoryStick, HardDrive, Network, Terminal as TerminalIcon, X } from "lucide-svelte";
  import { flyAndScale } from "$lib/utils"; //
  import { onMount } from 'svelte';

  export let data: PageData;

  let machine: Machine | undefined = data.machine;

  // Find rack position for current machine
  $: rackPosition = machine ? rackDevices.find(d => d.infraMachineId === machine.id) : null;

  let selectedImage: string | undefined;
  let lightboxOpen = false;

  onMount(() => {
    if (machine?.gallery && machine.gallery.length > 0) {
      selectedImage = machine.gallery[0];
    } else if (machine?.imageUrl) {
      selectedImage = machine.imageUrl;
    }
  });

  function openLightbox() {
    lightboxOpen = true;
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightboxOpen = false;
    document.body.style.overflow = '';
  }

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === 'Escape' && lightboxOpen) {
      closeLightbox();
    }
  }

  function formatDate(dateString?: string): string {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }
</script>

<svelte:window on:keydown={handleKeydown} />

{#if machine}
  <div class="container mx-auto px-4 py-8 md:py-12 min-h-screen_minus_header_footer" in:flyAndScale={{ y: 50, duration: 400, start: 0.75 }}>
    <div class="mb-8">
      <Button href="/infra" variant="outline" size="sm">
        <ArrowLeft class="mr-2 h-4 w-4" /> Retour à l'infrastructure
      </Button>
    </div>

    <header class="mb-10 md:mb-12">
      <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 class="text-4xl sm:text-5xl font-bold tracking-tight text-foreground">{machine.name}</h1>
          <p class="text-xl text-primary font-semibold mt-1">{machine.role}</p>
        </div>
        {#if machine.status}
          <Badge variant={machine.status === 'Online' ? 'default' : machine.status === 'Offline' ? 'destructive' : 'secondary'} class="text-lg px-4 py-1.5 self-start md:self-center">
            {#if machine.status === 'Online'} <Activity class="mr-2 h-5 w-5 text-green-400" /> {/if}
            {machine.status}
          </Badge>
        {/if}
      </div>
      <hr class="mt-6 border-border/40" />
    </header>

    <!-- Hero Image Section -->
    {#if selectedImage}
    <div class="mb-10">
      <button on:click={openLightbox} class="relative w-full h-[50vh] min-h-[400px] max-h-[600px] overflow-hidden rounded-2xl shadow-2xl border border-border/10 cursor-pointer hover:opacity-95 hover:shadow-3xl transition-all group">
        <img src={selectedImage} alt="Image de {machine.name}" class="object-cover w-full h-full" />
        <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
        <div class="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
          <ImageIcon class="w-12 h-12 text-white opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-2xl" />
        </div>
      </button>
      {#if machine.gallery && machine.gallery.length > 1}
        <div class="flex space-x-3 overflow-x-auto pb-2 mt-4 justify-center">
          {#each machine.gallery as imgUrl, i}
            <button on:click={() => selectedImage = imgUrl} class="h-24 w-24 rounded-lg overflow-hidden border-2 {selectedImage === imgUrl ? 'border-primary shadow-lg scale-105' : 'border-border/20 hover:border-border/40'} transition-all flex-shrink-0">
              <img src={imgUrl} alt="Galerie image {i+1} de {machine.name}" class="object-cover h-full w-full"/>
            </button>
          {/each}
        </div>
      {/if}
    </div>
    {/if}

    <!-- Main Content Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
      <!-- Left Column: Info + Specs -->
      <div class="lg:col-span-7 space-y-8">
        {#if machine.description}
        <div class="bg-card/30 rounded-xl p-6 border border-border/10">
          <h3 class="flex items-center text-lg font-semibold mb-4 text-foreground">
            <Info class="mr-2 h-5 w-5 text-primary"/>
            Description
          </h3>
          <p class="text-muted-foreground leading-relaxed">{machine.description}</p>
        </div>
        {/if}

        <div class="bg-card/30 rounded-xl p-6 border border-border/10">
          <h3 class="flex items-center text-lg font-semibold mb-4 text-foreground">
            <ListChecks class="mr-2 h-5 w-5 text-primary"/>
            Spécifications Détaillées
          </h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-1 text-sm">
            {#each machine.moreSpecs || machine.specs as spec}
              <div class="flex flex-col py-2.5 border-b border-border/10 last:border-b-0">
                <span class="font-medium text-muted-foreground flex items-center mb-1">
                  {#if spec.icon}<svelte:component this={spec.icon} class="h-4 w-4 mr-2 text-primary/70"/>{/if}
                  {spec.name}
                </span>
                <span class="text-foreground font-medium">{spec.value}</span>
              </div>
            {/each}
          </div>
        </div>

        {#if machine.software && machine.software.length > 0}
        <div class="bg-card/30 rounded-xl p-6 border border-border/10">
          <h3 class="flex items-center text-lg font-semibold mb-4 text-foreground">
            <Laptop class="mr-2 h-5 w-5 text-primary"/>
            Logiciels & Services Clés
          </h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            {#each machine.software as sw}
              <div class="p-3 rounded-lg bg-card/50 border border-border/10">
                <p class="font-medium text-foreground mb-1">{sw.name} {#if sw.version}<Badge variant="outline" class="ml-2 text-xs">{sw.version}</Badge>{/if}</p>
                {#if sw.notes}<p class="text-xs text-muted-foreground italic leading-relaxed">{sw.notes}</p>{/if}
              </div>
            {/each}
          </div>
        </div>
        {/if}
      </div>

      <!-- Right Column: Quick Info + Rack -->
      <div class="lg:col-span-5 space-y-8">
        <div class="bg-card/30 rounded-xl p-6 border border-border/10 lg:sticky lg:top-8">
          <h3 class="flex items-center text-lg font-semibold mb-6 text-foreground">
            <Info class="mr-2 h-5 w-5 text-primary"/>
            Informations Clés
          </h3>
          <div class="space-y-4 text-sm">
            <div class="flex items-start justify-between p-3 rounded-lg bg-card/50 border border-border/10">
              <span class="text-muted-foreground">Système d'exploitation</span>
              <span class="font-medium flex items-center text-right">
                {#if machine.os.icon}<svelte:component this={machine.os.icon} class="h-4 w-4 mr-1.5"/>{/if}
                {machine.os.name}
              </span>
            </div>
            {#if machine.releaseDate}
            <div class="flex items-start justify-between p-3 rounded-lg bg-card/50 border border-border/10">
              <span class="text-muted-foreground">Année de fabrication</span>
              <span class="font-medium">{machine.releaseDate}</span>
            </div>
            {/if}
            {#if machine.purchaseDate}
            <div class="flex items-start justify-between p-3 rounded-lg bg-card/50 border border-border/10">
              <span class="text-muted-foreground">Date d'acquisition</span>
              <span class="font-medium text-right">{formatDate(machine.purchaseDate)}</span>
            </div>
            {/if}
          </div>

          {#if machine.notes}
            <div class="mt-6 pt-6 border-t border-border/10">
              <p class="text-sm text-muted-foreground italic leading-relaxed">{machine.notes}</p>
            </div>
          {/if}
        </div>

        {#if rackPosition}
        <div class="bg-card/30 rounded-xl p-6 border border-border/10">
          <h3 class="flex items-center text-lg font-semibold mb-4 text-foreground">
            <Server class="mr-2 h-5 w-5 text-primary"/>
            Position dans le rack
          </h3>
          <div class="flex items-center justify-between mb-6 p-3 rounded-lg bg-card/50 border border-border/10">
            <span class="text-muted-foreground text-sm">Position</span>
            <span class="font-bold text-primary text-lg">U{rackPosition.uPosition} ({rackPosition.uHeight}U)</span>
          </div>
          <!-- Mini Rack Visualization -->
          <div class="bg-gradient-to-br from-zinc-800 to-zinc-900 dark:from-zinc-900 dark:to-black border border-zinc-700 dark:border-zinc-800 rounded-lg p-2 shadow-lg">
            <div class="flex gap-1">
              <!-- U numbers column (top to bottom: U1...U18) -->
              <div class="flex flex-col text-[8px] text-zinc-400 font-mono">
                {#each Array(TOTAL_U_SLOTS) as _, i}
                  {@const uNumber = i + 1}
                  <div class="h-4 flex items-center justify-center">{uNumber}</div>
                {/each}
              </div>
              <!-- Rack slots (top to bottom: U1...U18) -->
              <div class="flex-1 flex flex-col gap-[1px]">
                {#each Array(TOTAL_U_SLOTS) as _, i}
                  {@const uNumber = i + 1}
                  {@const device = rackDevices.find(d => {
                    const deviceBottom = d.uPosition;
                    const deviceTop = d.uPosition - d.uHeight + 1;
                    return uNumber >= deviceTop && uNumber <= deviceBottom;
                  })}
                  {@const isDeviceStart = device && uNumber === (device.uPosition - device.uHeight + 1)}
                  {@const isCurrentMachine = device?.infraMachineId === machine.id}
                  {#if device && isDeviceStart}
                    <div
                      class="h-4 flex items-center justify-center text-[8px] font-bold text-white uppercase tracking-wider px-1"
                      class:bg-primary={isCurrentMachine}
                      class:bg-zinc-600={!isCurrentMachine}
                      style="height: {device.uHeight * 16}px;"
                    >
                      <span class="truncate">{device.name}</span>
                    </div>
                  {:else if !device}
                    <div class="h-4 bg-zinc-700/30"></div>
                  {/if}
                {/each}
              </div>
            </div>
          </div>
          <Button href="/rack" variant="outline" size="sm" class="w-full text-xs mt-4">
            Voir le rack complet →
          </Button>
        </div>
        {/if}
      </div>
    </div>

    <!-- Image Lightbox -->
    {#if lightboxOpen && selectedImage}
      <div
        class="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
        on:click={closeLightbox}
        role="dialog"
        aria-modal="true"
      >
        <button
          on:click={closeLightbox}
          class="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors z-10"
          aria-label="Fermer"
        >
          <X class="w-8 h-8" />
        </button>
        <div
          class="relative max-w-7xl max-h-full"
          on:click|stopPropagation
        >
          <img
            src={selectedImage}
            alt="Image de {machine.name}"
            class="max-w-full max-h-[90vh] w-auto h-auto object-contain rounded-lg"
          />
        </div>
      </div>
    {/if}

  </div>
{:else}
  <div class="container mx-auto px-4 py-12 text-center">
    <h1 class="text-3xl font-bold text-destructive mb-4">Machine non trouvée</h1>
    <p class="text-muted-foreground mb-6">Désolé, nous n'avons pas pu trouver les détails pour cette machine.</p>
    <Button href="/infra" variant="secondary">
      <ArrowLeft class="mr-2 h-4 w-4" /> Retour à l'infrastructure
    </Button>
  </div>
{/if}

<style lang="postcss">
  .min-h-screen_minus_header_footer {
    min-height: calc(100vh - theme(spacing.28));
  }
  .prose :where(p):not(:where([class~="not-prose"] *)) {
    margin-top: 0.5em;
    margin-bottom: 0.5em;
  }
</style>
<script lang="ts">
  import type { PageData } from './$types';
  import { infrastructure, type Machine, type MachineSpec } from '$lib/infra-data';
  import { Badge } from "$lib/components/ui/badge"; //
  import { Button } from "$lib/components/ui/button"; //
  import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "$lib/components/ui/card"; //
  // Added Laptop to the import list
  import { ArrowLeft, ExternalLink, Activity, CalendarDays, Info, ListChecks, ImageIcon, Laptop, Server, Cpu, MemoryStick, HardDrive, Network, Terminal as TerminalIcon } from "lucide-svelte";
  import { flyAndScale } from "$lib/utils"; //
  import { onMount } from 'svelte';

  export let data: PageData;

  let machine: Machine | undefined = data.machine;

  let selectedImage: string | undefined;
  onMount(() => {
    if (machine?.gallery && machine.gallery.length > 0) {
      selectedImage = machine.gallery[0];
    } else if (machine?.imageUrl) {
      selectedImage = machine.imageUrl;
    }
  });

  function formatDate(dateString?: string): string {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }
</script>

{#if machine}
  <div class="container mx-auto px-4 py-8 md:py-12 min-h-screen_minus_header_footer" in:flyAndScale={{ y: 50, duration: 600, start: 0.75 }}>
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

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-10">
      <div class="lg:col-span-1 space-y-6">
        {#if selectedImage}
          <div class="relative aspect-video w-full overflow-hidden rounded-lg shadow-md border border-border/20">
            <img src={selectedImage} alt="Image de {machine.name}" class="object-cover w-full h-full" />
          </div>
        {/if}
        {#if machine.gallery && machine.gallery.length > 1}
          <div class="flex space-x-2 overflow-x-auto pb-2">
            {#each machine.gallery as imgUrl, i}
              <button on:click={() => selectedImage = imgUrl} class="h-20 w-20 rounded-md overflow-hidden border-2 {selectedImage === imgUrl ? 'border-primary' : 'border-transparent hover:border-muted-foreground/50'} transition-all">
                <img src={imgUrl} alt="Galerie image {i+1} de {machine.name}" class="object-cover h-full w-full"/>
              </button>
            {/each}
          </div>
        {/if}

        <Card>
          <CardHeader>
            <CardTitle class="flex items-center text-xl"><Info class="mr-2 h-5 w-5 text-primary"/>Informations Clés</CardTitle>
          </CardHeader>
          <CardContent class="space-y-2 text-sm">
            <div class="flex justify-between">
                <span class="text-muted-foreground">Système d'exploitation:</span>
                <span class="font-medium flex items-center">
                    {#if machine.os.icon}<svelte:component this={machine.os.icon} class="h-4 w-4 mr-1.5"/>{/if}
                    {machine.os.name}
                </span>
            </div>
            {#if machine.releaseDate}
            <div class="flex justify-between">
                <span class="text-muted-foreground">Année de fabrication:</span>
                <span class="font-medium">{machine.releaseDate}</span>
            </div>
            {/if}
            {#if machine.purchaseDate}
            <div class="flex justify-between">
                <span class="text-muted-foreground">Date d'acquisition:</span>
                <span class="font-medium">{formatDate(machine.purchaseDate)}</span>
            </div>
            {/if}
            {#if machine.notes}
              <div class="pt-2">
                <p class="text-xs text-muted-foreground italic">{machine.notes}</p>
              </div>
            {/if}
          </CardContent>
        </Card>
      </div>

      <div class="lg:col-span-2 space-y-8">
        {#if machine.description}
        <Card>
            <CardHeader>
                <CardTitle class="flex items-center text-xl"><Info class="mr-2 h-5 w-5 text-primary"/>Description</CardTitle>
            </CardHeader>
            <CardContent class="prose dark:prose-invert max-w-none text-muted-foreground">
                <p>{machine.description}</p>
            </CardContent>
        </Card>
        {/if}

        <Card>
          <CardHeader>
            <CardTitle class="flex items-center text-xl"><ListChecks class="mr-2 h-5 w-5 text-primary"/>Spécifications Détaillées</CardTitle>
          </CardHeader>
          <CardContent class="space-y-2 text-sm">
            {#each machine.moreSpecs || machine.specs as spec}
              <div class="flex justify-between py-1.5 border-b border-border/20 last:border-b-0">
                <span class="font-medium text-muted-foreground flex items-center">
                  {#if spec.icon}<svelte:component this={spec.icon} class="h-4 w-4 mr-2 text-primary/70"/>{/if}
                  {spec.name}:
                </span>
                <span class="text-right text-foreground">{spec.value}</span>
              </div>
            {/each}
          </CardContent>
        </Card>

        {#if machine.software && machine.software.length > 0}
        <Card>
          <CardHeader>
            <CardTitle class="flex items-center text-xl"><Laptop class="mr-2 h-5 w-5 text-primary"/>Logiciels & Services Clés</CardTitle>
          </CardHeader>
          <CardContent class="space-y-2 text-sm">
             {#each machine.software as sw}
              <div class="py-1.5 border-b border-border/20 last:border-b-0">
                <p class="font-medium text-foreground">{sw.name} {#if sw.version}<Badge variant="outline" class="ml-2 text-xs">{sw.version}</Badge>{/if}</p>
                {#if sw.notes}<p class="text-xs text-muted-foreground italic mt-0.5">{sw.notes}</p>{/if}
              </div>
            {/each}
          </CardContent>
        </Card>
        {/if}
      </div>
    </div>

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
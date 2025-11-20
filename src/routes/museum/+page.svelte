<script lang="ts">
  import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "$lib/components/ui/card";
  import { Badge } from "$lib/components/ui/badge";
  import { Button } from "$lib/components/ui/button";
  import { flyAndScale } from "$lib/utils";
  import { ArchiveIcon, CalendarIcon, TagIcon, InfoIcon, CpuIcon, MemoryStickIcon, HardDriveIcon, ZapIcon, HelpCircleIcon } from "lucide-svelte";
  import { onMount } from "svelte"; // writable is imported from svelte/store
  import { writable } from "svelte/store"; // Correct import for writable

  interface RetiredHardware {
    id: string;
    name: string;
    type: string;
    era: string;
    yearAcquired?: number;
    yearRetired: number;
    imageUrl?: string;
    specs?: string[];
    story: string;
    reasonForRetirement: string;
    statusAfterRetirement?: string;
    icon?: any;
  }

  const retiredHardwareItems: RetiredHardware[] = [
     {
       id: "skylight",
       name: "Skylight (original)",
       type: "PC",
       icon: ZapIcon,
       era: "Mid 2010",
       yearAcquired: 2019,
       yearRetired: 2021,
       imageUrl: "/images/kpe3.png",
       specs: ["Intel Core i9-7980XE", "EVGA GeForce GTX 980Ti KINGPIN", "SuperFlower Leadex 2000W", "32GB DDR4"],
       story: "Premier PC avec un processeur Intel que j'ai possédé. Légendaire de par son processeur ultra haut de gamme, sa carte graphique de collection et tous les composants démesurés autour. Une pièce autant visuelle que fonctionnelle.",
       reasonForRetirement: "Remplacé par Snowflake après que la carte graphique soit partie en fumée et le kit processeur/carte mère ait été vendu.",
       statusAfterRetirement: "Remis en service en 2025 en tant que station de travail, après remplacement de quelques pièces."
     },
     {
       id: "kpe",
       name: "GTX 980Ti KINGPIN",
       type: "GPU",
       icon: ZapIcon,
       era: "Mid 2010",
       yearAcquired: 2019,
       yearRetired: 2021,
       imageUrl: "/images/kpe1.png",
       specs: ["GM200", "6GB GDDR5", "Radiateur en cuivre"],
       story: "Carte graphique légendaire. Edition limitée assez rare de la GTX 980Ti produite par EVGA en collaboration avec l'overclockeur KINGPIN.",
       reasonForRetirement: "Défaut connu sur cette série de cartes qui l'a amené à brûler.",
       statusAfterRetirement: "Affiché comme artéfact dans une vitrine."
     },
  ];

  let visibleItems = writable<RetiredHardware[]>([]);
  const itemsPerLoad = 6; 
  let currentIndex = 0;

  function loadMoreItems() {
    const nextItems = retiredHardwareItems.slice(currentIndex, currentIndex + itemsPerLoad);
    // Explicitly type 'current' parameter here
    visibleItems.update((current: RetiredHardware[]) => [...current, ...nextItems]);
    currentIndex += itemsPerLoad;
  }

  onMount(() => {
    currentIndex = 0;
    visibleItems.set([]);
    loadMoreItems();
  });

</script>

<svelte:head>
    <title>Az' - Le musée</title>
    <meta name="description" content="Jetez un oeil à ma collection" />
</svelte:head>

<div class="container mx-auto px-4 py-8 md:py-12">
  <div class="text-center mb-12 md:mb-16" in:flyAndScale={{ y: -40, duration: 450, start: 0.7 }}>
    <h1 class="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-foreground flex items-center justify-center">
      <ArchiveIcon class="w-10 h-10 md:w-12 md:h-12 mr-3 text-primary" />
      Le musée
    </h1>
    <p class="mt-4 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
      Collection personnelle de matériel marquant ou hors service.
    </p>
  </div>

  {#if $visibleItems.length > 0}
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
      {#each $visibleItems as item (item.id)}
        <div in:flyAndScale={{ y: 50, duration: 400, start: 0.75, delay: (($visibleItems.indexOf(item) % itemsPerLoad) * 80)}}>
          <Card class="h-full flex flex-col museum-card hover:shadow-xl dark:hover:shadow-primary/30 transition-all duration-300 overflow-hidden hover:-translate-y-1 hover:scale-[1.01]">
            {#if item.imageUrl}
              <div class="aspect-[4/3] w-full overflow-hidden rounded-t-lg bg-muted/50 dark:bg-muted/20 border-b border-border/30">
                <img src={item.imageUrl} alt="Image de {item.name}" class="object-contain w-full h-full p-2 hover:scale-105 transition-transform duration-300" />
              </div>
            {:else}
              <div class="aspect-[4/3] w-full overflow-hidden rounded-t-lg bg-muted/50 dark:bg-muted/20 border-b border-border/30 flex items-center justify-center">
                {#if item.icon} 
                  <svelte:component this={item.icon} class="w-24 h-24 text-muted-foreground/40" stroke-width="1"/> 
                {:else} 
                  <HelpCircleIcon class="w-24 h-24 text-muted-foreground/40" stroke-width="1"/> 
                {/if}
              </div>
            {/if}
            <CardHeader class="pb-3">
              <CardTitle class="text-xl group-hover:text-primary transition-colors">{item.name}</CardTitle>
              <div class="flex flex-wrap gap-2 mt-1.5 text-xs">
                <Badge variant="secondary" class="flex items-center"><TagIcon class="w-3 h-3 mr-1.5"/>{item.type}</Badge>
                <Badge variant="outline" class="flex items-center"><CalendarIcon class="w-3 h-3 mr-1.5"/>{item.era}</Badge>
              </div>
            </CardHeader>
            <CardContent class="flex-grow space-y-3 text-sm">
              {#if item.specs && item.specs.length > 0}
                <div>
                  <h4 class="font-semibold mb-1 text-foreground/90">Spécifications clés:</h4>
                  <ul class="list-disc list-inside text-muted-foreground space-y-0.5 text-xs">
                    {#each item.specs as spec}
                      <li>{spec}</li>
                    {/each}
                  </ul>
                </div>
              {/if}
              <div class="pt-1">
                <h4 class="font-semibold mb-1 text-foreground/90">Histoire:</h4>
                <p class="text-muted-foreground text-xs leading-relaxed italic">"{item.story}"</p>
              </div>
              <p class="text-xs pt-1"><strong class="text-foreground/80">Retiré en:</strong> {item.yearRetired} - {item.reasonForRetirement}</p>
              {#if item.statusAfterRetirement}
                <p class="text-xs"><strong class="text-foreground/80">Statut actuel:</strong> {item.statusAfterRetirement}</p>
              {/if}
            </CardContent>
            {#if item.yearAcquired}
            <CardFooter class="text-xs text-muted-foreground pt-3 border-t border-border/20 mt-auto">
              Acquis vers ~{item.yearAcquired}
            </CardFooter>
            {/if}
          </Card>
        </div>
      {/each}
    </div>

    {#if $visibleItems.length < retiredHardwareItems.length}
      <div class="text-center mt-12">
        <Button variant="outline" on:click={loadMoreItems} class="shadow-md hover:shadow-lg transition-shadow">
          Charger plus d'artefacts...
        </Button>
      </div>
    {/if}
  {:else if retiredHardwareItems.length === 0}
    <p class="text-center text-muted-foreground text-lg py-10">Le musée est actuellement vide... revenez bientôt pour découvrir de nouveaux artéfacts !</p>
  {/if}
</div>

<style lang="postcss">
  .museum-card {
    /* Ensures that the card itself takes up the full height if in a grid row */
  }
  .museum-card img {
    /* For a bit more polish on image hover */
  }
  /* Add any additional specific styling for the museum page */
</style>

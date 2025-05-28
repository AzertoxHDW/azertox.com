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
      id: "soundblaster-awe32",
      name: "Sound Blaster AWE32",
      type: "Sound Card",
      icon: ZapIcon,
      era: "Mid 1990s",
      yearAcquired: 1996,
      yearRetired: 2002,
      imageUrl: "/images/museum/sound_blaster_awe32.png",
      specs: ["ISA Interface", "32-voice polyphony", "EMU8000 sampler", "1MB RAM (expandable)"],
      story: "This was my first real sound card! Saved up for months. The difference in DOS games was incredible – from PC speaker beeps to full orchestral scores with General MIDI. Many hours spent configuring IRQs and DMAs!",
      reasonForRetirement: "Upgraded to a PCI sound card with better Windows XP support.",
      statusAfterRetirement: "Kept in anti-static bag for nostalgia."
    },
    {
      id: "voodoo2",
      name: "3dfx Voodoo2 12MB",
      type: "GPU (3D Accelerator)",
      icon: CpuIcon, 
      era: "Late 1990s",
      yearAcquired: 1998,
      yearRetired: 2001,
      imageUrl: "/images/museum/voodoo2.png", 
      specs: ["SLI Capable", "12MB EDO DRAM", "PCI Interface", "Required separate 2D graphics card"],
      story: "The Voodoo2 was legendary! Playing Quake II and Unreal with Glide support was mind-blowing. I remember the excitement of setting up SLI with a friend's card for even better performance.",
      reasonForRetirement: "Replaced by a GeForce 2 GTS with AGP.",
      statusAfterRetirement: "Display piece in a shadow box."
    },
    {
      id: "pentium-mmx",
      name: "Intel Pentium MMX 200MHz",
      type: "CPU",
      icon: CpuIcon,
      era: "Mid-Late 1990s",
      yearAcquired: 1997,
      yearRetired: 2003,
      imageUrl: "/images/museum/pentium_mmx.png", 
      specs: ["Socket 7", "200MHz Clock Speed", "MMX Technology", "32KB L1 Cache"],
      story: "This CPU powered my main PC for years. It ran Windows 95/98 smoothly and handled many games and applications of the era. Paired it with the Voodoo2 for a great gaming setup.",
      reasonForRetirement: "System upgrade to an Athlon XP based machine.",
      statusAfterRetirement: "Still have it, mounted on a small plaque."
    },
    {
      id: "hdd-4gb",
      name: "Quantum Fireball 4.3GB HDD",
      type: "Hard Disk Drive",
      icon: HardDriveIcon,
      era: "Late 1990s",
      yearAcquired: 1999,
      yearRetired: 2004,
      imageUrl: "/images/museum/quantum_fireball.png", 
      specs: ["4.3 GB Capacity", "IDE Interface", "5400 RPM"],
      story: "Four gigabytes felt like an infinite amount of space back then! It held my OS, all my games, music, and school projects. The distinct whirring sound is unforgettable.",
      reasonForRetirement: "Capacity became insufficient; upgraded to a larger drive.",
      statusAfterRetirement: "Data wiped, kept as a historical artifact."
    },
    {
      id: "ram-64mb-sdram",
      name: "64MB PC100 SDRAM Stick",
      type: "RAM",
      icon: MemoryStickIcon,
      era: "Late 1990s / Early 2000s",
      yearAcquired: 1999,
      yearRetired: 2003,
      specs: ["64 Megabytes", "PC100 SDRAM", "168-pin DIMM"],
      story: "Upgrading from 32MB to 64MB, and later to 128MB, was a huge deal for Windows 98 performance and multitasking. Each upgrade felt like a new machine!",
      reasonForRetirement: "Part of the Pentium MMX system upgrade.",
      statusAfterRetirement: "Stored with other old RAM sticks."
    }
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

<div class="container mx-auto px-4 py-8 md:py-12">
  <div class="text-center mb-12 md:mb-16" in:flyAndScale={{ y: -20, duration: 500, start: 0.95 }}>
    <h1 class="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-foreground flex items-center justify-center">
      <ArchiveIcon class="w-10 h-10 md:w-12 md:h-12 mr-3 text-primary" />
      Mon Musée Hardware
    </h1>
    <p class="mt-4 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
      Une collection nostalgique de matériel informatique qui a marqué mon parcours technologique.
    </p>
  </div>

  {#if $visibleItems.length > 0}
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
      {#each $visibleItems as item (item.id)}
        <div in:flyAndScale|global={{ y: 20, duration: 300, start:0.98, delay: (($visibleItems.indexOf(item) % itemsPerLoad) * 75)}}>
          <Card class="h-full flex flex-col museum-card hover:shadow-xl dark:hover:shadow-primary/30 transition-shadow duration-300 overflow-hidden">
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
                  <h4 class="font-semibold mb-1 text-foreground/90">Spécifications Clés:</h4>
                  <ul class="list-disc list-inside text-muted-foreground space-y-0.5 text-xs">
                    {#each item.specs as spec}
                      <li>{spec}</li>
                    {/each}
                  </ul>
                </div>
              {/if}
              <div class="pt-1">
                <h4 class="font-semibold mb-1 text-foreground/90">Mon Histoire:</h4>
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
          Charger Plus d'Artefacts...
        </Button>
      </div>
    {/if}
  {:else if retiredHardwareItems.length === 0}
    <p class="text-center text-muted-foreground text-lg py-10">Le musée est actuellement vide... revenez bientôt pour découvrir des trésors technologiques !</p>
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

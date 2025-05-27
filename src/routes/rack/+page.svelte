<script lang="ts">
    import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "$lib/components/ui/card";
    import { Badge } from "$lib/components/ui/badge";
    import { Button } from "$lib/components/ui/button";
    import { flyAndScale } from "$lib/utils";
    import { ArrowRight, Info, Link as LinkIcon, Server, NetworkIcon, HardDrive as StorageIcon, Zap, CornerDownLeft } from "lucide-svelte";
    import { onMount, tick } from "svelte";
  
    interface RackDeviceFaceplate {
      text?: string;
      leds?: { color: 'green' | 'amber' | 'red' | 'blue'; count: number; blinking?: boolean }[];
      ports?: { type: 'rj45' | 'sfp' | 'usb' | 'fiber'; count: number; arrangement?: 'row' | 'grid' };
      buttons?: { label?: string, count: number };
      vents?: 'horizontal' | 'hexagonal' | 'dots' | boolean;
      displayText?: string;
    }
  
    interface RackDevice {
      id: string;
      name: string;
      uHeight: number;
      type: 'pdu' | 'patch-panel' | 'switch' | 'server-1u' | 'server-2u' | 'server-3u' | 'server-4u' | 'storage-2u' | 'storage-4u' | 'ups' | 'spacer' | 'arm-cluster';
      description: string;
      details?: string[];
      link?: string;
      status?: 'Online' | 'Offline' | 'Warning';
      faceplate?: RackDeviceFaceplate;
      uPosition?: number; // Top U it occupies (e.g., U28 is 28)
    }
  
    const rackDevicesData: RackDevice[] = [
      { id: 'u28-pdu', name: 'PDU Top', uHeight: 1, uPosition: 28, type: 'pdu', description: 'Power Distribution Unit for upper equipment.', faceplate: { text: "PDU-01" } },
      { id: 'u27-arm', name: 'ARM Cluster', uHeight: 1, uPosition: 27, type: 'arm-cluster', description: 'Raspberry Pi or similar ARM devices.', faceplate: { text: "Pi Rack", leds: [{color: 'green', count: 4}] } },
      { id: 'u26-spacer1', name: 'Spacer', uHeight: 1, uPosition: 26, type: 'spacer', description: 'Blank panel for airflow or future use.'},
      { id: 'u25-switch', name: 'Network Switch', uHeight: 1, uPosition: 25, type: 'switch', description: 'Main Gigabit Network Switch.', faceplate: { ports: { type: 'rj45', count: 24, arrangement: 'row' }, leds: [{color: 'green', count:24}]} , link: '/infra/networking'},
      { id: 'u24-patchpanel1', name: 'Patch Panel CAT6A', uHeight: 1, uPosition: 24, type: 'patch-panel', description: 'Network Cabling Management.', faceplate: { ports: {type: 'rj45', count: 24, arrangement: 'row'}}},
      { id: 'u23-spacer2', name: 'Spacer', uHeight: 1, uPosition: 23, type: 'spacer', description: 'Blank panel.'},
      { id: 'u22-truenas', name: 'TrueNAS Server', uHeight: 2, uPosition: 22, type: 'storage-2u', description: 'Primary Network Attached Storage.', faceplate: { text: "TRUENAS-01", leds: [{color:'blue', count:1, blinking: true}, {color:'green', count:4}], vents: true }, link: '/infra/nas-truenas'},
      { id: 'u20-spare', name: 'Spare Slot', uHeight: 2, uPosition: 20, type: 'spacer', description: 'Reserved for future expansion.'},
      { id: 'u18-server1', name: 'Proxmox Node 1', uHeight: 2, uPosition: 18, type: 'server-2u', description: 'Virtualization Host 1.', faceplate: { text: "PVE-NODE-01", leds: [{color:'green', count:1}, {color:'amber', count:1, blinking:true}], vents: 'hexagonal'}, link: '/infra/proxmox-node1'},
      { id: 'u16-server2', name: 'Proxmox Node 2', uHeight: 2, uPosition: 16, type: 'server-2u', description: 'Virtualization Host 2.', faceplate: { text: "PVE-NODE-02", leds: [{color:'green', count:2}], vents: 'hexagonal'}},
      { id: 'u14-server3', name: 'Proxmox Node 3', uHeight: 2, uPosition: 14, type: 'server-2u', description: 'Virtualization Host 3.', faceplate: { text: "PVE-NODE-03", leds: [{color:'green', count:2}], vents: 'hexagonal'}},
      { id: 'u12-storage-expansion1', name: 'Storage Array 1', uHeight: 4, uPosition: 12, type: 'storage-4u', description: 'Disk shelf for Proxmox cluster.', faceplate: { text: "DAS-01", vents: 'hexagonal', leds: [{color:'blue', count:16}]} },
      { id: 'u08-storage-expansion2', name: 'Storage Array 2', uHeight: 4, uPosition: 8, type: 'storage-4u', description: 'Disk shelf for Proxmox cluster.', faceplate: { text: "DAS-02", vents: 'hexagonal', leds: [{color:'blue', count:16}]} },
      { id: 'u04-spacer3', name: 'Spacer/Cable Management', uHeight: 2, uPosition: 4, type: 'spacer', description: 'Cable routing or blank.'},
      { id: 'u02-ups', name: 'UPS Unit', uHeight: 2, uPosition: 2, type: 'ups', description: 'Uninterruptible Power Supply.', faceplate: { text: "CyberPower 1500VA", displayText: "100% | 980W", leds:[{color:'green', count:1}]} , link: '/infra/ups-details'},
    ];
  
    let currentHoveredItem: RackDevice | null = null;
    let infoBoxPosition = { top: 0, left: 0, visible: false, preferSide: 'right' };
    let rackWrapperEl: HTMLElement;
  
    async function handleMouseEnter(item: RackDevice, event: MouseEvent) {
      currentHoveredItem = item;
      await tick(); 
      if (rackWrapperEl) {
        const targetElement = event.currentTarget as HTMLElement;
        const targetRect = targetElement.getBoundingClientRect();
        const rackRect = rackWrapperEl.getBoundingClientRect();
        let top = targetRect.top - rackRect.top + targetRect.height / 2;
        let left;
        const infoBoxWidth = 320;
        if (targetRect.left + targetRect.width / 2 > window.innerWidth / 2) {
          left = targetRect.left - rackRect.left - infoBoxWidth - 10;
          infoBoxPosition.preferSide = 'left';
        } else {
          left = targetRect.right - rackRect.left + 10;
          infoBoxPosition.preferSide = 'right';
        }
        const infoBoxHeight = 200; 
        if (event.clientY + infoBoxHeight > window.innerHeight) {
          top = targetRect.bottom - rackRect.top - infoBoxHeight;
        } else if (event.clientY - infoBoxHeight / 2 < 0) {
           top = targetRect.top - rackRect.top;
        }
        infoBoxPosition = { ...infoBoxPosition, top: Math.max(0, top), left: Math.max(0, left), visible: true };
      }
    }
  
    function handleMouseLeave() {
      infoBoxPosition = { ...infoBoxPosition, visible: false };
      setTimeout(() => {
          if (!infoBoxPosition.visible) { 
              currentHoveredItem = null;
          }
      }, 200);
    }
  
    const U_HEIGHT_PX = 30;
    const TOTAL_U_SLOTS = 28;
    let displayGrid: (RackDevice | null)[] = Array(TOTAL_U_SLOTS).fill(null);
  
    rackDevicesData.forEach(device => {
      if (typeof device.uPosition !== 'number') return; 
  
      const startIndexInArray = TOTAL_U_SLOTS - device.uPosition;
  
      if (startIndexInArray >= 0 && startIndexInArray < TOTAL_U_SLOTS) {
        const existingDevice = displayGrid[startIndexInArray];
        if (!existingDevice || existingDevice.type === 'spacer') { 
          for (let i = 0; i < device.uHeight; i++) {
            // Corrected: declare currentIndexInArray properly
            const currentIndexInArray = startIndexInArray + i; 
            if (currentIndexInArray < TOTAL_U_SLOTS) {
              if (i === 0) {
                displayGrid[currentIndexInArray] = device;
              } else {
                displayGrid[currentIndexInArray] = { 
                  ...device, 
                  id: `${device.id}-fill-${i}`, 
                  name: '', 
                  type:'spacer', 
                  faceplate: undefined, 
                  isFiller: true 
                } as RackDevice & { isFiller?: boolean };
              }
            }
          }
        }
      }
    });
    const reversedDisplayGrid = [...displayGrid].reverse();
  </script>
  
  <svelte:head>
    <title>Mon Rack Serveur Interactif (HTML) | Azertox.com</title>
    <meta name="description" content="Diagramme interactif de mon infrastructure serveur et homelab, construit en HTML." />
  </svelte:head>
  
  <div class="container mx-auto px-4 py-8 md:py-12">
    <div class="text-center mb-10 md:mb-12" in:flyAndScale={{ y: -20, duration: 500 }}>
      <h1 class="text-4xl sm:text-5xl font-bold tracking-tight text-foreground">
        Mon Installation Serveur (Vue HTML)
      </h1>
      <p class="mt-3 text-lg text-muted-foreground">
        Survolez les équipements pour plus de détails.
      </p>
    </div>
  
    <div class="flex flex-col md:flex-row gap-8 items-start justify-center">
      <div class="relative w-full md:w-[350px] bg-card border-2 border-foreground/30 rounded-md p-2 shadow-xl rack-cabinet select-none" bind:this={rackWrapperEl}>
        {#each [0,1] as side}
          <div class="absolute top-0 h-full w-6 {side === 0 ? 'left-1' : 'right-1'} flex flex-col-reverse justify-start items-center rack-rail">
            {#each Array(TOTAL_U_SLOTS) as _, i (TOTAL_U_SLOTS-i)}
              <div class="rack-u-marking text-xs text-muted-foreground/70" style="height: {U_HEIGHT_PX}px;">{TOTAL_U_SLOTS-i}</div>
            {/each}
          </div>
        {/each}
  
        <div class="mx-8 space-y-px rack-devices-column">
          {#each reversedDisplayGrid as deviceInSlot, slotIndex (TOTAL_U_SLOTS - slotIndex)}
            {@const currentU = slotIndex + 1} 
            {#if deviceInSlot && (deviceInSlot as RackDevice & { isFiller?: boolean }).isFiller}
              {:else}
              <div
                class="rack-device type-{(deviceInSlot || {type: 'spacer'}).type} border border-foreground/10 flex items-center justify-center text-center text-muted-foreground relative"
                style="height: { (deviceInSlot ? deviceInSlot.uHeight : 1) * U_HEIGHT_PX }px;"
                on:mouseenter={(e) => deviceInSlot && deviceInSlot.type !== 'spacer' && !(deviceInSlot as RackDevice & { isFiller?: boolean }).isFiller ? handleMouseEnter(deviceInSlot, e) : null}
                on:mouseleave={deviceInSlot && deviceInSlot.type !== 'spacer' && !(deviceInSlot as RackDevice & { isFiller?: boolean }).isFiller ? handleMouseLeave : null}
                role={deviceInSlot && deviceInSlot.type !== 'spacer' ? "button" : "presentation"}
                tabindex={deviceInSlot && deviceInSlot.type !== 'spacer' ? 0 : -1}
                aria-label={deviceInSlot?.name}
              >
                {#if deviceInSlot && deviceInSlot.type !== 'spacer' && !(deviceInSlot as RackDevice & { isFiller?: boolean }).isFiller}
                  <div class="device-faceplate w-full h-full p-1 flex flex-col items-center justify-center overflow-hidden">
                    <span class="device-name text-xs truncate">{deviceInSlot.faceplate?.text || deviceInSlot.name.split('(')[0].trim()}</span>
                    {#if deviceInSlot.faceplate?.leds}
                      <div class="leds-strip mt-0.5">
                        {#each deviceInSlot.faceplate.leds as ledGroup (ledGroup.color + ledGroup.count)}
                          {#each Array(ledGroup.count) as _led, k (k)}
                            <span class="led led-{ledGroup.color} {ledGroup.blinking ? 'blinking' : ''}"></span>
                          {/each}
                        {/each}
                      </div>
                    {/if}
                    {#if deviceInSlot.faceplate?.displayText}
                      <div class="display-text mt-0.5">{deviceInSlot.faceplate.displayText}</div>
                    {/if}
                    {#if deviceInSlot.faceplate?.ports}
                      <div class="ports-strip mt-0.5 flex flex-wrap gap-px justify-center">
                         {#each Array(Math.min(deviceInSlot.faceplate.ports.count, 16)) as _port, k (k)}
                            <span class="port port-{deviceInSlot.faceplate.ports.type}"></span>
                         {/each}
                      </div>
                    {/if}
                  </div>
                  {#if deviceInSlot.status}
                    <Badge variant={deviceInSlot.status === 'Online' ? 'default' : deviceInSlot.status === 'Offline' ? 'destructive' : 'secondary'} class="absolute top-1 right-1 text-[8px] px-1 py-0.5">{deviceInSlot.status}</Badge>
                  {/if}
                {:else}
                  <span class="text-xs">{ (deviceInSlot && deviceInSlot.name) || `U${currentU} - Vide`}</span>
                {/if}
              </div>
            {/if}
          {/each}
        </div>
      </div>
  
      <div class="flex-grow md:w-[350px] lg:w-[400px] sticky top-24 h-fit">
        {#if currentHoveredItem}
          <div
            class="p-1"
            transition:flyAndScale={{ y: 8, duration: 200, start: 0.95 }}
          >
            <Card class="shadow-2xl bg-card/95 backdrop-blur-sm">
              <CardHeader class="pb-3 pt-4">
                <CardTitle class="text-lg flex items-center">
                  <Info class="h-5 w-5 mr-2 text-primary" />
                  {currentHoveredItem.name}
                </CardTitle>
                {#if currentHoveredItem.uHeight}
                  <CardDescription>{currentHoveredItem.uHeight}U - Type: {currentHoveredItem.type}</CardDescription>
                {/if}
              </CardHeader>
              <CardContent class="text-sm space-y-2 pb-4">
                <p class="text-muted-foreground">{currentHoveredItem.description}</p>
                {#if currentHoveredItem.details && currentHoveredItem.details.length > 0}
                  <ul class="list-disc list-inside pl-1 space-y-0.5">
                    {#each currentHoveredItem.details as detail}
                      <li>{detail}</li>
                    {/each}
                  </ul>
                {/if}
                {#if currentHoveredItem.link}
                  <Button href={currentHoveredItem.link} size="sm" variant="link" class="p-0 h-auto mt-2 text-primary">
                    Plus de détails <ArrowRight class="ml-1 h-4 w-4" />
                  </Button>
                {/if}
              </CardContent>
            </Card>
          </div>
        {:else}
          <div class="p-4 text-center text-muted-foreground italic">
            <CornerDownLeft class="inline-block mr-2 h-5 w-5" /> Survolez un équipement dans le rack pour voir ses informations ici.
          </div>
        {/if}
      </div>
    </div>
  </div>
  
  <style lang="postcss">
    .rack-cabinet {
      min-height: calc(28 * var(--u-slot-height, 30px) + 2 * theme(spacing.2) + 2 * 2px); 
      --u-slot-height: v-bind(U_HEIGHT_PX + 'px'); 
    }
    .rack-rail { 
      background-color: theme(colors.foreground / 0.05);
    }
    .rack-u-marking {
      @apply flex items-center justify-center border-b border-dashed border-foreground/10;
      line-height: 1;
    }
  
    .rack-device {
      @apply bg-muted/30 hover:bg-primary/10 dark:bg-foreground/5 dark:hover:bg-primary/20 transition-all duration-150 cursor-pointer overflow-hidden;
    }
    .device-faceplate { }
    .device-name {
      @apply font-semibold text-foreground/80;
    }
  
    .type-pdu { @apply bg-gray-700 text-gray-200; }
    .type-pdu .device-name { @apply text-white; }
    .type-patch-panel { @apply bg-gray-300 dark:bg-gray-600; }
    .type-patch-panel .device-name { @apply text-black dark:text-white; }
    .type-switch { @apply bg-blue-800 dark:bg-blue-900; }
    .type-switch .device-name { @apply text-blue-100; }
    .type-server-1u, .type-server-2u, .type-server-3u, .type-server-4u {
      @apply bg-zinc-300 dark:bg-zinc-700;
    }
    .type-server-1u .device-name, .type-server-2u .device-name, .type-server-3u .device-name, .type-server-4u .device-name {
      @apply text-zinc-800 dark:text-zinc-100;
    }
    .type-storage-2u, .type-storage-4u { @apply bg-slate-300 dark:bg-slate-700; }
    .type-storage-2u .device-name, .type-storage-4u .device-name { @apply text-slate-800 dark:text-slate-100;}
    .type-ups { @apply bg-yellow-500 dark:bg-yellow-700; }
    .type-ups .device-name { @apply text-black dark:text-yellow-100; }
    .type-ups .display-text { @apply bg-black/70 text-green-400 font-mono text-xs p-0.5 rounded-sm; }
    .type-spacer:not([aria-label*="Vide"]) { 
       @apply bg-background/50 opacity-70 border-dashed; 
    }
    .type-spacer[aria-label*="Vide"] { 
       @apply bg-transparent border-dashed border-foreground/15;
    }
    .type-spacer .device-name { @apply text-muted-foreground/50; }
    .type-arm-cluster { @apply bg-purple-200 dark:bg-purple-800; }
    .type-arm-cluster .device-name { @apply text-purple-800 dark:text-purple-100;}
  
    .leds-strip { @apply flex gap-0.5; }
    .led { @apply w-1 h-1 rounded-full; }
    .led-green { @apply bg-green-500 shadow-[0_0_2px_#34D399]; }
    .led-amber { @apply bg-amber-500 shadow-[0_0_2px_#FBBF24]; }
    .led-red   { @apply bg-red-500 shadow-[0_0_2px_#F87171]; }
    .led-blue  { @apply bg-blue-500 shadow-[0_0_2px_#60A5FA]; }
    .led.blinking { animation: led-blink 1s infinite step-end; }
    @keyframes led-blink { 50% { opacity: 0.2; } }
  
    .ports-strip { }
    .port { @apply w-1.5 h-1.5 bg-black/30 border border-black/50; }
  </style>
<script lang="ts">
    import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "$lib/components/ui/card";
    import { Badge } from "$lib/components/ui/badge";
    import { Button } from "$lib/components/ui/button";
    import { flyAndScale } from "$lib/utils";
    import { ArrowRight, Info, Link as LinkIcon, Server, NetworkIcon, HardDrive as StorageIcon, Zap, CornerDownLeft, Activity } from "lucide-svelte";
    import { onMount, tick } from "svelte";
    import { infrastructure, type Machine } from "$lib/infra-data";
  
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
      infraMachineId?: string; // ID to link to infrastructure machine
      status?: 'Online' | 'Offline' | 'Warning';
      faceplate?: RackDeviceFaceplate;
      uPosition?: number; // Top U it occupies (e.g., U28 is 28)
    }
  
    const rackDevicesData: RackDevice[] = [
      { id: 'u2', name: 'Network switch', uHeight: 1, uPosition: 2, type: 'switch', description: 'Main switch', faceplate: { text: " ", ports: { type: 'rj45', count: 8, arrangement: 'row' }, leds: [{color: 'green', count:8, blinking: true}]}},
      { id: 'u3', name: 'Raspberry Pi', uHeight: 1, uPosition: 3, type: 'arm-cluster', description: 'Main local services host machine', status: 'Online', faceplate: { text: "PI-01", leds: [{color: 'green', count:1}, {color: 'amber', count:1, blinking: true}]}},
      { id: 'u9', name: 'Dell Optiplex R230', uHeight: 1, uPosition: 9, type: 'server-1u', description: 'Unused server', status: 'Offline', faceplate: { text: "SPARE", leds: [{color: 'red', count:2}]}},
      { id: 'u10', name: 'Dell Optiplex R320', uHeight: 1, uPosition: 10, type: 'server-1u', description: 'TrueNAS storage server', status: 'Online', faceplate: { text: "TRUENAS", leds: [{color: 'green', count:1}, {color: 'amber', count:1, blinking: true}]}, infraMachineId: 'nas'},
      { id: 'u18', name: 'Sierra', uHeight: 4, uPosition: 18, type: 'server-4u', description: 'Game hosting server', status: 'Online', faceplate: { text: "PVE-01", leds: [{color: 'green', count:1}, {color: 'amber', count:1, blinking: true}]}, infraMachineId: 'pve-01'},
    ];

    let currentHoveredItem: RackDevice | null = null;
    let infoBoxPosition = { top: 0, left: 0, visible: false, preferSide: 'right' };
    let rackWrapperEl: HTMLElement;

    // Get the infrastructure machine for the currently hovered device
    $: currentInfraMachine = currentHoveredItem?.infraMachineId
      ? infrastructure.find(m => m.id === currentHoveredItem.infraMachineId)
      : null;

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
    const TOTAL_U_SLOTS = 18;
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
    <title>Mon rack | Azertox.com</title>
    <meta name="description" content="Diagramme interactif de mon infrastructure serveur et homelab." />
  </svelte:head>
  
  <div class="container mx-auto px-4 py-8 md:py-12">
    <div class="text-center mb-10 md:mb-12" in:flyAndScale|global={{ y: -40, duration: 450, start: 0.7 }}>
      <h1 class="text-4xl sm:text-5xl font-bold tracking-tight text-foreground">
        Mon installation rack
      </h1>
      <p class="mt-3 text-lg text-muted-foreground">
        Survolez les équipements pour plus de détails.
      </p>
      <div class="mt-6">
        <Button href="/infra" variant="outline" class="shadow-md hover:shadow-lg transition-shadow">
          <CornerDownLeft class="mr-2 h-4 w-4" />
          Retour à l'infrastructure
        </Button>
      </div>
    </div>

    <!-- Rack Statistics -->
    <div class="flex flex-wrap gap-4 justify-center mb-8" in:flyAndScale|global={{ y: 30, duration: 400, start: 0.75, delay: 100 }}>
      <Card class="px-4 py-3 shadow-md">
        <div class="flex items-center gap-2">
          <Server class="h-5 w-5 text-primary" />
          <div>
            <div class="text-sm text-muted-foreground">Espace utilisé</div>
            <div class="text-lg font-bold">{rackDevicesData.reduce((sum, d) => sum + d.uHeight, 0)}/{TOTAL_U_SLOTS}U</div>
          </div>
        </div>
      </Card>
      <Card class="px-4 py-3 shadow-md">
        <div class="flex items-center gap-2">
          <Zap class="h-5 w-5 text-amber-500" />
          <div>
            <div class="text-sm text-muted-foreground">Équipements actifs</div>
            <div class="text-lg font-bold">{rackDevicesData.filter(d => d.status === 'Online').length}/{rackDevicesData.length}</div>
          </div>
        </div>
      </Card>
      <Card class="px-4 py-3 shadow-md">
        <div class="flex items-center gap-2">
          <NetworkIcon class="h-5 w-5 text-blue-500" />
          <div>
            <div class="text-sm text-muted-foreground">Type d'équipements</div>
            <div class="text-lg font-bold">{new Set(rackDevicesData.map(d => d.type)).size}</div>
          </div>
        </div>
      </Card>
    </div>

    <div class="flex flex-col md:flex-row gap-8 items-start justify-center" in:flyAndScale|global={{ y: 30, duration: 400, start: 0.75, delay: 200 }}>
      <div class="relative w-full md:w-[380px] bg-gradient-to-br from-zinc-800 to-zinc-900 dark:from-zinc-900 dark:to-black border-4 border-zinc-700 dark:border-zinc-800 rounded-lg p-3 shadow-2xl rack-cabinet select-none" bind:this={rackWrapperEl}>
        <!-- Corner screws -->
        <div class="absolute top-2 left-2 w-2 h-2 rounded-full bg-zinc-600 shadow-inner"></div>
        <div class="absolute top-2 right-2 w-2 h-2 rounded-full bg-zinc-600 shadow-inner"></div>
        <div class="absolute bottom-2 left-2 w-2 h-2 rounded-full bg-zinc-600 shadow-inner"></div>
        <div class="absolute bottom-2 right-2 w-2 h-2 rounded-full bg-zinc-600 shadow-inner"></div>

        {#each [0,1] as side}
          <div class="absolute w-8 {side === 0 ? 'left-2' : 'right-2'} flex flex-col items-center rack-rail">
            {#each Array(TOTAL_U_SLOTS) as _, i (1+i)}
              <div class="rack-u-marking text-xs font-mono" style="height: {U_HEIGHT_PX}px;">
                <span class="text-zinc-400">{1+i}</span>
                <!-- Mounting holes -->
                <div class="mounting-holes">
                  <div class="mounting-hole"></div>
                  <div class="mounting-hole"></div>
                  <div class="mounting-hole"></div>
                </div>
              </div>
            {/each}
          </div>
        {/each}
  
        <div class="mx-10 rack-devices-column">
          {#each reversedDisplayGrid as deviceInSlot, slotIndex (TOTAL_U_SLOTS - slotIndex)}
            {@const currentU = slotIndex + 1}
            {#if deviceInSlot && (deviceInSlot as RackDevice & { isFiller?: boolean }).isFiller}
              {:else}
              <div
                class="rack-device type-{(deviceInSlot || {type: 'spacer'}).type} flex items-center justify-center text-center text-muted-foreground relative"
                style="height: { (deviceInSlot ? deviceInSlot.uHeight : 1) * U_HEIGHT_PX }px;"
                on:mouseenter={(e) => deviceInSlot && deviceInSlot.type !== 'spacer' && !(deviceInSlot as RackDevice & { isFiller?: boolean }).isFiller ? handleMouseEnter(deviceInSlot, e) : null}
                on:mouseleave={deviceInSlot && deviceInSlot.type !== 'spacer' && !(deviceInSlot as RackDevice & { isFiller?: boolean }).isFiller ? handleMouseLeave : null}
                role={deviceInSlot && deviceInSlot.type !== 'spacer' ? "region" : "presentation"}
                aria-label={deviceInSlot?.name}
              >
                {#if deviceInSlot && deviceInSlot.type !== 'spacer' && !(deviceInSlot as RackDevice & { isFiller?: boolean }).isFiller}
                  <!-- Device bezel/frame -->
                  <div class="device-bezel"></div>

                  <div class="device-faceplate w-full h-full p-2 flex flex-col items-center justify-center overflow-hidden gap-1">
                    <span class="device-name text-xs font-bold tracking-wider truncate">{deviceInSlot.faceplate?.text || deviceInSlot.name.split('(')[0].trim()}</span>
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
                      <div class="display-text mt-1">{deviceInSlot.faceplate.displayText}</div>
                    {/if}
                    {#if deviceInSlot.faceplate?.ports}
                      <div class="ports-strip mt-1 flex flex-wrap gap-1 justify-center">
                         {#each Array(Math.min(deviceInSlot.faceplate.ports.count, 16)) as _port, k (k)}
                            <span class="port port-{deviceInSlot.faceplate.ports.type}"></span>
                         {/each}
                      </div>
                    {/if}

                    <!-- Ventilation for servers -->
                    {#if deviceInSlot.type.includes('server') && deviceInSlot.uHeight >= 2}
                      <div class="vents-pattern"></div>
                    {/if}
                  </div>
                  {#if deviceInSlot.status}
                    <Badge variant={deviceInSlot.status === 'Online' ? 'default' : deviceInSlot.status === 'Offline' ? 'destructive' : 'secondary'} class="absolute top-1 right-1 text-[8px] px-1.5 py-0.5 shadow-md">{deviceInSlot.status}</Badge>
                  {/if}
                {:else}
                  <span class="text-xs text-zinc-600">{ (deviceInSlot && deviceInSlot.name) || `U${currentU}`}</span>
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
            transition:flyAndScale={{ y: 15, duration: 300, start: 0.8 }}
          >
            {#if currentInfraMachine}
              <!-- Full Infrastructure Card -->
              <Card class="shadow-2xl h-full flex flex-col">
                {#if currentInfraMachine.imageUrl}
                  <div class="relative h-48 w-full overflow-hidden rounded-t-lg">
                    <img
                      src={currentInfraMachine.imageUrl}
                      alt="Image de {currentInfraMachine.name}"
                      class="object-cover w-full h-full"
                    />
                    {#if currentInfraMachine.status}
                      <Badge
                        variant={currentInfraMachine.status === 'Online' ? 'default' : currentInfraMachine.status === 'Offline' ? 'destructive' : 'secondary'}
                        class="absolute top-2 right-2"
                      >
                        {#if currentInfraMachine.status === 'Online'} <Activity class="mr-1 h-3 w-3 text-green-400" /> {/if}
                        {currentInfraMachine.status}
                      </Badge>
                    {/if}
                  </div>
                {/if}

                <CardHeader class="pb-4">
                  <CardTitle class="text-xl">{currentInfraMachine.name}</CardTitle>
                  <CardDescription class="flex items-center">
                    {#if currentInfraMachine.os.icon}
                      <svelte:component this={currentInfraMachine.os.icon} class="h-4 w-4 mr-1.5 text-muted-foreground" />
                    {/if}
                    {currentInfraMachine.os.name}
                  </CardDescription>
                  <p class="text-sm text-primary font-semibold pt-1">{currentInfraMachine.role}</p>
                </CardHeader>

                <CardContent class="flex-grow space-y-3 text-sm">
                  <h4 class="font-semibold text-foreground mb-1">Spécifications Clés :</h4>
                  <ul class="space-y-1.5">
                    {#each currentInfraMachine.specs.slice(0, 3) as spec}
                      <li class="flex items-center text-muted-foreground">
                        {#if spec.icon}
                          <svelte:component this={spec.icon} class="h-4 w-4 mr-2 text-primary/80" />
                        {:else}
                          <div class="w-4 mr-2"></div>
                        {/if}
                        <span class="font-medium text-foreground/90 min-w-[80px]">{spec.name}:</span>
                        <span>{spec.value}</span>
                      </li>
                    {/each}
                  </ul>
                </CardContent>

                <div class="p-6 pt-4 border-t mt-auto">
                  <Button href={`/infra/${currentInfraMachine.id}`} variant="outline" size="sm" class="w-full">
                    Voir tous les Détails <ArrowRight class="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </Card>
            {:else}
              <!-- Basic Rack Device Info -->
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
                </CardContent>
              </Card>
            {/if}
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
      min-height: calc(28 * var(--u-slot-height, 30px) + 2 * theme(spacing.3) + 2 * 4px);
      --u-slot-height: v-bind(U_HEIGHT_PX + 'px');
      box-shadow:
        inset 0 2px 4px rgba(0, 0, 0, 0.3),
        inset 0 -2px 4px rgba(255, 255, 255, 0.05),
        0 20px 60px rgba(0, 0, 0, 0.5);
      position: relative;
    }

    .rack-cabinet::before {
      content: '';
      position: absolute;
      inset: 8px;
      border: 1px solid rgba(255, 255, 255, 0.05);
      border-radius: 4px;
      pointer-events: none;
    }

    .rack-rail {
      background: linear-gradient(to right,
        rgba(100, 100, 100, 0.3) 0%,
        rgba(150, 150, 150, 0.4) 50%,
        rgba(100, 100, 100, 0.3) 100%);
      box-shadow:
        inset 2px 0 4px rgba(0, 0, 0, 0.3),
        inset -2px 0 4px rgba(0, 0, 0, 0.3);
      border-left: 1px solid rgba(255, 255, 255, 0.05);
      border-right: 1px solid rgba(0, 0, 0, 0.3);
    }

    .rack-u-marking {
      @apply flex items-center justify-between px-1 border-b border-zinc-700/50;
      line-height: 1;
      position: relative;
    }

    .mounting-holes {
      @apply flex flex-col gap-0.5;
    }

    .mounting-hole {
      width: 3px;
      height: 3px;
      background: radial-gradient(circle, rgba(0, 0, 0, 0.8) 0%, rgba(50, 50, 50, 0.6) 100%);
      border-radius: 50%;
      box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.8), 0 1px 1px rgba(255, 255, 255, 0.1);
    }

    .rack-device {
      @apply transition-all duration-200 cursor-pointer overflow-hidden;
      border: 1px solid rgba(0, 0, 0, 0.4);
      border-top: 1px solid rgba(255, 255, 255, 0.1);
      position: relative;
      box-shadow:
        0 2px 8px rgba(0, 0, 0, 0.3),
        inset 0 1px 0 rgba(255, 255, 255, 0.1);
    }

    .rack-device:hover {
      transform: translateX(2px);
      box-shadow:
        0 4px 12px rgba(0, 0, 0, 0.4),
        inset 0 1px 0 rgba(255, 255, 255, 0.2),
        0 0 0 2px hsl(var(--primary) / 0.3);
    }

    .device-bezel {
      position: absolute;
      inset: 0;
      border: 2px solid rgba(0, 0, 0, 0.3);
      border-radius: 2px;
      pointer-events: none;
      box-shadow:
        inset 0 0 0 1px rgba(255, 255, 255, 0.05),
        inset 2px 2px 4px rgba(0, 0, 0, 0.2);
    }

    .device-faceplate {
      text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
    }

    .device-name {
      @apply uppercase;
      letter-spacing: 0.1em;
      filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.8));
    }

    /* Device Type Styles with 3D depth */
    .type-switch {
      background: linear-gradient(180deg, #1e40af 0%, #1e3a8a 50%, #1e3a8a 100%);
    }
    .type-switch .device-name { @apply text-blue-100; }

    .type-server-1u, .type-server-2u, .type-server-3u, .type-server-4u {
      background: linear-gradient(180deg, #a1a1aa 0%, #71717a 50%, #52525b 100%);
    }
    .type-server-1u .device-name, .type-server-2u .device-name,
    .type-server-3u .device-name, .type-server-4u .device-name {
      @apply text-zinc-100;
    }

    .type-storage-2u, .type-storage-4u {
      background: linear-gradient(180deg, #94a3b8 0%, #64748b 50%, #475569 100%);
    }
    .type-storage-2u .device-name, .type-storage-4u .device-name {
      @apply text-slate-100;
    }

    .type-arm-cluster {
      background: linear-gradient(180deg, #c084fc 0%, #a855f7 50%, #9333ea 100%);
    }
    .type-arm-cluster .device-name { @apply text-purple-100; }

    .type-spacer {
      @apply bg-transparent border-dashed border-zinc-700/30;
      box-shadow: none;
    }
    .type-spacer:hover {
      transform: none;
      box-shadow: none;
    }

    /* LED Styles with glow effects */
    .leds-strip { @apply flex gap-1; }
    .led {
      @apply w-1.5 h-1.5 rounded-full;
      position: relative;
    }
    .led-green {
      background: radial-gradient(circle, #4ade80 0%, #22c55e 100%);
      box-shadow:
        0 0 4px #4ade80,
        0 0 8px rgba(74, 222, 128, 0.5),
        inset 0 -1px 2px rgba(0, 0, 0, 0.3);
    }
    .led-amber {
      background: radial-gradient(circle, #fbbf24 0%, #f59e0b 100%);
      box-shadow:
        0 0 4px #fbbf24,
        0 0 8px rgba(251, 191, 36, 0.5),
        inset 0 -1px 2px rgba(0, 0, 0, 0.3);
    }
    .led-red {
      background: radial-gradient(circle, #f87171 0%, #ef4444 100%);
      box-shadow:
        0 0 4px #f87171,
        0 0 8px rgba(248, 113, 113, 0.5),
        inset 0 -1px 2px rgba(0, 0, 0, 0.3);
    }
    .led-blue {
      background: radial-gradient(circle, #60a5fa 0%, #3b82f6 100%);
      box-shadow:
        0 0 4px #60a5fa,
        0 0 8px rgba(96, 165, 250, 0.5),
        inset 0 -1px 2px rgba(0, 0, 0, 0.3);
    }
    .led.blinking {
      animation: led-blink 1.5s infinite ease-in-out;
    }
    @keyframes led-blink {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.3; }
    }

    /* Port Styles */
    .ports-strip { }
    .port {
      @apply w-2 h-2 rounded-sm;
      background: linear-gradient(135deg, #1a1a1a 0%, #0a0a0a 100%);
      border: 1px solid rgba(0, 0, 0, 0.8);
      box-shadow:
        inset 0 1px 2px rgba(0, 0, 0, 0.8),
        0 1px 1px rgba(255, 255, 255, 0.1);
    }
    .port-rj45 {
      border-color: rgba(251, 191, 36, 0.3);
    }

    /* Ventilation Pattern */
    .vents-pattern {
      position: absolute;
      right: 8px;
      top: 50%;
      transform: translateY(-50%);
      width: 40px;
      height: 80%;
      background: repeating-linear-gradient(
        0deg,
        transparent,
        transparent 2px,
        rgba(0, 0, 0, 0.3) 2px,
        rgba(0, 0, 0, 0.3) 3px
      );
      border-radius: 2px;
      opacity: 0.6;
    }

    .display-text {
      @apply bg-black/90 text-green-400 font-mono text-xs px-2 py-1 rounded;
      box-shadow: inset 0 0 10px rgba(74, 222, 128, 0.3);
      border: 1px solid rgba(74, 222, 128, 0.2);
    }
  </style>
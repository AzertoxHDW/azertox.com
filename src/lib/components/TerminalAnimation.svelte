<script lang="ts">
    import { onMount, afterUpdate } from 'svelte';
    import { fade, fly } from 'svelte/transition';
    import { Button } from '$lib/components/ui/button';
    import { X } from 'lucide-svelte';
    
    let visible = true;
    let lines: string[] = [
    "[ OK ] Initializing system core...",
    "[ OK ] Loading kernel modules: ext4, btrfs, vfat...",
    "[ OK ] Mounting root filesystem on /dev/sda1...",
    "[ OK ] Checking disk integrity... [PASS]",
    "[ OK ] Starting network services: DHCP, DNS, SSH...",
    "[ OK ] Applying security policies...",
    "[ OK ] Configuring user environment: locale, permissions...",
    "[ OK ] Installing Node.js dependencies via npm...",
    "[ OK ] Running build script: npm run build...",
    "[ OK ] Optimizing assets for production...",
    "[ OK ] Starting Node.js server on port 3000...",
    "[ OK ] Running database migrations...",
    "[ OK ] Initializing background workers...",
    "[ WARN ] Some optional modules failed to load: coffee_machine",
    "[ OK ] Deployment successful. Access the app at https://mathdesigns.app",
    "[ OK ] System ready. Welcome!"
];

    
    let currentLine = 0;
    let terminalContent: HTMLDivElement;
    
    onMount(() => {
      const interval = setInterval(() => {
        if (currentLine < lines.length - 1) {
          currentLine++;
        } else {
          clearInterval(interval);
          setTimeout(() => {
            visible = false;
          }, 1600);
        }
      }, 5);
    
      return () => clearInterval(interval);
    });
    
    afterUpdate(() => {
      if (terminalContent) {
        terminalContent.scrollTop = terminalContent.scrollHeight;
      }
    });
    
    function closeTerminal() {
      visible = false;
    }
    </script>
    
    {#if visible}
      <div
        class="fixed inset-0 bg-background flex items-center justify-center z-50"
        transition:fade={{ duration: 300 }}
      >
        <div class="w-full max-w-2xl bg-black rounded-lg overflow-hidden shadow-lg">
          <div class="flex items-center justify-between bg-card px-4 py-2">
            <div class="flex space-x-2">
              <div class="w-3 h-3 rounded-full bg-red-500"></div>
              <div class="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div class="w-3 h-3 rounded-full bg-green-500"></div>
            </div>
            <div class="text-gray-400 text-sm font-mono">mathdesigns@portfolio:~</div>
            <Button variant="ghost" size="icon" on:click={closeTerminal} class="text-gray-400 hover:text-white">
              <X class="h-4 w-4" />
            </Button>
          </div>
          <div bind:this={terminalContent} class="p-4 h-80 overflow-y-auto font-mono text-sm">
            {#each lines.slice(0, currentLine + 1) as line, index}
              <p 
                in:fly={{ y: 20, duration: 300, delay: index * 100 }} 
                class="text-primary mb-2"
              >
                <span class="text-blue-400">$</span> {line}
              </p>
            {/each}
          </div>
        </div>
      </div>
    {/if}
    
    
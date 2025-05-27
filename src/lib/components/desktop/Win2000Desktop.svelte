<script lang="ts">
  import { onMount, onDestroy, tick } from 'svelte';
  import { Card, CardHeader, CardTitle, CardContent } from '$lib/components/ui/card';
  import { Button } from '$lib/components/ui/button';
  import { draggable } from '$lib/actions/draggable';
  import { XIcon, ComputerIcon, FolderOpenIcon, GlobeIcon, FilesIcon, InfoIcon, Settings2Icon, LogOutIcon, Maximize2Icon, Minimize2Icon, ChevronsRightIcon, ServerIcon, UserCircle as UserCircleIcon, Icon } from 'lucide-svelte';
  import { writable, get } from 'svelte/store';
  import { BROWSER } from 'esm-env';
  import { currentTheme, setTheme, themes, type Theme, type ThemeOption } from "$lib/themeStore"; // For "Shut Down"
  import { flyAndScale } from '$lib/utils';
	import { goto } from '$app/navigation';

  interface WindowInstance {
    id: number;
    title: string;
    component?: any; 
    content?: string; 
    x: number;
    y: number;
    width: string;
    height: string;
    zIndex: number;
    icon?: any;
    isMinimized?: boolean;
    isActive: boolean; // Non-optional
    isMaximized?: boolean; 
    originalRect?: { x: number; y: number; width: string; height: string }; 
  }

  const openWindows = writable<WindowInstance[]>([]);
  let nextWindowId = 0;
  let highestZIndex = 10; 

  let showStartMenu = writable(false);

  const desktopIcons = [
    { 
      name: "My Computer", 
      icon: ComputerIcon, 
      action: () => openWindow({
        title: "My Computer", 
        content: "", 
        icon: ComputerIcon, 
        initialPos: {x: 50, y: 50}
      }) 
    },
    { 
      name: "My Documents", 
      icon: FolderOpenIcon, 
      action: () => openWindow({
        title: "My Documents", 
        content: "Projects\nArticles\nPersonal Files...", 
        icon: FolderOpenIcon,
        initialPos: {x: 100, y: 100}
      }) 
    },
    { 
      name: "Internet Explorer",
      icon: GlobeIcon, 
      action: () => openWindow({
        title: "Azertox Web Browser", 
        content: "Welcome to the Azertox Web!\n\nNavigating to: azertox.com...\n\n(This is a simulated browser window)", 
        icon: GlobeIcon,
        initialPos: {x: 150, y: 150}
      }) 
    },
    {
      name: "Control Panel",
      icon: Settings2Icon,
      action: () => openWindow({
        title: "Control Panel",
        content: "Appearance and Themes\nNetwork Connections\nAdd or Remove Programs\nUser Accounts",
        icon: Settings2Icon,
        initialPos: {x: 200, y: 200}
      })
    }
  ];

  interface OpenWindowOptions {
    title: string;
    content?: string;
    component?: any;
    icon?: any;
    initialPos?: { x: number; y: number };
    initialSize?: { width: string; height: string };
  }

  function openWindow(options: OpenWindowOptions) {
    const { title, content, component, icon, initialPos, initialSize } = options;
    highestZIndex++;
    const newWindow: WindowInstance = {
      id: nextWindowId++,
      title,
      content,
      component,
      icon,
      x: initialPos?.x ?? Math.random() * (BROWSER ? window.innerWidth / 4 : 200) + 20,
      y: initialPos?.y ?? Math.random() * (BROWSER ? window.innerHeight / 4 : 100) + 20,
      width: initialSize?.width ?? "480px",
      height: initialSize?.height ?? "320px",
      zIndex: highestZIndex,
      isMinimized: false,
      isActive: true, // New window is active
      isMaximized: false, 
    };
    openWindows.update(windows => 
        windows.map(w => ({ ...w, isActive: false })).concat(newWindow) // Deactivate others
    );
    showStartMenu.set(false); 
  }

  function closeWindow(windowId: number, event?: MouseEvent) {
    event?.stopPropagation();
    openWindows.update(windows => windows.filter(w => w.id !== windowId));
    const remainingWindows = get(openWindows);
    if (remainingWindows.length > 0) {
      // Find the window with the highest zIndex among the remaining ones and make it active
      let topWindow = remainingWindows.reduce((prev, current) => (prev.zIndex > current.zIndex) ? prev : current);
      bringToFront(topWindow.id);
    }
  }

  function bringToFront(windowId: number) {
    highestZIndex++;
    openWindows.update(windows =>
      windows.map(w => ({
        ...w,
        zIndex: w.id === windowId ? highestZIndex : w.zIndex,
        isActive: w.id === windowId, 
        isMinimized: w.id === windowId ? false : w.isMinimized 
      }))
    );
    showStartMenu.set(false); 
  }

  function toggleMinimize(windowId: number, event?: MouseEvent) {
    event?.stopPropagation();
    let wasMinimized = false; // To know if we are restoring or minimizing

    openWindows.update(windows =>
      windows.map(w => {
        if (w.id === windowId) {
          wasMinimized = w.isMinimized ?? false;
          const newIsMinimized = !w.isMinimized;
          return { 
            ...w, 
            isMinimized: newIsMinimized, 
            isActive: newIsMinimized ? false : true // Active if restoring, inactive if minimizing
          };
        }
        // If we are restoring a window, other windows should become inactive
        return !wasMinimized && w.id !== windowId ? { ...w, isActive: false } : w;
      })
    );

    // If the window was just restored (wasMinimized is true, meaning newIsMinimized is false)
    // or if it was active and minimized (wasMinimized is false, newIsMinimized is true)
    // we need to ensure correct active state and z-index.
    if (!wasMinimized) { // Window was active and is now being minimized (or was restored by taskbar click)
        // If it was restored by taskbar click, bringToFront would have handled active state.
        // If minimized via its own button, it becomes inactive.
        // If it's being restored by its own button, it should become active.
        const currentWindow = get(openWindows).find(w => w.id === windowId);
        if (currentWindow && !currentWindow.isMinimized) {
             bringToFront(windowId); // This makes it active and sets z-index
        } else if (currentWindow && currentWindow.isMinimized) {
            // If it was just minimized, and another window exists, make the top one active
            const otherWindows = get(openWindows).filter(w => w.id !== windowId && !w.isMinimized);
            if (otherWindows.length > 0) {
                let topWindow = otherWindows.reduce((prev, current) => (prev.zIndex > current.zIndex) ? prev : current);
                bringToFront(topWindow.id);
            }
        }
    }
     // If it was minimized and is now restored (wasMinimized = true), bringToFront will make it active.
    if(wasMinimized){
        bringToFront(windowId);
    }
  }

  function toggleMaximize(windowId: number, event?: MouseEvent) {
    event?.stopPropagation();
    openWindows.update(windows =>
      windows.map(w => {
        if (w.id === windowId) {
          if (w.isMaximized) {
            return { 
              ...w,
              isMaximized: false,
              x: w.originalRect?.x ?? w.x,
              y: w.originalRect?.y ?? w.y,
              width: w.originalRect?.width ?? w.width,
              height: w.originalRect?.height ?? w.height,
            };
          } else {
            return { 
              ...w,
              isMaximized: true,
              originalRect: { x: w.x, y: w.y, width: w.width, height: w.height },
              x: 0,
              y: 0,
              width: "100%", 
              height: `calc(100% - ${TASKBAR_HEIGHT}px)`, 
            };
          }
        }
        return w;
      })
    );
    bringToFront(windowId); 
  }

  let desktopEl: HTMLElement; 
  let currentTime = BROWSER ? new Date().toLocaleTimeString('fr-FR', {hour: '2-digit', minute: '2-digit'}) : '';
  let clockInterval: number;
  const TASKBAR_HEIGHT = 28; 

  const logoff2k = new Audio();
  logoff2k.src = '/sounds/2klogoff.mp3';
  const startMenuItems = [
    { label: "Musée", icon: FolderOpenIcon, action: () => {
        goto('/projets');
        setTimeout(() => setTheme('system'), 500);
        showStartMenu.set(false);
    }},
    { label: "Infrastructure", icon: ServerIcon, href: "/infra", action: () => {
        goto('/infra');
        setTimeout(() => setTheme('system'), 500);
        showStartMenu.set(false);
    }},
    { label: "À propos de moi", icon: UserCircleIcon, href: "/about", action: () => {
        goto('/about');
        setTimeout(() => setTheme('system'), 500);
        showStartMenu.set(false);
    }},
    { isSeparator: true },
    { label: "Se Déconnecter", icon: LogOutIcon, action: () => {
        setTheme('system');
        logoff2k.play();
        showStartMenu.set(false);
    }}
  ];

  function handleStartMenuClick(action?: () => void, href?: string) {
    if (action) action();
    if (href && BROWSER) {
      window.location.href = href; 
    }
    showStartMenu.set(false);
  }

  function handleClickOutsideStartMenu(event: MouseEvent) {
    const startMenuNode = document.getElementById('start-menu');
    const startButtonNode = document.getElementById('start-button');
    if ($showStartMenu && startMenuNode && !startMenuNode.contains(event.target as Node) &&
        startButtonNode && !startButtonNode.contains(event.target as Node)) {
      showStartMenu.set(false);
    }
  }

  onMount(() => {
    if (BROWSER) {
      clockInterval = window.setInterval(() => {
        currentTime = new Date().toLocaleTimeString('fr-FR', {hour: '2-digit', minute: '2-digit'});
      }, 1000 * 30); 
      document.addEventListener('click', handleClickOutsideStartMenu);
    }
  });

  onDestroy(() => {
    if (BROWSER) {
      window.clearInterval(clockInterval);
      document.removeEventListener('click', handleClickOutsideStartMenu);
    }
  });

</script>

<div class="win2000-desktop fixed inset-0 overflow-hidden select-none" bind:this={desktopEl}>
  <div class="desktop-icons-container p-4 flex flex-col flex-wrap items-start content-start h-full gap-y-1 gap-x-1">
    {#each desktopIcons as item (item.name)}
      <button
        class="desktop-icon flex flex-col items-center w-[72px] text-center p-1 rounded hover:bg-blue-700/30 focus:bg-blue-700/50 focus:outline-none"
        on:click={item.action}
        on:dblclick={item.action} title={item.name}
      >
        <svelte:component this={item.icon} class="w-8 h-8 mb-0.5 text-white" stroke-width="1.5"/>
        <span class="text-xs text-white truncate w-full bg-transparent px-0.5 py-px">{item.name}</span>
      </button>
    {/each}
  </div>

  {#if BROWSER} {#each $openWindows as windowItem (windowItem.id)}
      <div
        class="window-wrapper absolute {windowItem.isMinimized ? 'hidden' : 'block'} {windowItem.isMaximized ? 'maximized-window' : ''}"
        use:draggable={{ 
            handleSelector: '.window-title-bar', 
            initialPosition: {x: windowItem.x, y: windowItem.y },
            bounds: desktopEl, 
            disabled: windowItem.isMaximized,
            onDragStart: () => bringToFront(windowItem.id),
            onDragEnd: (_, node, newPos) => {
                openWindows.update(ws => ws.map(w => w.id === windowItem.id ? {...w, x: newPos.x, y: newPos.y} : w));
            }
        }}
        style="width: {windowItem.width}; height: {windowItem.height}; z-index: {windowItem.zIndex}; left: {windowItem.x}px; top: {windowItem.y}px;"
        on:mousedown={() => bringToFront(windowItem.id)}
        role="dialog"
        aria-labelledby="window-title-{windowItem.id}"
        aria-modal="false" 
      >
        <Card class="w-full h-full flex flex-col shadow-md win2000-window-card {windowItem.isActive ? 'active-window' : ''}">
          <div 
            class="window-title-bar p-1 flex items-center justify-between {windowItem.isMaximized ? 'cursor-default' : 'cursor-grab active:cursor-grabbing'}"
            id="window-title-{windowItem.id}"
            on:dblclick={(e) => { if (!windowItem.isMaximized) toggleMaximize(windowItem.id, e); }}
          >
            <div class="flex items-center pl-1 flex-grow min-w-0"> 
              {#if windowItem.icon} <svelte:component this={windowItem.icon} class="w-3 h-3 mr-1.5 flex-shrink-0" /> {/if}
              <span class="text-xs font-bold select-none truncate">{windowItem.title}</span>
            </div>
            <div class="flex items-center flex-shrink-0"> 
              <Button variant="ghost" size="sm" class="win2000-control-button" on:click={(e) => toggleMinimize(windowItem.id, e)} aria-label="Minimize window">
                <span class="font-['Marlett'] text-[10px]">0</span> </Button>
              <Button variant="ghost" size="sm" class="win2000-control-button" on:click={(e) => toggleMaximize(windowItem.id, e)} aria-label={windowItem.isMaximized ? "Restore window" : "Maximize window"}>
                <span class="font-['Marlett'] text-[10px]">{windowItem.isMaximized ? '2' : '1'}</span> 
              </Button>
              <Button variant="ghost" size="sm" class="win2000-control-button close" on:click={(e) => closeWindow(windowItem.id, e)} aria-label="Close window">
                <span class="font-['Marlett'] text-[10px]">r</span> </Button>
            </div>
          </div> 
          <CardContent class="p-2 bg-white text-black flex-grow overflow-auto win2000-window-content">
            {#if windowItem.component}
              <svelte:component this={windowItem.component} />
            {:else if windowItem.title === "Azertox Web Browser" && windowItem.content?.includes("azertox.com")}
              <p class="text-sm whitespace-pre-wrap">{windowItem.content}</p>
               <a href="https://azertox.com" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:underline">Visit azertox.com</a>
            {:else}
              <p class="text-sm whitespace-pre-wrap">{windowItem.content}</p>
            {/if}
          </CardContent>
        </Card>
      </div>
    {/each}
  {/if}

  {#if $showStartMenu && BROWSER}
    <div id="start-menu" class="win2000-start-menu fixed bottom-7 left-0 w-48 bg-gray-300 border-t-2 border-l-2 border-white border-r-2 border-b-2 border-gray-500 shadow-lg z-[10001] flex flex-col"
         use:flyAndScale={{y: 20, duration:150, start:0.9}}>
      <div class="start-menu-sidebar bg-blue-800 text-white p-2 flex items-center justify-center">
        <span class="font-bold text-sm transform whitespace-nowrap">Windown 2000</span>
      </div>
      <div class="start-menu-items flex-grow p-0.5">
        {#each startMenuItems as item, i (item.label || `sep-${i}`)}
          {#if item.isSeparator}
            <hr class="border-t-gray-500 border-b-white my-0.5" />
          {:else}
            <button 
              class="start-menu-item w-full text-left px-2 py-1 hover:bg-blue-700 hover:text-white focus:bg-blue-700 focus:text-white focus:outline-none text-xs flex items-center"
              on:click={() => handleStartMenuClick(item.action, item.href)}
            >
              {#if item.icon} <svelte:component this={item.icon} class="w-4 h-4 mr-2" /> {/if}
              {item.label}
              {#if item.href && !item.action} <ChevronsRightIcon class="w-3 h-3 ml-auto opacity-70" /> {/if}
            </button>
          {/if}
        {/each}
      </div>
    </div>
  {/if}

  <div class="win2000-taskbar fixed bottom-0 left-0 right-0 h-7 bg-gray-300 border-t border-white flex items-center px-1 z-[10000]">
    <Button 
      id="start-button"
      variant="ghost" 
      class="win2000-start-button text-xs font-bold px-2 py-0 h-[22px] flex items-center {$showStartMenu ? 'active' : ''}"
      on:click={() => showStartMenu.update(s => !s)}
    >
      <img src="/images/win2klogo.png" alt="windows logo" width="30px" class="-ml-2 mr-1">
      Démarrer
    </Button>
    <div class="taskbar-divider"></div>
    <div class="taskbar-tabs flex-grow h-full flex items-center overflow-x-auto">
      {#each $openWindows as windowItem (windowItem.id)}
          <button 
            class="taskbar-tab text-xs px-2 h-[22px] flex items-center truncate max-w-[150px] {windowItem.isActive && !windowItem.isMinimized ? 'active' : ''}" 
            on:click={() => bringToFront(windowItem.id)} title={windowItem.title}
          >
              {#if windowItem.icon} <svelte:component this={windowItem.icon} class="w-3 h-3 mr-1.5 flex-shrink-0" /> {/if}
              <span class="truncate">{windowItem.title}</span>
          </button>
      {/each}
    </div>
    <div class="taskbar-divider ml-auto"></div>
    <div class="system-tray text-xs px-2 text-gray-700 h-[22px] flex items-center">
      {currentTime}
    </div>
  </div>
</div>

<style lang="postcss">
  .win2000-desktop {
    background-image: url('/images/win2kwallpaper.png');
    background-size: cover;
    background-position: 100%;
    font-family: "Tahoma", "MS Sans Serif", Arial, sans-serif; /* W2K fonts */
  }

  .desktop-icons-container { }
  .desktop-icon { color: white; }
  .desktop-icon:focus span, 
  .desktop-icon:active span {
      background-color: #000080; 
      color: white;
  }

  .window-wrapper.maximized-window {
    border: none !important; /* Remove draggable border when maximized */
    box-shadow: none !important;
  }

  .win2000-window-card {
    border-top: 1px solid #FFFFFF;
    border-left: 1px solid #FFFFFF;
    border-right: 1px solid #404040;
    border-bottom: 1px solid #404040;
    box-shadow: 1px 1px 0px #808080; 
    border-radius: 0px; 
    background-color: #C0C0C0; 
  }
  .win2000-window-card.active-window .window-title-bar {
    background-color: #000080; 
  }

  .window-title-bar {
    background-color: #C0C0C0; 
    color: #808080; 
    padding: 2px 3px;
    height: 20px; 
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .win2000-window-card.active-window .window-title-bar span {
      color: white; 
  }
  .window-title-bar span {
      line-height: 1; 
  }

  .win2000-control-button {
    font-family: "Marlett", "Webdings"; 
    color: black;
    background-color: #808080;
    border-width: 1px;
    border-style: outset;
    border-color: #FFFFFF #808080 #808080 #FFFFFF; 
    width: 16px;
    height: 16px;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 10px; 
    margin-left: 2px;
    border-radius: 0;
  }
  .win2000-control-button:active {
      border-style: inset;
      border-color: #808080 #FFFFFF #FFFFFF #808080;
      background-color: #B0B0B0;
  }
  .win2000-control-button.close:hover {
      background-color: #E04343; 
      color: white;
  }
  .win2000-window-content { }

  .win2000-taskbar {
    background-color: #C0C0C0; 
    border-top: 1px solid #FFFFFF;
    box-shadow: inset 0 1px 0 #DFDFDF; 
  }
  .win2000-start-button {
    background-color: #C0C0C0;
    border: 1px solid;
    border-color: #FFFFFF #808080 #808080 #FFFFFF; 
    box-shadow: 1px 1px 1px #00000080; 
    color: black;
  }
  .win2000-start-button.active, /* Style for when start menu is open */
  .win2000-start-button:active {
    border-color: #808080 #FFFFFF #FFFFFF #808080; 
    background-color: #B0B0B0;
    box-shadow: inset 1px 1px 0px #00000030; 
  }
  .taskbar-divider {
    border-left: 1px solid #808080;
    border-right: 1px solid #FFFFFF;
    height: 80%; 
    margin: 0 2px;
    align-self: center;
  }
  .taskbar-tabs { }
  .taskbar-tab {
    background-color: #C0C0C0;
    border: 1px solid;
    border-color: #FFFFFF #808080 #808080 #FFFFFF; 
    box-shadow: 1px 1px 0 #00000030;
    color: black;
    margin-right: 1px; 
  }
  .taskbar-tab.active { 
    border-color: #808080 #FFFFFF #FFFFFF #808080; 
    background-color: #B0B0B0; 
    font-weight: bold;
    box-shadow: inset 1px 1px 1px #00000030; 
  }
  .system-tray {
    border: 1px solid;
    border-color: #808080 #FFFFFF #FFFFFF #808080; 
    padding: 1px 4px;
    margin: 1px 2px; 
    color: black;
  }

  /* Start Menu Styles */
  .win2000-start-menu {
    display: flex; /* Uses flex for sidebar and items */
    height: auto; /* Adjust height based on content, or set a max-height */
    max-height: 400px; /* Example max height */
  }
  .start-menu-sidebar {
    width: 24px; /* Width of the vertical "Windows 2000" text bar */
    writing-mode: vertical-rl; /* Rotate text */
    text-orientation: mixed;
    transform: rotate(180deg); /* Correct orientation after rotation */
    display: flex;
    align-items: center;
    justify-content: center;
    border-right: 1px solid #808080; /* Separator */
  }
  .start-menu-sidebar span {
      letter-spacing: 1px;
  }
  .start-menu-items {
    /* flex-grow takes remaining space */
  }
  .start-menu-item {
    border: 1px solid transparent; /* For focus indication */
  }
  .start-menu-item:hover, .start-menu-item:focus {
    background-color: #000080; /* W2K selection blue */
    color: white;
  }
</style>

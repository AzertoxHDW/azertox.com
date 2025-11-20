<script lang="ts">
  import "../app.css"; // Your global styles, including theme variables
  import { currentTheme, setTheme, themes, type Theme, type ThemeOption, bootAnimationTrigger } from "$lib/themeStore";
  import BootAnimation from "$lib/components/BootAnimation.svelte";
  import Win2000Desktop from "$lib/components/desktop/Win2000Desktop.svelte";
  import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "$lib/components/ui/select";
  import { Home, User, ServerIcon as ServerIconLucide, FolderGit2 as CodeIconLucide, Gem, Menu, X, Terminal, ArrowUp } from "lucide-svelte";
  import { page } from '$app/stores';
  import { onMount } from "svelte";
  import type { Selected } from "bits-ui";
  import { BROWSER } from 'esm-env';
  import { mobileTerminalTrigger } from '$lib/mobileMenuStore';

  let showBootUpAnimation = false;
  let currentBootThemeOption: ThemeOption | undefined = undefined;

  // Mobile menu state
  let mobileMenuOpen = false;
  let showScrollTop = false;

  // Navigation sliding background
  let navItemElements: (HTMLAnchorElement | null)[] = [];
  let activeIndicatorStyle = '';
  let isHoveringNav = false;
  let hoveredIndex = -1;

  $: if (navItemElements.length === navItems.length && BROWSER) {
    updateActiveIndicator();
  }

  function updateActiveIndicator() {
    const targetIndex = isHoveringNav && hoveredIndex !== -1 ? hoveredIndex : navItems.findIndex(item => $page.url.pathname === item.href);

    if (targetIndex !== -1 && navItemElements[targetIndex]) {
      const targetElement = navItemElements[targetIndex];
      const navContainer = targetElement?.parentElement;
      if (targetElement && navContainer) {
        const containerRect = navContainer.getBoundingClientRect();
        const targetRect = targetElement.getBoundingClientRect();
        const left = targetRect.left - containerRect.left;
        const width = targetRect.width;
        const transition = isHoveringNav ? 'all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)' : 'all 0.3s ease-out';
        activeIndicatorStyle = `left: ${left}px; width: ${width}px; transition: ${transition};`;
      }
    }
  }

  function handleNavMouseMove(event: MouseEvent) {
    if (!isHoveringNav) return;

    const navElement = event.currentTarget as HTMLElement;
    const mouseX = event.clientX;

    // Find closest nav item
    let closestIndex = -1;
    let closestDistance = Infinity;

    navItemElements.forEach((element, index) => {
      if (element) {
        const rect = element.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const distance = Math.abs(mouseX - centerX);

        if (distance < closestDistance) {
          closestDistance = distance;
          closestIndex = index;
        }
      }
    });

    if (closestIndex !== -1 && closestIndex !== hoveredIndex) {
      hoveredIndex = closestIndex;
      updateActiveIndicator();
    }
  }

  function handleNavMouseEnter() {
    isHoveringNav = true;
  }

  function handleNavMouseLeave() {
    isHoveringNav = false;
    hoveredIndex = -1;
    updateActiveIndicator();
  }

  // Reactive statement to check if win2000 theme is active
  $: isWin2000Theme = ($currentTheme === 'win2000');

  // Check if we're on the home page
  $: isHomePage = $page.url.pathname === '/';

  // Close mobile menu when route changes
  $: if ($page.url.pathname) {
    mobileMenuOpen = false;
    // Update active indicator when page changes
    if (BROWSER) {
      setTimeout(updateActiveIndicator, 0);
    }
  }

  // Listen for boot animation triggers from terminal
  $: if ($bootAnimationTrigger && $bootAnimationTrigger.theme === 'win2000') {
    const selectedOption = themes.find(t => t.value === 'win2000');
    if (selectedOption && $currentTheme !== 'win2000') {
      currentBootThemeOption = selectedOption;
      showBootUpAnimation = true;
      // Clear the trigger
      bootAnimationTrigger.set(null);
    }
  }

  function handleGlobalKeyDown(event: KeyboardEvent) {
    if (event.key === 'Escape' && isWin2000Theme) {
      // Play Windows 2000 shutdown sound
      if (BROWSER) {
        const audio = new Audio('/sounds/2klogoff.mp3');
        audio.volume = 0.5;
        audio.play().catch(err => console.log('Audio playback failed:', err));
      }
      setTheme('dark'); // Exit win2000 theme back to dark theme
    }

    // Close mobile menu on Escape
    if (event.key === 'Escape' && mobileMenuOpen) {
      mobileMenuOpen = false;
    }
  }

  onMount(() => {
    const initialTheme = localStorage.getItem('selected-theme') as Theme || 'system';
    if ($currentTheme !== initialTheme) {
        currentTheme.set(initialTheme);
    }

    if (BROWSER) {
      window.addEventListener('keydown', handleGlobalKeyDown);

      // Track scroll position for scroll to top button
      const handleScroll = () => {
        showScrollTop = window.scrollY > 300; // Show after 300px scroll
      };

      // Update active indicator on resize
      const handleResize = () => {
        updateActiveIndicator();
      };

      window.addEventListener('scroll', handleScroll, { passive: true });
      window.addEventListener('resize', handleResize);

      // Initial update
      setTimeout(updateActiveIndicator, 0);
    }

    return () => {
        if (BROWSER) {
            window.removeEventListener('keydown', handleGlobalKeyDown);
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('resize', handleResize);
        }
    };
  });


  function handleThemeChange(selected: Selected<Theme> | undefined) {
    if (selected && selected.value) {
      const newThemeValue = selected.value;
      const selectedOption = themes.find(t => t.value === newThemeValue);

      if (selectedOption && selectedOption.value === 'win2000') {
        // If we are already on win2000 and select it again, don't re-boot.
        if ($currentTheme === 'win2000') {
            return;
        }
        currentBootThemeOption = selectedOption;
        showBootUpAnimation = true;
        currentTheme.set(newThemeValue);
      } else if (selectedOption) {
        currentTheme.set(newThemeValue);
      }
    }
  }

  function onBootAnimationComplete() {
    if (currentBootThemeOption) {
      currentTheme.set(currentBootThemeOption.value);
      // Note: BootAnimation component already plays the startup sound
    }
    showBootUpAnimation = false;
    currentBootThemeOption = undefined;
  }

  function toggleMobileMenu() {
    mobileMenuOpen = !mobileMenuOpen;
  }

  const navItems = [
    { href: "/", label: "Accueil", icon: Home },
    { href: "/about", label: "À propos", icon: User },
    { href: "/infra", label: "Infrastructure", icon: ServerIconLucide },
    { href: "/projects", label: "Projets", icon: CodeIconLucide },
    { href: "/museum", label: "Musée", icon: Gem },
  ];

  function handleMobileTerminalClick() {
    mobileTerminalTrigger.set(true);
    mobileMenuOpen = false;
  }

  function scrollToTop() {
    if (BROWSER) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

</script>

<div class="flex flex-col min-h-screen bg-background text-foreground {isWin2000Theme ? 'win2000-theme' : ''}">

  {#if !showBootUpAnimation}
    <!-- Mobile/Tablet Header with Hamburger -->
    <div class="lg:hidden fixed top-4 left-4 z-[160]">
      <!-- Hamburger Button -->
      <button
        on:click={toggleMobileMenu}
        class="w-12 h-12 rounded-full bg-primary/10 hover:bg-primary/20 border border-primary/30 flex items-center justify-center transition-all hover:scale-110 backdrop-blur-sm"
        aria-label="{mobileMenuOpen ? 'Fermer' : 'Ouvrir'} le menu"
      >
        {#if mobileMenuOpen}
          <X class="h-6 w-6 text-primary" />
        {:else}
          <Menu class="h-6 w-6 text-primary" />
        {/if}
      </button>
    </div>

    <!-- Mobile/Tablet Scroll to Top Button (appears when scrolled) -->
    {#if showScrollTop}
      <div class="lg:hidden fixed top-4 right-4 z-[160]">
        <button
          on:click={scrollToTop}
          class="w-12 h-12 rounded-full bg-primary/10 hover:bg-primary/20 border border-primary/30 flex items-center justify-center transition-all hover:scale-110 backdrop-blur-sm animate-in fade-in slide-in-from-top-2 duration-300"
          aria-label="Retour en haut"
        >
          <ArrowUp class="h-6 w-6 text-primary" />
        </button>
      </div>
    {/if}

    <!-- Desktop Navigation -->
    <header class="hidden lg:block relative z-40 pt-6 pb-2 lg:pt-8 lg:pb-4 transition-opacity duration-300">
      <div class="container mx-auto flex items-center justify-center">
        <nav
          class="relative flex items-center space-x-1 sm:space-x-2 bg-background/80 dark:bg-muted/50 backdrop-blur-lg shadow-xl rounded-full px-3 py-2 border border-border/40"
          on:mouseenter={handleNavMouseEnter}
          on:mouseleave={handleNavMouseLeave}
          on:mousemove={handleNavMouseMove}
        >
          <!-- Sliding background indicator -->
          <div
            class="absolute top-2 h-[calc(100%-16px)] bg-primary rounded-full pointer-events-none"
            style="{activeIndicatorStyle}"
          ></div>

          {#each navItems as item, i}
            {@const isActive = $page.url.pathname === item.href}
            {@const isHovered = isHoveringNav && hoveredIndex === i}
            {@const hasBlob = isActive || isHovered}
            <a
              bind:this={navItemElements[i]}
              href={item.href}
              class="relative flex items-center text-xs sm:text-sm px-3 py-2 rounded-full z-10
                    {hasBlob ? '!text-white' : 'text-muted-foreground hover:text-primary'}
                    {isActive ? 'font-bold underline decoration-primary decoration-2 underline-offset-4' : 'font-medium'}
                    {hasBlob ? 'transition-none' : 'transition-colors'}"
              aria-current={isActive ? "page" : undefined}
            >
              <svelte:component this={item.icon} class="mr-1.5 h-4 w-4 {hasBlob ? '!text-white' : ''}" />
              <span class="hidden sm:inline">{item.label}</span>
            </a>
          {/each}
        </nav>
      </div>
    </header>

    <!-- Mobile/Tablet Menu Overlay -->
    {#if mobileMenuOpen}
      <div class="lg:hidden fixed inset-0 z-[150] bg-background/95 backdrop-blur-md">
        <div class="flex flex-col h-full p-4 pt-20">
          <!-- Navigation Links -->
          <nav class="flex flex-col space-y-2 flex-1">
            {#each navItems as item}
              {@const isActive = $page.url.pathname === item.href}
              <a
                href={item.href}
                class="flex items-center text-lg font-medium px-4 py-4 rounded-lg transition-colors border border-border/40
                      {isActive
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-card text-foreground hover:bg-accent'}"
                aria-current={isActive ? "page" : undefined}
              >
                <svelte:component this={item.icon} class="mr-3 h-6 w-6" />
                {item.label}
              </a>
            {/each}

            <!-- Terminal Button (only on home page) -->
            {#if isHomePage}
              <button
                on:click={handleMobileTerminalClick}
                class="flex items-center text-lg font-medium px-4 py-4 rounded-lg transition-colors border border-border/40 bg-primary/10 text-primary hover:bg-primary/20"
              >
                <Terminal class="mr-3 h-6 w-6" />
                Terminal
              </button>
            {/if}
          </nav>
        </div>
      </div>
    {/if}
  {/if}

  {#if showBootUpAnimation && currentBootThemeOption && currentBootThemeOption.value === 'win2000'}
    <BootAnimation themeOption={currentBootThemeOption} onComplete={onBootAnimationComplete} />
  {/if}

  {#if !showBootUpAnimation}
    <main
      class="flex-grow pt-16 lg:pt-8 transition-opacity duration-300 ease-in-out {showBootUpAnimation ? 'opacity-0 pointer-events-none absolute -z-10' : 'opacity-100'}"
    >
      <slot />
    </main>
  {/if}
</div>

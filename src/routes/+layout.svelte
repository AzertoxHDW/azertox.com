<script lang="ts">
  import "../app.css"; // Your global styles, including theme variables
  import { currentTheme, setTheme, themes, type Theme, type ThemeOption, bootAnimationTrigger } from "$lib/themeStore";
  import BootAnimation from "$lib/components/BootAnimation.svelte";
  import Win2000Desktop from "$lib/components/desktop/Win2000Desktop.svelte";
  import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "$lib/components/ui/select";
  import { Home, User, ServerIcon as ServerIconLucide, FolderGit2 as CodeIconLucide, Gem } from "lucide-svelte";
  import { page } from '$app/stores';
  import { onMount } from "svelte";
  import type { Selected } from "bits-ui";
  import { BROWSER } from 'esm-env';

  let showBootUpAnimation = false;
  let currentBootThemeOption: ThemeOption | undefined = undefined;

  // Reactive statement to check if win2000 theme is active
  $: isWin2000Theme = ($currentTheme === 'win2000');

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
  }

  onMount(() => {
    const initialTheme = localStorage.getItem('selected-theme') as Theme || 'system';
    if ($currentTheme !== initialTheme) {
        currentTheme.set(initialTheme);
    }

    if (BROWSER) {
      window.addEventListener('keydown', handleGlobalKeyDown);
    }
    return () => {
        if (BROWSER) {
            window.removeEventListener('keydown', handleGlobalKeyDown);
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

  const navItems = [
    { href: "/", label: "Accueil", icon: Home },
    { href: "/about", label: "À propos", icon: User },
    { href: "/infra", label: "Infrastructure", icon: ServerIconLucide },
    { href: "/projects", label: "Projets", icon: CodeIconLucide },
    { href: "/museum", label: "Musée", icon: Gem },
  ];

</script>

<div class="flex flex-col min-h-screen bg-background text-foreground {isWin2000Theme ? 'win2000-theme' : ''}">

  {#if !showBootUpAnimation}
    <header class="relative z-40 pt-6 pb-2 md:pt-8 md:pb-4 transition-opacity duration-300">
      <div class="container mx-auto flex items-center justify-center">
        <nav class="flex items-center space-x-1 sm:space-x-2 bg-background/80 dark:bg-muted/50 backdrop-blur-lg shadow-xl rounded-full px-3 py-2 border border-border/40">
          {#each navItems as item}
            {@const isActive = $page.url.pathname === item.href}
            <a
              href={item.href}
              class="flex items-center text-xs sm:text-sm font-medium px-3 py-2 rounded-full transition-colors
                    {isActive
                        ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                        : 'text-muted-foreground hover:text-primary hover:bg-accent'}"
              aria-current={isActive ? "page" : undefined}
            >
              <svelte:component this={item.icon} class="mr-1.5 h-4 w-4 {isActive ? 'text-primary-foreground' : ''}" />
              <span class="hidden sm:inline">{item.label}</span>
            </a>
          {/each}
        </nav>
      </div>
    </header>
  {/if}

  {#if showBootUpAnimation && currentBootThemeOption && currentBootThemeOption.value === 'win2000'}
    <BootAnimation themeOption={currentBootThemeOption} onComplete={onBootAnimationComplete} />
  {/if}

  {#if !showBootUpAnimation}
    <main
      class="flex-grow pt-4 md:pt-8 transition-opacity duration-300 ease-in-out {showBootUpAnimation ? 'opacity-0 pointer-events-none absolute -z-10' : 'opacity-100'}"
    >
      <slot />
    </main>
  {/if}
</div>

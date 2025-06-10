<script lang="ts">
  import "../app.css"; // Your global styles, including theme variables
  import { currentTheme, setTheme, themes, type Theme, type ThemeOption } from "$lib/themeStore";
  import BootAnimation from "$lib/components/BootAnimation.svelte";
  import Win2000Desktop from "$lib/components/desktop/Win2000Desktop.svelte";
  import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "$lib/components/ui/select";
  import { Home, User, ServerIcon as ServerIconLucide, FolderGit2 as CodeIconLucide } from "lucide-svelte";
  import { page } from '$app/stores';
  import { onMount } from "svelte";
  import type { Selected } from "bits-ui";
  import { BROWSER } from 'esm-env';

  let showBootUpAnimation = false;
  let currentBootThemeOption: ThemeOption | undefined = undefined;
  
  // Reactive statement to control desktop visibility
  // It's true if the current theme is 'win2000' AND no boot animation is playing.
  $: showWin2000Desktop = ($currentTheme === 'win2000' && !showBootUpAnimation);

  function handleGlobalKeyDown(event: KeyboardEvent) {
    if (event.key === 'Escape' && showWin2000Desktop) {
      setTheme('system'); // This will trigger the reactive update for showWin2000Desktop
    }
  }

  onMount(() => {
    const initialTheme = localStorage.getItem('selected-theme') as Theme || 'system';
    if ($currentTheme !== initialTheme) {
        currentTheme.set(initialTheme); // This triggers the reactive $: showWin2000Desktop
    }
    // If initialTheme is 'win2000', the reactive statement will set showWin2000Desktop to true
    // (assuming showBootUpAnimation is initially false).

    if (BROWSER) {
      window.addEventListener('keydown', handleGlobalKeyDown);
    }
    return () => { // onDestroy equivalent for onMount
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
            if (!showWin2000Desktop) showWin2000Desktop = true; // Ensure desktop is shown if somehow hidden
            return;
        }
        currentBootThemeOption = selectedOption;
        // showWin2000Desktop will become false when $currentTheme changes if it's not yet win2000,
        // or if it changes from win2000 to something else then back to win2000.
        showBootUpAnimation = true;
        currentTheme.set(newThemeValue); // Set theme to start boot
      } else if (selectedOption) {
        currentTheme.set(newThemeValue); // For other themes, just set it.
                                        // showWin2000Desktop will become false via reactive statement.
      }
    }
  }

  function onBootAnimationComplete() {
    if (currentBootThemeOption) {
      // Ensure the theme is correctly set in the store.
      // The reactive statement $: showWin2000Desktop will make the desktop visible.
      currentTheme.set(currentBootThemeOption.value);
    }
    showBootUpAnimation = false; // This allows showWin2000Desktop to become true if $currentTheme is 'win2000'
    currentBootThemeOption = undefined;
  }

  const navItems = [
    { href: "/", label: "Accueil", icon: Home },
    { href: "/about", label: "À propos", icon: User },
    { href: "/infra", label: "Infrastructure", icon: ServerIconLucide },
    { href: "/museum", label: "Musée", icon: CodeIconLucide },
  ];

</script>

<div class="flex flex-col min-h-screen bg-background text-foreground">

  {#if !showWin2000Desktop && !showBootUpAnimation}
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
        <div class="absolute top-4 right-4 md:top-6 md:right-6 z-50">
            <Select
              selected={$currentTheme ? { value: $currentTheme, label: themes.find(t => t.value === $currentTheme)?.label || $currentTheme } : undefined}
              onSelectedChange={handleThemeChange}
            >
                <SelectTrigger class="w-[200px] bg-background/80 dark:bg-muted/50 backdrop-blur-md shadow-md">
                    <SelectValue placeholder="Choisir un thème" />
                </SelectTrigger>
                <SelectContent>
                    <SelectGroup>
                        <SelectLabel>Thèmes Disponibles</SelectLabel>
                        {#each themes as themeOption (themeOption.value)}
                            <SelectItem value={themeOption.value}>{themeOption.label}</SelectItem>
                        {/each}
                    </SelectGroup>
                </SelectContent>
            </Select>
        </div>
      </div>
    </header>
  {/if}

  {#if showBootUpAnimation && currentBootThemeOption && currentBootThemeOption.value === 'win2000'}
    <BootAnimation themeOption={currentBootThemeOption} onComplete={onBootAnimationComplete} />
  {/if}

  {#if showWin2000Desktop} <Win2000Desktop />
  {:else if !showBootUpAnimation} <main 
      class="flex-grow pt-4 md:pt-8 transition-opacity duration-300 ease-in-out
             {showBootUpAnimation || showWin2000Desktop ? 'opacity-0 pointer-events-none absolute -z-10' : 'opacity-100'}"
    >
      <slot />
    </main>
  {/if}
</div>

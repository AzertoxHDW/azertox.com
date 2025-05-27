<script lang="ts">
  import "../app.css"; // Your global styles, including theme variables
  import { currentTheme, setTheme, themes, type Theme, type ThemeOption } from "$lib/themeStore";
  import BootAnimation from "$lib/components/BootAnimation.svelte";
  import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "$lib/components/ui/select";
  import { Home, User, ServerIcon as ServerIconLucide, FolderGit2 as CodeIconLucide } from "lucide-svelte";
  import { page } from '$app/stores';
  import { onDestroy, onMount } from "svelte";
  import type { Selected } from "bits-ui"; // Import Selected type from bits-ui

  let showBootUpAnimation = false;
  let currentBootThemeOption: ThemeOption | undefined = undefined;

  onMount(() => {
    const initialTheme = localStorage.getItem('selected-theme') as Theme || 'system';
    if ($currentTheme !== initialTheme) {
        currentTheme.set(initialTheme);
    }
  });

  // Updated to handle the object from onSelectedChange
  function handleThemeChange(selected: Selected<Theme> | undefined) {
    // console.log('handleThemeChange called with selected:', selected);
    if (selected && selected.value) { // Check if selected and selected.value exist
      const newThemeValue = selected.value; // selected.value is the primitive theme value ('xp', 'dark', etc.)
      const selectedOption = themes.find(t => t.value === newThemeValue);
      // console.log('Selected option in handleThemeChange:', selectedOption);

      currentTheme.set(newThemeValue);

      if (selectedOption && (selectedOption.value === 'xp' || selectedOption.value === 'win98' || selectedOption.value === 'vista')) {
        // console.log('Triggering boot animation for:', newThemeValue);
        currentBootThemeOption = selectedOption;
        showBootUpAnimation = true;
      } else if (selectedOption) {
        // console.log('Applied non-boot theme:', newThemeValue);
      }
    }
  }

  function onBootAnimationComplete() {
    // console.log('Boot animation complete for:', currentBootThemeOption?.value);
    if (currentBootThemeOption) {
      currentTheme.set(currentBootThemeOption.value);
    }
    showBootUpAnimation = false;
    currentBootThemeOption = undefined;
  }

  const navItems = [
    { href: "/", label: "Accueil", icon: Home },
    { href: "/about", label: "À propos", icon: User },
    { href: "/infra", label: "Infrastructure", icon: ServerIconLucide },
    { href: "/projets", label: "Projets", icon: CodeIconLucide },
  ];
</script>

<header class="relative z-40 pt-6 pb-2 md:pt-8 md:pb-4">
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
        <!-- The 'value' prop on Select (Root) should bind to the store for two-way binding if needed,
             or be set to the store's current value for one-way.
             For bits-ui, the `selected` prop is used to control the selected item.
             We'll use onSelectedChange for reacting to changes.
             The SelectValue component will display the current selection. -->
        <Select selected={$currentTheme ? { value: $currentTheme, label: themes.find(t => t.value === $currentTheme)?.label || 'Choisir un thème'} : undefined} onSelectedChange={handleThemeChange}>
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

{#if showBootUpAnimation && currentBootThemeOption}
  <BootAnimation themeOption={currentBootThemeOption} onComplete={onBootAnimationComplete}/>
{/if}

<main class="flex-grow pt-4 md:pt-8 {showBootUpAnimation ? 'opacity-0 pointer-events-none' : 'opacity-100 transition-opacity duration-300 ease-in-out'}">
  <slot />
</main>
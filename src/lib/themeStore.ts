import { writable, get } from 'svelte/store';
import { browser } from '$app/environment';

// Define the possible theme values
export type Theme = 'system' | 'light' | 'dark' | 'win2000';

// Define the structure for theme options in the dropdown
export interface ThemeOption {
  value: Theme;
  label: string;
  sound?: string; // Optional path to sound file in /static
  animationDuration?: number; // Optional duration for boot animation
  uiSounds?: ThemeUISounds; // For theme-specific UI interaction sounds
}

export interface ThemeUISounds {
  click?: string;
  error?: string;
  notification?: string;
  // Add more as needed
}

const LS_THEME_KEY = 'selected-theme';

// Helper to get initial theme from localStorage or default to 'system'
function getInitialTheme(): Theme {
  if (!browser) {
    return 'system'; // Default for SSR
  }
  return (localStorage.getItem(LS_THEME_KEY) as Theme) || 'system';
}

// Create a writable store for the current theme
export const currentTheme = writable<Theme>(getInitialTheme());

// Subscribe to theme changes to update localStorage and apply class to <html>
currentTheme.subscribe((theme) => {
  if (browser) {
    localStorage.setItem(LS_THEME_KEY, theme);

    // Remove all potential theme classes first to ensure a clean state
    document.documentElement.classList.remove(
      'light',
      'dark',
      'theme-win2000',
      'theme-xp', // Ensure old ones are removed if they were ever applied
      'theme-win98',
      'theme-vista'
    );

    // Apply the correct class based on the theme
    if (theme === 'light') {
      document.documentElement.classList.add('light');
    } else if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else if (theme === 'win2000') {
      document.documentElement.classList.add('theme-win2000');
      // Win2000 is typically a light UI, so ensure .dark is not active
      // unless your .theme-win2000 CSS specifically handles/overrides .dark styles.
      document.documentElement.classList.remove('dark');
    } else if (theme === 'system') {
      // For system, we clear our specific theme classes and let OS preference dictate light/dark
      // This logic is also handled by the media query listener below for dynamic changes.
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
        // Optionally, explicitly add 'light' if not dark, though default :root styles might cover this.
        // document.documentElement.classList.add('light');
      }
    }
  }
});

// Define the available themes for the dropdown
export const themes: ThemeOption[] = [
  { value: 'system', label: '🖥️ Thème Système' },
  { value: 'light', label: '☀️ Clair' },
  { value: 'dark', label: '🌙 Sombre' },
  {
    value: 'win2000',
    label: '💻 Windows 2000',
    sound: '/sounds/win2000_startup.mp3', // Ensure this file exists in static/sounds/
    animationDuration: 4500, // Adjust as needed for W2K boot animation
    uiSounds: {
        click: '/sounds/ui/win2000/click.wav', // Example, ensure file exists
        error: '/sounds/ui/win2000/error.wav'  // Example, ensure file exists
    }
  },
];

// Function to explicitly set the theme (e.g., from the dropdown)
export function setTheme(theme: Theme) {
  currentTheme.set(theme);
}

// Listener for system theme changes if 'system' is selected
if (browser) {
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  
  const updateSystemThemeBasedOnOS = (event?: MediaQueryListEvent) => {
    // Read the persisted theme choice. Only act if it's 'system'.
    const currentSelectedThemeInStorage = localStorage.getItem(LS_THEME_KEY) as Theme || 'system';

    if (currentSelectedThemeInStorage === 'system') {
      // Clear any specific named themes first
      document.documentElement.classList.remove('theme-win2000', 'theme-xp', 'theme-win98', 'theme-vista');
      
      // Apply light or dark based on OS preference
      if (event ? event.matches : mediaQuery.matches) { // If event is present, use its state, else use current mediaQuery state
        document.documentElement.classList.remove('light');
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
        document.documentElement.classList.add('light'); // Explicitly add light for system light
      }
    }
  };

  mediaQuery.addEventListener('change', updateSystemThemeBasedOnOS);
  
  // Apply initial system theme correctly on load if 'system' is the stored/default theme
  // This ensures that if 'system' is selected, the correct light/dark class is applied immediately.
  if (get(currentTheme) === 'system') {
    updateSystemThemeBasedOnOS();
  }
}

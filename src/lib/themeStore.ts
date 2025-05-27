import { writable } from 'svelte/store';
import { browser } from '$app/environment';

// Define the possible theme values
export type Theme = 'system' | 'light' | 'dark' | 'xp' | 'win98' | 'vista';

// Define the structure for theme options in the dropdown
export interface ThemeOption {
  value: Theme;
  label: string;
  sound?: string; // Optional path to sound file in /static
  animationDuration?: number; // Optional duration for boot animation
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

    // Remove all theme classes
    document.documentElement.classList.remove('light', 'dark', 'theme-xp', 'theme-win98', 'theme-vista');

    // Apply the correct class based on the theme
    // For 'system', we'd rely on ModeWatcher or a media query listener to set 'light' or 'dark'
    if (theme === 'light') {
      document.documentElement.classList.add('light');
    } else if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else if (theme === 'xp') {
      document.documentElement.classList.add('theme-xp');
      document.documentElement.classList.remove('dark'); // XP is not inherently dark in this context
    } else if (theme === 'win98') {
      document.documentElement.classList.add('theme-win98');
      document.documentElement.classList.remove('dark');
    } else if (theme === 'vista') {
      document.documentElement.classList.add('theme-vista');
      // Vista could be darkish, decide if it should also have .dark
      // document.documentElement.classList.add('dark');
    } else if (theme === 'system') {
      // For system, we clear our specific theme classes and let OS preference dictate light/dark
      // This might need integration with a prefers-color-scheme listener if not using ModeWatcher
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
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
    value: 'xp',
    label: ' nostalgic Windows XP',
    sound: '/sounds/xp.mp3', // Ensure this file exists in static/sounds
    animationDuration: 2000
  },
  {
    value: 'win98',
    label: '💾 Windows 98',
    sound: '/sounds/98.mp3', // Placeholder, add actual sound
    animationDuration: 6000
  },
  {
    value: 'vista',
    label: '💠 Windows Vista',
    sound: '/sounds/vista.mp3', // Placeholder, add actual sound
    animationDuration: 4000
  },
];

// Function to explicitly set the theme (e.g., from the dropdown)
export function setTheme(theme: Theme) {
  currentTheme.set(theme);
}

// Listener for system theme changes if 'system' is selected
if (browser) {
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', event => {
    const currentSelectedTheme = localStorage.getItem(LS_THEME_KEY) as Theme || 'system';
    if (currentSelectedTheme === 'system') {
      if (event.matches) {
        document.documentElement.classList.add('dark');
        document.documentElement.classList.remove('light', 'theme-xp', 'theme-win98', 'theme-vista');
      } else {
        document.documentElement.classList.remove('dark', 'theme-xp', 'theme-win98', 'theme-vista');
        document.documentElement.classList.add('light');
      }
    }
  });
}
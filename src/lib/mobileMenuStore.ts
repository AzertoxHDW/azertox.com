import { writable } from 'svelte/store';

// Store to trigger terminal opening from mobile menu
export const mobileTerminalTrigger = writable(false);

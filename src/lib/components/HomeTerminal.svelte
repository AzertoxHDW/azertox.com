<script lang="ts">
  import { onMount, tick } from 'svelte';
  import { setTheme, themes, currentTheme } from '$lib/themeStore';

  let inputValue = '';
  let commandHistory: Array<{ command: string; output: string }> = [];
  let terminalContent: HTMLDivElement;
  let inputElement: HTMLInputElement;
  let isFocused = false;

  export let onFocus: (() => void) | undefined = undefined;
  export let onClose: (() => void) | undefined = undefined;

  onMount(() => {
    // Show welcome message
    commandHistory = [{
      command: '',
      output: 'Az\' Terminal v1.0 - Type "help" for available commands'
    }];
    focusInput();
  });

  function focusInput() {
    if (inputElement) {
      inputElement.focus();
      isFocused = true;
    }
  }

  function handleBlur() {
    isFocused = false;
  }

  async function handleCommand(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      event.preventDefault();
      const command = inputValue.trim().toLowerCase();
      let output = '';

      if (command) {
        // Process command
        if (command === 'help') {
          output = 'Available commands:\n  help         - Show this help message\n  cls          - Clear the terminal\n  light        - Switch to light theme\n  dark         - Switch to dark theme\n  whoami       - Display current user';
        } else if (command === 'cls' || command === 'clear') {
          commandHistory = [];
          inputValue = '';
          return;
        } else if (command === 'whoami') {
          output = 'User: Az\' (Dylan R.)\nRole: Developer & System Administrator\nLocation: Belgium';
        } else if (command === 'light' || command === 'dark') {
          setTheme(command);
          const theme = themes.find(t => t.value === command);
          output = theme ? `Theme changed to: ${theme.label}` : `Theme changed to: ${command}`;
        } else if (command.startsWith('theme ')) {
          const themeName = command.substring(6).trim();
          const theme = themes.find(t => t.value === themeName);
          if (theme) {
            setTheme(theme.value);
            output = `Theme changed to: ${theme.label}`;
          } else {
            output = `Error: Theme "${themeName}" not found. Available: light, dark`;
          }
        } else {
          output = `Command not found: ${command}\nType "help" for available commands.`;
        }

        commandHistory = [...commandHistory, { command, output }];
      }

      inputValue = '';
      await tick();

      // Scroll to bottom
      if (terminalContent) {
        terminalContent.scrollTop = terminalContent.scrollHeight;
      }
    }
  }

  function handleTerminalClick() {
    focusInput();
    if (onFocus) {
      onFocus();
    }
  }
</script>

<div class="terminal-window-wrapper">
  <!-- Terminal Title Bar -->
  <div class="terminal-titlebar">
    <div class="terminal-controls">
      <button class="terminal-btn close" on:click|stopPropagation={() => onClose && onClose()}></button>
      <div class="terminal-btn minimize"></div>
      <div class="terminal-btn maximize"></div>
    </div>
    <div class="terminal-title">~ terminal ~</div>
  </div>

  <!-- Terminal Content -->
  <div
    class="terminal-content"
    on:click={handleTerminalClick}
    on:keydown={() => {}}
    role="button"
    tabindex="0"
  >
    <div class="terminal-body" bind:this={terminalContent}>
      {#each commandHistory as entry}
        {#if entry.command}
          <div class="terminal-line">
            <span class="prompt">$</span>
            <span class="command">{entry.command}</span>
          </div>
        {/if}
        {#if entry.output}
          <div class="output">{entry.output}</div>
        {/if}
      {/each}

      <div class="terminal-line input-line">
        <span class="prompt">$</span>
        <div class="input-wrapper">
          <span class="input-sizer">{inputValue}&nbsp;</span>
          <input
            bind:this={inputElement}
            bind:value={inputValue}
            on:keydown={handleCommand}
            on:focus={() => isFocused = true}
            on:blur={handleBlur}
            class="terminal-input"
            spellcheck="false"
            autocomplete="off"
          />
          {#if isFocused}
            <span class="cursor">_</span>
          {/if}
        </div>
      </div>
    </div>
  </div>
</div>

<style lang="postcss">
  .terminal-window-wrapper {
    @apply w-full;
  }

  .terminal-titlebar {
    @apply bg-primary/20 border-b border-primary/30 px-3 py-2 flex items-center justify-between;
    @apply cursor-grab active:cursor-grabbing;
  }

  .terminal-controls {
    @apply flex gap-2;
  }

  .terminal-btn {
    @apply w-3 h-3 rounded-full border-0 p-0;
  }

  .terminal-btn.close {
    @apply bg-red-500/80 hover:bg-red-500 cursor-pointer;
  }

  .terminal-btn.minimize {
    @apply bg-yellow-500/80 hover:bg-yellow-500;
  }

  .terminal-btn.maximize {
    @apply bg-green-500/80 hover:bg-green-500;
  }

  .terminal-title {
    @apply text-sm font-mono text-primary absolute left-1/2 -translate-x-1/2 pointer-events-none;
  }

  .terminal-content {
    @apply p-4 font-mono text-sm overflow-y-auto cursor-text;
    @apply bg-card/50 backdrop-blur-sm;
    height: 220px;
  }

  .terminal-body {
    @apply h-full overflow-y-auto;
  }

  .terminal-line {
    @apply flex mb-1;
  }

  .input-line {
    @apply items-center;
  }

  .prompt {
    @apply text-primary mr-2 flex-shrink-0;
  }

  .command {
    @apply text-foreground;
  }

  .output {
    @apply text-muted-foreground whitespace-pre-wrap mb-2 ml-6;
  }

  .input-wrapper {
    @apply flex items-center flex-grow relative;
  }

  .input-sizer {
    @apply invisible;
    white-space: pre;
  }

  .terminal-input {
    all: unset;
    @apply text-foreground bg-transparent absolute left-0;
    caret-color: transparent;
    width: 100%;
  }

  .cursor {
    @apply text-primary;
    animation: blink 1s infinite;
  }

  @keyframes blink {
    0%, 49% {
      opacity: 1;
    }
    50%, 100% {
      opacity: 0;
    }
  }

  /* Custom scrollbar */
  .terminal-body::-webkit-scrollbar {
    width: 6px;
  }

  .terminal-body::-webkit-scrollbar-track {
    @apply bg-muted/30;
  }

  .terminal-body::-webkit-scrollbar-thumb {
    @apply bg-primary/50 rounded;
  }

  .terminal-body::-webkit-scrollbar-thumb:hover {
    @apply bg-primary/70;
  }
</style>

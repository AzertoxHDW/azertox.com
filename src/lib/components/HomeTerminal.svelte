<script lang="ts">
  import { onMount, tick } from 'svelte';
  import { setTheme, themes, currentTheme } from '$lib/themeStore';

  let inputValue = '';
  let commandHistory: Array<{ command: string; output: string }> = [];
  let terminalContent: HTMLDivElement;
  let inputElement: HTMLInputElement;

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
    }
  }

  async function handleCommand(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      event.preventDefault();
      const command = inputValue.trim().toLowerCase();
      let output = '';

      if (command) {
        // Process command
        if (command === 'help') {
          output = 'Available commands:\n  help         - Show this help message\n  cls          - Clear the terminal\n  theme <name> - Change theme (system, light, dark, win2000)\n  theme list   - List available themes\n  whoami       - Display current user';
        } else if (command === 'cls' || command === 'clear') {
          commandHistory = [];
          inputValue = '';
          return;
        } else if (command === 'whoami') {
          output = 'User: Az\' (Dylan R.)\nRole: Developer & System Administrator\nLocation: Belgium';
        } else if (command.startsWith('theme ')) {
          const themeName = command.substring(6).trim();

          if (themeName === 'list') {
            output = 'Available themes:\n' + themes.map(t => `  ${t.value.padEnd(10)} - ${t.label}`).join('\n');
          } else {
            const theme = themes.find(t => t.value === themeName);
            if (theme) {
              setTheme(theme.value);
              output = `Theme changed to: ${theme.label}`;
            } else {
              output = `Error: Theme "${themeName}" not found. Type "theme list" to see available themes.`;
            }
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
  }
</script>

<div
  class="home-terminal"
  on:click={handleTerminalClick}
  on:keydown={() => {}}
  role="button"
  tabindex="0"
>
  <div class="terminal-header">
    <span class="terminal-header-title">terminal@azertox:~</span>
  </div>
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
      <input
        bind:this={inputElement}
        bind:value={inputValue}
        on:keydown={handleCommand}
        class="terminal-input"
        spellcheck="false"
        autocomplete="off"
        placeholder="Type a command..."
      />
      <span class="cursor">_</span>
    </div>
  </div>
</div>

<style lang="postcss">
  .home-terminal {
    @apply w-full max-w-4xl mx-auto bg-card border border-border rounded-lg overflow-hidden shadow-lg cursor-text;
  }

  .terminal-header {
    @apply bg-muted border-b border-border px-4 py-2 flex items-center;
  }

  .terminal-header-title {
    @apply text-sm font-mono text-foreground;
  }

  .terminal-body {
    @apply p-4 font-mono text-sm overflow-y-auto;
    max-height: 400px;
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

  .terminal-input {
    all: unset;
    @apply flex-grow text-foreground bg-transparent;
    caret-color: transparent;
  }

  .terminal-input::placeholder {
    @apply text-muted-foreground/50;
  }

  .cursor {
    @apply text-primary ml-1;
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
    width: 8px;
  }

  .terminal-body::-webkit-scrollbar-track {
    @apply bg-muted;
  }

  .terminal-body::-webkit-scrollbar-thumb {
    @apply bg-border rounded;
  }

  .terminal-body::-webkit-scrollbar-thumb:hover {
    @apply bg-primary/50;
  }
</style>

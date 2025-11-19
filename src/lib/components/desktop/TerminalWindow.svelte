<script lang="ts">
  import { onMount, tick } from 'svelte';

  let inputValue = '';
  let commandHistory: Array<{ command: string; output: string }> = [];
  let terminalContent: HTMLDivElement;
  let inputElement: HTMLInputElement;

  onMount(() => {
    // Show welcome message
    commandHistory = [{
      command: '',
      output: 'Microsoft Windows 2000 [Version 5.00.2195]\n(C) Copyright 1985-2000 Microsoft Corp.'
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
      const command = inputValue.trim();
      let output = '';

      if (command) {
        // Process command
        if (command.toLowerCase() === 'help') {
          output = 'Available commands:\n  HELP    - Display this help message\n  CLS     - Clear the screen\n  THEME   - Change theme (coming soon)\n  EXIT    - Close terminal';
        } else if (command.toLowerCase() === 'cls') {
          commandHistory = [];
          inputValue = '';
          return;
        } else if (command.toLowerCase() === 'exit') {
          output = 'Terminal will close...';
        } else {
          output = `'${command}' is not recognized as an internal or external command,\noperable program or batch file.`;
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
  class="terminal-window-content"
  on:click={handleTerminalClick}
  on:keydown={() => {}}
  role="button"
  tabindex="0"
>
  <div class="terminal-content" bind:this={terminalContent}>
    {#each commandHistory as entry}
      {#if entry.command}
        <div class="terminal-line">
          <span class="prompt">C:\&gt;</span>
          <span class="command">{entry.command}</span>
        </div>
      {/if}
      {#if entry.output}
        <div class="output">{entry.output}</div>
      {/if}
    {/each}

    <div class="terminal-line input-line">
      <span class="prompt">C:\&gt;</span>
      <input
        bind:this={inputElement}
        bind:value={inputValue}
        on:keydown={handleCommand}
        class="terminal-input"
        spellcheck="false"
        autocomplete="off"
      />
      <span class="cursor">_</span>
    </div>
  </div>
</div>

<style>
  .terminal-window-content {
    height: 100%;
    background-color: #000000;
    color: #C0C0C0;
    font-family: 'Courier New', 'Consolas', monospace;
    font-size: 14px;
    padding: 4px 8px;
    overflow: hidden;
    cursor: text;
  }

  .terminal-content {
    height: 100%;
    overflow-y: auto;
    overflow-x: hidden;
  }

  .terminal-line {
    display: flex;
    line-height: 1.4;
    white-space: pre-wrap;
    word-wrap: break-word;
  }

  .input-line {
    align-items: center;
  }

  .prompt {
    color: #FFFFFF;
    margin-right: 4px;
    flex-shrink: 0;
  }

  .command {
    color: #FFFFFF;
  }

  .output {
    color: #C0C0C0;
    white-space: pre-wrap;
    margin-bottom: 4px;
    line-height: 1.4;
  }

  .terminal-input {
    all: unset;
    flex-grow: 1;
    color: #FFFFFF;
    background: transparent;
    caret-color: transparent;
    font-family: inherit;
    font-size: inherit;
    line-height: inherit;
  }

  .cursor {
    color: #FFFFFF;
    animation: blink 1s infinite;
    margin-left: 2px;
  }

  @keyframes blink {
    0%, 49% {
      opacity: 1;
    }
    50%, 100% {
      opacity: 0;
    }
  }

  /* Custom scrollbar for terminal */
  .terminal-content::-webkit-scrollbar {
    width: 16px;
  }

  .terminal-content::-webkit-scrollbar-track {
    background: #C0C0C0;
  }

  .terminal-content::-webkit-scrollbar-thumb {
    background: #808080;
    border: 1px solid #000;
  }

  .terminal-content::-webkit-scrollbar-button {
    background: #C0C0C0;
    height: 16px;
  }
</style>

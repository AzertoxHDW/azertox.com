<script lang="ts">
  import { Button } from '$lib/components/ui/button';
  import { AlertTriangle, Bug, Server, Lock, Clock, Ban } from 'lucide-svelte';

  const errorTests = [
    { code: 400, label: '400 - Bad Request', icon: AlertTriangle, category: 'Client Errors' },
    { code: 401, label: '401 - Unauthorized', icon: Lock, category: 'Client Errors' },
    { code: 403, label: '403 - Forbidden', icon: Ban, category: 'Client Errors' },
    { code: 404, label: '404 - Not Found', icon: AlertTriangle, category: 'Client Errors' },
    { code: 405, label: '405 - Method Not Allowed', icon: Ban, category: 'Client Errors' },
    { code: 408, label: '408 - Request Timeout', icon: Clock, category: 'Client Errors' },
    { code: 429, label: '429 - Too Many Requests', icon: AlertTriangle, category: 'Client Errors' },
    { code: 500, label: '500 - Internal Server Error', icon: Server, category: 'Server Errors' },
    { code: 501, label: '501 - Not Implemented', icon: Bug, category: 'Server Errors' },
    { code: 502, label: '502 - Bad Gateway', icon: Server, category: 'Server Errors' },
    { code: 503, label: '503 - Service Unavailable', icon: Server, category: 'Server Errors' },
    { code: 504, label: '504 - Gateway Timeout', icon: Clock, category: 'Server Errors' }
  ];

  // Group errors by category
  const clientErrors = errorTests.filter(e => e.category === 'Client Errors');
  const serverErrors = errorTests.filter(e => e.category === 'Server Errors');
</script>

<svelte:head>
  <title>HTTP Error Testing - Azertox</title>
</svelte:head>

<div class="container mx-auto px-4 py-16 max-w-4xl">
  <div class="mb-12 text-center">
    <h1 class="text-4xl font-bold mb-4">HTTP Error Testing</h1>
    <p class="text-muted-foreground text-lg">
      Click any error code below to see how the error page displays it.
    </p>
    <p class="text-muted-foreground text-sm mt-2">
      Test the interactive draggable error pages and Windows 2000 BSOD theme!
    </p>
  </div>

  <!-- Client Errors (4xx) -->
  <div class="mb-12">
    <h2 class="text-2xl font-semibold mb-4 flex items-center gap-2">
      <AlertTriangle class="h-6 w-6 text-yellow-500" />
      Client Errors (4xx)
    </h2>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      {#each clientErrors as error}
        <Button
          href="/test-error/{error.code}"
          variant="outline"
          class="h-auto py-4 px-6 justify-start gap-3 hover:bg-destructive/10 hover:border-destructive"
        >
          <svelte:component this={error.icon} class="h-5 w-5 flex-shrink-0" />
          <span class="font-mono">{error.label}</span>
        </Button>
      {/each}
    </div>
  </div>

  <!-- Server Errors (5xx) -->
  <div class="mb-12">
    <h2 class="text-2xl font-semibold mb-4 flex items-center gap-2">
      <Server class="h-6 w-6 text-red-500" />
      Server Errors (5xx)
    </h2>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      {#each serverErrors as error}
        <Button
          href="/test-error/{error.code}"
          variant="outline"
          class="h-auto py-4 px-6 justify-start gap-3 hover:bg-destructive/10 hover:border-destructive"
        >
          <svelte:component this={error.icon} class="h-5 w-5 flex-shrink-0" />
          <span class="font-mono">{error.label}</span>
        </Button>
      {/each}
    </div>
  </div>

  <!-- Custom Error Testing -->
  <div class="p-6 border border-border rounded-lg bg-card">
    <h3 class="text-xl font-semibold mb-3">Custom Error Code</h3>
    <p class="text-muted-foreground text-sm mb-4">
      Test any error code between 400-599 by visiting:
    </p>
    <code class="block bg-muted px-4 py-2 rounded font-mono text-sm">
      /test-error/[code]
    </code>
    <p class="text-muted-foreground text-xs mt-3">
      Example: <a href="/test-error/418" class="text-primary hover:underline">/test-error/418</a> (I'm a teapot)
    </p>
  </div>

  <!-- Tips -->
  <div class="mt-8 p-4 bg-primary/5 border border-primary/20 rounded-lg">
    <h4 class="font-semibold mb-2 flex items-center gap-2">
      <Bug class="h-4 w-4" />
      Testing Tips
    </h4>
    <ul class="text-sm text-muted-foreground space-y-1 ml-6 list-disc">
      <li>Try switching to Windows 2000 theme (type "win" in terminal) to see the BSOD version</li>
      <li>All error code digits are draggable - have fun rearranging them!</li>
      <li>The terminal window and error text are also draggable</li>
      <li>Each error code has a unique message and description</li>
    </ul>
  </div>

  <!-- Back to Home -->
  <div class="mt-12 text-center">
    <Button href="/" variant="default" size="lg">
      Back to Home
    </Button>
  </div>
</div>

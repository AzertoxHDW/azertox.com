<script lang="ts">
    import type { PageData } from './$types';
    import { flyAndScale } from "$lib/utils";
    import { FolderGit2 } from "lucide-svelte";
    let { data }: { data: PageData } = $props();
</script>


<div class="container mx-auto px-4 py-8 md:py-12">
  <div class="text-center mb-12 md:mb-16" in:flyAndScale={{ y: -20, duration: 500, start: 0.95 }}>
    <h1 class="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-foreground flex items-center justify-center">
      <FolderGit2 class="w-10 h-10 md:w-12 md:h-12 mr-3 text-primary" />
      Mes projets
    </h1>
    <p class="mt-4 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
      List de mes projets.
    </p>
  </div>
</div>
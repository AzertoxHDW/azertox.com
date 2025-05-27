<script lang="ts">
  import type { PageData } from './$types';

  let { data }: { data: PageData } = $props();
</script>

<div class="flex my-4 justify-center">
    <nav class="py-4 space-x-12 rounded-full items-center shadow-md bg-slate-700">
      <a>&nbsp;</a>
      <a href="/index.html" class="font-bold rounded-full hover:bg-slate-200 hover:text-black p-2 text-white transition">Accueil</a>
      <a href="/about/" class="font-bold rounded-full hover:bg-slate-200 hover:text-black p-2 text-white transition">À propos de moi</a>
      <a href="/infra/" class="font-bold rounded-full hover:bg-slate-200 hover:text-black p-2 text-white transition">Mon infrastructure</a>
      <a href="/projets/" class="font-bold rounded-full hover:bg-slate-200 hover:text-black p-2 text-white transition">Mes projets</a>
      <a>&nbsp;</a>
    </nav>
  </div>
    <h1 class="text-6xl text-white text-center mt-20">Mes projets</h1>
    <h2 class="text-4xl text-white text-center mt-10 animate-pulse">Cette page est en construction...</h2>
    <footer class="fixed bottom-0 bg-gray-800 text-white w-full text-center py-1">
      Dernière mise à jour du site: 26 juin 2024 &nbsp;|&nbsp; Code source: <a href="https://github.com/AzertoxHDW/personnal-website">Github</a>
    </footer>
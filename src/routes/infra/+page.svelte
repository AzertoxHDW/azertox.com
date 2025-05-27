<script lang="ts">
  import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "$lib/components/ui/card"; //
  import { Badge } from "$lib/components/ui/badge"; //
  import { Button } from "$lib/components/ui/button"; //
  import { ExternalLink, Activity, ArrowRight } from "lucide-svelte";
  import { flyAndScale } from "$lib/utils"; //
  import { infrastructure, type Machine } from "$lib/infra-data"; // Import from the new module

  // infrastructure array is now imported
</script>

<div class="container mx-auto px-4 py-8 md:py-12 min-h-screen_minus_header_footer">
  <div class="text-center mb-12 md:mb-16" in:flyAndScale={{ y: -20, duration: 500 }}>
    <h1 class="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-foreground">
      Mon infrastructure
    </h1>
  </div>

  <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8">
    {#each infrastructure as machine, i (machine.id)}
    <div in:flyAndScale|global={{ y: 20, duration: 300, start: 0.98, delay: i * 100 }}>
        <Card class="flex flex-col h-full shadow-lg hover:shadow-primary/20 transition-shadow duration-300">
          {#if machine.imageUrl}
            <a href={`/infra/${machine.id}`} class="block relative h-48 w-full overflow-hidden rounded-t-lg group">
              <img
                src={machine.imageUrl}
                alt="Image de {machine.name}"
                class="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
              />
              {#if machine.status}
                <Badge
                  variant={machine.status === 'Online' ? 'default' : machine.status === 'Offline' ? 'destructive' : 'secondary'}
                  class="absolute top-2 right-2"
                >
                  {#if machine.status === 'Online'} <Activity class="mr-1 h-3 w-3 text-green-400" /> {/if}
                  {machine.status}
                </Badge>
              {/if}
            </a>
          {:else if machine.status}
             <div class="px-6 pt-6 flex justify-end">
                <Badge
                    variant={machine.status === 'Online' ? 'default' : machine.status === 'Offline' ? 'destructive' : 'secondary'}
                >
                    {#if machine.status === 'Online'} <Activity class="mr-1 h-3 w-3 text-green-400" /> {/if}
                    {machine.status}
                </Badge>
             </div>
          {/if}

          <CardHeader class="pb-4 {machine.imageUrl ? '' : 'pt-2'}">
            <a href={`/infra/${machine.id}`} class="group">
              <CardTitle class="text-xl lg:text-2xl mb-1 group-hover:text-primary transition-colors">{machine.name}</CardTitle>
            </a>
            <CardDescription class="flex items-center">
              {#if machine.os.icon}
                <svelte:component this={machine.os.icon} class="h-4 w-4 mr-1.5 text-muted-foreground" />
              {/if}
              {machine.os.name}
            </CardDescription>
            <p class="text-sm text-primary font-semibold pt-1">{machine.role}</p>
          </CardHeader>
          <CardContent class="flex-grow space-y-3 text-sm">
            <h4 class="font-semibold text-foreground mb-1">Spécifications Clés :</h4>
            <ul class="space-y-1.5">
              {#each machine.specs.slice(0, 3) as spec} <li class="flex items-center text-muted-foreground">
                  {#if spec.icon}
                    <svelte:component this={spec.icon} class="h-4 w-4 mr-2 text-primary/80" />
                  {:else}
                    <div class="w-4 mr-2"></div>
                  {/if}
                  <span class="font-medium text-foreground/90 min-w-[80px] sm:min-w-[100px]">{spec.name}:</span>
                  <span>{spec.value}</span>
                </li>
              {/each}
            </ul>
          </CardContent>
          <div class="p-6 pt-4 border-t mt-auto">
            <Button href={`/infra/${machine.id}`} variant="outline" size="sm" class="w-full">
              Voir les Détails <ArrowRight class="ml-2 h-4 w-4" />
            </Button>
          </div>
        </Card>
      </div>
    {/each}
  </div>

  <div class="text-center mt-16 md:mt-20" in:flyAndScale|global={{ y: 20, duration: 300, delay: infrastructure.length * 100 + 200 }}>
    <p class="text-lg sm:text-xl md:text-2xl text-muted-foreground">
      Vous pouvez vérifier le statut de l'infrastructure en temps réel
      <a
        href="https://status.azertox.com/status/infra"
        target="_blank"
        rel="noopener noreferrer"
        class="font-semibold text-primary hover:underline underline-offset-4"
      >
        via Kuma <ExternalLink class="inline-block h-4 w-4 ml-0.5" />
      </a>
    </p>
  </div>
</div>

<footer class="bg-muted border-t border-border/40 text-muted-foreground py-4 text-sm text-center">
  Dernière mise à jour du site: 26 juin 2024 &nbsp;|&nbsp; Code source:
  <a href="https://github.com/AzertoxHDW/personnal-website" target="_blank" rel="noopener noreferrer" class="font-medium text-primary hover:underline underline-offset-4">
    Github
  </a>
</footer>

<style lang="postcss">
  .min-h-screen_minus_header_footer {
    min-height: calc(100vh - theme(spacing.20) - theme(spacing.10));
  }
</style>
<script lang="ts">
  // This page now just renders its content.
  // The boot animation is handled by the layout when a Windows theme is selected.
  import { Button } from "$lib/components/ui/button/index.js";
  import { Card, CardHeader, CardTitle, CardContent } from "$lib/components/ui/card/index.js";
  import { flyAndScale } from "$lib/utils.js";
  import { Terminal, UserCircle, ServerIcon, FolderGit2, ShieldCheck, ArrowRight } from "lucide-svelte";

  // Dashboard links remain the same as previous version
  const dashboardLinks = [
    {
        href: "/about",
        title: "Poste de travail",
        description: "Afficher les informations sur cet utilisateur et ses documents.",
        icon: UserCircle,
        details: "Utilisateur: Azertox (Administrateur)",
    },
    {
        href: "/infra",
        title: "Panneau de configuration Réseau",
        description: "Configurer et afficher les connexions réseau et serveurs.",
        icon: ServerIcon, // Changed from Settings2 to ServerIcon for consistency
        details: "Domaine: WORKGROUP | IP: Automatique",
    },
    {
        href: "/museum",
        title: "Mes documents (Projets)",
        description: "Parcourir les projets et les développements en cours.",
        icon: FolderGit2,
        details: "Espace libre: 420 Go / 1 To",
    },
    {
        href: "https://status.azertox.com/status/infra",
        title: "Centre de sécurité & Statut",
        description: "Vérifier l'état des services et la sécurité du système.",
        icon: ShieldCheck,
        details: "Pare-feu: Activé | Mises à jour: Auto",
        external: true,
    }
  ];
</script>

<style lang="postcss">
  /* Styles for the dashboard cards, can be kept from previous version */
  .dashboard-card {
    @apply bg-card border border-border hover:border-primary/70 hover:shadow-xl transition-all duration-300 ease-in-out;
  }
  .dashboard-card .icon-wrapper {
    @apply mb-3 p-3 bg-primary/10 rounded-lg text-primary inline-flex;
  }
</style>

<div class="w-full min-h-[calc(100vh-10rem)] flex flex-col items-center justify-center text-foreground p-4">
    <div class="w-full max-w-5xl space-y-10 md:space-y-16" in:flyAndScale={{ y:0, duration:500, start:0.95}}>
      <header class="text-center space-y-2">
        <h1 class="text-4xl md:text-5xl font-bold tracking-tight flex items-center justify-center">
            <Terminal class="h-10 w-10 mr-3 text-primary" /> Interface Système: <span class="ml-2 text-primary">Azertox</span>
        </h1>
        <p class="text-muted-foreground md:text-lg">
          Tableau de bord opérationnel pour les ressources système et la navigation des projets.
        </p>
      </header>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 md:gap-8">
        {#each dashboardLinks as item, i}
        <div in:flyAndScale|global={{ y: 20, duration: 300, start: 0.98, delay: i * 100 }}>
            <Card class="dashboard-card h-full flex flex-col">
              <CardHeader>
                <div class="icon-wrapper">
                    <svelte:component this={item.icon} class="h-7 w-7" />
                </div>
                <CardTitle class="text-xl !mt-2 group-hover:text-primary">{item.title}</CardTitle>
              </CardHeader>
              <CardContent class="flex-grow">
                <p class="text-muted-foreground text-sm mb-3">{item.description}</p>
                <p class="text-xs font-mono text-primary/80 bg-muted/50 p-2 rounded">{item.details}</p>
              </CardContent>
              <div class="p-4 pt-2">
                <Button href={item.href} target={item.external ? '_blank' : undefined} rel={item.external ? 'noopener noreferrer' : undefined} class="w-full" variant="outline">
                  {item.external ? 'Accéder' : 'Explorer'} <ArrowRight class="ml-2 h-4 w-4" />
                </Button>
              </div>
            </Card>
          </div>
        {/each}
      </div>
        <div class="text-center text-sm text-muted-foreground pt-8">
            <p>&copy; {new Date().getFullYear()} Dylan "Azertox". Horloge système: {new Date().toLocaleTimeString('fr-BE')}. Tous systèmes nominaux.</p>
            <p class="mt-1">Développé avec Svelte & TailwindCSS.</p>
        </div>
    </div>
</div>

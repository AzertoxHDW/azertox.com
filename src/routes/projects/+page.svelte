<script lang="ts">
    import { flyAndScale } from "$lib/utils";
    import { FolderGit2, Github, ExternalLink, Calendar, CheckCircle2, Clock, Archive } from "lucide-svelte";
    import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "$lib/components/ui/card";
    import { Badge } from "$lib/components/ui/badge";
    import { Button } from "$lib/components/ui/button";

    interface Project {
      id: string;
      name: string;
      description: string;
      longDescription?: string;
      techStack?: string[];
      categories?: ('dev' | 'contrib' | 'pro' | 'homelab' | 'creative')[];
      status: 'active' | 'completed' | 'archived' | 'in-progress';
      githubUrl?: string;
      liveUrl?: string;
      imageUrl?: string;
      startDate?: string;
      endDate?: string;
    }

    function getCategoryConfig(category: string) {
      switch (category) {
        case 'dev':
          return { label: 'Dev', class: 'bg-blue-500/10 text-blue-500 border-blue-500/20' };
        case 'contrib':
          return { label: 'Contrib', class: 'bg-purple-500/10 text-purple-500 border-purple-500/20' };
        case 'pro':
          return { label: 'Pro', class: 'bg-amber-500/10 text-amber-500 border-amber-500/20' };
        case 'homelab':
          return { label: 'Homelab', class: 'bg-green-500/10 text-green-500 border-green-500/20' };
        case 'creative':
          return { label: 'Creative', class: 'bg-pink-500/10 text-pink-500 border-pink-500/20' };
        default:
          return { label: category, class: 'bg-muted text-muted-foreground' };
      }
    }

    const projects: Project[] = [
      {
        id: "azertox-website",
        name: "azertox.com",
        description: "Mon site web personnel",
        techStack: ["SvelteKit", "TypeScript", "TailwindCSS", "shadcn-svelte"],
        categories: ["dev"],
        status: "active",
        githubUrl: "https://github.com/AzertoxHDW/azertox.com",
        liveUrl: "https://azertox.com",
        imageUrl: "https://avatars.githubusercontent.com/u/121285134",
        startDate: "2024-01",
      },
      {
        id: "aztone",
        name: "DJ Aztone",
        description: "Mon allias DJ avec lequel je me produis et crée mes sons.",
        categories: ["creative", "pro"],
        status: "active",
        //liveUrl: "https://aztone.be",
        imageUrl: "src/routes/projects/logo yt.png",
        startDate: "2022-11",
      },
      {
        id: "wltn",
        name: "We Love The Night - Events",
        description: "Société d'organisation et gestion évènementielle dont je suis co-créateur.",
        categories: ["pro"],
        status: "active",
        //liveUrl: "https://welovethenight.event",
        imageUrl: "src/routes/projects/wltn logo 2024 v2.png",
        startDate: "2022-12",
      },
      //{
      //  id: "loginight",
      //  name: "Loginight",
      //  description: "Ma société de logistique et imagerie évènementielle.",
      //  longDescription: "BIENTÔT",
      //  categories: ["pro"],
      //  status: "active",
      //  liveUrl: "https://loginight.be",
      //  imageUrl: "src/routes/projects/loginight complet v2.png",
      //},
    ];

    function getStatusConfig(status: Project['status']) {
      switch (status) {
        case 'active':
          return { label: 'Actif', variant: 'default' as const, icon: CheckCircle2 };
        case 'completed':
          return { label: 'Terminé', variant: 'secondary' as const, icon: CheckCircle2 };
        case 'in-progress':
          return { label: 'En cours', variant: 'outline' as const, icon: Clock };
        case 'archived':
          return { label: 'Archivé', variant: 'secondary' as const, icon: Archive };
        default:
          return { label: 'Inconnu', variant: 'outline' as const, icon: Clock };
      }
    }

    function formatDate(dateString?: string): string {
      if (!dateString) return '';
      const date = new Date(dateString + '-01');
      return date.toLocaleDateString('fr-FR', { year: 'numeric', month: 'long' });
    }
</script>

<svelte:head>
    <title>Az' - Mes projets</title>
    <meta name="description" content="Découvrez mes projets personnels et professionnels" />
</svelte:head>

<div class="container mx-auto px-4 py-8 md:py-12">
  <div class="text-center mb-12 md:mb-16" in:flyAndScale={{ y: -20, duration: 500, start: 0.95 }}>
    <h1 class="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-foreground flex items-center justify-center">
      <FolderGit2 class="w-10 h-10 md:w-12 md:h-12 mr-3 text-primary" />
      Mes projets
    </h1>
    <p class="mt-4 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
      Une sélection de mes projets personnels et contributions.
    </p>
  </div>

  <div class="max-w-4xl mx-auto space-y-6">
    {#each projects as project, i (project.id)}
      {@const statusConfig = getStatusConfig(project.status)}
      <div in:flyAndScale|global={{ y: 20, duration: 300, start: 0.98, delay: i * 100 }}>
        <Card class="overflow-hidden hover:shadow-lg hover:shadow-primary/10 transition-shadow duration-300">
          <div class="flex flex-col md:flex-row">
            {#if project.imageUrl}
              <div class="md:w-48 md:flex-shrink-0">
                <img 
                  src={project.imageUrl} 
                  alt="Aperçu de {project.name}" 
                  class="h-48 w-full md:h-full object-cover"
                />
              </div>
            {/if}
            
            <div class="flex-grow">
              <CardHeader class="pb-3">
                <div class="flex flex-wrap items-start justify-between gap-2">
                  <div class="flex items-center gap-2 flex-wrap">
                    <CardTitle class="text-xl md:text-2xl">{project.name}</CardTitle>
                    {#if project.categories && project.categories.length > 0}
                      {#each project.categories as category}
                        {@const catConfig = getCategoryConfig(category)}
                        <span class="text-xs px-2 py-0.5 rounded-full border {catConfig.class}">
                          {catConfig.label}
                        </span>
                      {/each}
                    {/if}
                  </div>
                  <Badge variant={statusConfig.variant} class="flex items-center gap-1">
                    <svelte:component this={statusConfig.icon} class="h-3 w-3" />
                    {statusConfig.label}
                  </Badge>
                </div>
                <CardDescription class="text-base mt-1">
                  {project.description}
                </CardDescription>
              </CardHeader>
              
              <CardContent class="space-y-4">
                {#if project.longDescription}
                  <p class="text-sm text-muted-foreground">
                    {project.longDescription}
                  </p>
                {/if}
                
                {#if project.techStack && project.techStack.length > 0}
                  <div class="flex flex-wrap gap-2">
                    {#each project.techStack as tech}
                      <Badge variant="outline" class="text-xs">{tech}</Badge>
                    {/each}
                  </div>
                {/if}
                
                {#if project.startDate}
                  <p class="text-xs text-muted-foreground flex items-center">
                    <Calendar class="h-3 w-3 mr-1.5" />
                    Démarré en {formatDate(project.startDate)}
                    {#if project.endDate}
                      <span class="mx-1">•</span> Terminé en {formatDate(project.endDate)}
                    {/if}
                  </p>
                {/if}
              </CardContent>
              
              <CardFooter class="pt-0 gap-2 flex-wrap">
                {#if project.githubUrl}
                  <Button href={project.githubUrl} target="_blank" rel="noopener noreferrer" variant="outline" size="sm">
                    <Github class="h-4 w-4 mr-2" />
                    Code source
                  </Button>
                {/if}
                {#if project.liveUrl}
                  <Button href={project.liveUrl} target="_blank" rel="noopener noreferrer" variant="default" size="sm">
                    <ExternalLink class="h-4 w-4 mr-2" />
                    Voir le site
                  </Button>
                {/if}
              </CardFooter>
            </div>
          </div>
        </Card>
      </div>
    {/each}
  </div>

  {#if projects.length === 0}
    <div class="text-center py-12">
      <p class="text-muted-foreground text-lg">Aucun projet à afficher pour le moment.</p>
    </div>
  {/if}
</div>
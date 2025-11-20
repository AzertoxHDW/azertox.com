<script lang="ts">
  import { Card, CardHeader, CardTitle, CardContent } from "$lib/components/ui/card/index.js";
  import { Badge } from "$lib/components/ui/badge";
  import { flyAndScale } from "$lib/utils";
  import {
    UserCircle,
    Terminal,
    Code2,
    Server,
    Cpu,
    Sparkles
  } from "lucide-svelte";

  const startDate = new Date('2003-06-11');

  const yearsSince = (): number => {
    const now = new Date();
    let years = now.getFullYear() - startDate.getFullYear();
    const monthDiff = now.getMonth() - startDate.getMonth();
    const dayDiff = now.getDate() - startDate.getDate();
    if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
      years--;
    }
    return years;
  };

  const skills = [
    {
      category: "Développement",
      icon: Code2,
      color: "text-blue-500",
      items: ["JavaScript/TypeScript", "Python", "Svelte/SvelteKit", "React", "Node.js"]
    },
    {
      category: "Infrastructure",
      icon: Server,
      color: "text-green-500",
      items: ["Linux", "Docker", "Proxmox", "Networking", "Monitoring"]
    },
    {
      category: "Hardware",
      icon: Cpu,
      color: "text-orange-500",
      items: ["Server Architecture", "Diagnostics", "Building", "Performance Tuning"]
    },
    {
      category: "Autres",
      icon: Sparkles,
      color: "text-purple-500",
      items: ["Électronique", "Musique", "Domotique", "IoT"]
    }
  ];
</script>

<svelte:head>
  <title>Az' - À propos de moi</title>
  <meta name="description" content="Développeur, sysadmin et passionné de technologie" />
</svelte:head>

<style lang="postcss">
  .min-h-screen_minus_header_footer {
    min-height: calc(100vh - theme(spacing.20) - theme(spacing.10));
  }

  .gradient-text {
    background: linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--primary) / 0.6) 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
</style>

<div class="container mx-auto px-4 py-8 md:py-12 min-h-screen_minus_header_footer max-w-4xl">
  <!-- Header -->
  <div class="text-center mb-12" in:flyAndScale={{ y: -40, duration: 450, start: 0.7 }}>
    <div class="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-4">
      <UserCircle class="w-12 h-12 text-primary" />
    </div>
    <h1 class="text-4xl md:text-5xl font-bold tracking-tight mb-3">
      <span class="gradient-text">Dylan "Az'" R.</span>
    </h1>
    <p class="text-lg md:text-xl text-muted-foreground mb-3">
      {yearsSince()} ans • Passionné de technologie & Autodidacte
    </p>
    <div class="flex flex-wrap items-center justify-center gap-2">
      <Badge variant="outline" class="text-sm">
        <Terminal class="w-3 h-3 mr-1" />
        Developer
      </Badge>
      <Badge variant="outline" class="text-sm">
        <Server class="w-3 h-3 mr-1" />
        Sysadmin
      </Badge>
      <Badge variant="outline" class="text-sm">
        <Cpu class="w-3 h-3 mr-1" />
        Hardware
      </Badge>
    </div>
  </div>

  <!-- Bio -->
  <section class="mb-12" in:flyAndScale|global={{ y: 50, duration: 400, start: 0.75, delay: 120 }}>
    <Card class="shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      <CardContent class="p-6 md:p-8">
        <p class="text-base md:text-lg text-muted-foreground leading-relaxed">
          Développeur et administrateur système autodidacte depuis plus de 10 ans.
          Je travaille principalement avec JavaScript/TypeScript, Python, et je gère des infrastructures Linux/Docker.
          Au-delà du code et des serveurs, j'explore l'électronique, la domotique et la musique.
          Chaque projet est une opportunité d'apprendre quelque chose de nouveau.
        </p>
      </CardContent>
    </Card>
  </section>

  <!-- Skills -->
  <section in:flyAndScale|global={{ y: 50, duration: 400, start: 0.75, delay: 240 }}>
    <h2 class="text-2xl md:text-3xl font-bold text-foreground mb-6 flex items-center gap-3">
      <Terminal class="h-7 w-7 text-primary" />
      Compétences
    </h2>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      {#each skills as skillGroup}
        <Card class="shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-primary/30">
          <CardHeader class="pb-3">
            <CardTitle class="flex items-center gap-2 text-lg">
              <svelte:component this={skillGroup.icon} class="w-5 h-5 {skillGroup.color}" />
              <span>{skillGroup.category}</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div class="flex flex-wrap gap-2">
              {#each skillGroup.items as skill}
                <Badge variant="secondary" class="text-sm">
                  {skill}
                </Badge>
              {/each}
            </div>
          </CardContent>
        </Card>
      {/each}
    </div>
  </section>
</div>

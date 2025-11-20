<script lang="ts">
  import { Card, CardHeader, CardTitle, CardContent } from "$lib/components/ui/card/index.js";
  import { Badge } from "$lib/components/ui/badge";
  import { flyAndScale } from "$lib/utils";
  import FloatingOrbs from "$lib/components/FloatingOrbs.svelte";
  import {
    UserCircle,
    Laptop,
    Server,
    Wrench,
    Music,
    Lightbulb,
    Zap
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

  const interests = [
    {
      category: "Technologie",
      icon: Laptop,
      color: "text-blue-500",
      items: ["Développement web", "Serveurs", "Réseaux", "Automatisation"]
    },
    {
      category: "Hardware",
      icon: Wrench,
      color: "text-orange-500",
      items: ["Architecture serveur", "Assemblage", "Optimisation", "Diagnostic"]
    },
    {
      category: "Électronique",
      icon: Zap,
      color: "text-yellow-500",
      items: ["Circuits", "IoT", "Domotique", "Prototypage"]
    },
    {
      category: "Créativité",
      icon: Music,
      color: "text-purple-500",
      items: ["Musique", "Conception 3D", "Projets DIY", "Expérimentation"]
    }
  ];
</script>

<svelte:head>
  <title>Az' - À propos de moi</title>
  <meta name="description" content="Passionné de technologie et créateur autodidacte" />
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

<FloatingOrbs />

<div class="container mx-auto px-4 py-8 md:py-12 min-h-screen_minus_header_footer max-w-4xl relative z-10">
  <!-- Header -->
  <div class="text-center mb-12" in:flyAndScale={{ y: -40, duration: 450, start: 0.7 }}>
    <div class="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-4">
      <UserCircle class="w-12 h-12 text-primary" />
    </div>
    <h1 class="text-4xl md:text-5xl font-bold tracking-tight mb-3">
      <span class="gradient-text">Dylan &ldquo;Az&rsquo;&rdquo; R.</span>
    </h1>
    <p class="text-lg md:text-xl text-muted-foreground">
      {yearsSince()} ans • Belgique
    </p>
  </div>

  <!-- Bio -->
  <section class="mb-12" in:flyAndScale|global={{ y: 50, duration: 400, start: 0.75, delay: 120 }}>
    <Card class="shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      <CardContent class="p-6 md:p-8">
        <div class="flex items-start gap-3 mb-4">
          <Lightbulb class="w-6 h-6 text-primary flex-shrink-0 mt-1" />
          <div class="space-y-3 text-base md:text-lg text-muted-foreground leading-relaxed">
            <p>
              Passionné de technologie depuis toujours, j'ai construit mon expertise en autodidacte.
              Ce qui me motive, c'est comprendre comment les choses fonctionnent et créer des solutions.
            </p>
            <p>
              Je gère des infrastructures serveurs, développe des applications web, et expérimente avec l'électronique et la domotique.
              Chaque projet est une occasion d'apprendre et de repousser mes limites.
            </p>
            <p>
              Au-delà de la technique, j'aime la musique et les projets créatifs qui mélangent différents domaines.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  </section>

  <!-- Interests -->
  <section in:flyAndScale|global={{ y: 50, duration: 400, start: 0.75, delay: 240 }}>
    <h2 class="text-2xl md:text-3xl font-bold text-foreground mb-6 flex items-center gap-3">
      <Server class="h-7 w-7 text-primary" />
      Centres d'intérêt
    </h2>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      {#each interests as interest}
        <Card class="shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-primary/30">
          <CardHeader class="pb-3">
            <CardTitle class="flex items-center gap-2 text-lg">
              <svelte:component this={interest.icon} class="w-5 h-5 {interest.color}" />
              <span>{interest.category}</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div class="flex flex-wrap gap-2">
              {#each interest.items as item}
                <Badge variant="secondary" class="text-sm">
                  {item}
                </Badge>
              {/each}
            </div>
          </CardContent>
        </Card>
      {/each}
    </div>
  </section>
</div>

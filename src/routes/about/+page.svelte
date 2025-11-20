<script lang="ts">
  import { Card, CardHeader, CardTitle, CardContent } from "$lib/components/ui/card/index.js";
  import { Badge } from "$lib/components/ui/badge";
  import { flyAndScale } from "$lib/utils";
  import {
    UserCircle,
    Terminal,
    Code2,
    Server,
    Wrench,
    Music,
    Zap,
    Brain,
    Heart,
    Sparkles,
    Cpu,
    Database,
    Globe,
    Box
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
      items: [
        "JavaScript/TypeScript",
        "Python",
        "Svelte/SvelteKit",
        "React",
        "Node.js",
        "Web APIs"
      ]
    },
    {
      category: "Infrastructure",
      icon: Server,
      color: "text-green-500",
      items: [
        "Linux Administration",
        "Docker & Containers",
        "Proxmox",
        "Networking",
        "Monitoring",
        "Automation"
      ]
    },
    {
      category: "Hardware",
      icon: Cpu,
      color: "text-orange-500",
      items: [
        "Server Architecture",
        "Hardware Diagnostics",
        "System Building",
        "Component Selection",
        "Performance Tuning",
        "Troubleshooting"
      ]
    },
    {
      category: "Autres",
      icon: Sparkles,
      color: "text-purple-500",
      items: [
        "Électronique",
        "Musique",
        "Conception 3D",
        "Domotique",
        "IoT",
        "Sécurité"
      ]
    }
  ];

  const stats = [
    { label: "Années d'expérience", value: "10+", icon: Terminal },
    { label: "Projets réalisés", value: "50+", icon: Box },
    { label: "Technologies maîtrisées", value: "20+", icon: Brain },
    { label: "Tasses de café", value: "∞", icon: Zap }
  ];
</script>

<svelte:head>
  <title>Az' - À propos de moi</title>
  <meta name="description" content="Apprenez-en plus sur moi, mes compétences et mes passions" />
</svelte:head>

<style lang="postcss">
  .min-h-screen_minus_header_footer {
    min-height: calc(100vh - theme(spacing.20) - theme(spacing.10));
  }

  .blinking-cursor {
    animation: blink 1s step-end infinite;
  }

  @keyframes blink {
    from, to {
      color: transparent;
    }
    50% {
      color: inherit;
    }
  }

  .gradient-text {
    background: linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--primary) / 0.6) 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .stat-card {
    position: relative;
    overflow: hidden;
  }

  .stat-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, hsl(var(--primary) / 0.1), transparent);
    transition: left 0.5s ease;
  }

  .stat-card:hover::before {
    left: 100%;
  }
</style>

<div class="container mx-auto px-4 py-8 md:py-12 min-h-screen_minus_header_footer">
  <!-- Hero Section -->
  <div class="text-center mb-12 md:mb-16" in:flyAndScale={{ y: -40, duration: 450, start: 0.7 }}>
    <div class="inline-flex items-center justify-center w-20 h-20 md:w-24 md:h-24 rounded-full bg-primary/10 mb-6">
      <UserCircle class="w-12 h-12 md:w-14 md:h-14 text-primary" />
    </div>
    <h1 class="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-4">
      <span class="gradient-text">Dylan "Az'" R.</span>
    </h1>
    <p class="text-xl md:text-2xl text-muted-foreground mb-2">
      Passionné de technologie & Autodidacte
    </p>
    <div class="flex flex-wrap items-center justify-center gap-2 mt-4">
      <Badge variant="outline" class="text-sm">
        <Terminal class="w-3 h-3 mr-1" />
        Developer
      </Badge>
      <Badge variant="outline" class="text-sm">
        <Server class="w-3 h-3 mr-1" />
        Sysadmin
      </Badge>
      <Badge variant="outline" class="text-sm">
        <Wrench class="w-3 h-3 mr-1" />
        Hardware Enthusiast
      </Badge>
    </div>
  </div>

  <!-- Stats Section -->
  <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16" in:flyAndScale|global={{ y: 50, duration: 400, start: 0.75, delay: 0 }}>
    {#each stats as stat, i}
      <Card class="stat-card text-center p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:border-primary/50">
        <svelte:component this={stat.icon} class="w-8 h-8 mx-auto mb-3 text-primary" />
        <div class="text-3xl md:text-4xl font-bold text-foreground mb-1">{stat.value}</div>
        <div class="text-xs md:text-sm text-muted-foreground">{stat.label}</div>
      </Card>
    {/each}
  </div>

  <!-- About Me Section -->
  <section class="mb-16" in:flyAndScale|global={{ y: 50, duration: 400, start: 0.75, delay: 120 }}>
    <div class="flex items-center mb-6">
      <Terminal class="h-8 w-8 md:h-10 md:w-10 mr-3 text-primary" />
      <h2 class="text-3xl md:text-4xl font-bold text-foreground">Qui je suis</h2>
      <span class="text-3xl md:text-4xl font-bold text-primary blinking-cursor ml-1">_</span>
    </div>
    <Card class="shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      <CardContent class="p-6 md:p-8">
        <div class="space-y-4 text-base md:text-lg text-muted-foreground leading-relaxed">
          <p>
            <span class="text-primary font-semibold">Bonjour!</span> Je suis Dylan R., aussi connu sous le pseudo <span class="text-primary font-semibold">Az'</span> sur internet.
            À {yearsSince()} ans, je suis un passionné de technologie qui aime explorer et maîtriser de nouveaux domaines en autodidacte.
          </p>
          <p>
            Mon parcours dans la tech a commencé il y a plus de 10 ans, et depuis, je n'ai jamais cessé d'apprendre.
            Ce qui me motive, c'est la curiosité sans limite et l'envie de comprendre comment les choses fonctionnent,
            que ce soit au niveau logiciel ou matériel.
          </p>
          <p>
            Au fil des années, j'ai développé une expertise dans le développement web, la gestion d'infrastructures serveurs,
            et le hardware. Mais ma passion ne s'arrête pas là - j'explore également l'électronique, la domotique, et même la musique!
          </p>
        </div>
      </CardContent>
    </Card>
  </section>

  <!-- Skills Section -->
  <section class="mb-16" in:flyAndScale|global={{ y: 50, duration: 400, start: 0.75, delay: 240 }}>
    <div class="flex items-center mb-8">
      <Brain class="h-8 w-8 md:h-10 md:w-10 mr-3 text-primary" />
      <h2 class="text-3xl md:text-4xl font-bold text-foreground">Compétences & Technologies</h2>
      <span class="text-3xl md:text-4xl font-bold text-primary blinking-cursor ml-1">_</span>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      {#each skills as skillGroup, i}
        <Card class="shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-primary/30">
          <CardHeader>
            <CardTitle class="flex items-center gap-3">
              <div class="p-2 rounded-lg bg-primary/10">
                <svelte:component this={skillGroup.icon} class="w-6 h-6 {skillGroup.color}" />
              </div>
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

  <!-- Passions Section -->
  <section class="mb-16" in:flyAndScale|global={{ y: 50, duration: 400, start: 0.75, delay: 360 }}>
    <div class="flex items-center mb-6">
      <Heart class="h-8 w-8 md:h-10 md:w-10 mr-3 text-primary" />
      <h2 class="text-3xl md:text-4xl font-bold text-foreground">Ce qui me passionne</h2>
      <span class="text-3xl md:text-4xl font-bold text-primary blinking-cursor ml-1">_</span>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card class="shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:scale-[1.02]">
        <CardContent class="p-6">
          <div class="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center mb-4">
            <Code2 class="w-6 h-6 text-blue-500" />
          </div>
          <h3 class="text-xl font-bold mb-2 text-foreground">Développement</h3>
          <p class="text-muted-foreground">
            Créer des applications web modernes et performantes avec les dernières technologies.
            J'aime construire des interfaces élégantes et des systèmes robustes.
          </p>
        </CardContent>
      </Card>

      <Card class="shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:scale-[1.02]">
        <CardContent class="p-6">
          <div class="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center mb-4">
            <Server class="w-6 h-6 text-green-500" />
          </div>
          <h3 class="text-xl font-bold mb-2 text-foreground">Infrastructure</h3>
          <p class="text-muted-foreground">
            Concevoir et maintenir des infrastructures serveurs efficaces.
            De la virtualisation au monitoring, j'adore optimiser les systèmes.
          </p>
        </CardContent>
      </Card>

      <Card class="shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:scale-[1.02]">
        <CardContent class="p-6">
          <div class="w-12 h-12 rounded-full bg-purple-500/10 flex items-center justify-center mb-4">
            <Zap class="w-6 h-6 text-purple-500" />
          </div>
          <h3 class="text-xl font-bold mb-2 text-foreground">Expérimentation</h3>
          <p class="text-muted-foreground">
            Toujours curieux d'explorer de nouveaux domaines : électronique, IoT, domotique, musique...
            L'apprentissage permanent est mon moteur.
          </p>
        </CardContent>
      </Card>
    </div>
  </section>

  <!-- Philosophy Section -->
  <section in:flyAndScale|global={{ y: 50, duration: 400, start: 0.75, delay: 480 }}>
    <Card class="shadow-lg border-primary/20 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      <CardContent class="p-8 md:p-10">
        <div class="flex items-start gap-4 mb-4">
          <div class="p-3 rounded-lg bg-primary/10 flex-shrink-0">
            <Terminal class="w-8 h-8 text-primary" />
          </div>
          <div>
            <h3 class="text-2xl md:text-3xl font-bold mb-3 text-foreground">Ma philosophie</h3>
            <blockquote class="text-lg md:text-xl text-muted-foreground italic leading-relaxed">
              "La technologie n'est pas juste un outil, c'est un terrain de jeu infini.
              Chaque projet est une opportunité d'apprendre, chaque problème est un puzzle à résoudre,
              et chaque ligne de code est une petite victoire."
            </blockquote>
          </div>
        </div>
        <div class="mt-6 pt-6 border-t border-border">
          <p class="text-base text-muted-foreground">
            En tant qu'autodidacte, j'ai appris que la meilleure façon de maîtriser quelque chose est de <span class="text-primary font-semibold">se lancer et expérimenter</span>.
            Que ce soit en déployant un nouveau service, en codant un projet personnel, ou en démontant un serveur pour comprendre son fonctionnement,
            c'est dans la pratique que naît la véritable compréhension.
          </p>
        </div>
      </CardContent>
    </Card>
  </section>
</div>

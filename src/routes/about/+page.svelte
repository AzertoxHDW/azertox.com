<script lang="ts">
  import { Card, CardHeader, CardTitle, CardContent } from "$lib/components/ui/card/index.js"; //
  import { flyAndScale } from "$lib/utils"; //
  import { UserCircle, Briefcase, Terminal } from "lucide-svelte"; // Using UserCircle and Briefcase for semantic icons
</script>

<style lang="postcss">
  /* Adjust min-height to account for your global header/navbar and this page's footer if they have fixed heights */
  .min-h-screen_minus_header_footer {
    min-height: calc(100vh - theme(spacing.20) - theme(spacing.10)); /* Example: 5rem header, 2.5rem footer */
     /* You might need to adjust these values based on your actual header and footer heights */
  }
   .blinking-cursor {
    animation: blink 1s step-end infinite;
  }

  @keyframes blink {
    from,
    to {
      color: transparent;
    }
    50% {
      color: inherit;
    }
  }
</style>

<div class="container mx-auto px-4 py-8 md:py-12 min-h-screen_minus_header_footer">
  <div class="text-center mb-12 md:mb-16" in:flyAndScale={{ y: -20, duration: 500, start: 0.95 }}>
    <h1 class="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-foreground">
      À Propos de Moi
    </h1>
    <p class="mt-3 text-lg md:text-xl text-muted-foreground">
        Un peu plus d'informations sur qui je suis et ce qui me passionne.
    </p>
  </div>

  <div class="space-y-16 md:space-y-24">
    <section in:flyAndScale|global={{ y: 20, duration: 500 }}>
      <div class="flex items-center mb-6">
        <Terminal class="h-10 w-10 mr-3 text-primary" />
        <h2 class="text-4xl md:text-5xl font-bold text-foreground">Qui je suis</h2>
        <span class="text-4xl md:text-5xl font-bold text-primary blinking-cursor ml-1">_</span>
      </div>
      <Card class="shadow-lg">
        <CardContent class="p-6 md:p-8">
          <p class="text-xl md:text-2xl text-muted-foreground leading-relaxed">
            Je suis Dylan (ou Azertox, ou Az', sur internet). Je suis un jeune passionné de technologie qui,
            depuis des années déjà, passe son temps à cultiver sa passion au travers de plus en plus de domaines.
          </p>
        </CardContent>
      </Card>
    </section>

    <section in:flyAndScale|global={{ y: 20, duration: 500 }}>
      <div class="flex items-center mb-6">
         <Terminal class="h-10 w-10 mr-3 text-primary" />
        <h2 class="text-4xl md:text-5xl font-bold text-foreground">Ce que je fais</h2>
         <span class="text-4xl md:text-5xl font-bold text-primary blinking-cursor ml-1">_</span>
      </div>
      <Card class="shadow-lg">
        <CardContent class="p-6 md:p-8">
          <p class="text-xl md:text-2xl text-muted-foreground leading-relaxed">
            Je cultive mes connaissances en tant qu'autodidacte dans plusieurs domaines tels que le développement, le "hardware", ou la gestion de serveurs
            informatiques, mais aussi dans d'autres domaines plus éloignés de l'informatique comme l'électronique ou la musique.
          </p>
        </CardContent>
      </Card>
    </section>
  </div>
</div>

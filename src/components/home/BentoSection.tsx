import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  FEATURES,
  FEATURES_CONTENT,
  STEPS,
  STEPS_CONTENT,
} from "@/constants/homepage";

/**
 * Bento Box grid combining Features + How-It-Works into one visual section.
 * Cards use glassmorphism (translucent + backdrop-blur).
 *
 * Layout (desktop):
 * ┌──────────┬──────────┬──────────┐
 * │ Feature1 │ Feature2 │  Steps   │
 * │  (1×1)   │  (1×1)   │  (1×2)   │
 * ├──────────┼──────────┤          │
 * │ Feature3 │ Feature4 │          │
 * │  (1×1)   │  (1×1)   │          │
 * └──────────┴──────────┴──────────┘
 */
export function BentoSection() {
  return (
    <section id="features" className="relative py-16 sm:py-24 overflow-hidden">
      {/* Background blobs for glass effect */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-1/4 -left-32 h-96 w-96 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute bottom-1/4 -right-32 h-80 w-80 rounded-full bg-accent/8 blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight">
            {FEATURES_CONTENT.title}{" "}
            <span className="text-primary">{FEATURES_CONTENT.titleHighlight}</span>
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            {FEATURES_CONTENT.description}
          </p>
        </div>

        {/* Bento grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-auto">
          {/* Feature cards — glassmorphism */}
          {FEATURES.map((feature) => (
            <Card
              key={feature.title}
              className="group border border-white/50 bg-white/50 backdrop-blur-lg hover:bg-white/70 hover:shadow-lg transition-all duration-300"
            >
              <CardHeader className="pb-2">
                <div
                  className={`inline-flex items-center justify-center h-11 w-11 rounded-xl ${feature.iconBg} group-hover:rotate-3 transition-transform duration-300`}
                >
                  <feature.icon className={`h-5 w-5 ${feature.iconColor}`} />
                </div>
                <CardTitle className="text-lg mt-3">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}

          {/* Steps card — glassmorphism, tall */}
          <Card className="lg:col-start-3 lg:row-start-1 lg:row-span-2 border border-primary/10 bg-primary/[0.04] backdrop-blur-lg">
            <CardHeader>
              <CardTitle className="text-xl">
                {STEPS_CONTENT.title}{" "}
                <span className="text-primary">{STEPS_CONTENT.titleHighlight}</span>
              </CardTitle>
              <CardDescription>{STEPS_CONTENT.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-0">
              {STEPS.map((step, index) => (
                <div key={step.step}>
                  <div className="flex items-start gap-4 py-4">
                    <Badge className="h-8 w-8 rounded-full p-0 flex items-center justify-center shrink-0 text-xs font-bold">
                      {step.step}
                    </Badge>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <step.icon className="h-4 w-4 text-primary shrink-0" />
                        <h4 className="font-semibold text-foreground">
                          {step.title}
                        </h4>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {step.description}
                      </p>
                    </div>
                  </div>
                  {index < STEPS.length - 1 && <Separator />}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}

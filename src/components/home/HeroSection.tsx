import { Link } from "react-router";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { StudyIllustration } from "@/components/illustrations/StudyIllustration";
import { HERO_CONTENT } from "@/constants/homepage";

export function HeroSection() {
  return (
    <section className="relative pt-24 pb-12 sm:pt-28 sm:pb-16 overflow-hidden">
      {/* Background blobs */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-32 -right-32 h-96 w-96 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute top-20 -left-32 h-80 w-80 rounded-full bg-accent/10 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-64 w-64 rounded-full bg-primary/3 blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          {/* Text */}
          <div className="flex-1 text-center lg:text-left">
            <Badge variant="secondary" className="mb-6 gap-2 px-4 py-1.5 text-sm">
              <Sparkles className="h-3.5 w-3.5 text-accent-foreground" />
              {HERO_CONTENT.badge}
            </Badge>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground leading-[1.1]">
              {HERO_CONTENT.title}{" "}
              <span className="text-primary">
                {HERO_CONTENT.titleHighlight}
              </span>{" "}
              {HERO_CONTENT.titleSuffix}
            </h1>

            <p className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-xl mx-auto lg:mx-0 leading-relaxed">
              {HERO_CONTENT.description}
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button asChild size="lg" className="text-base px-8 h-12">
                <Link to="/register">
                  {HERO_CONTENT.ctaPrimary}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="text-base px-8 h-12">
                <a href="#features">{HERO_CONTENT.ctaSecondary}</a>
              </Button>
            </div>
          </div>

          {/* Illustration — glassmorphism card */}
          <div className="flex-1 w-full max-w-lg lg:max-w-none">
            <Card className="border border-white/50 bg-white/50 backdrop-blur-xl shadow-xl">
              <CardContent className="p-6">
                <StudyIllustration className="w-full" />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}

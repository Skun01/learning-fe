import { Link } from "react-router";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CTA_CONTENT } from "@/constants/homepage";

export function CTASection() {
  return (
    <section className="py-16 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Card className="bg-primary text-primary-foreground border-0">
          <CardContent className="p-10 sm:p-14 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
              {CTA_CONTENT.title}
            </h2>
            <p className="mt-4 text-lg text-primary-foreground/80 max-w-xl mx-auto">
              {CTA_CONTENT.description}
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                asChild
                size="lg"
                className="bg-white text-primary hover:bg-white/90 text-base px-8 h-12 font-semibold"
              >
                <Link to="/register">
                  {CTA_CONTENT.ctaPrimary}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                className="bg-transparent border border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 text-base px-8 h-12"
              >
                <Link to="/login">{CTA_CONTENT.ctaSecondary}</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

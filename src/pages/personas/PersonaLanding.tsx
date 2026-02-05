import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useWaitlist } from "@/components/WaitlistProvider";
import { ProductRatingPreview } from "@/components/ProductRatingPreview";
import type { PersonaLandingConfig } from "./personaLandingConfig";
import { ArrowRight, Check } from "lucide-react";

export function PersonaLanding({ config }: { config: PersonaLandingConfig }) {
  const { openWaitlist } = useWaitlist();

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <Header />

      {/* Hero */}
      <section className="container pt-20 pb-16 md:pt-20 md:pb-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex justify-center mb-8">
            <span className="inline-flex items-center rounded-full bg-[#F3F4F8] px-5 py-1.5 text-xs font-sans font-medium text-[#505050]">
              Now accepting early access
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900 mb-4 text-balance">
            {config.hero.title}
          </h1>
          <p className="text-xs md:text-base text-[#666666] mb-4 text-pretty max-w-4xl mx-auto">
            {config.hero.description}
          </p>
          {config.hero.description2 && (
            <p className="text-xs md:text-base text-[#666666] mb-8 text-pretty max-w-4xl mx-auto">
              {config.hero.description2}
            </p>
          )}
          {!config.hero.description2 && <div className="mb-4" />}

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              type="button"
              size="lg"
              className="text-xs bg-[#171717] hover:bg-[#171717]/90 text-white"
              onClick={() => openWaitlist({ title: config.hero.ctaLabel, submitLabel: config.hero.ctaLabel })}
            >
              {config.hero.ctaLabel} <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="text-xs bg-transparent cursor-pointer border-[#171717] text-[#171717] hover:bg-[#171717]/5"
            >
              <Link to="/how-it-works">How it works</Link>
            </Button>
          </div>

          {config.hero.extraBelowCtas && (
            <p className="text-xs md:text-base text-[#666666] mt-8 mb-10 text-pretty max-w-4xl mx-auto">
              {config.hero.extraBelowCtas}
            </p>
          )}
        </div>
      </section>

      {/* Integration Logos */}
      <div className="w-full">
        <section className="container py-8">
          <div className="max-w-5xl mx-auto">
            <h2 className="font-sans font-normal text-[#666666] mb-6 text-center text-sm">
              Works with your existing stack:
            </h2>
            <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
              <div className="flex items-center justify-center h-14">
                <img
                  src="/landing/shopify-logo.svg"
                  alt="Shopify"
                  className="h-9 md:h-10 w-auto opacity-95 contrast-125 transition-all duration-200 ease-out filter hover:brightness-90"
                />
              </div>
              <div className="flex items-center justify-center h-14">
                <img
                  src="/landing/stripe-logo.svg"
                  alt="Stripe"
                  className="h-9 md:h-10 w-auto opacity-95 contrast-125 transition-all duration-200 ease-out filter hover:brightness-90"
                />
              </div>
              <div className="flex items-center justify-center h-14">
                <img
                  src="/landing/amazon-logo.svg"
                  alt="Amazon"
                  className="h-9 md:h-10 w-auto opacity-95 contrast-125 transition-all duration-200 ease-out filter hover:brightness-90"
                />
              </div>
              <div className="flex items-center justify-center h-14">
                <img
                  src="/landing/google-analytics-logo.svg"
                  alt="Google Analytics"
                  className="h-7 md:h-8 w-auto opacity-95 contrast-125 transition-all duration-200 ease-out filter hover:brightness-90"
                />
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Pillars */}
      <section className="w-full bg-slate-100/90">
        <div className="container pt-16 pb-16 text-center">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-[#171717]">{config.pillars.title}</h2>
          {config.pillars.subtitle && (
            <p className="mt-2 text-xs md:text-sm text-[#666666]">{config.pillars.subtitle}</p>
          )}

          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-5 text-left">
            {config.pillars.cards.map((card) => {
              const Icon = card.icon;
              return (
                <div
                  key={card.title}
                  className="rounded-xl border border-slate-200/70 bg-[#F3F4F8]/60 p-6"
                >
                  <Icon className="h-5 w-5 text-slate-400" />
                  <h3 className="mt-4 text-sm font-medium text-[#171717]">{card.title}</h3>
                  <p className="mt-1.5 text-xs text-slate-500">{card.description}</p>
                </div>
              );
            })}
          </div>

          <p className="mt-8 text-xs text-slate-500 max-w-3xl mx-auto">{config.pillars.footer}</p>
        </div>
      </section>

      {/* Why section */}
      <div className="w-full">
        <section className="container py-16">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-[#171717] text-center mb-8">
              {config.why.title}
            </h2>
            <ul className="space-y-4 text-left">
              {config.why.bullets.map((b) => (
                <li key={b} className="flex items-start gap-3 text-sm text-[#666666]">
                  <Check className="h-5 w-5 shrink-0 text-[#171717] mt-0.5" strokeWidth={2.5} />
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </div>

      {/* Example image */}
      <div className="w-full bg-slate-100/90">
        <section className="container pt-16 pb-10">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-[#171717]">{config.example.title}</h2>
            <p className="mt-3 text-xs md:text-sm text-[#666666] max-w-3xl mx-auto">{config.example.description}</p>
          </div>
        </section>
        <section className="container py-16">
          <div className="relative max-w-6xl mx-auto">
            <ProductRatingPreview
              productName="Portable Espresso Maker"
              ratingLabel="Scale"
              phaseLabel="Phase 2 – Mature"
              coherentRating={784}
              confidence={0.86}
              pillars={[
                {
                  title: "Demand Velocity",
                  score: 812,
                  note: "Strong, sustained external interest",
                },
                {
                  title: "Red Ocean Pressure",
                  score: 735,
                  note: "Active competition, but not prohibitive",
                },
                {
                  title: "Unit Economics",
                  score: 790,
                  note: "Solid margins after landed costs and returns",
                },
                {
                  title: "Live Performance",
                  score: 760,
                  note: "Healthy sales velocity and conversion",
                },
              ]}
              interpretation="Interpretation: This SKU supports additional acquisition spend and channel expansion. Monitor CPC inflation, but economics and demand are currently robust."
            />
          </div>
        </section>
      </div>

      {/* Bottom CTA */}
      <section className="container pt-20 pb-24 md:pt-24 md:pb-28">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-2xl font-bold tracking-tight text-slate-900 mb-4 text-balance">
            {config.bottomCta.title}
          </h2>
          <p className="text-xs md:text-base text-[#666666] mb-8 text-pretty max-w-4xl mx-auto">
            {config.bottomCta.description}
          </p>
          <Button
            type="button"
            size="lg"
            className="text-xs bg-[#171717] hover:bg-[#171717]/90 text-white"
            onClick={() => openWaitlist({ title: config.bottomCta.ctaLabel, submitLabel: config.bottomCta.ctaLabel })}
          >
            {config.bottomCta.ctaLabel} <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
}


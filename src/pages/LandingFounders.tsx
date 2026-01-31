import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  TrendingUp, 
  Target, 
  DollarSign, 
  BarChart3, 
  ArrowRight,
  X,
  Check
} from 'lucide-react';
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export default function LandingFounders() {
  const [isWaitlistOpen, setIsWaitlistOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const closeModal = () => {
    if (isSubmitting) return;
    setIsWaitlistOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    const trimmed = email.trim().toLowerCase();
    if (!trimmed || !trimmed.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }

    const configuredEndpoint = (import.meta.env.VITE_WAITLIST_FUNCTION_URL as string | undefined)?.trim();
    const projectId = (import.meta.env.VITE_FIREBASE_PROJECT_ID as string | undefined)?.trim();
    const region =
      (import.meta.env.VITE_FIREBASE_FUNCTIONS_REGION as string | undefined)?.trim() || "us-central1";

    // Only use emulators when running locally (prevents accidentally hitting localhost endpoints in prod).
    const isLocalhost =
      typeof window !== "undefined" && ["localhost", "127.0.0.1"].includes(window.location.hostname);
    const useEmulators = isLocalhost && String(import.meta.env.VITE_USE_FIREBASE_EMULATORS) === "true";

    const derivedEndpoint = projectId
      ? useEmulators
        ? `http://localhost:5001/${projectId}/${region}/add_to_waitlist`
        : `https://${region}-${projectId}.cloudfunctions.net/add_to_waitlist`
      : undefined;

    const endpoint = configuredEndpoint || derivedEndpoint;
    if (!endpoint) {
      setError(
        "Waitlist endpoint is not configured. Set VITE_WAITLIST_FUNCTION_URL in your .env and restart the dev server."
      );
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: trimmed }),
      });

      const data = (await res.json().catch(() => ({}))) as {
        message?: string;
        error?: string;
        duplicate?: boolean;
      };

      if (!res.ok) {
        throw new Error(data.error || "Failed to join waitlist.");
      }

      // Treat duplicates as success (user is effectively “on the list”)
      setIsSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to join waitlist.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Header */}
      <Header />

      {/* Hero */}
      <section className="container mx-auto px-4 pt-20 pb-16 md:pt-24 md:pb-16">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex justify-center mb-8">
            <span className="inline-flex items-center rounded-full bg-[#F3F4F8] px-5 py-1.5 text-xs font-sans font-medium text-[#505050]">
              Now accepting early access
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900 mb-4 text-balance">
            Validate your product idea before the first order.
          </h1>
          <p className="text-xs md:text-base text-[#666666] mb-4 text-pretty max-w-4xl mx-auto">
            Evalin pulls in demand, competition, and cost signals to generate a 300–900 rating and a confidence index. First-time founders can stop guessing with their initial inventory purchases.
          </p>
          <p className="text-xs md:text-base text-[#666666] mb-8 text-pretty max-w-4xl mx-auto">
            For new founders picking a first product or category.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button asChild size="lg" className="text-xs bg-[#171717] hover:bg-[#171717]/90 text-white">
              <Link to="/portfolio">
                Check my product idea <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-xs bg-transparent cursor-pointer border-[#171717] text-[#171717] hover:bg-[#171717]/5"
              onClick={() => setIsWaitlistOpen(true)}
            >
              How it works
            </Button>
          </div>
        </div>
      </section>

      {/* Integration Logos */}
      <div className="w-full">
        <section className="container mx-auto px-4 py-16">
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
      <section className="container mx-auto px-4 pt-16 pb-16 bg-slate-100/90">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-[#171717]">
            One simple score, four data pillars.
          </h2>
          <p className="mt-4 text-xs text-slate-500 max-w-3xl mx-auto">
            Evalin analyzes these pillars before providing a recommendation.
          </p>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-5 text-left">
            <div className="rounded-xl border border-slate-200/70 bg-[#F3F4F8]/60 p-6">
              <TrendingUp className="h-5 w-5 text-slate-400" />
              <h3 className="mt-4 text-sm font-medium text-[#171717]">Demand Velocity</h3>
              <p className="mt-1.5 text-xs text-slate-500">
                Search trends and social interest showing if current demand is real.
              </p>
            </div>

            <div className="rounded-xl border border-slate-200/70 bg-[#F3F4F8]/60 p-6">
              <DollarSign className="h-5 w-5 text-slate-400" />
              <h3 className="mt-4 text-sm font-medium text-[#171717]">Unit Economics</h3>
              <p className="mt-1.5 text-xs text-slate-500">
                Profit remaining after product costs, shipping, tariffs, and potential returns.
              </p>
            </div>

            <div className="rounded-xl border border-slate-200/70 bg-[#F3F4F8]/60 p-6">
              <Target className="h-5 w-5 text-slate-400" />
              <h3 className="mt-4 text-sm font-medium text-[#171717]">Red Ocean Pressure</h3>
              <p className="mt-1.5 text-xs text-slate-500">
                Market crowding and the intensity of competition.
              </p>
            </div>

            <div className="rounded-xl border border-slate-200/70 bg-[#F3F4F8]/60 p-6">
              <BarChart3 className="h-5 w-5 text-slate-400" />
              <h3 className="mt-4 text-sm font-medium text-[#171717]">Live Performance</h3>
              <p className="mt-1.5 text-xs text-slate-500">
                Post-launch behavior including sales, conversion rates, repeat purchases, and discounting.
              </p>
            </div>
          </div>

          <p className="mt-8 text-xs text-slate-500 max-w-3xl mx-auto">
            Every rating includes a{" "}
            <span className="font-medium text-slate-700">Confidence Index</span> and phase tag. This identifies the difference between a strong signal and an early hint.
          </p>
        </div>
      </section>

      {/* Why new founders start with Evalin */}
      <div className="w-full">
        <section className="container mx-auto px-4 py-16">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-[#171717] text-center mb-8">
              Why new founders start with Evalin.
            </h2>
            <ul className="space-y-4 text-left">
              <li className="flex items-start gap-3 text-sm text-[#666666]">
                <Check className="h-5 w-5 shrink-0 text-[#171717] mt-0.5" strokeWidth={2.5} />
                <span>Protect capital by avoiding products that lack a verified market signal.</span>
              </li>
              <li className="flex items-start gap-3 text-sm text-[#666666]">
                <Check className="h-5 w-5 shrink-0 text-[#171717] mt-0.5" strokeWidth={2.5} />
                <span>Real market visibility. Spot where demand rises, where competition is too high, and where margins remain stable.</span>
              </li>
              <li className="flex items-start gap-3 text-sm text-[#666666]">
                <Check className="h-5 w-5 shrink-0 text-[#171717] mt-0.5" strokeWidth={2.5} />
                <span>Compare multiple ideas side by side with one score instead of many tabs.</span>
              </li>
            </ul>
          </div>
        </section>
      </div>


      {/* Image Container with Gradient Mask */}
      <div className="w-full bg-slate-100/90">
        {/* Example section header */}
        <section className="container mx-auto px-4 pt-16 pb-10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-[#171717]">
            Example: Mature product inside Evalin
          </h2>
          <p className="mt-3 text-xs md:text-sm text-[#666666] max-w-3xl mx-auto">
            A mature SKU scored by Evalin: one 300–900 rating, pillar breakdowns, and a confidence index that together
            explain why this product is tagged to scale rather than fix or retire.
          </p>
        </div>
        </section>
      <section className="container mx-auto px-4 py-16">
        <div className="relative max-w-6xl mx-auto">
          <div 
            className="relative rounded-xl aspect-video overflow-hidden bg-slate-100"
            style={{
              boxShadow:
                "0 24px 70px -20px rgba(0, 0, 0, 0.35), 0 12px 30px -12px rgba(0, 0, 0, 0.25)",
            }}
          >
            {/* Content area with gradient fade at edges */}
            <div 
              className="absolute inset-0 rounded-xl overflow-hidden"
              style={{
                maskImage: 'radial-gradient(ellipse 85% 85% at center, black 50%, transparent 100%)',
                WebkitMaskImage: 'radial-gradient(ellipse 85% 85% at center, black 50%, transparent 100%)',
              }}
            >
              <img
                src="/landing/product-image.png"
                alt="Evalin product preview"
                className="w-full h-full object-cover"
                style={{
                  // Fade out at the bottom over a larger region
                  maskImage: "linear-gradient(to bottom, black 0%, black 25%, transparent 100%)",
                  WebkitMaskImage: "linear-gradient(to bottom, black 0%, black 25%, transparent 100%)",
                }}
              />
            </div>
          </div>
        </div>
      </section>
      </div>

        {/* Bottom CTA */}
        <section className="container mx-auto px-4 pt-20 pb-24 md:pt-24 md:pb-28">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-2xl font-bold tracking-tight text-slate-900 mb-4 text-balance">
          Stop guessing with the first inventory order.
          </h2>
          <p className="text-xs md:text-base text-[#666666] mb-8 text-pretty max-w-4xl mx-auto">
          Validate product ideas through Evalin to see which items are worth bringing to life.
          </p>
          <Button asChild size="lg" className="text-xs bg-[#171717] hover:bg-[#171717]/90 text-white">
            <Link to="/portfolio">
              Get my first product scored <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Waitlist Modal */}
      {isWaitlistOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={closeModal}
        >
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
          <div
            className="relative bg-white rounded-xl shadow-2xl max-w-md w-full p-8 border"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closeModal}
              disabled={isSubmitting}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors disabled:opacity-50"
            >
              <X className="h-5 w-5" />
            </button>

            {!isSubmitted ? (
              <>
                <h2 className="text-xl font-bold text-slate-900 mb-2">Join the Waitlist</h2>
                <p className="text-sm text-slate-600 mb-6">
                  Be among the first to access Evalin when we launch.
                </p>
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email address</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      disabled={isSubmitting}
                      className="w-full"
                    />
                    {error && <p className="text-sm text-red-600">{error}</p>}
                  </div>
                  <Button
                    type="submit"
                    size="lg"
                    className="w-full"
                    disabled={isSubmitting || !email.trim()}
                  >
                    {isSubmitting ? "Submitting..." : "Join Waitlist"}
                  </Button>
                </form>
              </>
            ) : (
              <div className="text-center py-6">
                <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h2 className="text-xl font-bold text-slate-900 mb-2">You're on the list!</h2>
                <p className="text-sm text-slate-600">We'll be in touch very soon.</p>
              </div>
            )}
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
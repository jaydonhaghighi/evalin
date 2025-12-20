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
  Upload,
  Calculator,
  Layers,
  Rocket,
  Shield,
  FlaskConical,
  Archive,
  Zap,
  CheckCircle2,
  X
} from 'lucide-react';
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export default function Landing() {
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

    const endpoint = import.meta.env.VITE_WAITLIST_FUNCTION_URL as string | undefined;
    if (!endpoint) {
      setError("Waitlist endpoint is not configured (missing VITE_WAITLIST_FUNCTION_URL).");
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
      <section className="container mx-auto px-4 pt-20 pb-16 md:pt-32 md:pb-16">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-slate-900 mb-6 text-balance">
            The standard for intelligent product validation.
          </h1>
          <p className="text-sm md:text-xl text-[#666666] mb-10 text-pretty max-w-4xl mx-auto">
            Evalin is the logic layer for your stack. It unifies demand, competition, unit economics and live performance into a standardized 300–900 rating. Backed by a live Confidence Index, teams can finally decide with precision: enter, scale, fix, or retire.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="text-sm bg-[#171717] hover:bg-[#171717]/90 text-white">
              <Link to="/portfolio">
                Explore Portfolio <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-sm bg-transparent cursor-pointer border-[#171717] text-[#171717] hover:bg-[#171717]/5"
              onClick={() => setIsWaitlistOpen(true)}
            >
              Join Waitlist
            </Button>
          </div>
        </div>
      </section>

      {/* Image Container with Gradient Mask */}
      <section className="container mx-auto px-4 py-12">
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
                loading="lazy"
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

      {/* Integration Logos */}
      <section className="container mx-auto px-4 py-12">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-1xl md:text-xl font-sans font-normal text-[#666666] mb-8 text-center">
            Works with your existing stack:
          </h2>
          <div className="flex flex-wrap items-center justify-center gap-10 md:gap-14">
            <div className="flex items-center justify-center h-16">
              <img 
                src="/landing/shopify-logo.svg"
                alt="Shopify" 
                className="h-10 md:h-11 w-auto opacity-95 hover:opacity-100 contrast-125 transition-all"
              />
            </div>
            <div className="flex items-center justify-center h-16">
              <img 
                src="/landing/stripe-logo.svg"
                alt="Stripe" 
                className="h-10 md:h-11 w-auto opacity-95 hover:opacity-100 contrast-125 transition-all"
              />
            </div>
            <div className="flex items-center justify-center h-16">
              <img 
                src="/landing/amazon-logo.svg" 
                alt="Amazon" 
                className="h-10 md:h-11 w-auto opacity-95 hover:opacity-100 contrast-125 transition-all"
              />
            </div>
            <div className="flex items-center justify-center h-16">
              <img 
                src="/landing/google-analytics-logo.svg" 
                alt="Google Analytics" 
                className="h-8 md:h-9 w-auto opacity-95 hover:opacity-100 contrast-125 transition-all"
              />
            </div>
          </div>
        </div>
      </section>

      

      {/* What Evalin Is
      <section className="container mx-auto px-4 py-20 border-t">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6 text-center">
            A rating layer for your product portfolio.
          </h2>
          <div className="prose prose-slate max-w-none">
            <p className="text-lg text-slate-600 leading-relaxed">
              Evalin is a product intelligence and scoring platform. It connects to your commerce stack, overlays
              external market data, and produces a standardized{" "}
              <span className="font-semibold text-slate-900">Evalin Product Rating (CPR)</span> between 300 and 900
              for every product and feature.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-6 mt-10">
            {[
              { title: "Demand Velocity", description: "External demand and intent signals" },
              { title: "Red Ocean Pressure", description: "Competitive and advertising intensity" },
              { title: "Unit Economics", description: "Margins, landed cost, and return risk" },
              { title: "Live Performance", description: "Sales, conversion, retention, and discount dependency" },
            ].map((pillar) => (
              <div key={pillar.title} className="border rounded-lg p-6 bg-white shadow-sm">
                <h3 className="font-semibold text-slate-900 mb-2">{pillar.title}</h3>
                <p className="text-sm text-slate-600">{pillar.description}</p>
              </div>
            ))}
          </div>
          <p className="text-slate-600 mt-8 text-center">
            Every CPR is accompanied by a{" "}
            <span className="font-semibold text-slate-900">confidence index (0.00–1.00)</span> and a phase tag (idea,
            early live, mature), so stakeholders always know both how strong the signal is and how much to trust it.
          </p>
        </div>
      </section> */}

      {/* Example Snapshot
      <section className="container mx-auto px-4 py-20 border-t">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-10 text-center">
            Example: mature product inside Evalin
          </h2>
          <div className="border-2 border-blue-200 rounded-xl p-8 bg-gradient-to-br from-blue-50 to-white">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
              <div>
                <h3 className="text-2xl font-bold text-slate-900">Portable Espresso Maker</h3>
                <div className="flex items-center gap-3 mt-2">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                    Scale
                  </span>
                  <span className="text-sm text-slate-500">Phase 2 – Mature</span>
                </div>
              </div>
              <div className="mt-4 md:mt-0 text-right">
                <div className="text-sm text-slate-500 mb-1">Evalin Product Rating</div>
                <div className="text-5xl font-bold text-slate-900">784</div>
                <div className="text-sm text-slate-500 mt-1">Confidence: 0.86</div>
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                { name: "Demand Velocity", score: 812, description: "Strong, sustained external interest" },
                { name: "Red Ocean Pressure", score: 735, description: "Active competition, but not prohibitive" },
                { name: "Unit Economics", score: 790, description: "Solid margins after landed costs and returns" },
                { name: "Live Performance", score: 760, description: "Healthy sales velocity and conversion" },
              ].map((pillar) => (
                <div key={pillar.name} className="bg-white rounded-lg p-4 border">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-slate-700">{pillar.name}</span>
                    <span className="text-lg font-bold text-slate-900">{pillar.score}</span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden mb-2">
                    <div
                      className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 transition-all duration-700"
                      style={{ width: `${((pillar.score - 300) / 600) * 100}%` }}
                    />
                  </div>
                  <p className="text-xs text-slate-500">{pillar.description}</p>
                </div>
              ))}
            </div>
            <p className="text-sm text-slate-600 mt-6 italic">
              Interpretation: This SKU supports additional acquisition spend and channel expansion. Monitor CPC
              inflation, but economics and demand are currently robust.
            </p>
          </div>
        </div>
      </section> */}


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
                <h2 className="text-2xl font-bold text-slate-900 mb-2">Join the Waitlist</h2>
                <p className="text-slate-600 mb-6">
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
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-slate-900 mb-2">You're on the list!</h2>
                <p className="text-slate-600">We'll be in touch very soon.</p>
              </div>
            )}
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
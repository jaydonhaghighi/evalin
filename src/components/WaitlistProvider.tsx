import { createContext, useContext, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X } from "lucide-react";

type WaitlistContextValue = {
  openWaitlist: (options?: WaitlistOpenOptions) => void;
};

const WaitlistContext = createContext<WaitlistContextValue | null>(null);

export type WaitlistOpenOptions = {
  title?: string;
  description?: string;
  submitLabel?: string;
  successTitle?: string;
  successDescription?: string;
};

const DEFAULT_COPY: Required<WaitlistOpenOptions> = {
  title: "Join the Waitlist",
  description: "Be among the first to access Evalin when we launch.",
  submitLabel: "Join waitlist",
  successTitle: "You're on the list!",
  successDescription: "We'll be in touch very soon.",
};

export function useWaitlist() {
  const ctx = useContext(WaitlistContext);
  if (!ctx) {
    throw new Error("useWaitlist must be used within WaitlistProvider");
  }
  return ctx;
}

function buildWaitlistEndpoint(): string | undefined {
  const configuredEndpoint = (import.meta.env.VITE_WAITLIST_FUNCTION_URL as string | undefined)?.trim();
  if (configuredEndpoint) return configuredEndpoint;

  const projectId = (import.meta.env.VITE_FIREBASE_PROJECT_ID as string | undefined)?.trim();
  const region =
    (import.meta.env.VITE_FIREBASE_FUNCTIONS_REGION as string | undefined)?.trim() || "us-central1";

  const isLocalhost =
    typeof window !== "undefined" && ["localhost", "127.0.0.1"].includes(window.location.hostname);
  const useEmulators = isLocalhost && String(import.meta.env.VITE_USE_FIREBASE_EMULATORS) === "true";

  if (!projectId) return undefined;
  return useEmulators
    ? `http://localhost:5001/${projectId}/${region}/add_to_waitlist`
    : `https://${region}-${projectId}.cloudfunctions.net/add_to_waitlist`;
}

export function WaitlistProvider({ children }: { children: React.ReactNode }) {
  const endpoint = useMemo(() => buildWaitlistEndpoint(), []);

  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [copy, setCopy] = useState(DEFAULT_COPY);
  const [openContext, setOpenContext] = useState<{
    opened_from_path?: string;
    opened_from_query?: string;
    referrer?: string;
    utm?: Record<string, string>;
    click_ids?: Record<string, string>;
  } | null>(null);

  const closeModal = () => {
    if (isSubmitting) return;
    setIsOpen(false);
  };

  const openWaitlist = (options?: WaitlistOpenOptions) => {
    const merged = { ...DEFAULT_COPY, ...(options ?? {}) };
    setCopy(merged);

    // Capture attribution context at open-time (closest to click).
    const url = typeof window !== "undefined" ? new URL(window.location.href) : null;
    const params = url ? url.searchParams : null;
    const utmKeys = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"] as const;
    const utm: Record<string, string> = {};
    for (const k of utmKeys) {
      const v = params?.get(k);
      if (v) utm[k] = v;
    }
    const clickIdKeys = ["gclid", "gbraid", "wbraid", "fbclid", "msclkid", "ttclid", "li_fat_id"] as const;
    const click_ids: Record<string, string> = {};
    for (const k of clickIdKeys) {
      const v = params?.get(k);
      if (v) click_ids[k] = v;
    }

    setOpenContext({
      opened_from_path: url?.pathname,
      opened_from_query: url?.search || undefined,
      referrer: typeof document !== "undefined" ? document.referrer || undefined : undefined,
      utm: Object.keys(utm).length ? utm : undefined,
      click_ids: Object.keys(click_ids).length ? click_ids : undefined,
    });

    setError(null);
    setIsSubmitted(false);
    setIsSubmitting(false);
    setEmail("");
    setIsOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    const trimmed = email.trim().toLowerCase();
    if (!trimmed || !trimmed.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }

    if (!endpoint) {
      setError(
        "Waitlist endpoint is not configured. Set VITE_WAITLIST_FUNCTION_URL in your .env and restart the dev server."
      );
      return;
    }

    setIsSubmitting(true);
    try {
      const meta = {
        landing_path: openContext?.opened_from_path ?? (typeof window !== "undefined" ? window.location.pathname : undefined),
        landing_query: openContext?.opened_from_query ?? (typeof window !== "undefined" ? window.location.search || undefined : undefined),
        referrer: openContext?.referrer ?? (typeof document !== "undefined" ? document.referrer || undefined : undefined),
        utm: openContext?.utm,
        click_ids: openContext?.click_ids,
        user_agent: typeof navigator !== "undefined" ? navigator.userAgent : undefined,
      };

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: trimmed, meta }),
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
    <WaitlistContext.Provider value={{ openWaitlist }}>
      {children}

      {/* Waitlist Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={closeModal}>
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
                <h2 className="text-2xl font-bold text-slate-900 mb-2">{copy.title}</h2>
                <p className="text-slate-600 mb-6">{copy.description}</p>
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="waitlist-email">Email address</Label>
                    <Input
                      id="waitlist-email"
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
                  <Button type="submit" size="lg" className="w-full" disabled={isSubmitting || !email.trim()}>
                    {isSubmitting ? "Submitting..." : copy.submitLabel}
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
                <h2 className="text-2xl font-bold text-slate-900 mb-2">{copy.successTitle}</h2>
                <p className="text-slate-600">{copy.successDescription}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </WaitlistContext.Provider>
  );
}
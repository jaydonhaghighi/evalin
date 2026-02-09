import { createContext, useContext, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
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

function buildWaitlistSurveyEndpoint(waitlistEndpoint?: string): string | undefined {
  const configuredEndpoint = (import.meta.env.VITE_WAITLIST_SURVEY_FUNCTION_URL as string | undefined)?.trim();
  if (configuredEndpoint) return configuredEndpoint;

  if (waitlistEndpoint && /\/add_to_waitlist\/?$/.test(waitlistEndpoint)) {
    return waitlistEndpoint.replace(/\/add_to_waitlist\/?$/, "/submit_waitlist_survey");
  }

  const projectId = (import.meta.env.VITE_FIREBASE_PROJECT_ID as string | undefined)?.trim();
  const region =
    (import.meta.env.VITE_FIREBASE_FUNCTIONS_REGION as string | undefined)?.trim() || "us-central1";

  const isLocalhost =
    typeof window !== "undefined" && ["localhost", "127.0.0.1"].includes(window.location.hostname);
  const useEmulators = isLocalhost && String(import.meta.env.VITE_USE_FIREBASE_EMULATORS) === "true";

  if (!projectId) return undefined;
  return useEmulators
    ? `http://localhost:5001/${projectId}/${region}/submit_waitlist_survey`
    : `https://${region}-${projectId}.cloudfunctions.net/submit_waitlist_survey`;
}

type SurveyCategory =
  | "new_founder"
  | "early_startup"
  | "established_ecom"
  | "pm_growth"
  | "other";

type SurveyPrimaryFunction =
  | "validate_ideas"
  | "reorder_defend_retire"
  | "prioritize_roadmap"
  | "standardize_reviews"
  | "initial_exploration";

type WaitlistSurveyState = {
  category: SurveyCategory | null;
  category_other_text: string;
  primary_functions: SurveyPrimaryFunction[];
  optional_requirements: string;
};

const DEFAULT_SURVEY: WaitlistSurveyState = {
  category: null,
  category_other_text: "",
  primary_functions: [],
  optional_requirements: "",
};

export function WaitlistProvider({ children }: { children: React.ReactNode }) {
  const endpoint = useMemo(() => buildWaitlistEndpoint(), []);
  const surveyEndpoint = useMemo(() => buildWaitlistSurveyEndpoint(endpoint), [endpoint]);

  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [wasDuplicate, setWasDuplicate] = useState(false);
  const [copy, setCopy] = useState(DEFAULT_COPY);
  const [isSurveyOpen, setIsSurveyOpen] = useState(false);
  const [survey, setSurvey] = useState<WaitlistSurveyState>(DEFAULT_SURVEY);
  const [surveyError, setSurveyError] = useState<string | null>(null);
  const [isSurveySubmitting, setIsSurveySubmitting] = useState(false);
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

  const closeSurveyModal = () => {
    if (isSurveySubmitting) return;
    setIsSurveyOpen(false);
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
    setWasDuplicate(false);
    setIsSubmitting(false);
    setEmail("");
    setSurvey(DEFAULT_SURVEY);
    setSurveyError(null);
    setIsSurveySubmitting(false);
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

      setIsSubmitted(true);

      if (data.duplicate) {
        // Already on the waitlist: show a friendly message and don't force the survey again.
        setWasDuplicate(true);
        setIsSurveyOpen(false);
        return;
      }

      setWasDuplicate(false);
      // New signup: close the email modal and open the survey follow-up.
      setIsOpen(false);
      setIsSurveyOpen(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to join waitlist.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const togglePrimaryFunction = (key: SurveyPrimaryFunction) => {
    setSurvey((prev) => {
      const has = prev.primary_functions.includes(key);
      return {
        ...prev,
        primary_functions: has ? prev.primary_functions.filter((k) => k !== key) : [...prev.primary_functions, key],
      };
    });
  };

  const submitSurvey = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSurveyError(null);

    const trimmedEmail = email.trim().toLowerCase();
    if (!trimmedEmail || !trimmedEmail.includes("@")) {
      setSurveyError("Missing email context. Please re-join the waitlist.");
      return;
    }

    if (!survey.category) {
      setSurveyError("Please select a category.");
      return;
    }

    if (survey.category === "other" && !survey.category_other_text.trim()) {
      setSurveyError('Please specify the "Other" category.');
      return;
    }

    if (survey.primary_functions.length === 0) {
      setSurveyError("Please select at least one primary function.");
      return;
    }

    if (!surveyEndpoint) {
      setSurveyError(
        "Survey endpoint is not configured. Set VITE_WAITLIST_SURVEY_FUNCTION_URL in your .env and restart the dev server."
      );
      return;
    }

    setIsSurveySubmitting(true);
    try {
      const res = await fetch(surveyEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: trimmedEmail,
          survey: {
            ...survey,
            category_other_text:
              survey.category === "other" ? survey.category_other_text.trim() : "",
          },
        }),
      });

      const data = (await res.json().catch(() => ({}))) as { error?: string; message?: string };
      if (!res.ok) throw new Error(data.error || "Failed to submit survey.");

      setIsSurveyOpen(false);
    } catch (err) {
      setSurveyError(err instanceof Error ? err.message : "Failed to submit survey.");
    } finally {
      setIsSurveySubmitting(false);
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
                <h2 className="text-2xl font-bold text-slate-900 mb-2">
                  {wasDuplicate ? "You're already on the waitlist" : copy.successTitle}
                </h2>
                <p className="text-slate-600">
                  {wasDuplicate ? "Looks like you're already on the list. We'll be in touch soon." : copy.successDescription}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Survey Modal (after waitlist signup) */}
      <Dialog open={isSurveyOpen} onOpenChange={(open) => (open ? setIsSurveyOpen(true) : closeSurveyModal())}>
        <DialogContent className="w-[calc(100vw-1.5rem)] sm:w-full max-w-[calc(100vw-1.5rem)] sm:max-w-2xl max-h-[calc(100vh-1.5rem)] p-0 overflow-hidden">
          <div className="p-6 sm:p-8 max-h-[calc(100vh-1.5rem)] overflow-y-auto">
            <DialogHeader className="space-y-3 text-left">
              <DialogTitle className="text-3xl font-semibold tracking-tight text-slate-900">
                Align Evalin with your objectives
              </DialogTitle>
              <DialogDescription className="text-sm text-slate-600 max-w-xl">
                Three questions to categorize requirements for the beta program. Completion time is approximately 20 seconds.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={submitSurvey} className="mt-8 space-y-8">
              <div className="space-y-4">
                <p className="text-sm font-medium text-slate-800">
                  Which category best describes the current operation?
                </p>

                <div className="space-y-3">
                  {[
                    { key: "new_founder", label: "New founder selecting a first product or category" },
                    { key: "early_startup", label: "Early-stage startup with live products" },
                    { key: "established_ecom", label: "Established e-commerce brand or marketplace" },
                    { key: "pm_growth", label: "Product manager or growth lead at a product-led company" },
                    { key: "other", label: "Other" },
                  ].map((opt) => {
                    const checked = survey.category === (opt.key as SurveyCategory);
                    return (
                      <div
                        key={opt.key}
                        role="button"
                        tabIndex={0}
                        className="flex items-start gap-3 rounded-lg p-2 -m-2 cursor-pointer hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-300"
                        onClick={() =>
                          setSurvey((prev) => ({
                            ...prev,
                            category: opt.key as SurveyCategory,
                          }))
                        }
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            setSurvey((prev) => ({
                              ...prev,
                              category: opt.key as SurveyCategory,
                            }));
                          }
                        }}
                      >
                        <div
                          onClick={(e) => e.stopPropagation()}
                          onKeyDown={(e) => e.stopPropagation()}
                        >
                          <Checkbox
                            checked={checked}
                            onCheckedChange={() =>
                              setSurvey((prev) => ({
                                ...prev,
                                category: opt.key as SurveyCategory,
                              }))
                            }
                            aria-label={opt.label}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-slate-600">{opt.label}</p>
                          {opt.key === "other" && checked && (
                            <Input
                              value={survey.category_other_text}
                              onChange={(e) =>
                                setSurvey((prev) => ({ ...prev, category_other_text: e.target.value }))
                              }
                              className="mt-3 max-w-sm"
                              placeholder=""
                            />
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="border-t border-slate-200/70 pt-8 space-y-4">
                <p className="text-sm font-medium text-slate-800">Select the primary functions required from Evalin:</p>
                <div className="space-y-3">
                  {[
                    { key: "validate_ideas", label: "Validating new product ideas for launch" },
                    { key: "reorder_defend_retire", label: "Deciding which items to reorder, defend, or retire" },
                    { key: "prioritize_roadmap", label: "Prioritizing features or roadmap initiatives" },
                    { key: "standardize_reviews", label: "Standardizing portfolio reviews with objective data" },
                    { key: "initial_exploration", label: "Initial exploration" },
                  ].map((opt) => {
                    const checked = survey.primary_functions.includes(opt.key as SurveyPrimaryFunction);
                    return (
                      <div
                        key={opt.key}
                        role="button"
                        tabIndex={0}
                        className="flex items-start gap-3 rounded-lg p-2 -m-2 cursor-pointer hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-300"
                        onClick={() => togglePrimaryFunction(opt.key as SurveyPrimaryFunction)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            togglePrimaryFunction(opt.key as SurveyPrimaryFunction);
                          }
                        }}
                      >
                        <div
                          onClick={(e) => e.stopPropagation()}
                          onKeyDown={(e) => e.stopPropagation()}
                        >
                          <Checkbox
                            checked={checked}
                            onCheckedChange={() => togglePrimaryFunction(opt.key as SurveyPrimaryFunction)}
                            aria-label={opt.label}
                          />
                        </div>
                        <p className="text-sm text-slate-600">{opt.label}</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="border-t border-slate-200/70 pt-8 space-y-3">
                <p className="text-sm font-medium text-slate-800">Optional Requirements</p>
                <p className="text-sm text-slate-600">Specify any additional feature requirements (Optional):</p>
                <Textarea
                  value={survey.optional_requirements}
                  onChange={(e) => setSurvey((prev) => ({ ...prev, optional_requirements: e.target.value }))}
                  placeholder='Example: Side-by-side idea comparison, SKU rationalization, or specific dashboard integrations."'
                  className="min-h-[88px]"
                />
              </div>

              {surveyError && <p className="text-sm text-red-600">{surveyError}</p>}

              <div className="pt-2">
                <Button
                  type="submit"
                  size="lg"
                  className="w-full bg-slate-900 hover:bg-slate-900/90 text-white"
                  disabled={isSurveySubmitting}
                >
                  {isSurveySubmitting ? "Submitting..." : "Submit Answers"}
                </Button>
              </div>
            </form>
          </div>
        </DialogContent>
      </Dialog>
    </WaitlistContext.Provider>
  );
}
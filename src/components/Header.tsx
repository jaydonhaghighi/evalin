import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useWaitlist } from "@/components/WaitlistProvider";
import { useEffect, useMemo } from "react";

const BETA_BUTTON_TEXT: Record<string, string> = {
  "/": "Join waitlist",
  "/startup": "Join early-stage beta",
  "/product-manager": "Request access",
  "/founders": "Check my product idea",
};

const PERSONA_ROUTES = new Set(Object.keys(BETA_BUTTON_TEXT));
const PERSONA_STORAGE_KEY = "evalin:personaHome";

function getStoredPersonaHome(): string | undefined {
  try {
    return sessionStorage.getItem(PERSONA_STORAGE_KEY) || undefined;
  } catch {
    return undefined;
  }
}

function setStoredPersonaHome(path: string) {
  try {
    sessionStorage.setItem(PERSONA_STORAGE_KEY, path);
  } catch {
    // ignore
  }
}

export function Header() {
  const { pathname } = useLocation();
  const { openWaitlist } = useWaitlist();

  // Remember the last persona landing route the user came from.
  useEffect(() => {
    if (PERSONA_ROUTES.has(pathname)) {
      setStoredPersonaHome(pathname);
    }
  }, [pathname]);

  const personaHome = useMemo(() => {
    if (PERSONA_ROUTES.has(pathname)) return pathname;
    return getStoredPersonaHome() ?? "/";
  }, [pathname]);

  const betaButtonText = BETA_BUTTON_TEXT[personaHome] ?? "Join waitlist";

  return (
    <header className="border-b bg-slate-100/95 backdrop-blur-sm sticky top-0 z-50 w-full">
      <div className="container h-16 flex items-center justify-between">
        <Link to={personaHome} className="flex items-center gap-2">
          <img
            src="/landing/evalin_logo.png"
            alt="Evalin"
            className="h-7 sm:h-7 md:h-7 w-auto object-contain"
          />
        </Link>

        <div className="flex items-center gap-3">
          <nav className="hidden md:flex items-center gap-3">
            <Button
              type="button"
              size="sm"
              className="text-xs bg-[#171717] hover:bg-[#171717]/90 text-white"
              onClick={() => openWaitlist({ title: betaButtonText, submitLabel: betaButtonText })}
            >
              {betaButtonText}
            </Button>
          </nav>

        <Link className="text-xs text-[#171717] hover:text-[#171717]/90" to="/how-it-works">
          How it works
        </Link>
        </div>
      </div>
    </header>
  );
}
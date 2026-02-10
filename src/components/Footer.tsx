import { Link, useLocation } from "react-router-dom";
import { useEffect, useMemo } from "react";

const PERSONA_STORAGE_KEY = "evalin:personaHome";
const PERSONA_ROUTES = new Set(["/", "/startup", "/product-manager", "/founders"]);

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

export function Footer() {
  const { pathname } = useLocation();

  // Mirror header behavior: remember last persona landing route.
  useEffect(() => {
    if (PERSONA_ROUTES.has(pathname)) setStoredPersonaHome(pathname);
  }, [pathname]);

  const personaHome = useMemo(() => {
    if (PERSONA_ROUTES.has(pathname)) return pathname;
    return getStoredPersonaHome() ?? "/";
  }, [pathname]);

  return (
    <footer className="py-8 border-t">
      <div className="container">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <Link
            to={personaHome}
            className="flex items-center gap-2"
            aria-label="Evalin home"
            onClick={() => {
              // If the user is already on the home route, React Router won't trigger a navigation.
              // Ensure the click still brings them back to the top.
              if (typeof window !== "undefined") {
                window.scrollTo({ top: 0, left: 0, behavior: "auto" });
              }
            }}
          >
            <img
              src="/landing/evalin_logo.png"
              alt="Evalin"
              className="h-7 sm:h-7 md:h-7 w-auto object-contain"
            />
          </Link>
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Evalin. Product intelligence for modern commerce.
          </p>
        </div>
      </div>
    </footer>
  );
}
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";

const BETA_BUTTON_TEXT: Record<string, string> = {
  "/": "Join waitlist",
  "/startup": "Join early-stage beta",
  "/product-manager": "Request access",
  "/new-founders": "Check my product idea",
};

export function Header() {
  const { pathname } = useLocation();
  const betaButtonText = BETA_BUTTON_TEXT[pathname] ?? "Join early-stage beta";

  return (
    <header className="border-b bg-slate-100/95 backdrop-blur-sm sticky top-0 z-50 w-full">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
            <img
              src="/landing/evalin_logo.png"
              alt="Evalin"
              className="h-48 w-auto object-contain"
            />
        </Link>

        <div className="flex items-center gap-3">
          <nav className="hidden md:flex items-center gap-3">
          <Button asChild size="sm" className="text-xs bg-[#171717] hover:bg-[#171717]/90 text-white">
              <Link to="/portfolio">
                {betaButtonText}
              </Link>
          </Button>
          </nav>

        <Link className="text-xs text-[#171717] hover:text-[#171717]/90" to="/portfolio">
          How it works
        </Link>
        </div>
      </div>
    </header>
  );
}
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";

export function Header() {
  return (
    <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
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
            <Button asChild size="sm" className="bg-[#171717] hover:bg-[#171717]/90 text-white">
              <Link to="/portfolio">Portfolio</Link>
            </Button>
          </nav>

          <Button variant="ghost" size="icon" aria-label="Settings">
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  );
}
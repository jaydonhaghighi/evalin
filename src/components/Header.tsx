import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { LayoutGrid, Plus, Settings } from 'lucide-react';

export function Header() {
  return (
    <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center gap-2">
            <img
              src="/landing/evalin-logo.png"
              alt="Evalin"
              className="h-32 w-32 rounded-lg object-contain"
            />
          </Link>
        </div>
        <div className="flex items-center gap-2">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <nav className="hidden md:flex items-center gap-6">
            <Link to="/portfolio" className="text-sm text-slate-600 hover:text-slate-900 transition-colors">
              Portfolio
            </Link>
            <Link to="/docs" className="text-sm text-slate-600 hover:text-slate-900 transition-colors">
              Docs
            </Link>
            <Link to="/api" className="text-sm text-slate-600 hover:text-slate-900 transition-colors">
              API
            </Link>
          </nav>
        </div>
          <Button variant="ghost" size="icon">
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  );
}

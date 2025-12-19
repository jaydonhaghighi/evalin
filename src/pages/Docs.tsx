import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function Docs() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16 max-w-3xl">
        <h1 className="text-3xl font-bold text-foreground">Docs</h1>
        <p className="mt-3 text-muted-foreground">
          Documentation page placeholder.
        </p>

        <div className="mt-8 flex gap-3">
          <Button asChild>
            <Link to="/">Back to Home</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}



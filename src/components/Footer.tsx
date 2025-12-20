export function Footer() {
  return (
    <footer className="py-8 border-t">
      <div className="container">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <img
              src="/landing/evalin-logo.png"
              alt="Evalin"
              className="w-24 h-10 rounded object-contain"
            />
          </div>
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Evalin. Product intelligence for modern commerce.
          </p>
        </div>
      </div>
    </footer>
  );
}



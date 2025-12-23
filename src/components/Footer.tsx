export function Footer() {
  return (
    <footer className="py-0 border-t">
      <div className="container">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <img
              src="/landing/evalin_logo.png"
              alt="Evalin"
              className="h-28 sm:h-32 md:h-36 w-auto rounded object-contain"
              loading="lazy"
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
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * Scroll to top on route change (SPA navigation).
 */
export function ScrollToTop() {
  const { pathname, search, hash } = useLocation();

  useEffect(() => {
    // If the URL contains a hash, let the browser handle anchor scrolling.
    if (hash) return;
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [pathname, search, hash]);

  return null;
}


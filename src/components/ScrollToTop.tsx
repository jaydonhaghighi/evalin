import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

/**
 * Scroll to top on route change (SPA navigation).
 */
export function ScrollToTop() {
  const { pathname, search, hash } = useLocation();
  const isFirst = useRef(true);

  useEffect(() => {
    // If the URL contains a hash, let the browser handle anchor scrolling.
    if (hash) return;
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });

    // Meta Pixel SPA PageView tracking on route changes.
    // Base pixel code already tracks the initial PageView.
    if (isFirst.current) {
      isFirst.current = false;
      return;
    }
    const fbq = (window as unknown as { fbq?: (...args: unknown[]) => void }).fbq;
    if (typeof fbq === "function") {
      fbq("track", "PageView");
    }
  }, [pathname, search, hash]);

  return null;
}


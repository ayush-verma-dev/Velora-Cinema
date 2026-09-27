import { useLayoutEffect } from "react";
import { useLocation } from "react-router-dom";

function ScrollToTop() {
  const location = useLocation();

  useLayoutEffect(() => {
    // Reset browser scroll restoration
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }

    // Scroll the page itself
    window.scrollTo(0, 0);

    // Also reset the document scroll (helps on mobile browsers)
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, [location.key]);

  return null;
}

export default ScrollToTop;
import { useState, useEffect } from "react";
import { BREAKPOINTS } from "./constants";

/**
 * Production-grade mobile detection hook
 * Debounced resize listener for performance
 * 
 * @example
 * const isMobile = useMobileBreakpoint("md");
 * return isMobile ? <MobileView /> : <DesktopView />;
 */
export const useMobileBreakpoint = (breakpoint = "md") => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const targetBreakpoint = breakpoint.toUpperCase();
    const breakpointValue = BREAKPOINTS[targetBreakpoint] || 768;

    // Set initial value
    setIsMobile(window.innerWidth < breakpointValue);

    // Debounced resize handler for performance
    let resizeTimer;
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        setIsMobile(window.innerWidth < breakpointValue);
      }, 150);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      clearTimeout(resizeTimer);
    };
  }, [breakpoint]);

  return isMobile;
};

export default useMobileBreakpoint;

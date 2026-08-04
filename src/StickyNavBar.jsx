import React, { useState, useEffect } from "react";
import { COLORS, Z_INDEX, BREAKPOINTS } from "./constants";

/**
 * Production-grade sticky navigation bar
 * - Mobile-optimized fallback / Desktop horizontal tabs
 * - Accessibility-first (ARIA labels, keyboard navigation)
 * - Smooth scroll behavior
 */
export const StickyNavBar = ({
  tabs = [],
  activeTab,
  onTabChange,
  showBorder = true,
}) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () =>
      setIsMobile(window.innerWidth < (BREAKPOINTS?.TABLET || 768));
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleKeyDown = (e, tabId) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onTabChange(tabId);
    }
  };

  return (
    <nav
      role="navigation"
      aria-label="Main navigation"
      style={{
        position: "sticky",
        top: 0,
        zIndex: Z_INDEX?.STICKY || 40,
        backgroundColor: COLORS?.BG?.PRIMARY || "#FFFFFF",
        borderBottom: showBorder
          ? `1px solid ${COLORS?.BG?.TERTIARY || "#F3F4F6"}`
          : "none",
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.05)",
      }}
    >
      <div
        style={{
          display: "flex",
          padding: isMobile ? "8px 12px" : "12px 24px",
          gap: "8px",
          overflowX: "auto",
        }}
      >
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              onKeyDown={(e) => handleKeyDown(e, tab.id)}
              aria-selected={isActive}
              role="tab"
              aria-label={`${tab.label} tab`}
              style={{
                padding: isMobile ? "6px 12px" : "8px 16px",
                fontSize: "14px",
                fontWeight: isActive ? 600 : 500,
                borderRadius: "6px",
                border: "none",
                cursor: "pointer",
                color: isActive
                  ? COLORS?.ACCENT?.BLUE || "#3B82F6"
                  : COLORS?.TEXT?.SECONDARY || "#374151",
                backgroundColor: isActive ? "#EFF6FF" : "transparent",
                transition: "all 0.2s ease-in-out",
                whiteSpace: "nowrap",
                display: "inline-flex",
                alignItems: "center",
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.backgroundColor =
                    COLORS?.BG?.TERTIARY || "#F3F4F6";
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.backgroundColor = "transparent";
                }
              }}
            >
              {tab.icon && (
                <span style={{ marginRight: "6px", display: "inline-flex" }}>
                  {tab.icon}
                </span>
              )}
              {tab.label}
              {tab.badge && (
                <span
                  style={{
                    marginLeft: "6px",
                    padding: "2px 6px",
                    backgroundColor: COLORS?.ACCENT?.RED || "#EF4444",
                    color: "white",
                    borderRadius: "10px",
                    fontSize: "12px",
                    fontWeight: 600,
                  }}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default StickyNavBar;

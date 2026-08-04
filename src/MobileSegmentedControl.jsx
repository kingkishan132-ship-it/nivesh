import React, { useRef, useEffect } from "react";
import { COLORS, Z_INDEX } from "./constants";

/**
 * iOS-style segmented control for mobile navigation
 * - Equal width distribution (if ≤4 tabs) or scrollable (if >4)
 * - Touch-friendly tap targets (min 44px height)
 */
export const MobileSegmentedControl = ({
  tabs = [],
  activeTab,
  onTabChange,
}) => {
  const containerRef = useRef(null);
  const activeTabRef = useRef(null);

  // Auto-scroll active tab into view
  useEffect(() => {
    if (activeTabRef.current && containerRef.current) {
      activeTabRef.current.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      });
    }
  }, [activeTab]);

  const shouldScroll = tabs.length > 4;

  return (
    <div
      style={{
        position: "sticky",
        top: 0,
        zIndex: Z_INDEX?.STICKY || 40,
        backgroundColor: COLORS?.BG?.PRIMARY || "#FFFFFF",
        padding: "8px 12px",
        borderBottom: `1px solid ${COLORS?.BG?.TERTIARY || "#F3F4F6"}`,
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.05)",
      }}
    >
      <div
        ref={containerRef}
        role="tablist"
        aria-label="Navigation"
        style={{
          display: "flex",
          gap: "6px",
          padding: "4px",
          backgroundColor: COLORS?.BG?.TERTIARY || "#F3F4F6",
          borderRadius: "8px",
          overflowX: shouldScroll ? "auto" : "visible",
          overflowY: "hidden",
          WebkitOverflowScrolling: "touch",
          scrollBehavior: "smooth",
          scrollSnapType: "x mandatory",
        }}
      >
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              ref={isActive ? activeTabRef : null}
              onClick={() => onTabChange(tab.id)}
              role="tab"
              aria-selected={isActive}
              aria-label={tab.label}
              style={{
                flex: shouldScroll ? "0 0 auto" : `1 1 ${100 / (tabs.length || 1)}%`,
                padding: "12px 14px",
                minHeight: "44px", // Touch-friendly
                fontSize: "13px",
                fontWeight: isActive ? 600 : 500,
                borderRadius: "6px",
                border: "none",
                cursor: "pointer",
                backgroundColor: isActive
                  ? COLORS?.BG?.PRIMARY || "#FFFFFF"
                  : "transparent",
                color: isActive
                  ? COLORS?.ACCENT?.BLUE || "#3B82F6"
                  : COLORS?.TEXT?.SECONDARY || "#374151",
                boxShadow: isActive ? "0 2px 8px rgba(0, 0, 0, 0.08)" : "none",
                transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                whiteSpace: "nowrap",
                scrollSnapAlign: "center",
              }}
            >
              {tab.icon && <span style={{ marginRight: "4px" }}>{tab.icon}</span>}
              {tab.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default MobileSegmentedControl;

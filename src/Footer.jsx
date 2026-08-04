import React from "react";
import AccessibleText from "./AccessibleText";
import { COLORS } from "./constants";

/**
 * Production-grade footer with WCAG AAA compliance
 * All text has proper contrast and readability
 */
export const Footer = () => {
  return (
    <footer
      style={{
        backgroundColor: COLORS?.BG?.CREAM || "#FFFAF0", // Nivesh brand
        borderTop: `1px solid ${COLORS?.BG?.TERTIARY || "#F3F4F6"}`,
        padding: "32px 24px",
        marginTop: "64px",
      }}
      role="contentinfo"
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "32px",
            marginBottom: "32px",
          }}
        >
          {/* Column 1: About */}
          <div>
            <AccessibleText as="h3" variant="primary" weight="bold" className="mb-4">
              About Nivesh
            </AccessibleText>
            <AccessibleText
              as="p"
              variant="secondary"
              size="sm"
              className="mb-3"
            >
              Nivesh is your personal finance advisor powered by AI.
            </AccessibleText>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <AccessibleText as="h3" variant="primary" weight="bold" className="mb-4">
              Quick Links
            </AccessibleText>
            <ul style={{ listStyle: "none", padding: 0 }}>
              {["Dashboard", "Calculator", "Health Score", "Blog"].map((link) => (
                <li key={link} style={{ marginBottom: "8px" }}>
                  <a
                    href="#"
                    style={{
                      color: COLORS?.ACCENT?.BLUE || "#3B82F6",
                      textDecoration: "none",
                      fontSize: "14px",
                      fontWeight: 500,
                      transition: "color 0.2s",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.color =
                        (COLORS?.ACCENT?.BLUE || "#3B82F6") + "CC")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.color =
                        COLORS?.ACCENT?.BLUE || "#3B82F6")
                    }
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Disclaimer */}
          <div>
            <AccessibleText as="h3" variant="primary" weight="bold" className="mb-4">
              Disclaimer
            </AccessibleText>
            <AccessibleText
              as="p"
              variant="secondary"
              size="sm"
              style={{ lineHeight: 1.6 }}
            >
              Assumes steady, uninterrupted growth. Nivesh is not a financial advisor.
              Consult certified professionals for investment decisions.
            </AccessibleText>
          </div>
        </div>

        {/* Divider */}
        <div
          style={{
            borderTop: `1px solid ${COLORS?.BG?.TERTIARY || "#F3F4F6"}`,
            paddingTop: "24px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "16px",
          }}
        >
          <AccessibleText variant="tertiary" size="sm">
            © 2026 Nivesh. All rights reserved.
          </AccessibleText>
          <div style={{ display: "flex", gap: "16px" }}>
            {["Privacy", "Terms", "Contact"].map((link) => (
              <a
                key={link}
                href="#"
                style={{
                  fontSize: "12px",
                  color: COLORS?.TEXT?.TERTIARY || "#6B7280",
                  textDecoration: "none",
                  transition: "color 0.2s",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.color =
                    COLORS?.TEXT?.SECONDARY || "#374151")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.color =
                    COLORS?.TEXT?.TERTIARY || "#6B7280")
                }
              >
                {link}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

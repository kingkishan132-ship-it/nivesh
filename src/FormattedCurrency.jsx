import React from "react";
import { formatCurrency } from "./formatters";
import { COLORS, TYPOGRAPHY } from "./constants";

/**
 * Production-grade currency display component
 * Reusable everywhere in app
 * 
 * @example
 * <FormattedCurrency amount={2000000} options={{ useLakhs: true }} />
 * <FormattedCurrency amount={500000} highlight size="xl" weight="bold" />
 */
export const FormattedCurrency = ({
  amount,
  options = {},
  size = "base",
  weight = "normal",
  highlight = false,
  prefix = "",
  suffix = "",
  className = "",
  ariaLabel,
}) => {
  const formatted = formatCurrency(amount, options);

  const sizeMap = {
    xs: TYPOGRAPHY?.FONT_SIZE?.XS || "12px",
    sm: TYPOGRAPHY?.FONT_SIZE?.SM || "14px",
    base: TYPOGRAPHY?.FONT_SIZE?.BASE || "16px",
    lg: TYPOGRAPHY?.FONT_SIZE?.LG || "18px",
    xl: TYPOGRAPHY?.FONT_SIZE?.XL || "20px",
  };

  const weightMap = {
    normal: TYPOGRAPHY?.FONT_WEIGHT?.NORMAL || 400,
    medium: TYPOGRAPHY?.FONT_WEIGHT?.MEDIUM || 500,
    semibold: TYPOGRAPHY?.FONT_WEIGHT?.SEMIBOLD || 600,
    bold: TYPOGRAPHY?.FONT_WEIGHT?.BOLD || 700,
  };

  return (
    <span
      className={className}
      style={{
        fontSize: sizeMap[size] || sizeMap.base,
        fontWeight: weightMap[weight] || weightMap.normal,
        color: highlight
          ? COLORS?.ACCENT?.GREEN || "#10B981"
          : COLORS?.TEXT?.PRIMARY || "#1F2937",
        fontVariantNumeric: "tabular-nums", // Monospace numbers for neat alignment
        fontFamily: TYPOGRAPHY?.FONT_FAMILY?.MONO || "monospace",
      }}
      aria-label={ariaLabel || `Amount: ${formatted}`}
    >
      {prefix}
      {formatted}
      {suffix}
    </span>
  );
};

export default FormattedCurrency;

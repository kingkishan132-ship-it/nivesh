/**
 * Production-grade Currency & Number Formatting Utilities
 * WCAG AAA Compliant · Indian Market Standard
 */

/**
 * Format number as Indian Rupee with ₹ symbol
 * @example formatCurrency(2000000) → "₹20,00,000"
 * @example formatCurrency(2000000, { useLakhs: true }) → "₹20 Lakhs"
 */
export const formatCurrency = (amount, options = {}) => {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return "₹0";
  }

  const {
    showSymbol = true,
    useLakhs = false,
    precision = 0,
    forceSign = false,
  } = options;

  // Use Lakhs format (Indian convention)
  if (useLakhs && Math.abs(amount) >= 100000) {
    const lakhs = (amount / 100000).toFixed(1);
    const sign = forceSign && amount >= 0 ? "+" : "";
    const cleanLakhs = parseFloat(lakhs).toString();
    return showSymbol ? `${sign}₹${cleanLakhs} Lakhs` : `${sign}${cleanLakhs}L`;
  }

  // Standard Indian currency format
  const formatter = new Intl.NumberFormat("en-IN", {
    style: showSymbol ? "currency" : "decimal",
    currency: "INR",
    minimumFractionDigits: precision,
    maximumFractionDigits: precision,
    signDisplay: forceSign ? "exceptZero" : "auto",
  });

  return formatter.format(amount);
};

/**
 * Format percentage with proper decimal places
 * @example formatPercentage(12.5678) → "12.57%"
 */
export const formatPercentage = (value, decimals = 2) => {
  if (isNaN(value)) return "0%";
  return `${parseFloat(Number(value).toFixed(decimals))}%`;
};

/**
 * Format large numbers as shortened form (K, L, Cr)
 * @example formatCompactNumber(2000000) → "20L" or "₹20L"
 */
export const formatCompactNumber = (value, showCurrency = false) => {
  if (value >= 10000000) return `${showCurrency ? "₹" : ""}${(value / 10000000).toFixed(1)}Cr`;
  if (value >= 100000) return `${showCurrency ? "₹" : ""}${(value / 100000).toFixed(1)}L`;
  if (value >= 1000) return `${showCurrency ? "₹" : ""}${(value / 1000).toFixed(1)}K`;
  return value.toString();
};

/**
 * Safe number parsing (handles string inputs from forms)
 * @example parseNumericInput("2,00,000") → 200000
 */
export const parseNumericInput = (input) => {
  if (typeof input === "number") return input;
  if (!input) return 0;
  
  const cleaned = input
    .toString()
    .replace(/[₹$]/g, "")
    .replace(/,/g, "")
    .trim();
  
  const parsed = parseFloat(cleaned);
  return isNaN(parsed) ? 0 : parsed;
};

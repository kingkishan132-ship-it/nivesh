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

  if (useLakhs && Math.abs(amount) >= 100000) {
    const lakhs = (amount / 100000).toFixed(1);
    const sign = forceSign && amount >= 0 ? "+" : "";
    const cleanLakhs = parseFloat(lakhs).toString();
    return showSymbol ? `${sign}₹${cleanLakhs} Lakhs` : `${sign}${cleanLakhs}L`;
  }

  const formatter = new Intl.NumberFormat("en-IN", {
    style: showSymbol ? "currency" : "decimal",
    currency: "INR",
    minimumFractionDigits: precision,
    maximumFractionDigits: precision,
    signDisplay: forceSign ? "exceptZero" : "auto",
  });

  return formatter.format(amount);
};

export const formatPercentage = (value, decimals = 2) => {
  if (isNaN(value)) return "0%";
  return `${parseFloat(Number(value).toFixed(decimals))}%`;
};

export const formatCompactNumber = (value, showCurrency = false) => {
  if (value >= 10000000) return `${showCurrency ? "₹" : ""}${(value / 10000000).toFixed(1)}Cr`;
  if (value >= 100000) return `${showCurrency ? "₹" : ""}${(value / 100000).toFixed(1)}L`;
  if (value >= 1000) return `${showCurrency ? "₹" : ""}${(value / 1000).toFixed(1)}K`;
  return value.toString();
};

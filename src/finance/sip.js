
/**
 * Nivesh Finance Engine
 * SIP Future Value Calculator
 *
 * All amounts are in INR.
 * Returns are estimates, not guaranteed market outcomes.
 */

export function calculateSip({
  monthlyAmount,
  annualReturnPercent,
  years,
}) {
  // Validate inputs
  if (
    !Number.isFinite(monthlyAmount) ||
    !Number.isFinite(annualReturnPercent) ||
    !Number.isFinite(years)
  ) {
    throw new Error("All inputs must be valid numbers.");
  }

  if (monthlyAmount < 0) {
    throw new Error("Monthly amount cannot be negative.");
  }

  if (years <= 0) {
    throw new Error("Investment period must be greater than zero.");
  }

  const months = years * 12;

  // Convert annual percentage return into monthly rate
  const monthlyRate = annualReturnPercent / 100 / 12;

  if (monthlyRate <= -1) {
    throw new Error("Invalid annual return rate.");
  }

  // Handle zero-return case separately
  let estimatedValue;

  if (monthlyRate === 0) {
    estimatedValue = monthlyAmount * months;
  } else {
    const growthFactor =
      (Math.pow(1 + monthlyRate, months) - 1) /
      monthlyRate;

    // Beginning-of-month contribution assumption.
    estimatedValue =
      monthlyAmount * growthFactor * (1 + monthlyRate);
  }

  const investedAmount = monthlyAmount * months;
  const estimatedGain = estimatedValue - investedAmount;

  return {
    monthlyAmount,
    annualReturnPercent,
    years,
    months,
    investedAmount,
    estimatedValue,
    estimatedGain,
    assumption: "Contributions are made at the beginning of each month.",
  };
}

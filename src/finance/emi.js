
/**
 * Nivesh Finance Engine
 * EMI Calculator
 *
 * Uses the reducing-balance EMI formula.
 * All amounts are in INR.
 */

export function calculateEmi({
  loanPrincipal,
  annualInterestPercent,
  months,
}) {
  // Validate inputs
  if (
    !Number.isFinite(loanPrincipal) ||
    !Number.isFinite(annualInterestPercent) ||
    !Number.isFinite(months)
  ) {
    throw new Error("All inputs must be valid numbers.");
  }

  if (loanPrincipal < 0) {
    throw new Error("Loan amount cannot be negative.");
  }

  if (annualInterestPercent < 0) {
    throw new Error("Interest rate cannot be negative.");
  }

  if (!Number.isInteger(months) || months <= 0) {
    throw new Error("Loan duration must be a positive whole number of months.");
  }

  const monthlyRate = annualInterestPercent / 100 / 12;

  let monthlyEmi;

  // Zero-interest loan
  if (monthlyRate === 0) {
    monthlyEmi = loanPrincipal / months;
  } else {
    const factor = Math.pow(1 + monthlyRate, months);

    monthlyEmi =
      (loanPrincipal * monthlyRate * factor) / (factor - 1);
  }

  const totalPayment = monthlyEmi * months;
  const totalInterest = totalPayment - loanPrincipal;

  return {
    loanPrincipal,
    annualInterestPercent,
    months,
    monthlyEmi,
    totalPayment,
    totalInterest,
  };
}

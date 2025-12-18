import { useMemo } from 'react';
import { safeParseFloat, roundToTwo } from '@/utils/number';

/**
 * Hook to calculate installment payment details
 * @param {number} cartTotal - Total cart amount
 * @param {number} months - Number of months for installment
 * @param {number} downPaymentPercent - Down payment percentage (0-100)
 * @param {number} interestRate - Annual interest rate percentage
 * @returns {Object} Calculation results
 */
export const useInstallmentCalculator = (
  cartTotal,
  months,
  downPaymentPercent,
  interestRate
) => {
  return useMemo(() => {
    // Validate inputs
    const validTotal = safeParseFloat(cartTotal, 0);
    const validMonths = safeParseFloat(months, 1);
    const validDownPayment = safeParseFloat(downPaymentPercent, 0);
    const validInterest = safeParseFloat(interestRate, 0);

    // Guard against invalid inputs
    if (validTotal <= 0 || validMonths <= 0) {
      return {
        totalAmount: 0,
        downPaymentAmount: 0,
        remainingAmount: 0,
        monthlyPayment: 0,
        totalPayment: 0,
        totalInterest: 0,
        difference: 0,
        interestRate: validInterest,
        error: 'Invalid cart total or months'
      };
    }

    // Calculate down payment
    const downPaymentAmount = roundToTwo((validTotal * validDownPayment) / 100);
    const remainingAmount = roundToTwo(validTotal - downPaymentAmount);

    // Calculate monthly payment with interest
    const monthlyInterestRate = validInterest / 100 / 12;
    let monthlyPayment;

    if (validInterest > 0 && monthlyInterestRate > 0) {
      // Use compound interest formula
      const numerator = remainingAmount * monthlyInterestRate * Math.pow(1 + monthlyInterestRate, validMonths);
      const denominator = Math.pow(1 + monthlyInterestRate, validMonths) - 1;
      
      if (denominator === 0) {
        monthlyPayment = remainingAmount / validMonths;
      } else {
        monthlyPayment = numerator / denominator;
      }
    } else {
      // No interest
      monthlyPayment = remainingAmount / validMonths;
    }

    monthlyPayment = roundToTwo(monthlyPayment);

    // Calculate totals
    const totalPayment = roundToTwo(downPaymentAmount + (monthlyPayment * validMonths));
    const totalInterest = roundToTwo(totalPayment - validTotal);
    const difference = roundToTwo(totalPayment - validTotal);

    return {
      totalAmount: validTotal,
      downPaymentAmount,
      remainingAmount,
      monthlyPayment,
      totalPayment,
      totalInterest,
      difference,
      interestRate: validInterest,
      error: null
    };
  }, [cartTotal, months, downPaymentPercent, interestRate]);
};

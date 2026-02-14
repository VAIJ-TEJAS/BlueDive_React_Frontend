/**
 * Booking calculation and validation helpers
 */

/**
 * Calculates advance payment amount based on pax count
 * @param paxCount - Number of passengers
 * @param advanceCostPerPax - Advance cost per passenger (default 2500)
 */
export const calculateAdvanceAmount = (
  paxCount: number | null | undefined,
  advanceCostPerPax: number = 2500
): number => {
  if (!paxCount || paxCount < 0 || isNaN(paxCount)) return 0;
  return Math.round(paxCount * advanceCostPerPax);
};

/**
 * Calculates total package cost from customer details
 * @param customers - Array of customer detail objects with package_cost
 * @param useDiscounted - Whether to use discounted pricing
 */
export const calculateTotalCost = (
  customers: Array<{ package_cost: number; discounted_package_cost: number }> | null | undefined,
  useDiscounted: boolean = false
): number => {
  if (!customers || !Array.isArray(customers)) return 0;
  return customers.reduce((sum, customer) => {
    const cost = useDiscounted ? customer.discounted_package_cost : customer.package_cost;
    return sum + (cost || 0);
  }, 0);
};

/**
 * Formats a price with rupee symbol
 */
export const formatPrice = (amount: number | null | undefined): string => {
  if (amount === null || amount === undefined || isNaN(amount)) return '₹0';
  return `₹${new Intl.NumberFormat('en-IN').format(Math.round(amount))}`;
};

/**
 * Calculates balance amount after payments
 * @param totalAmount - Total booking amount
 * @param paidAmount - Amount already paid
 */
export const calculateBalance = (
  totalAmount: number | null | undefined,
  paidAmount: number | null | undefined
): number => {
  const total = (totalAmount && !isNaN(totalAmount)) ? totalAmount : 0;
  const paid = (paidAmount && !isNaN(paidAmount)) ? paidAmount : 0;
  return Math.max(0, total - paid);
};

/**
 * Validates customer contact number (Indian format)
 */
export const isValidContactNumber = (phone: string | null | undefined): boolean => {
  if (!phone) return false;
  const cleaned = String(phone).replace(/\D/g, '');
  return /^[6-9]\d{9}$/.test(cleaned);
};

/**
 * Generates a unique identifier for pax records
 */
export const generateId = (): string => {
  return '_' + Math.random().toString(36).substr(2, 9);
};

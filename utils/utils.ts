export const formatAmount = (amount: number) =>
  Math.sign(amount) === -1
    ? `${amount.toString().replace("-", "+")}`
    : `-${amount}`;

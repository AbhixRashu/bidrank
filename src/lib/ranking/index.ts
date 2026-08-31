export function getMinimumIncrement(currentBid: number): number {
  if (currentBid < 1000) return 1;
  if (currentBid < 10000) return 10;
  if (currentBid < 100000) return 100;
  return 1000;
}

export function getMinimumBidToOutbid(currentBid: number): number {
  return currentBid + getMinimumIncrement(currentBid);
}

export function validateBidAmount(amount: number, currentBid: number): {
  valid: boolean;
  error?: string;
  minimum: number;
  increment: number;
} {
  const increment = getMinimumIncrement(currentBid);
  const minimum = currentBid + increment;
  if (amount < minimum) {
    return {
      valid: false,
      error: `Minimum bid amount is ₹${minimum.toLocaleString("en-IN")}. Current bid: ₹${currentBid.toLocaleString("en-IN")} + ₹${increment.toLocaleString("en-IN")} increment.`,
      minimum,
      increment,
    };
  }
  return { valid: true, minimum, increment };
}

export function calculateRankings(
  bids: Array<{
    listingId: string;
    amount: number;
    activatedAt: Date | null;
  }>
): Array<{ listingId: string; rank: number; amount: number }> {
  const sorted = [...bids].sort((a, b) => {
    if (b.amount !== a.amount) return b.amount - a.amount;
    return (a.activatedAt?.getTime() ?? 0) - (b.activatedAt?.getTime() ?? 0);
  });
  return sorted.map((b, i) => ({ ...b, rank: i + 1 }));
}

export function generateReceiptNumber(num: number): string {
  return `RCP-${new Date().getFullYear()}-${String(num).padStart(5, "0")}`;
}

export interface ListingData {
  id: string;
  slug: string;
  name: string;
  url: string;
  tagline: string;
  description: string;
  logoUrl?: string | null;
  domain?: string | null;
  status: string;
  founderName?: string | null;
  founderBio?: string | null;
  founderAvatarUrl?: string | null;
  timeHeldRank1Seconds: number;
  totalViews: number;
  socialTwitter?: string | null;
  socialLinkedin?: string | null;
  socialWebsite?: string | null;
  promoCode?: string | null;
  promoOffer?: string | null;
  ogImageUrl?: string | null;
  createdAt: Date;
  updatedAt: Date;
  category: {
    id: string;
    name: string;
    slug: string;
  };
  user: {
    id: string;
    name?: string | null;
  };
  currentBid?: {
    amount: number;
    activatedAt: Date;
  } | null;
  _count?: {
    bids: number;
    clickEvents: number;
  };
}

export interface BidData {
  id: string;
  amount: number;
  status: string;
  paymentStatus: string;
  createdAt: Date;
  activatedAt?: Date | null;
  rankAtActivation?: number | null;
  listing: {
    id: string;
    slug: string;
    name: string;
    tagline: string;
    logoUrl?: string | null;
    domain?: string | null;
    category: {
      name: string;
      slug: string;
    };
  };
  user: {
    id: string;
    name?: string | null;
    email: string;
  };
}

export interface LeaderboardEntry {
  rank: number;
  listing: ListingData;
  bidAmount: number;
  claimedAt: Date;
  clicks: number;
}

export interface ActivityItem {
  id: string;
  type: "bid_won" | "outbid" | "listed" | "rank_change";
  message: string;
  timestamp: Date;
  listingSlug?: string;
  listingName?: string;
}

export interface InvoiceData {
  id: string;
  invoiceNumber: string;
  invoiceDate: Date;
  subtotal: number;
  gstRate: number;
  gstAmount: number;
  cgstAmount: number;
  sgstAmount: number;
  totalAmount: number;
  sellerName: string;
  sellerGstin?: string | null;
  buyerName?: string | null;
  buyerGstin?: string | null;
  status: string;
  bid: {
    amount: number;
    listing: {
      name: string;
    };
  };
}

export interface DashboardStats {
  activeListings: number;
  totalBids: number;
  totalSpent: number;
  currentRank?: number;
}

export interface RealtimeBidEvent {
  type: "bid:new" | "bid:outbid" | "rank:changed" | "leaderboard:update";
  timestamp: string;
  data: {
    listingId?: string;
    listingSlug?: string;
    listingName?: string;
    amount?: number;
    rank?: number;
    previousRank?: number;
    outbidUserId?: string;
    leaderboard?: LeaderboardApiItem[];
  };
}

export interface LeaderboardApiItem {
  rank: number;
  listing: {
    id: string;
    slug: string;
    name: string;
    tagline: string;
    logoUrl: string | null;
    domain: string | null;
    category: { id: string; name: string; slug: string; icon: string | null };
  };
  bidAmount: number;
  claimedAt: string | null;
  clicks: number;
}

export interface WeeklyChampionData {
  id: string;
  weekStart: string;
  weekEnd: string;
  rank: number;
  bidAmount: number;
  totalClicks: number;
  listing: {
    name: string;
    slug: string;
    tagline: string;
    logoUrl: string | null;
    category: { name: string; slug: string };
  };
}

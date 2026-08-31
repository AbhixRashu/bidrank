export interface MockListing {
  id: string;
  slug: string;
  name: string;
  url: string;
  tagline: string;
  description: string;
  logoUrl: string | null;
  domain: string;
  category: string;
  categorySlug: string;
  bidAmount: number;
  claimedAt: Date;
  clicks: number;
  verified: boolean;
}

const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();

async function main() {
  const userId = 'cmtfbrpne000goxl0xu9gtwkn';

  const l2 = await p.listing.create({
    data: {
      slug: 'indbid',
      name: 'IndBid',
      url: 'https://indbid.salarypitcher.com',
      tagline: 'India\'s live leaderboard for products',
      description: 'Claim your rank on India\'s live product leaderboard.',
      domain: 'indbid.salarypitcher.com',
      contactEmail: 'admin@indbid.in',
      status: 'approved',
      userId,
      categoryId: 'cmtfbrpms000foxl058o9wfuf',
    },
  });

  await p.bid.create({
    data: {
      amount: 3500,
      status: 'activated',
      idempotencyKey: 'manual_indbid_3500',
      paymentStatus: 'paid',
      paymentVerified: true,
      verifiedAt: new Date(),
      activatedAt: new Date(),
      rankAtActivation: 2,
      userId,
      listingId: l2.id,
    },
  });

  const l3 = await p.listing.create({
    data: {
      slug: 'razorpay-test',
      name: 'Razorpay',
      url: 'https://razorpay.com',
      tagline: 'Payments platform for Indian businesses',
      description: 'India\'s leading payment gateway.',
      domain: 'razorpay.com',
      contactEmail: 'admin@indbid.in',
      status: 'approved',
      userId,
      categoryId: 'cmtfbrpi70006oxl0izk6omm0',
    },
  });

  await p.bid.create({
    data: {
      amount: 2100,
      status: 'activated',
      idempotencyKey: 'manual_razorpay_2100',
      paymentStatus: 'paid',
      paymentVerified: true,
      verifiedAt: new Date(),
      activatedAt: new Date(),
      rankAtActivation: 3,
      userId,
      listingId: l3.id,
    },
  });

  console.log('Created: seo.io #1 ₹4,775 | IndBid #2 ₹3,500 | Razorpay #3 ₹2,100');
  return p.$disconnect();
}

main().catch(e => { console.error(e); return p.$disconnect(); });

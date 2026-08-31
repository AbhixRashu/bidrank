const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();
p.listing.findMany({ select: { name: true, slug: true, status: true, bids: { select: { amount: true, status: true } } } }).then(r => {
  console.log(JSON.stringify(r, null, 2));
  return p.$disconnect();
});

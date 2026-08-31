const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();

async function main() {
  await p.invoice.deleteMany();
  await p.refund.deleteMany();
  await p.rankSnapshot.deleteMany();
  await p.clickEvent.deleteMany();
  await p.moderationCase.deleteMany();
  await p.notification.deleteMany();
  await p.auditLog.deleteMany();
  await p.bid.deleteMany();
  await p.listing.deleteMany();
  await p.featureFlag.deleteMany();
  await p.systemConfig.deleteMany();
  console.log('All listings, bids, and related data deleted.');
  return p.$disconnect();
}

main().catch(e => { console.error(e); return p.$disconnect(); });

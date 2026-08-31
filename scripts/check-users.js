const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();

async function main() {
  const users = await p.user.findMany({ select: { id: true, email: true } });
  console.log('Users:', JSON.stringify(users));
  const categories = await p.category.findMany({ select: { id: true, slug: true, name: true } });
  console.log('Categories:', JSON.stringify(categories));
  return p.$disconnect();
}

main().catch(e => { console.error(e); return p.$disconnect(); });

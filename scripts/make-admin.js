const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.update({
    where: { email: 'demo@indbid.in' },
    data: { role: 'admin' },
  });
  console.log('Admin user:', user.email, user.role);
}

main().finally(() => prisma.$disconnect());

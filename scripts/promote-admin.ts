import { prisma } from '@/server/db/prisma';

const email = 'YOUR_ADMIN_EMAIL@example.com';

async function main() {
  const user = await prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      email: true,
      name: true,
      role: true
    }
  });

  if (!user) {
    throw new Error(`No user found with email: ${email}`);
  }

  if (user.role === 'ADMIN') {
    console.log(`${user.email} is already an ADMIN.`);
    return;
  }

  const updatedUser = await prisma.user.update({
    where: {
      id: user.id
    },
    data: {
      role: 'ADMIN'
    },
    select: {
      id: true,
      email: true,
      name: true,
      role: true
    }
  });

  console.log('Admin promoted successfully:');
  console.log(updatedUser);
}

main()
  .catch(error => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
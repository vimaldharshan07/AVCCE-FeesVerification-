require('dotenv').config();
const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

// 1. Setup the connection pool
const connectionString = `${process.env.DATABASE_URL}`;
const pool = new Pool({ connectionString });

// 2. Setup the Prisma Adapter
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Starting seed...');

  const hashedPassword = await bcrypt.hash('admin123', 10);

  const hods = [
    { username: 'hod_cse', department: 'CSE' },
    { username: 'hod_ece', department: 'ECE' },
    { username: 'hod_mech', department: 'MECH' },
    { username: 'hod_civil', department: 'CIVIL' },
    { username: 'hod_eee', department: 'EEE' },
    { username: 'hod_it', department: 'IT' },
    { username: 'hod_aids', department: 'AIDS' },
    { username: 'hod_aiml', department: 'AIML' },
    { username: 'hod_MCA', department: 'MCA' },
    { username: 'hod_mba', department: 'MBA' }
  ];

  for (const hod of hods) {
    const user = await prisma.user.upsert({
      where: { username: hod.username },
      update: {},
      create: {
        username: hod.username,
        password: hashedPassword,
        department: hod.department,
        role: 'HOD',
      },
    });
    console.log(`✅ Created HOD: ${user.username}`);
  }
  
  console.log('🏁 Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding HODs...');

  // --- STEP 1: CLEAR EXISTING DATA ---
  // Option A: Delete ALL users (Fresh start)
  await prisma.user.deleteMany({});
  console.log('Deleted all previous users.');

  /* // Option B: Delete ONLY HODs (If you want to keep Students)
  await prisma.user.deleteMany({
    where: { role: 'HOD' }
  });
  */

  // --- STEP 2: PREPARE DATA ---
  // Create a hashed password (all HODs use "admin123")
  const hashedPassword = await bcrypt.hash('admin123', 10);

  const hods = [
    { username: 'hod_cse', department: 'CSE' },
    { username: 'hod_ece', department: 'ECE' },
    { username: 'hod_mech', department: 'MECH' },
    { username: 'hod_civil', department: 'CIVIL' },
    { username: 'hod_IT', department: 'IT' },
    { username: 'hod_eee', department: 'EEE' },
    { username: 'hod_AIDS', department: 'AIDS' },
    { username: 'hod_MBA', department: 'MBA' },
    { username: 'hod_Mca', department: 'MCA' },
    { username: 'hod_ICE', department: 'ICE' }
  ];

  // --- STEP 3: INSERT NEW DATA ---
  await prisma.user.createMany({
    data: hods.map(hod => ({
      username: hod.username,
      password: hashedPassword,
      department: hod.department,
      role: 'HOD',
    })),
    skipDuplicates: true,
  });

  console.log(`Seeding finished. Added ${hods.length} HODs.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
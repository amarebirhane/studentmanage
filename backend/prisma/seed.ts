import { PrismaClient, UserRole } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Seeding database...');

    // 1. Create a Default School (Optional, but useful for initial setup)
    const school = await prisma.school.upsert({
        where: { id: 'default-school' }, // We use a fixed ID for seeding consistency
        update: {},
        create: {
            id: 'default-school',
            name: 'Default International School',
            email: 'info@defaultschool.com',
            address: '123 Education Lane',
        },
    });

    console.log(`✅ Default school created: ${school.name}`);

    // 2. Create Super Admin
    const superAdminPassword = await bcrypt.hash('SuperAdmin@123', 10);
    const superAdmin = await prisma.user.upsert({
        where: { email: 'superadmin@platform.com' },
        update: {},
        create: {
            email: 'superadmin@platform.com',
            password: superAdminPassword,
            firstName: 'Super',
            lastName: 'Admin',
            role: UserRole.SUPER_ADMIN,
            phone: '+1234567890',
            // Super Admin doesn't necessarily belong to a specific school (platform scope)
        },
    });

    console.log(`✅ Super Admin created: ${superAdmin.email}`);

    // 3. Create a School Admin
    const schoolAdminPassword = await bcrypt.hash('Admin@123', 10);
    const schoolAdmin = await prisma.user.upsert({
        where: { email: 'admin@school.com' },
        update: {},
        create: {
            email: 'admin@school.com',
            password: schoolAdminPassword,
            firstName: 'School',
            lastName: 'Admin',
            role: UserRole.ADMIN,
            schoolId: school.id,
            phone: '+1234567891',
        },
    });

    console.log(`✅ School Admin created: ${schoolAdmin.email}`);

    console.log('🚀 Seeding completed successfully!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });

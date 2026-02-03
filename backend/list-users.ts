import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
    try {
        console.log('--- Database User Check ---');
        const users = await prisma.user.findMany();
        console.log(`Total users found: ${users.length}`);
        users.forEach(u => {
            console.log(`- ID: ${u.id}, Email: "${u.email}", Role: ${u.role}, deletedAt: ${u.deletedAt}`);
        });
        console.log('---------------------------');
    } catch (error) {
        console.error('Error:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();

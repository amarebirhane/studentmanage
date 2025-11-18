const prisma = require('../lib/prisma');

const connectDB = async () => {
  try {
    if (!process.env.DATABASE_URL) {
      console.error('Error: DATABASE_URL is not defined in environment variables');
      console.error('Please create a .env file in the backend directory with DATABASE_URL');
      process.exit(1);
    }

    console.log('Attempting to connect to PostgreSQL...');
    const masked = process.env.DATABASE_URL.replace(/:[^:@]+@/, ':****@');
    console.log(`Connection string: ${masked}`);

    await prisma.$connect();
    const result = await prisma.$queryRaw`SELECT current_database() AS db, current_user AS user;`;
    console.log(`‚úÖ PostgreSQL Connected: database=${result[0].db}, user=${result[0].user}`);
  } catch (error) {
    console.error(`‚ùå PostgreSQL Connection Error: ${error.message}`);
    console.error('\nÌ¥ß Troubleshooting steps:');
    console.error('1. Ensure PostgreSQL is running and accessible');
    console.error('2. Verify DATABASE_URL in backend/.env');
    console.error('3. Check firewall or VPN blocking connections');
    console.error('4. If using Docker, confirm container is up and port exposed');
    process.exit(1);
  }
};

module.exports = connectDB;

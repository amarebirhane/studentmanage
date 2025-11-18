const { PrismaClient } = require('@prisma/client');

let prisma;

if (!global.__prisma) {
  prisma = new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });
  global.__prisma = prisma;
} else {
  prisma = global.__prisma;
}

module.exports = prisma;

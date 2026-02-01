import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '../../.env') });

export const config = {
    env: process.env.NODE_ENV || 'development',
    port: parseInt(process.env.PORT || '5000', 10),
    jwt: {
        secret: process.env.JWT_SECRET || 'your_jwt_secret',
        expire: process.env.JWT_EXPIRE || '30d',
        cookieExpire: parseInt(process.env.JWT_COOKIE_EXPIRE || '30', 10),
    },
    db: {
        url: process.env.DATABASE_URL,
    },
    cors: {
        origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    },
    upload: {
        path: path.join(__dirname, '../../uploads'),
    }
};

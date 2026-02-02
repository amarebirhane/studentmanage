import jwt from 'jsonwebtoken';
import { config } from '../config';

export const signToken = (id: string): string => {
    return jwt.sign({ id }, config.jwt.secret, {
        expiresIn: config.jwt.expire as any,
    });
};

export const signRefreshToken = (id: string): string => {
    return jwt.sign({ id }, config.jwt.refreshSecret, {
        expiresIn: config.jwt.refreshExpire as any,
    });
};

export const verifyToken = (token: string): any => {
    return jwt.verify(token, config.jwt.secret);
};

export const verifyRefreshToken = (token: string): any => {
    return jwt.verify(token, config.jwt.refreshSecret);
};

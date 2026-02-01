import jwt from 'jsonwebtoken';
import { config } from '../config';

export const signToken = (id: string): string => {
    return jwt.sign({ id }, config.jwt.secret, {
        expiresIn: config.jwt.expire as any,
    });
};

export const verifyToken = (token: string): any => {
    return jwt.verify(token, config.jwt.secret);
};

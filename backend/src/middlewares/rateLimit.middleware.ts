import rateLimit from 'express-rate-limit';

export const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 500, // Limit each IP to 500 requests per windowMs (more reasonable for development)
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    message: 'Too many requests from this IP, please try again after 15 minutes',
});

export const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 50, // Limit each IP to 50 auth requests per 15 minutes (increased from 10/hour)
    message:
        'Too many authentication attempts from this IP, please try again after 15 minutes',
    skipSuccessfulRequests: true, // Don't count successful requests against the limit
});

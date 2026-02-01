import express, { Application } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import path from 'path';
import { config } from './config';
import { errorMiddleware } from './middlewares/error.middleware';
import routes from './routes';

const app: Application = express();

// Middleware
app.use(cors({
    origin: config.cors.origin,
    credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Static Files
app.use('/uploads', express.static(config.upload.path));

// Ignore Chrome DevTools requests
app.get('/.well-known/appspecific/com.chrome.devtools.json', (req, res) => {
    res.status(204).end();
});

// Health Check
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'UP', timestamp: new Date().toISOString() });
});

// Routes Placeholder (To be implemented)
// app.use('/api/v1', routes);

// Error Handling
app.use(errorMiddleware);

export default app;

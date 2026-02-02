"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const config_1 = require("./config");
const error_middleware_1 = require("./middlewares/error.middleware");
const routes_1 = __importDefault(require("./routes"));
const app = (0, express_1.default)();
const rateLimit_middleware_1 = require("./middlewares/rateLimit.middleware");
const tenant_middleware_1 = require("./middlewares/tenant.middleware");
// Middleware
app.use((0, cors_1.default)({
    origin: config_1.config.cors.origin,
    credentials: true,
}));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
app.use((0, cookie_parser_1.default)());
app.use(rateLimit_middleware_1.limiter);
app.use(tenant_middleware_1.tenantMiddleware);
// Static Files
app.use('/uploads', express_1.default.static(config_1.config.upload.path));
// Ignore Chrome DevTools requests
app.get('/.well-known/appspecific/com.chrome.devtools.json', (req, res) => {
    res.status(204).end();
});
// Health Check
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'UP', timestamp: new Date().toISOString() });
});
// Routes
app.use('/api/v1', routes_1.default);
// Error Handling
app.use(error_middleware_1.errorMiddleware);
exports.default = app;

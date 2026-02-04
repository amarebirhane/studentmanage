# School Management System - Backend

A production-ready, multi-tenant backend for K-12 school management built with Node.js, Express, TypeScript, PostgreSQL, and Prisma.

## 🚀 Features

- **Multi-Tenancy**: Strict data isolation per school via `schoolId`
- **Role-Based Access Control**: Super Admin, School Admin, Teacher, Student, Parent, Accountant
- **Soft Deletes**: All records are soft-deleted with `deletedAt` timestamps
- **Audit Logging**: Comprehensive activity tracking across all modules
- **JWT Authentication**: Access + Refresh token rotation
- **Input Validation**: Zod schemas for request validation
- **Rate Limiting**: Redis-backed rate limiting
- **API Documentation**: Swagger/OpenAPI specs at `/api-docs`

## 📋 Requirements

- Node.js >= 18
- PostgreSQL >= 14
- Redis (optional, for rate limiting and caching)

## 🛠️ Setup

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Configure environment**:
   ```bash
   cp .env.example .env
   # Edit .env with your database credentials
   ```

3. **Run migrations**:
   ```bash
   npx prisma migrate deploy
   npx prisma generate
   ```

4. **Seed database** (optional):
   ```bash
   npm run seed
   ```

5. **Start server**:
   ```bash
   npm run dev     # Development
   npm run build   # Production build
   npm start       # Production
   ```

## 🗂️ Project Structure

```
src/
├── config/          # Database, Redis, Logger, Swagger
├── middlewares/     # Auth, Tenant, Rate Limit, Validation
├── modules/         # Feature modules (Students, Teachers, etc.)
├── utils/           # Helpers and utilities
├── routes.ts        # Main router
├── app.ts           # Express app setup
└── server.ts        # Server entry point
```

## 🔐 Authentication

All endpoints (except `/auth/*`) require JWT authentication:

```bash
POST /api/v1/auth/login
POST /api/v1/auth/refresh
POST /api/v1/auth/logout
```

Include the access token in requests:
```
Authorization: Bearer <access_token>
```

## 📚 Core Modules

- **Students**: Enrollment, profiles, academic records
- **Teachers**: Profiles, assignments, class management
- **Classes & Sections**: Hierarchical academic structure
- **Attendance**: Period-wise tracking with summaries
- **Exams & Results**: Exam scheduling, grade entry, report cards
- **Assignments**: Homework creation and submissions
- **Fees**: Invoice generation, payment tracking
- **Messages**: Internal communication system
- **Announcements**: School-wide notifications
- **Dashboards**: Role-specific analytics

## 🏫 Multi-Tenancy

Every request is scoped to a school via middleware:
- `tenantMiddleware` injects `req.schoolId`
- All queries filter by `schoolId`
- Cross-school data access is prevented

## 🔒 Security

- Passwords hashed with bcrypt (10 rounds)
- JWT tokens expire: Access (30d), Refresh (7d)
- Rate limiting: 100 req/15min per IP
- Input sanitization via Zod
- Role + permission enforcement
- Audit logs for all mutations

## 📖 API Documentation

Access Swagger UI at: `http://localhost:5000/api-docs`

## 🧪 Testing

```bash
npm test           # Run all tests
npm run test:watch # Watch mode
```

## 🐛 Debugging

Check logs in `logs/` directory:
- `combined.log`: All logs
- `error.log`: Errors only

## 🚢 Deployment

1. Set `NODE_ENV=production`
2. Build: `npm run build`
3. Run migrations: `npx prisma migrate deploy`
4. Start: `npm start`

## 📝 License

MIT

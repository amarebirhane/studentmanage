# Student Management System

A full-stack student management system built with Express.js (backend) and Next.js 14 (frontend) using App Router.

## Features

- **Authentication**: JWT with HTTP-only cookies, role-based access (admin/teacher)
- **Student Management**: Full CRUD operations with search, filter, and pagination
- **Photo Upload**: Student photo upload functionality
- **Dashboard**: Admin dashboard with statistics and recent admissions
- **Responsive Design**: Mobile-friendly UI with Tailwind CSS and shadcn/ui
- **Validation**: Zod validation on both frontend and backend
- **Data Table**: TanStack React Table with sorting, filtering, and pagination

## Tech Stack

### Backend
- Node.js + Express.js
- MongoDB with Mongoose
- JWT authentication with HTTP-only cookies
- bcryptjs for password hashing
- Zod for validation
- Multer for file uploads

### Frontend
- Next.js 14 (App Router)
- React 18
- Tailwind CSS
- shadcn/ui components
- TanStack React Table
- Axios for API calls
- React Context API for state management
- Zod for validation
- React Hot Toast for notifications

## Project Structure

```
student-management-system/
├── backend/          # Express.js Backend
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── utils/
│   │   └── server.js
│   ├── uploads/      # Student photos
│   ├── .env
│   └── package.json
│
├── frontend/         # Next.js Frontend
│   ├── app/
│   ├── components/
│   ├── context/
│   ├── lib/
│   ├── public/
│   └── package.json
│
├── README.md
└── docker-compose.yml
```

## Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the backend directory:
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/studentmanagement
JWT_SECRET=your_jwt_secret_key_change_this_in_production
FRONTEND_URL=http://localhost:3000
```

4. Seed admin user (optional):
```bash
npm run seed
```
This creates an admin user:
- Email: `admin@example.com`
- Password: `admin123`

5. Start the development server:
```bash
npm run dev
```

The backend server will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file in the frontend directory:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
```

4. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:3000`

## API Endpoints

All API routes are under `/api/v1/`

### Authentication
- `POST /api/v1/auth/register` - Register a new user (Admin only)
- `POST /api/v1/auth/login` - Login user
- `POST /api/v1/auth/logout` - Logout user
- `GET /api/v1/auth/profile` - Get user profile (Protected)

### Students
- `GET /api/v1/students` - Get all students with pagination (Teacher/Admin)
- `GET /api/v1/students/:id` - Get single student (Teacher/Admin)
- `POST /api/v1/students` - Create student (Admin only)
- `PUT /api/v1/students/:id` - Update student (Admin only)
- `DELETE /api/v1/students/:id` - Delete student (Admin only)
- `GET /api/v1/students/stats` - Get dashboard stats (Admin only)

### Upload
- `POST /api/v1/upload` - Upload student photo (Admin only)
- `DELETE /api/v1/upload/:filename` - Delete photo (Admin only)

## Usage

1. Start MongoDB (if running locally)
2. Start the backend server: `cd backend && npm run dev`
3. Start the frontend server: `cd frontend && npm run dev`
4. Open `http://localhost:3000` in your browser
5. Login with the seeded admin account:
   - Email: `admin@example.com`
   - Password: `admin123`
6. Start managing students!

## Roles

- **Admin**: Full access - can create, read, update, delete students and create other users
- **Teacher**: Read-only access - can view student list and details

## Student Fields

- Name
- Email (unique)
- Phone
- Enrollment Number (unique)
- Date of Admission
- Photo (optional)

## Docker Setup (Optional)

A `docker-compose.yml` file is included for easy setup with MongoDB:

```bash
docker-compose up -d
```

This will start MongoDB in a Docker container.

## License

ISC


<!-- 

Core Features (Must-Have)

Student Registration & Profile Management

Name, age, gender, contact

Parent/guardian info

Documents upload (ID, photo)

Class & Section Management

Create classes/sections

Assign students to classes

Attendance Management

Daily attendance

Reports (monthly/weekly)

Grades & Exam Management

Record marks

Report cards

GPA/grade calculation

User Roles & Authentication

Admin

Teachers

Students

Parents

Dashboard

Quick stats (total students, attendance, performance)

⭐ Advanced Features

Timetable Management

Generate weekly schedules

Assign teachers to periods

Fee Management

Due dates

Payment status

Receipts

Behavior & Discipline Records

Notes for good behavior or incidents

Student Performance Analytics

Graphs for marks

Trends over time

Assignments Module

Teachers upload tasks

Students submit work

Notifications System

SMS / Email alerts

In-app notifications for deadlines

🚀 Professional Features (Optional but Valuable)

Online Exams

Multiple-choice quizzes

Automatic grading

Document Generation

Transcripts

Transfer certificates

ID cards

Parent Portal

Monitor attendance

View marks

Receive messages

Library Management

Books

Issued/returned

Due reminders

Transport Management

Bus routes

Student bus assignment

Driver info

Hostel Management (if needed)

Room allocation

Fee tracking

🤖 Modern Features (If using AI or advanced tech)

AI-powered performance prediction

Chatbot for student queries

Face-recognition attendance

Smart timetable generator

🗂️ Integration Features

Export data (Excel/PDF)

Backup & restore

Cloud storage support

API for mobile app
 -->

 <!-- 
    npx prisma migrate dev --name init
   npm run db:seed
      npm run dev
  -->
# TaskFlow — Full-Stack Task Manager

A MERN stack task management app with JWT auth, OTP 2FA, role-based access, and Redis-backed token management.

---

## Backend Analysis

### ✅ Already Implemented
- User registration with email verification (token-based, stored in Redis)
- User login with OTP 2FA via email (SMTP / Nodemailer)
- JWT access tokens (1 min expiry) + refresh tokens (7 days, stored in Redis)
- Token refresh flow via `/api/v1/refresh`
- Logout with cookie clearing + Redis token revocation
- Protected routes via `isAuth` middleware with Redis user caching
- Rate limiting on register and login endpoints (per IP + email)
- NoSQL injection prevention via `mongo-sanitize`
- Input validation via Zod
- Password hashing with bcrypt
- Cookie-based auth (httpOnly, sameSite)
- TryCatch error wrapper middleware

### ❌ Missing — Added in This Project
- **Forgot Password** — generates a hashed reset token, stores on user doc, sends email link (15 min expiry)
- **Reset Password** — validates token, hashes new password, clears token, revokes sessions
- **Task model** — title, description, status, priority, dueDate, assignedTo, createdBy
- **Task CRUD** — create, read, update, delete (admin only)
- **Task assignment** — admin assigns tasks to any user
- **User task endpoints** — users can view and update status of their own tasks
- **Admin middleware** (`isAdmin`) — role-based route guard
- **Task routes** — `/api/v1/tasks/*` and `/api/v1/my-tasks/*`
- **CORS middleware** — allows frontend origin with credentials
- **`getResetPasswordHtml`** — reset password email template

### ⚠️ Minor Issues Fixed
- `verifyOtp` route renamed from `/verify` → `/verify-otp` (avoids clash with email verify)
- `myProfile` now returns `{ user }` wrapper for consistency
- `sameSite` casing corrected on access token cookie (`samesite` → `sameSite`)
- `secure: true` commented out — remember to enable in production with HTTPS

---

## Folder Structure

```
taskflow/
├── backend/                     # Express API
│   ├── config/
│   │   ├── db.js                # MongoDB connection
│   │   ├── generateToken.js     # JWT helpers
│   │   ├── html.js              # Email templates
│   │   ├── sendMail.js          # Nodemailer
│   │   └── zod.js               # Zod validation schemas
│   ├── controllers/
│   │   ├── user.js              # Auth controller (register, login, OTP, forgot/reset)
│   │   └── task.js              # Task controller (CRUD, assign, my-tasks)
│   ├── middlewares/
│   │   ├── isAuth.js            # JWT auth middleware
│   │   ├── isAdmin.js           # Admin role guard
│   │   └── TryCatch.js          # Async error wrapper
│   ├── models/
│   │   ├── User.js              # User schema
│   │   └── Task.js              # Task schema
│   ├── routes/
│   │   ├── user.js              # Auth routes
│   │   └── task.js              # Task routes
│   ├── index.js                 # App entry point
│   └── .env.example
│
└── frontend/                    # React + Vite
    ├── src/
    │   ├── api/
    │   │   ├── axios.js         # Axios instance + refresh interceptor
    │   │   └── index.js         # All API functions
    │   ├── components/
    │   │   ├── common/
    │   │   │   └── ProtectedRoute.jsx   # PrivateRoute, AdminRoute, PublicRoute
    │   │   ├── layout/
    │   │   │   ├── Sidebar.jsx
    │   │   │   └── DashboardLayout.jsx
    │   │   └── tasks/
    │   │       └── TaskCard.jsx
    │   ├── context/
    │   │   └── AuthContext.jsx   # Global auth state
    │   ├── pages/
    │   │   ├── Home.jsx
    │   │   ├── auth/
    │   │   │   ├── Register.jsx
    │   │   │   ├── Login.jsx
    │   │   │   ├── VerifyEmail.jsx
    │   │   │   ├── VerifyOtp.jsx
    │   │   │   ├── ForgotPassword.jsx
    │   │   │   └── ResetPassword.jsx
    │   │   ├── user/
    │   │   │   ├── Dashboard.jsx
    │   │   │   ├── MyTasks.jsx
    │   │   │   └── Profile.jsx
    │   │   └── admin/
    │   │       ├── Dashboard.jsx
    │   │       ├── Tasks.jsx
    │   │       ├── TaskForm.jsx    # Used for both create and edit
    │   │       └── Users.jsx
    │   ├── App.jsx               # All routes
    │   ├── main.jsx
    │   └── index.css             # Global styles + design tokens
    ├── index.html
    ├── vite.config.js
    └── package.json
```

---

## Setup Instructions

### Prerequisites
- Node.js v18+
- MongoDB (local or Atlas)
- Redis (local or Upstash)
- Gmail account with an App Password (for SMTP)

---

### 1. Backend Setup

```bash
cd backend
npm install express dotenv mongoose redis jsonwebtoken bcrypt cookie-parser cors nodemailer zod mongo-sanitize crypto
```

Copy `.env.example` to `.env` and fill in your values:

```
PORT=5000
MONGO_URI=mongodb://localhost:27017
REDIS_URL=redis://localhost:6379
JWT_SECRET=a_long_random_string_here
REFRESH_SECRET=another_long_random_string
SMTP_USER=your_gmail@gmail.com
SMTP_PASSWORD=your_16_char_app_password
APP_NAME=TaskFlow
FRONTEND_URL=http://localhost:5173
```

> **Gmail App Password:** Go to Google Account → Security → 2-Step Verification → App passwords → Generate one for "Mail".

Add to `package.json`:
```json
{
  "type": "module",
  "scripts": {
    "dev": "node --watch index.js",
    "start": "node index.js"
  }
}
```

Start backend:
```bash
npm run dev
```

---

### 2. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The Vite proxy in `vite.config.js` forwards `/api` requests to `localhost:5000`, so no CORS issues during development.

---

### 3. Create an Admin User

After registering through the app, manually update a user's role in MongoDB:

```js
// In MongoDB shell or Compass
db.users.updateOne({ email: "your@email.com" }, { $set: { role: "admin" } })
```

---

## API Routes Reference

### Auth
| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| POST | `/api/v1/register` | — | Register + send verify email |
| POST | `/api/v1/verify/:token` | — | Confirm email |
| POST | `/api/v1/login` | — | Login → send OTP |
| POST | `/api/v1/verify-otp` | — | Submit OTP → set cookies |
| GET | `/api/v1/me` | ✅ | Get current user |
| POST | `/api/v1/refresh` | — | Refresh access token |
| POST | `/api/v1/logout` | ✅ | Logout + revoke token |
| POST | `/api/v1/forgot-password` | — | Send reset email |
| POST | `/api/v1/reset-password/:token` | — | Set new password |

### Admin Tasks
| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| POST | `/api/v1/tasks` | Admin | Create task |
| GET | `/api/v1/tasks` | Admin | Get all tasks |
| GET | `/api/v1/tasks/:id` | Admin | Get task by ID |
| PUT | `/api/v1/tasks/:id` | Admin | Update task |
| DELETE | `/api/v1/tasks/:id` | Admin | Delete task |
| PATCH | `/api/v1/tasks/:id/assign` | Admin | Assign task to user |
| GET | `/api/v1/users` | Admin | Get all users |

### User Tasks
| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| GET | `/api/v1/my-tasks` | User | Get my assigned tasks |
| PATCH | `/api/v1/my-tasks/:id/status` | User | Update task status |

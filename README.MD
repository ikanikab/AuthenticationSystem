# TaskFlow — Secure Authentication & Task Management System

A full-stack MERN application featuring a production-grade authentication system — email OTP verification, two-factor login, JWT-based session management with automatic token renewal, and RBAC — built around a task management platform for Admins and Users.

🔗 **Live:** https://authsystem-taskflow.vercel.app

---

## Tech Stack

| Category                      | Technologies                                                      |
| ----------------------------- | ----------------------------------------------------------------- |
| **Frontend**                  | React, React Router, Axios                                        |
| **Backend**                   | Node.js, Express.js                                               |
| **Database**                  | MongoDB, Redis (Upstash)                                          |
| **Authentication & Security** | JWT, bcrypt, Resend (Email API)                                   |
| **Deployment & Hosting**      | Vercel (Frontend), Render (Backend), MongoDB Atlas, Upstash Redis |


---

## Key Features

### 🔐 Authentication & Authorization
- User registration with **email OTP verification** (Redis-backed, 5-minute expiry, Resend for delivery)
- **Two-factor login** — password + emailed OTP required to authenticate
- **JWT-based authentication** with short-lived access tokens (1-minute TTL) and long-lived refresh tokens (7 days)
- **Forgot / reset password** flow using one-time codes, with full session revocation after reset
- **Role-based access control (RBAC)** — Admin and User roles enforced across 10+ protected REST endpoints

### 🛡️ Security Practices
- **bcrypt** password hashing (10 salt rounds) — passwords never stored in plain text
- **httpOnly + SameSite cookies** for token storage — immune to XSS token theft and CSRF via cross-origin requests
- **Refresh-token session management** with Redis-backed revocation — sessions can be instantly invalidated server-side, unlike standard stateless JWTs
- **Rate limiting** on auth endpoints (login, register) to mitigate brute-force and credential-stuffing attacks
- **CORS** configured with credentialed, origin-restricted access between frontend and backend
- **NoSQL injection prevention** via input sanitization on all user-submitted data
- **Server-side input validation** (Zod schemas) on every auth endpoint

### ⚡ Token Lifecycle & Session Continuity
- Designed a secure **access token (1-minute TTL) + refresh token workflow**
- Built an **Axios interceptor** that transparently detects expired access tokens, requests a new one via the refresh token, and retries the original request — with request queuing to prevent duplicate refresh calls during concurrent requests
- Result: strong security posture (short-lived tokens limit exposure) **without** sacrificing user experience (sessions feel persistent, no forced re-logins)

### 📋 Task Management
- Admins can create, assign, edit, and delete tasks
- Users can view and update the status of tasks assigned to them
- Task ownership enforced at the database query level — users can only ever modify their own assigned tasks

---
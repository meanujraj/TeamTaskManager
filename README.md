# 🚀 Team Task Manager

> A lightweight, production-ready task management platform built for distributed teams. Inspired by Trello/Asana — without the complexity.

[![Node.js](https://img.shields.io/badge/Node.js-20+-339933?logo=node.js&logoColor=white)](https://nodejs.org)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)](https://react.dev)
[![MongoDB](https://img.shields.io/badge/MongoDB-6+-47A248?logo=mongodb&logoColor=white)](https://mongodb.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [API Reference](#-api-reference)
- [Authentication & Authorization](#-authentication--authorization)
- [Database Schema](#-database-schema)
- [Deployment (Railway)](#-deployment-railway)
- [Environment Variables](#-environment-variables)
- [Testing](#-testing)
- [Interview Preparation](#-interview-preparation)
- [License](#-license)

---

## 🎯 Overview

### Problem
Existing task management tools (Trello, Asana, Jira) are over-engineered for small-to-medium teams — leading to high onboarding cost and unnecessary UI complexity.

### Solution
Team Task Manager provides a clean, focused interface for:
- Creating projects and assigning team members
- Managing tasks with priorities, statuses, and due dates
- Viewing real-time dashboard statistics
- Enforcing role-based access control (Admin vs Member)

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| **JWT Authentication** | Secure signup/login with token-based sessions |
| **Role-Based Access** | Admin: full CRUD. Member: view & update status only |
| **Project Management** | Create projects, add/remove team members |
| **Task CRUD** | Create, read, update, delete tasks with priority & status |
| **Dashboard Analytics** | Real-time cards: total, completed, in-progress, overdue |
| **Dark Mode** | System-aware theme toggle, persisted in localStorage |
| **Input Validation** | Server-side validation for all inputs (email, password, enums) |
| **Responsive UI** | Tailwind CSS — works on desktop, tablet, and mobile |


---

## 🛠 Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | React 19, Vite 8, Tailwind CSS 4, React Router 7, Axios, Lucide Icons |
| **Backend** | Node.js 20, Express 5, Mongoose, JWT, Bcrypt.js |
| **Database** | MongoDB (Atlas or local) |
| **Deployment** | Railway |
| **Testing** | Jest, Supertest (backend) |

---

## 📁 Project Structure

```
Team Task Manager/
├── backend/
│   ├── config/               # DB connection config
│   ├── controllers/          # Route handlers
│   │   ├── authController.js
│   │   ├── dashboardController.js
│   │   ├── projectController.js
│   │   └── taskController.js
│   ├── middleware/           # Auth & role middleware
│   │   └── authMiddleware.js
│   ├── models/               # Mongoose schemas
│   │   ├── User.js
│   │   ├── Project.js
│   │   └── Task.js
│   ├── routes/               # Express route definitions
│   │   ├── authRoutes.js
│   │   ├── dashboardRoutes.js
│   │   ├── projectRoutes.js
│   │   └── taskRoutes.js
│   ├── utils/                # Helpers & utilities
│   ├── server.js             # Entry point
│   ├── .env.example          # Environment template
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── api/              # Axios instance
│   │   ├── components/       # Navbar, ProtectedRoute
│   │   ├── context/          # AuthContext (global state)
│   │   ├── hooks/            # Custom React hooks
│   │   └── pages/            # Login, Signup, Dashboard, Projects, Tasks
│   ├── .env.example          # Frontend env template
│   ├── vite.config.js
│   └── package.json
├── .gitignore
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** ≥ 20
- **npm** ≥ 10
- **MongoDB** (local install or [Atlas](https://www.mongodb.com/atlas))

### 1. Clone the repository
```bash
git clone <your-repo-url>
cd "Team Task Manager"
```

### 2. Backend setup
```bash
cd backend
cp .env.example .env    # Edit with your MongoDB URI and JWT secret
npm install
npm run dev             # Starts on http://localhost:5000
```

### 3. Frontend setup
```bash
cd frontend
cp .env.example .env    # Set VITE_API_URL=http://localhost:5000/api
npm install
npm run dev             # Starts on http://localhost:5173
```

### 4. (Optional) MongoDB via Docker
```bash
docker run -d -p 27017:27017 --name taskmanager-mongo mongo:6
```

---

## 📡 API Reference

### Authentication (No token required)

| Method | Endpoint | Body | Response |
|--------|----------|------|----------|
| `POST` | `/api/auth/signup` | `{ name, email, password, role }` | `201` — `{ user, token }` |
| `POST` | `/api/auth/login` | `{ email, password }` | `200` — `{ user, token }` |

### Projects (Token required)

| Method | Endpoint | Access | Body | Response |
|--------|----------|--------|------|----------|
| `GET` | `/api/projects` | All | — | `200` — `[Project]` |
| `POST` | `/api/projects` | Admin | `{ name }` | `201` — `{ project }` |
| `PATCH` | `/api/projects/:id/add-member` | Admin | `{ userId }` | `200` — `{ project }` |
| `PATCH` | `/api/projects/:id/remove-member` | Admin | `{ userId }` | `200` — `{ project }` |

### Tasks (Token required)

| Method | Endpoint | Access | Body | Response |
|--------|----------|--------|------|----------|
| `GET` | `/api/tasks` | All | `?projectId=` | `200` — `[Task]` |
| `POST` | `/api/tasks` | Admin | task payload | `201` — `{ task }` |
| `PATCH` | `/api/tasks/:id` | All* | `{ status }` or full | `200` — `{ task }` |
| `DELETE` | `/api/tasks/:id` | Admin | — | `204` |

> *Members can only update `status` on their assigned tasks.

### Dashboard (Token required)

| Method | Endpoint | Response |
|--------|----------|----------|
| `GET` | `/api/dashboard` | `{ totalTasks, completed, pending, overdue }` |

### Health Check

| Method | Endpoint | Response |
|--------|----------|----------|
| `GET` | `/health` | `{ status: 'ok' }` |

---

## 🔐 Authentication & Authorization

### JWT Flow
1. User logs in → server signs JWT with `{ id }` payload
2. Client stores token in `localStorage`
3. Axios interceptor attaches `Authorization: Bearer <token>` to all requests
4. `protect` middleware verifies token → attaches `req.user`
5. `adminOnly` middleware checks `req.user.role === 'admin'`

### Role Permissions

| Action | Admin | Member |
|--------|:-----:|:------:|
| Create project | ✅ | ❌ |
| Add/remove members | ✅ | ❌ |
| Create task | ✅ | ❌ |
| Delete task | ✅ | ❌ |
| Update any task field | ✅ | ❌ |
| Update own task status | ✅ | ✅ |
| View dashboard | ✅ | ✅ (own tasks) |
| View projects | ✅ (all) | ✅ (assigned) |

---

## 💾 Database Schema

### User
```js
{
  name: String (required),
  email: String (required, unique),
  password: String (required, bcrypt hashed),
  role: "admin" | "member" (default: "member"),
  timestamps: true
}
```

### Project
```js
{
  name: String (required),
  admin: ObjectId → User (required),
  members: [ObjectId → User],
  timestamps: true
}
```

### Task
```js
{
  title: String (required),
  description: String,
  dueDate: Date,
  priority: "low" | "medium" | "high" (default: "medium"),
  status: "todo" | "in-progress" | "done" (default: "todo"),
  assignedTo: ObjectId → User,
  projectId: ObjectId → Project (required),
  timestamps: true
}
```

---

## ☁️ Deployment (Railway)

### Backend
1. Push code to GitHub
2. Create Railway project → connect repo
3. Set root directory to `backend`
4. Add environment variables (see below)
5. Railway auto-detects Node.js, runs `npm install` then `npm start`

### Frontend
1. Add new service → Static Site
2. Set root directory to `frontend`
3. Build command: `npm install && npm run build`
4. Publish directory: `dist`
5. Set `VITE_API_URL` to your backend Railway URL

### Common Deployment Issues

| Issue | Cause | Fix |
|-------|-------|-----|
| CORS error | Missing `cors()` or wrong origin | Backend uses `cors()` — ensure frontend URL matches |
| MongoDB timeout | `MONGO_URI` not set or IP not whitelisted | Whitelist `0.0.0.0/0` in Atlas (dev) or add Railway IPs |
| 401 on all routes | JWT secret mismatch | Ensure same `JWT_SECRET` in Railway env vars |
| Build fails | Missing deps | Verify `package.json` has all dependencies |

---

## 🔑 Environment Variables

### Backend (`backend/.env`)
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/taskmanager
JWT_SECRET=your_jwt_secret_here
```

### Frontend (`frontend/.env`)
```env
VITE_API_URL=http://localhost:5000/api
```

---

## 🧪 Testing

```bash
# Backend unit/integration tests
cd backend && npm test

# Frontend build verification
cd frontend && npm run build
```

### Key Test Cases
- ✅ Signup with duplicate email → `400`
- ✅ Login with wrong password → `401`
- ✅ Member creates task → `403`
- ✅ Member updates own task status → `200`
- ✅ Member deletes task → `403`
- ✅ Invalid/expired JWT → `401`
- ✅ Unassigned task update by member → `403`

---

## 🎤 Interview Preparation

| Question | Answer |
|----------|--------|
| **Why JWT over sessions?** | Stateless — scales horizontally across Railway containers without sticky sessions. |
| **How does RBAC work?** | JWT payload contains user ID. `protect` middleware fetches user (with role) from DB. `adminOnly` checks `req.user.role`. Frontend uses `<ProtectedRoute>` to hide unauthorized UI. |
| **DB relationships?** | User ↔ Project via `members[]`. Project ↔ Task via `projectId`. User ↔ Task via `assignedTo`. All use MongoDB ObjectId references. |
| **How do you handle deployment?** | Monorepo with `/backend` and `/frontend`. Railway deploys each as separate service. Env vars injected via Railway dashboard. |
| **Edge cases handled?** | Duplicate email (409), null `assignedTo` check, token expiry, double-response prevention in middleware, global error handler. |
| **What would you change at scale?** | Redis caching, microservices, PostgreSQL for strict relations, Socket.io for real-time, rate limiting, message queues. |
| **Security measures?** | Bcrypt password hashing, JWT expiration, role middleware, CORS, input validation, `.env` secrets (never in Git). |

---

## 📄 License

MIT — free to use, modify, and distribute.

---

**Built with ❤️ for fast, focused team collaboration.**

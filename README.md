# 🧠 DailyHabitz

**DailyHabitz** is a full-stack habit tracker app that allows users to create, track, and visualize their daily habits. Built using **Next.js 15 (App Router)**, **TypeScript**, **Tailwind CSS**, **MongoDB**, and **Auth.js (GitHub OAuth)**, this app provides a clean, responsive, and personalized dashboard to stay consistent with your goals.

---

## 🚀 Features

- ✅ **User Authentication** via GitHub (powered by Auth.js)
- 📅 **Streak Calendar** to track completion dates
- ➕ **Create, edit, delete habits**
- 👤 **User-specific dashboards**
- 🎯 **Progress visualization** using date-fns
- ⚙️ Full-stack with Express & MongoDB (Mongoose)
- 📱 Responsive and clean UI (Tailwind CSS + Shadcn UI)

---

## 🧱 Tech Stack

### Frontend
- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS
- Auth.js (GitHub Provider)
- date-fns

### Backend
- Node.js + Express.js
- MongoDB (via Mongoose)
- REST API
- CORS, dotenv, nodemon, body-parser

---

## 🗂️ Folder Structure

```
/frontend
  /src
    /app
      /dashboard          # Habit Dashboard (UI)
      /api/auth           # NextAuth route
    /components           # Reusable components (HabitForm, HabitList, etc.)
    /lib                  # API handlers
    /types                # TypeScript interfaces

/backend
  /controllers            # Logic for Habit routes
  /models                 # Mongoose Models
  /routes                 # Express routes
  db.js                   # MongoDB Connection
  index.js                # Express App Entry
```

---

## 🔐 Authentication

- Auth.js GitHub Provider
- Protects routes via `useSession()` and `getServerSession`

---

## 🌐 Deployment

- **Frontend:** [Vercel](https://vercel.com/)
- **Backend:** [Render](https://render.com/)
- **Database:** [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)

Ensure IP whitelisting for Render deployment in MongoDB Atlas.

---

## ⚙️ Local Development

### 1. Clone the repo

```bash
git clone https://github.com/Ykadam006/DailyHabitz.git
cd DailyHabitz
```

### 2. Set up `.env` files

#### Frontend (`frontend/.env.local`)
```
NEXTAUTH_SECRET=your_secret
NEXTAUTH_URL=http://localhost:3000
GITHUB_ID=your_github_oauth_client_id
GITHUB_SECRET=your_github_oauth_client_secret
```

#### Backend (`backend/.env`)
```
PORT=5000
MONGODB_URI=your_mongo_connection_string
```

### 3. Install dependencies

```bash
cd frontend && npm install
cd ../backend && npm install
```

### 4. Run locally

```bash
# In /backend
npm run dev

# In /frontend
npm run dev
```

---

## 🧪 Future Improvements

- Notifications/reminders
- Analytics & charts
- Mobile-friendly enhancements
- Offline support (PWA)
- AI habit suggestions

---

## 👤 Author

[Yogesh Kadam](https://github.com/Ykadam006)  
✉️ Email: ykadam1@hawk.iit.edu

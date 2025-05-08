# 🌿 DailyHabitz - Full Stack Habit Tracker

DailyHabitz is a beautifully designed full-stack habit tracking app built using **Next.js**, **Node.js**, **Express**, and **MongoDB Atlas**. It allows users to create, manage, and track daily/weekly habits with a clean UI and streak tracking system.

---

## 🔗 Live Links

- **Frontend**: [https://dailyhabitz-1.onrender.com](https://dailyhabitz-1.onrender.com/)
- **Backend**: [https://dailyhabitz.onrender.com/habits](https://dailyhabitz.onrender.com/habits)

---

## 🧰 Tech Stack

| Layer     | Tech                          |
|-----------|-------------------------------|
| Frontend  | Next.js 15, Tailwind CSS      |
| Backend   | Node.js, Express              |
| Database  | MongoDB Atlas                 |
| Deployment| Render (Frontend), Render (Backend) |

---

## 📁 Project Structure

```
DailyHabitz/
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── db.js
│   └── index.js
├── frontend/
│   ├── app/
│   ├── components/
│   ├── lib/
│   └── styles/
```

---

## 🚀 Getting Started

### Backend

```bash
cd backend
npm install
# Add .env file with MONGO_URI
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

---

## 🌐 API Endpoints

Base URL: `https://dailyhabitz.onrender.com/habits`

| Method | Endpoint         | Description           |
|--------|------------------|-----------------------|
| GET    | /?userId=123     | Get all habits        |
| POST   | /                | Create new habit      |
| POST   | /:id/done        | Mark habit as done    |
| PUT    | /:id             | Update habit          |
| DELETE | /:id             | Delete habit          |

---

## 🎨 Features

- 📝 Add / Edit / Delete Habits
- 🔁 Daily & Weekly Frequency
- 📅 Track Completions with Date
- ⚡ XP & Streak System
- ☁️ Full Deployment (Vercel + Render)
- 🎨 Beautiful UI with Tailwind

---

## 📸 UI Previews

Include screenshots in `/screenshots` folder or update paths:
- Home Page
- Dashboard
- Add/Edit Habit
- Mark as Done

---

## 👨‍💻 Author

Made with ❤️ by **Yogesh Kadam**  
GitHub: [Ykadam006](https://github.com/Ykadam006)  
Email: ykadam1@hawk.iit.edu


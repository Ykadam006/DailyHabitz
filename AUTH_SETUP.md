# Auth Setup & Verification

## 0) .env format — one variable per line

Each env var must be on its **own line**. Never merge lines like:
```env
# ❌ INVALID
JWT_SECRET=...CORS_ORIGIN=http://localhost:3000
```

---

## 1) Backend `backend/.env`

```env
MONGO_URI=your_mongodb_atlas_uri
PORT=5050
CORS_ORIGIN=http://localhost:3000
```

Sessions stored in MongoDB only (no JWT). Multiple origins: `CORS_ORIGIN=http://localhost:3000,https://dailyhabitz.vercel.app`

---

## 2) Frontend `frontend/.env` or `frontend/.env.local`

```env
NEXT_PUBLIC_API_URL=http://localhost:5050
NEXTAUTH_SECRET=random-32-char-string
NEXTAUTH_URL=http://localhost:3000
```

For production, set `NEXT_PUBLIC_API_URL` and `NEXTAUTH_URL` to your deployed URLs.

Generate secrets: `openssl rand -base64 32`

---

## 3) File locations (Phase F)

### Backend
| File | Path |
|------|------|
| User model | `backend/models/User.js` |
| Auth routes | `backend/routes/auth.js` |
| Auth middleware | `backend/middleware/auth.js` |
| Auth controller | `backend/controllers/authController.js` |
| Habits routes | `backend/routes/habits.js` |

### Frontend
| File | Path |
|------|------|
| NextAuth route | `frontend/src/app/api/auth/[...nextauth]/route.ts` |
| Auth config | `frontend/src/lib/auth.ts` |
| Login page | `frontend/src/app/login/page.tsx` |
| Signup page | `frontend/src/app/signup/page.tsx` |
| API client | `frontend/src/lib/api.ts` |
| Dashboard guard | `frontend/src/components/DashboardGuard.tsx` |

---

## 4) Verification checklist

### Step 1 — Backend

```bash
cd backend
npm i
npm run dev
```

**Register:**
```bash
curl -X POST http://localhost:5050/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123"}'
```

**Login:**
```bash
curl -X POST http://localhost:5050/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

✅ Login should return `{ "token": "...", "user": { "id": "...", "email": "...", "name": "..." } }`

### Step 2 — Frontend

```bash
cd frontend
npm i
npm run dev
```

1. Go to `http://localhost:3000/signup` → create user
2. Go to `http://localhost:3000/login` → sign in
3. Go to `http://localhost:3000/dashboard`
4. DevTools → Network → check `/habits` requests have `Authorization: Bearer <token>`

### Step 3 — Quick search (confirm wiring)

```bash
# Backend
rg "JWT_SECRET|Bearer|req\.user|/auth/login" backend

# Frontend
rg "Authorization|backendToken|useSession" frontend/src
```

---

## 5) Common issues

| Symptom | Check |
|---------|-------|
| CORS error | `CORS_ORIGIN` in backend `.env` matches frontend origin |
| 401 on /habits | Token in `Authorization: Bearer <token>`, session valid in MongoDB |
| NextAuth redirect loop | `NEXTAUTH_URL` and `NEXTAUTH_SECRET` set in frontend `.env` |
| Login works, habits 401 | `backendToken` in session; API client uses it in headers |

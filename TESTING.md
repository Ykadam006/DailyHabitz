# Testing

## Backend tests

Requires MongoDB. Use either:

1. **MongoMemoryServer** (default): First run downloads MongoDB binaries (needs network). Uses `backend/.tmp/mongodb-binaries`.
2. **Local MongoDB**: `MONGO_URI=mongodb://localhost:27017/dailyhabitz_test npm test`

```bash
cd backend
npm test
```

### Test coverage

- **Auth middleware**: rejects missing/invalid token, accepts valid token
- **Create habit**: creates with valid token, rejects without title
- **Mark done idempotent**: marking done twice for same day does not duplicate or double XP
- **Ownership 403**: returns 403 when accessing/updating/deleting another user's habit

---

## Frontend E2E (Playwright)

Requires **backend + MongoDB** running. The E2E starts the frontend automatically.

### Run E2E

```bash
# Terminal 1: Start backend
cd backend && npm run dev

# Terminal 2: Run E2E (starts frontend)
cd frontend && npm run e2e
```

### Install Playwright browsers (first time)

```bash
cd frontend && npx playwright install chromium
```

### E2E flow

Signup → Login → Create habit → Mark done → Verify streak + XP → Delete habit

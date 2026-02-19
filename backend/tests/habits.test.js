const request = require("supertest");
const User = require("../models/User");
const Session = require("../models/Session");
const Habit = require("../models/Habit");

let app;
beforeAll(() => {
  app = require("../app");
});

async function createUserAndToken(email = "user@test.com", name = "Test") {
  const user = await User.create({
    email,
    password: "password123",
    name,
  });
  const token = await Session.createForUser(user._id);
  return { user, token };
}

describe("Create habit", () => {
  it("creates a habit with valid token", async () => {
    const { token } = await createUserAndToken();

    const res = await request(app)
      .post("/habits")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Daily Run",
        frequency: "daily",
      })
      .expect(201);

    expect(res.body).toMatchObject({
      title: "Daily Run",
      frequency: "daily",
      currentStreak: 0,
      xp: 0,
    });
    expect(res.body._id).toBeDefined();
    expect(Array.isArray(res.body.completedDates)).toBe(true);
    expect(res.body.completedDates).toHaveLength(0);
  });

  it("rejects habit without title", async () => {
    const { token } = await createUserAndToken();

    await request(app)
      .post("/habits")
      .set("Authorization", `Bearer ${token}`)
      .send({ frequency: "daily" })
      .expect(400);
  });
});

describe("Mark done idempotent", () => {
  it("marking done twice for same day does not duplicate or double XP", async () => {
    const { user, token } = await createUserAndToken();
    const habit = await Habit.create({
      title: "Meditate",
      frequency: "daily",
      userId: user._id.toString(),
      completedDates: [],
      currentStreak: 0,
      xp: 0,
    });

    const today = new Date()
      .toISOString()
      .slice(0, 10);

    const res1 = await request(app)
      .post(`/habits/${habit._id}/done`)
      .set("Authorization", `Bearer ${token}`)
      .query({ date: today })
      .expect(200);

    expect(res1.body.xp).toBe(10);
    expect(res1.body.currentStreak).toBe(1);
    expect(res1.body.completedDates).toContain(today);

    const res2 = await request(app)
      .post(`/habits/${habit._id}/done`)
      .set("Authorization", `Bearer ${token}`)
      .query({ date: today })
      .expect(200);

    expect(res2.body.xp).toBe(10);
    expect(res2.body.currentStreak).toBe(1);
    expect(res2.body.completedDates).toHaveLength(1);
    expect(res2.body.completedDates).toContain(today);
  });
});

describe("Ownership check returns 403", () => {
  it("returns 403 when accessing another user's habit", async () => {
    const { user: user1, token: token1 } = await createUserAndToken("user1@test.com");
    const { user: user2, token: token2 } = await createUserAndToken("user2@test.com");

    const habit = await Habit.create({
      title: "User1 Habit",
      frequency: "daily",
      userId: user1._id.toString(),
      completedDates: [],
      currentStreak: 0,
      xp: 0,
    });

    await request(app)
      .post(`/habits/${habit._id}/done`)
      .set("Authorization", `Bearer ${token2}`)
      .expect(403);
  });

  it("returns 403 when updating another user's habit", async () => {
    const { user: user1, token: token1 } = await createUserAndToken("user1@test.com");
    const { user: user2, token: token2 } = await createUserAndToken("user2@test.com");

    const habit = await Habit.create({
      title: "User1 Habit",
      frequency: "daily",
      userId: user1._id.toString(),
      completedDates: [],
      currentStreak: 0,
      xp: 0,
    });

    await request(app)
      .put(`/habits/${habit._id}`)
      .set("Authorization", `Bearer ${token2}`)
      .send({ title: "Hacked" })
      .expect(403);
  });

  it("returns 403 when deleting another user's habit", async () => {
    const { user: user1 } = await createUserAndToken("user1@test.com");
    const { token: token2 } = await createUserAndToken("user2@test.com");

    const habit = await Habit.create({
      title: "User1 Habit",
      frequency: "daily",
      userId: user1._id.toString(),
      completedDates: [],
      currentStreak: 0,
      xp: 0,
    });

    await request(app)
      .delete(`/habits/${habit._id}`)
      .set("Authorization", `Bearer ${token2}`)
      .expect(403);
  });
});

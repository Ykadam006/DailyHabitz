const request = require("supertest");
const mongoose = require("mongoose");
const User = require("../models/User");
const Session = require("../models/Session");
const Habit = require("../models/Habit");

// Import app after mongoose is connected (setup runs first)
let app;
beforeAll(() => {
  app = require("../app");
});

describe("Auth middleware", () => {
  it("rejects missing token with 401", async () => {
    const res = await request(app)
      .get("/habits")
      .expect(401);
    expect(res.body.error).toMatch(/authentication required/i);
  });

  it("rejects invalid token with 401", async () => {
    const res = await request(app)
      .get("/habits")
      .set("Authorization", "Bearer invalid-token-123")
      .expect(401);
    expect(res.body.error).toMatch(/invalid|expired|session/i);
  });

  it("rejects malformed Authorization header with 401", async () => {
    const res = await request(app)
      .get("/habits")
      .set("Authorization", "Basic abc123")
      .expect(401);
    expect(res.body.error).toMatch(/authentication required/i);
  });

  it("accepts valid token and returns data", async () => {
    const user = await User.create({
      email: "test@example.com",
      password: "password123",
      name: "Test User",
    });
    const token = await Session.createForUser(user._id);

    const res = await request(app)
      .get("/habits")
      .set("Authorization", `Bearer ${token}`)
      .expect(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body).toHaveLength(0);
  });
});

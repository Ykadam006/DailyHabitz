const Habit = require("../models/Habit");
const { logErrorWithReq } = require("../lib/logger");

exports.createHabit = async (req, res) => {
  const { title, frequency, notes, category, goal, reminderTime } = req.body;
  const userId = req.user.id;
  try {
    const habit = new Habit({
      title,
      frequency: frequency || "daily",
      notes,
      category: category || null,
      goal: goal != null && typeof goal === "number" ? goal : null,
      reminderTime: reminderTime || null,
      userId,
      currentStreak: 0,
      xp: 0,
      completedDates: [],
    });
    await habit.save();
    res.status(201).json(habit);
  } catch (err) {
    logErrorWithReq(err, req);
    res.status(500).json({ error: "Failed to create habit" });
  }
};

function normalizeHabitForResponse(habit) {
  const h = habit.toObject ? habit.toObject() : { ...habit };
  if (Array.isArray(h.completedDates)) {
    h.completedDates = h.completedDates.map(toDayKey);
  }
  return h;
}

exports.getHabits = async (req, res) => {
  const userId = req.user.id;
  try {
    const habits = await Habit.find({ userId });
    res.status(200).json(habits.map(normalizeHabitForResponse));
  } catch (err) {
    logErrorWithReq(err, req);
    res.status(500).json({ error: "Failed to fetch habits" });
  }
};

/** Normalize to YYYY-MM-DD (day key) for consistent comparison */
function toDayKey(d) {
  if (typeof d === "string" && /^\d{4}-\d{2}-\d{2}$/.test(d)) return d;
  return new Date(d).toISOString().slice(0, 10);
}

function getConsecutiveStreak(completedDates, upToDate) {
  const dateSet = new Set(completedDates.map(toDayKey));
  let streak = 0;
  const check = new Date(upToDate);
  const getKey = (d) =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  while (dateSet.has(getKey(check))) {
    streak++;
    check.setDate(check.getDate() - 1);
  }
  return streak;
}

const DAY_KEY_REGEX = /^\d{4}-\d{2}-\d{2}$/;

function getTodayKey() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

/** Validate YYYY-MM-DD day key. Returns normalized key or null if invalid. */
function parseDayKey(input) {
  if (typeof input !== "string") return null;
  const trimmed = input.trim();
  if (!DAY_KEY_REGEX.test(trimmed)) return null;
  return trimmed;
}

/**
 * Mark habit done for a given day. Idempotent: if already done for that day, returns existing habit (no duplicate, no double XP).
 * Accepts optional ?date=YYYY-MM-DD or body.date for user's local timezone; otherwise uses server date.
 */
exports.markHabitDone = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;
  const dateParam = req.query?.date || req.body?.date;
  const dayKey = parseDayKey(dateParam) || getTodayKey();

  try {
    const habit = await Habit.findById(id);
    if (!habit) return res.status(404).json({ error: "Habit not found" });
    if (habit.userId !== userId) return res.status(403).json({ error: "Forbidden" });

    const normalizedDates = (habit.completedDates || []).map(toDayKey);
    if (normalizedDates.includes(dayKey)) {
      return res.status(200).json(normalizeHabitForResponse(habit));
    }

    normalizedDates.push(dayKey);
    normalizedDates.sort();
    habit.completedDates = [...new Set(normalizedDates)].sort();
    const [y, m, d] = dayKey.split("-").map(Number);
    const upToDate = new Date(y, m - 1, d);
    habit.currentStreak = getConsecutiveStreak(habit.completedDates, upToDate);
    habit.xp += 10;

    await habit.save();
    res.status(200).json(normalizeHabitForResponse(habit));
  } catch (err) {
    logErrorWithReq(err, req);
    res.status(500).json({ error: "Failed to mark habit done" });
  }
};

const ALLOWED_UPDATE_FIELDS = ["title", "frequency", "notes", "category", "goal", "reminderTime"];

exports.updateHabit = async (req, res) => {
  const userId = req.user.id;
  const updates = {};
  for (const key of ALLOWED_UPDATE_FIELDS) {
    if (req.body[key] !== undefined) updates[key] = req.body[key];
  }
  if (Object.keys(updates).length === 0) {
    return res.status(400).json({ error: "No valid fields to update" });
  }
  try {
    const habit = await Habit.findById(req.params.id);
    if (!habit) return res.status(404).json({ error: "Habit not found" });
    if (habit.userId !== userId) return res.status(403).json({ error: "Forbidden" });
    const updated = await Habit.findByIdAndUpdate(req.params.id, updates, { new: true });
    res.status(200).json(normalizeHabitForResponse(updated));
  } catch (err) {
    logErrorWithReq(err, req);
    res.status(500).json({ error: "Failed to update habit" });
  }
};

exports.deleteHabit = async (req, res) => {
  const userId = req.user.id;
  try {
    const habit = await Habit.findById(req.params.id);
    if (!habit) return res.status(404).json({ error: "Habit not found" });
    if (habit.userId !== userId) return res.status(403).json({ error: "Forbidden" });
    await Habit.findByIdAndDelete(req.params.id);
    res.status(204).end();
  } catch (err) {
    logErrorWithReq(err, req);
    res.status(500).json({ error: "Failed to delete habit" });
  }
};

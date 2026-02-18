const Habit = require("../models/Habit");

exports.createHabit = async (req, res) => {
  const { title, frequency, notes, userId } = req.body;
  if (!title || !userId) {
    return res.status(400).json({ error: "Title and userId are required" });
  }
  try {
    const habit = new Habit({
      title,
      frequency,
      notes,
      userId,
      currentStreak: 0,
      xp: 0,
      completedDates: [],
    });
    await habit.save();
    res.status(201).json(habit);
  } catch (err) {
    res.status(500).json({ error: "Failed to create habit" });
  }
};

exports.getHabits = async (req, res) => {
  const { userId } = req.query;
  if (!userId) {
    return res.status(400).json({ error: "userId is required" });
  }
  try {
    const habits = await Habit.find({ userId });
    res.status(200).json(habits);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch habits" });
  }
};

function getConsecutiveStreak(completedDates, upToDate) {
  const dateSet = new Set(
    completedDates.map((d) => new Date(d).toDateString())
  );
  let streak = 0;
  const check = new Date(upToDate);
  check.setHours(0, 0, 0, 0);
  while (dateSet.has(check.toDateString())) {
    streak++;
    check.setDate(check.getDate() - 1);
  }
  return streak;
}

exports.markHabitDone = async (req, res) => {
  const { id } = req.params;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  try {
    const habit = await Habit.findById(id);
    if (!habit) return res.status(404).json({ error: "Habit not found" });

    const alreadyMarked = habit.completedDates.some(
      (date) => new Date(date).setHours(0, 0, 0, 0) === today.getTime()
    );

    if (alreadyMarked) {
      return res.status(400).json({ error: "Already marked for today" });
    }

    habit.completedDates.push(today);
    habit.completedDates.sort((a, b) => new Date(a) - new Date(b));
    habit.currentStreak = getConsecutiveStreak(habit.completedDates, today);
    habit.xp += 10;

    await habit.save();
    res.status(200).json(habit);
  } catch (err) {
    console.error("Error marking done:", err);
    res.status(500).json({ error: "Failed to mark habit done" });
  }
};

const ALLOWED_UPDATE_FIELDS = ["title", "frequency", "notes"];

exports.updateHabit = async (req, res) => {
  const updates = {};
  for (const key of ALLOWED_UPDATE_FIELDS) {
    if (req.body[key] !== undefined) updates[key] = req.body[key];
  }
  if (Object.keys(updates).length === 0) {
    return res.status(400).json({ error: "No valid fields to update" });
  }
  try {
    const updated = await Habit.findByIdAndUpdate(req.params.id, updates, { new: true });
    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ error: "Failed to update habit" });
  }
};

exports.deleteHabit = async (req, res) => {
  try {
    await Habit.findByIdAndDelete(req.params.id);
    res.status(204).end();
  } catch (err) {
    res.status(500).json({ error: "Failed to delete habit" });
  }
};

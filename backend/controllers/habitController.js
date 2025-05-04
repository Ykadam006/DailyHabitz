const Habit = require("../models/Habit");

exports.createHabit = async (req, res) => {
  const { title, frequency, notes, userId } = req.body;
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
  try {
    const { userId } = req.query;
    const habits = await Habit.find({ userId });
    res.status(200).json(habits);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch habits" });
  }
};

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
    habit.currentStreak += 1;
    habit.xp += 10;

    await habit.save();
    res.status(200).json(habit);
  } catch (err) {
    console.error("Error marking done:", err);
    res.status(500).json({ error: "Failed to mark habit done" });
  }
};

exports.updateHabit = async (req, res) => {
  try {
    const updated = await Habit.findByIdAndUpdate(req.params.id, req.body, { new: true });
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

const express = require("express");
const router = express.Router();
const {
  createHabit,
  getHabits,
  markHabitDone,
  deleteHabit,
  updateHabit,
} = require("../controllers/habitController");

// POST /habits → create a new habit
router.post("/", createHabit);

// GET /habits → fetch all habits
router.get("/", getHabits);

// PUT /habits/:id/done → mark a habit as done
router.put("/:id/done", markHabitDone);

// PUT /habits/:id → update title/frequency/notes
router.put("/:id", updateHabit);

// DELETE /habits/:id → delete a habit
router.delete("/:id", deleteHabit);

module.exports = router;

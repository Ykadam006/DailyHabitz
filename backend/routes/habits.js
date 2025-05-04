// /backend/routes/habits.js
const express = require("express");
const router = express.Router();
const habitController = require("../controllers/habitController");

// CREATE
router.post("/", habitController.createHabit);

// GET user habits
router.get("/", habitController.getHabits);

// MARK DONE
router.post("/:id/done", habitController.markHabitDone);

// UPDATE
router.put("/:id", habitController.updateHabit);

// DELETE
router.delete("/:id", habitController.deleteHabit);

module.exports = router;
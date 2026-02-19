const express = require("express");
const router = express.Router();
const habitController = require("../controllers/habitController");
const { authMiddleware } = require("../middleware/auth");
const {
  createHabitValidator,
  updateHabitValidator,
  mongoIdParam,
  handleValidation,
} = require("../middleware/validateHabit");

router.use(authMiddleware);

router.post("/", createHabitValidator, handleValidation, habitController.createHabit);
router.get("/", habitController.getHabits);
router.post("/:id/done", mongoIdParam, handleValidation, habitController.markHabitDone);
router.put("/:id", updateHabitValidator, handleValidation, habitController.updateHabit);
router.delete("/:id", mongoIdParam, handleValidation, habitController.deleteHabit);

module.exports = router;
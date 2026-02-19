const { body, param, validationResult } = require("express-validator");

const handleValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const msg = errors.array().map((e) => e.msg).join("; ") || "Validation failed";
    return res.status(400).json({ error: msg });
  }
  next();
};

const createHabitValidator = [
  body("title").trim().notEmpty().withMessage("Title is required").isLength({ max: 100 }).withMessage("Title too long"),
  body("frequency").optional().isIn(["daily", "weekly"]).withMessage("Frequency must be daily or weekly"),
  body("notes").optional().trim().isLength({ max: 500 }),
  body("category").optional().trim().isLength({ max: 50 }),
  body("goal").optional().isInt({ min: 1, max: 7 }).withMessage("Goal must be 1-7"),
  body("reminderTime").optional().trim().isLength({ max: 10 }),
];

const updateHabitValidator = [
  param("id").isMongoId().withMessage("Invalid habit ID"),
  body("title").optional().trim().notEmpty().withMessage("Title cannot be empty").isLength({ max: 100 }),
  body("frequency").optional().isIn(["daily", "weekly"]),
  body("notes").optional().trim().isLength({ max: 500 }),
  body("category").optional().trim().isLength({ max: 50 }),
  body("goal").optional().isInt({ min: 1, max: 7 }),
  body("reminderTime").optional().trim().isLength({ max: 10 }),
];

const mongoIdParam = [param("id").isMongoId().withMessage("Invalid habit ID")];

module.exports = {
  handleValidation,
  createHabitValidator,
  updateHabitValidator,
  mongoIdParam,
};

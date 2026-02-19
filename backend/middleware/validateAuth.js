const { body, validationResult } = require("express-validator");

const handleValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const msg = errors.array().map((e) => e.msg).join("; ") || "Validation failed";
    return res.status(400).json({ error: msg });
  }
  next();
};

const loginValidator = [
  body("email").trim().isEmail().withMessage("Valid email is required"),
  body("password").notEmpty().withMessage("Password is required"),
];

const registerValidator = [
  body("email").trim().isEmail().withMessage("Valid email is required"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
  body("name").optional().trim().isLength({ max: 100 }).withMessage("Name too long"),
];

module.exports = {
  handleValidation,
  loginValidator,
  registerValidator,
};

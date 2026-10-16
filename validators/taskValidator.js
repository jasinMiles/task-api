
const { body, validationResult } = require("express-validator");

const allowedStatuses = [
  "pending",
  "in-progress",
  "completed"
];

// Rules for creating a task
const createTaskValidation = [
  body("title")
    .isString()
    .withMessage("Title must be text")
    .bail()
    .trim()
    .notEmpty()
    .withMessage("Task title is required"),

  body("description")
    .isString()
    .withMessage("Description must be text")
    .bail()
    .trim()
    .notEmpty()
    .withMessage("Task description is required"),

  body("status")
    .optional()
    .isIn(allowedStatuses)
    .withMessage(
      "Status must be pending, in-progress, or completed"
    )
];

// Rules for updating a task with PUT
const updateTaskValidation = [
  body("title")
    .isString()
    .withMessage("Title must be text")
    .bail()
    .trim()
    .notEmpty()
    .withMessage("Task title is required"),

  body("description")
    .isString()
    .withMessage("Description must be text")
    .bail()
    .trim()
    .notEmpty()
    .withMessage("Task description is required"),

  body("status")
    .isIn(allowedStatuses)
    .withMessage(
      "Status must be pending, in-progress, or completed"
    )
];

// Return validation errors before the route runs
const validateRequest = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: "Validation failed",
      errors: errors.array().map(error => ({
        field: error.path,
        message: error.msg
      }))
    });
  }

  next();
};

module.exports = {
  createTaskValidation,
  updateTaskValidation,
  validateRequest
};

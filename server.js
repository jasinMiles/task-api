require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const Task = require("./models/Task");
const authRoutes = require("./routes/authRoutes");
const authMiddleware = require("./middleware/authMiddleware");
const {
  createTaskValidation,
  updateTaskValidation,
  validateRequest
} = require("./validators/taskValidator");
const errorMiddleware = require("./middleware/errorMiddleware");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./swagger");

const app = express();

const PORT = process.env.PORT || 5000;

app.use(express.json());

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get("/health", (req, res) => {
  console.log("Health route reached");

  res.status(200).json({
    status: "OK"
  });
});
app.use("/api/auth", authRoutes);

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected successfully");
  })
  .catch((error) => {
    console.error("MongoDB connection failed:", error.message);
  });
// Routes


/**
 * @swagger
 * /api/tasks:
 *   post:
 *     summary: Create a task for the authenticated user
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *             properties:
 *               title:
 *                 type: string
 *                 example: Learn Express
 *               description:
 *                 type: string
 *                 example: Build a REST API
 *               status:
 *                 type: string
 *                 enum: [pending, in-progress, completed]
 *                 default: pending
 *     responses:
 *       201:
 *         description: Task created successfully
 *       401:
 *         description: Missing or invalid token
 */

app.post(
  "/api/tasks",
  authMiddleware,
  createTaskValidation,
  validateRequest,
  async (req, res, next) => {
    try {
      const task = await Task.create({
  title: req.body.title,
  description: req.body.description,
  status: req.body.status,
  user: req.user.userId
});

      res.status(201).json({
        message: "Task created successfully",
        task
      });
    } catch (error) {
      next(error);
    }
  }
);

app.get("/", (req, res) => {
  res.json({
    message: "Task API is running"
  });
});


/**
 * @swagger
 * /api/tasks:
 *   get:
 *     summary: Get tasks belonging to the authenticated user
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Tasks retrieved successfully
 *       401:
 *         description: Missing or invalid token
 */


// GET ALL TASKS
app.get("/api/tasks", authMiddleware, async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user.userId });
    res.status(200).json({
      count: tasks.length,
      tasks: tasks
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch tasks",
      error: error.message
    });
  }
});


/**
 * @swagger
 * /api/tasks/{id}:
 *   get:
 *     summary: Get one task owned by the authenticated user
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Task ID
 *     responses:
 *       200:
 *         description: Task retrieved successfully
 *       404:
 *         description: Task not found
 */


 // GET ONE TASK
app.get("/api/tasks/:id", authMiddleware, async (req, res, next) => {
  try {
    const task = await Task.findOne({
  _id: req.params.id,
  user: req.user.userId
});

    if (!task) {
      return res.status(404).json({
        message: "Task not found"
      });
    }

    res.status(200).json({
      task: task
    });
  } catch (error) {
  next(error);
}
});


/**
 * @swagger
 * /api/tasks/{id}:
 *   put:
 *     summary: Update a task owned by the authenticated user
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Task ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [pending, in-progress, completed]
 *     responses:
 *       200:
 *         description: Task updated successfully
 *       404:
 *         description: Task not found
 */


 // UPDATE TASK
app.put(
  "/api/tasks/:id",
  authMiddleware,
  updateTaskValidation,
  validateRequest,
  async (req, res, next) => {
    try {
      const task = await Task.findOneAndUpdate(
  {
    _id: req.params.id,
    user: req.user.userId
  },
  {
    title: req.body.title,
    description: req.body.description,
    status: req.body.status
  },
  {
    new: true,
    runValidators: true
  }
);

      if (!task) {
        return res.status(404).json({
          message: "Task not found"
        });
      }

      res.status(200).json({
        message: "Task updated successfully",
        task
      });
    } catch (error) {
      next(error);
    }
  }
);


/**
 * @swagger
 * /api/tasks/{id}:
 *   delete:
 *     summary: Delete a task owned by the authenticated user
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Task ID
 *     responses:
 *       200:
 *         description: Task deleted successfully
 *       404:
 *         description: Task not found
 */


 // DELETE TASK
app.delete("/api/tasks/:id", authMiddleware, async (req, res, next) => {
  try {
    const task = await Task.findOneAndDelete({
  _id: req.params.id,
  user: req.user.userId
});

    if (!task) {
      return res.status(404).json({
        message: "Task not found"
      });
    }

    res.status(200).json({
      message: "Task deleted successfully",
      task
    });
  } catch (error) {
    next(error);
  }
});


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
app.use(errorMiddleware);
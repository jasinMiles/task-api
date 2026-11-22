
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

// PORT configuration for Render and local development
const PORT = process.env.PORT || 5000;

// CORS configuration
const allowedOrigins = (
  process.env.CLIENT_URL || "http://localhost:5173"
)
  .split(",")
  .map((origin) => origin.trim());

app.use((req, res, next) => {
  const origin = req.headers.origin;

  if (
    !origin ||
    allowedOrigins.includes("*") ||
    allowedOrigins.includes(origin)
  ) {
    if (origin) {
      res.setHeader("Access-Control-Allow-Origin", origin);
    }
  }

  res.setHeader("Vary", "Origin");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,POST,PUT,DELETE,OPTIONS"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization"
  );

  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }

  next();
});

// Middleware
app.use(express.json());

// Swagger documentation
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec)
);

// Health check
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK"
  });
});

// Root route
app.get("/", (req, res) => {
  res.json({
    message: "Task API is running"
  });
});

// Authentication routes
app.use("/api/auth", authRoutes);

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected successfully");
  })
  .catch((error) => {
    console.error("MongoDB connection failed:", error.message);
  });


// CREATE TASK
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


// GET ALL TASKS
app.get("/api/tasks", authMiddleware, async (req, res, next) => {
  try {
    const tasks = await Task.find({
      user: req.user.userId
    });

    res.status(200).json({
      count: tasks.length,
      tasks
    });
  } catch (error) {
    next(error);
  }
});


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
      task
    });
  } catch (error) {
    next(error);
  }
});


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


// Error handling middleware (must come after routes)
app.use(errorMiddleware);


// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const Task = require("./models/Task");
const {
  createTaskValidation,
  updateTaskValidation,
  validateRequest
} = require("./validators/taskValidator");
const errorMiddleware = require("./middleware/errorMiddleware");

const app = express();

const PORT = process.env.PORT || 5000;

app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected successfully");
  })
  .catch((error) => {
    console.error("MongoDB connection failed:", error.message);
  });
// Routes

app.post(
  "/api/tasks",
  createTaskValidation,
  validateRequest,
  async (req, res, next) => {
    try {
      const task = await Task.create({
        title: req.body.title,
        description: req.body.description,
        status: req.body.status
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

// GET ALL TASKS
app.get("/api/tasks", async (req, res) => {
  try {
    const tasks = await Task.find();

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

 // GET ONE TASK
app.get("/api/tasks/:id", async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);

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



 // UPDATE TASK
app.put(
  "/api/tasks/:id",
  updateTaskValidation,
  validateRequest,
  async (req, res, next) => {
    try {
      const task = await Task.findByIdAndUpdate(
        req.params.id,
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
app.delete("/api/tasks/:id", async (req, res, next) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);

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
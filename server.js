const express = require("express");

const app = express();

const PORT = 5000;

let tasks = [
  {
    id: 1,
    title: "Learn Node.js"
  }
];

app.use(express.json());

// Routes

app.post("/api/tasks", (req, res) => {
  console.log(req.body);

  res.status(201).json({
    message: "Task created successfully",
    task: req.body
  });
});

app.get("/", (req, res) => {
  res.json({
    message: "Task API is running"
  });
});

app.get("/api/tasks", (req, res) => {
  res.json({
    message: "Here are all the tasks"
  });
});

app.get("/api/tasks/:id", (req, res) => {
  const id = Number(req.params.id);

  const task = tasks.find(task => task.id === id);

  if (!task) {
    return res.status(404).json({
      message: "Task not found"
    });
  }

  res.status(200).json({
    task: task
  });
});

app.put("/api/tasks/:id", (req, res) => {
  const id = Number(req.params.id);

  const task = tasks.find(task => task.id === id);

  if (!task) {
    return res.status(404).json({
      message: "Task not found"
    });
  }

  task.title = req.body.title;
  task.description = req.body.description;
  task.status = req.body.status;

  res.status(200).json({
    message: "Task updated successfully",
    task: task
  });
});

app.delete("/api/tasks/:id", (req, res) => {
  const id = Number(req.params.id);

  const taskIndex = tasks.findIndex(task => task.id === id);

  if (taskIndex === -1) {
    return res.status(404).json({
      message: "Task not found"
    });
  }

  const deletedTask = tasks.splice(taskIndex, 1);

  res.status(200).json({
    message: "Task deleted successfully",
    task: deletedTask[0]
  });
});


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
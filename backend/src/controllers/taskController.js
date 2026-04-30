import Task from "../models/Task.js";
import Project from "../models/Project.js";

// Create a task (Admin only)
export const createTask = async (req, res) => {
  try {
    const { title, description, assignedTo, projectId, dueDate } = req.body;

    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ message: "Project not found" });

    const task = await Task.create({
      title,
      description,
      assignedTo,
      project: projectId,
      dueDate,
    });

    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get tasks for a project
export const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ project: req.params.projectId })
      .populate("assignedTo", "name email")
      .populate("project", "name");
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update task status (Admin or assigned user)
export const updateTaskStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const task = await Task.findById(req.params.id);

    if (!task) return res.status(404).json({ message: "Task not found" });

    // Only Admin or the assigned user can update
    if (req.user.role !== "Admin" && task.assignedTo.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    task.status = status;
    await task.save();

    res.json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete a task
export const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) return res.status(404).json({ message: "Task not found" });

    // Only Admin can delete
    if (req.user.role !== "Admin") {
      return res.status(403).json({ message: "Only admins can delete tasks" });
    }

    await Task.findByIdAndDelete(req.params.id);

    res.json({ message: "Task deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

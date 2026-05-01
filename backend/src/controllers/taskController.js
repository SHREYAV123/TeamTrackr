import Task from "../models/Task.js";
import Project from "../models/Project.js";
import User from "../models/User.js";

// Create a task (Admin only)
export const createTask = async (req, res) => {
  try {
    const { title, description, assignedTo, projectId, dueDate } = req.body;

    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ message: "Project not found" });

    if (assignedTo) {
      const assignedUser = await User.findById(assignedTo);
      if (!assignedUser) return res.status(404).json({ message: "Assigned user not found" });
      if (!project.members.includes(assignedTo)) {
        return res.status(400).json({ message: "Assigned user must be a member of the project" });
      }
    }

    const task = await Task.create({
      title,
      description,
      assignedTo: assignedTo || undefined,
      project: projectId,
      dueDate,
    });

    await task.populate("assignedTo", "name email role").populate("project", "name");

    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get tasks for a project
export const getTasks = async (req, res) => {
  try {
    const query = { project: req.params.projectId };
    if (req.user.role !== "Admin") {
      query.assignedTo = req.user.id;
    }

    const tasks = await Task.find(query)
      .populate("assignedTo", "name email")
      .populate("project", "name");

    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get tasks assigned to the current user
export const getMyTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ assignedTo: req.user.id })
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
    const { status, dueDate } = req.body;
    const task = await Task.findById(req.params.id);

    if (!task) return res.status(404).json({ message: "Task not found" });

    // Only Admin or the assigned user can update
    if (req.user.role !== "Admin" && task.assignedTo.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    task.status = status;
    if (dueDate) task.dueDate = dueDate;
    if (status === "Completed") {
      task.completedAt = new Date();
    } else if (status !== "Completed" && task.completedAt) {
      task.completedAt = undefined; // Reset if not completed
    }
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

import Project from "../models/Project.js";
import Task from "../models/Task.js";
import User from "../models/User.js";

// Create a new project (Admin only)
export const createProject = async (req, res) => {
  try {
    const { name, description, members } = req.body;
    const memberIds = Array.isArray(members) ? members.filter(Boolean) : [];

    if (!memberIds.includes(req.user.id)) {
      memberIds.unshift(req.user.id);
    }

    const project = await Project.create({
      name,
      description,
      members: memberIds,
      createdBy: req.user.id,
    });

    await project.populate("members", "name email role");

    res.status(201).json(project);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all projects for the logged-in user
export const getProjects = async (req, res) => {
  try {
    const query = req.user.role === "Admin"
      ? { createdBy: req.user.id }
      : { members: req.user.id };

    const projects = await Project.find(query).populate("members", "name email role");
    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete a project and its tasks (Admin only)
export const deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: "Project not found" });

    if (project.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: "Only the project owner can delete this project" });
    }

    await Task.deleteMany({ project: req.params.id });
    await Project.findByIdAndDelete(req.params.id);

    res.json({ message: "Project deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Add a member to a project (Admin only)
export const addMember = async (req, res) => {
  try {
    const { userId } = req.body;
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: "Project not found" });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const existingIds = project.members.map((member) => member.toString());
    if (!existingIds.includes(userId)) {
      project.members.push(userId);
      await project.save();
    }

    res.json(project);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

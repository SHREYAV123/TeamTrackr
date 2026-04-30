import Project from "../models/Project.js";
import User from "../models/User.js";

// Create a new project (Admin only)
export const createProject = async (req, res) => {
  try {
    const { name, description } = req.body;
    const project = await Project.create({
      name,
      description,
      members: [req.user.id], // creator is automatically a member
    });
    res.status(201).json(project);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all projects for the logged-in user
export const getProjects = async (req, res) => {
  try {
    const projects = await Project.find({ members: req.user.id }).populate("members", "name email role");
    res.json(projects);
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

    if (!project.members.includes(userId)) {
      project.members.push(userId);
      await project.save();
    }

    res.json(project);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

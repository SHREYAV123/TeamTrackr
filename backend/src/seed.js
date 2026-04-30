import dotenv from "dotenv";
import mongoose from "mongoose";
import User from "./models/User.js";
import Project from "./models/Project.js";
import Task from "./models/Task.js";
import connectDB from "./config/db.js";

dotenv.config();

const seedData = async () => {
  try {
    // Connect DB
    await connectDB();

    // 🔥 RESET DATABASE (fixes duplicate index issue)
    await mongoose.connection.dropDatabase();

    console.log("🗑️ Database dropped");

    // Create Users
    const admin = await User.create({
      name: "Admin User",
      email: "admin@example.com",
      password: "admin123",
      role: "Admin",
    });

    const member = await User.create({
      name: "Member User",
      email: "member@example.com",
      password: "member123",
      role: "Member",
    });

    console.log("👤 Users created");

    // Create Project
    const project = await Project.create({
      name: "Website Redesign",
      description: "Revamp the company website with new UI/UX",
      members: [admin._id, member._id],
    });

    console.log("📁 Project created");

    // Create Tasks
    await Task.create([
      {
        title: "Design Homepage",
        description: "Create new homepage mockups",
        status: "Pending",
        assignedTo: member._id,
        project: project._id,
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
      {
        title: "Setup Backend",
        description: "Initialize Express server and MongoDB",
        status: "In Progress",
        assignedTo: admin._id,
        project: project._id,
        dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      },
    ]);

    console.log("✅ Tasks created");
    console.log("🎉 Dummy data inserted successfully!");

    process.exit();
  } catch (err) {
    console.error("❌ Error seeding data:", err.message);
    process.exit(1);
  }
};

seedData();
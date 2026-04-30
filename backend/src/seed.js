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
      name: "Shreya Kumar",
      email: "admin@example.com",
      password: "admin123",
      role: "Admin",
    });

    const member1 = await User.create({
      name: "Priya Singh",
      email: "member@example.com",
      password: "member123",
      role: "Member",
    });

    const member2 = await User.create({
      name: "Rajesh Patel",
      email: "rajesh@example.com",
      password: "rajesh123",
      role: "Member",
    });

    const member3 = await User.create({
      name: "Anjali Sharma",
      email: "anjali@example.com",
      password: "anjali123",
      role: "Member",
    });

    console.log("👤 Users created");

    // Create Projects
    const project1 = await Project.create({
      name: "Website Redesign",
      description: "Revamp the company website with new UI/UX design",
      members: [admin._id, member1._id, member2._id],
    });

    const project2 = await Project.create({
      name: "Mobile App Development",
      description: "Build a cross-platform mobile application",
      members: [admin._id, member3._id, member1._id],
    });

    const project3 = await Project.create({
      name: "Database Optimization",
      description: "Optimize and migrate database to improve performance",
      members: [admin._id, member2._id],
    });

    const project4 = await Project.create({
      name: "API Integration",
      description: "Integrate third-party APIs into the platform",
      members: [admin._id, member3._id],
    });

    console.log("📁 Projects created");

    // Create Tasks for Project 1
    await Task.create([
      {
        title: "Design Homepage",
        description: "Create new homepage mockups with Figma",
        status: "Completed",
        assignedTo: member1._id,
        project: project1._id,
        dueDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      },
      {
        title: "Setup Backend",
        description: "Initialize Express server and MongoDB connection",
        status: "In Progress",
        assignedTo: admin._id,
        project: project1._id,
        dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      },
      {
        title: "Create UI Components",
        description: "Build reusable React components for the website",
        status: "Pending",
        assignedTo: member2._id,
        project: project1._id,
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
      {
        title: "Setup CI/CD Pipeline",
        description: "Configure GitHub Actions for automated deployment",
        status: "Pending",
        assignedTo: admin._id,
        project: project1._id,
        dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
      },
    ]);

    // Create Tasks for Project 2
    await Task.create([
      {
        title: "Design Mobile UI",
        description: "Create app screens and user flows",
        status: "In Progress",
        assignedTo: member3._id,
        project: project2._id,
        dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
      },
      {
        title: "Setup React Native Project",
        description: "Initialize React Native project with necessary packages",
        status: "Completed",
        assignedTo: member1._id,
        project: project2._id,
        dueDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      },
      {
        title: "Implement Authentication",
        description: "Add login/signup functionality to mobile app",
        status: "Pending",
        assignedTo: admin._id,
        project: project2._id,
        dueDate: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000),
      },
    ]);

    // Create Tasks for Project 3
    await Task.create([
      {
        title: "Analyze Current Database",
        description: "Document current database schema and performance issues",
        status: "Completed",
        assignedTo: member2._id,
        project: project3._id,
        dueDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
      },
      {
        title: "Create Optimization Plan",
        description: "Design optimization strategy and migration plan",
        status: "In Progress",
        assignedTo: admin._id,
        project: project3._id,
        dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      },
      {
        title: "Execute Migration",
        description: "Perform database migration with zero downtime",
        status: "Pending",
        assignedTo: member2._id,
        project: project3._id,
        dueDate: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000),
      },
    ]);

    // Create Tasks for Project 4
    await Task.create([
      {
        title: "Integrate Payment Gateway",
        description: "Setup Stripe/PayPal integration",
        status: "In Progress",
        assignedTo: member3._id,
        project: project4._id,
        dueDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
      },
      {
        title: "Integrate Email Service",
        description: "Setup SendGrid for transactional emails",
        status: "Pending",
        assignedTo: admin._id,
        project: project4._id,
        dueDate: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000),
      },
    ]);

    console.log("✅ Tasks created");
    console.log("🎉 Dummy data inserted successfully!");
    console.log("\n📋 Seeded Data Summary:");
    console.log("   Users: 4 (1 Admin, 3 Members)");
    console.log("   Projects: 4");
    console.log("   Tasks: 13");

    process.exit();
  } catch (err) {
    console.error("❌ Error seeding data:", err.message);
    process.exit(1);
  }
};

seedData();
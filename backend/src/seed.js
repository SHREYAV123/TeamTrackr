import dotenv from "dotenv";
import mongoose from "mongoose";
import User from "./models/User.js";
import Project from "./models/Project.js";
import Task from "./models/Task.js";
import connectDB from "./config/db.js";

dotenv.config();

const seedData = async () => {
  try {
    await connectDB();
    await mongoose.connection.dropDatabase();
    console.log("🗑️ Database dropped");

    const admin = await User.create({
      name: "Shreya Sahu",
      email: "admin@example.com",
      password: "admin123",
      role: "Admin",
    });

    const member1 = await User.create({
      name: "Priya Singh",
      email: "member1@example.com",
      password: "member123",
      role: "Member",
    });

    const member2 = await User.create({
      name: "Rajesh Patel",
      email: "member2@example.com",
      password: "rajesh123",
      role: "Member",
    });

    const member3 = await User.create({
      name: "Anjali Sharma",
      email: "member3@example.com",
      password: "anjali123",
      role: "Member",
    });

    console.log("👤 Users created");

    const project1 = await Project.create({
      name: "Website Redesign",
      description: "Revamp the company website with a modern design and improved navigation.",
      members: [admin._id, member1._id, member2._id],
    });

    const project2 = await Project.create({
      name: "Mobile App Development",
      description: "Build a cross-platform mobile application for iOS and Android.",
      members: [admin._id, member3._id, member1._id],
    });

    const project3 = await Project.create({
      name: "Database Optimization",
      description: "Optimize the database schema and improve query performance.",
      members: [admin._id, member2._id],
    });

    const project4 = await Project.create({
      name: "API Integration",
      description: "Integrate external services and payment workflows into the platform.",
      members: [admin._id, member3._id],
    });

    console.log("📁 Projects created");

    await Task.create([
      {
        title: "Design Homepage",
        description: "Create homepage wireframes and final visual designs.",
        status: "Completed",
        assignedTo: member1._id,
        project: project1._id,
        dueDate: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
        completedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      },
      {
        title: "Setup Backend",
        description: "Configure the Express server, routes, and database connection.",
        status: "In Progress",
        assignedTo: admin._id,
        project: project1._id,
        dueDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
      },
      {
        title: "Create UI Components",
        description: "Build reusable components and layout for the redesign.",
        status: "Pending",
        assignedTo: member2._id,
        project: project1._id,
        dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
      },
      {
        title: "Implement CTA Animations",
        description: "Add hover and entrance animations for hero elements.",
        status: "Pending",
        assignedTo: member1._id,
        project: project1._id,
        dueDate: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000),
      },
      {
        title: "Design Mobile UI",
        description: "Create mobile app screens, icons, and navigation flows.",
        status: "In Progress",
        assignedTo: member3._id,
        project: project2._id,
        dueDate: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000),
      },
      {
        title: "Setup React Native Project",
        description: "Initialize the mobile project and install key packages.",
        status: "Completed",
        assignedTo: member1._id,
        project: project2._id,
        dueDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        completedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      },
      {
        title: "Implement Authentication",
        description: "Add login/signup flows and secure token handling.",
        status: "Pending",
        assignedTo: admin._id,
        project: project2._id,
        dueDate: new Date(Date.now() + 9 * 24 * 60 * 60 * 1000),
      },
      {
        title: "Build Chat Integration",
        description: "Add in-app messaging for team collaboration.",
        status: "Pending",
        assignedTo: member3._id,
        project: project2._id,
        dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      },
      {
        title: "Analyze Current Database",
        description: "Document schema, indexes, and slow queries.",
        status: "Completed",
        assignedTo: member2._id,
        project: project3._id,
        dueDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
        completedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      },
      {
        title: "Create Optimization Plan",
        description: "Draft the migration plan for indexes and caching.",
        status: "In Progress",
        assignedTo: admin._id,
        project: project3._id,
        dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      },
      {
        title: "Execute Migration",
        description: "Implement the database changes with zero downtime.",
        status: "Pending",
        assignedTo: member2._id,
        project: project3._id,
        dueDate: new Date(Date.now() + 13 * 24 * 60 * 60 * 1000),
      },
      {
        title: "Integrate Payment Gateway",
        description: "Add Stripe and PayPal checkout workflows.",
        status: "In Progress",
        assignedTo: member3._id,
        project: project4._id,
        dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
      },
      {
        title: "Integrate Email Service",
        description: "Configure transactional email notifications with SendGrid.",
        status: "Pending",
        assignedTo: admin._id,
        project: project4._id,
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
      {
        title: "Validate API Contracts",
        description: "Verify third-party API responses and error handling.",
        status: "Pending",
        assignedTo: member3._id,
        project: project4._id,
        dueDate: new Date(Date.now() + 9 * 24 * 60 * 60 * 1000),
      },
    ]);

    console.log("✅ Tasks created");
    console.log("🎉 Dummy data inserted successfully!");
    console.log("\n📋 Seeded Data Summary:");
    console.log("   Users: 4 (1 Admin, 3 Members)");
    console.log("   Projects: 4");
    console.log("   Tasks: 14");
  } catch (err) {
    console.error("❌ Error seeding data:", err.message);
    throw err;
  }
};

export default seedData;

if (import.meta.url === `file://${process.argv[1]}`) {
  seedData()
    .then(() => {
      console.log("✅ Seeding completed successfully");
      process.exit(0);
    })
    .catch((err) => {
      console.error("❌ Seeding failed:", err);
      process.exit(1);
    });
}

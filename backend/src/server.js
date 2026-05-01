import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import seedData from "./seed.js";
import authRoutes from "./routes/authRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";

dotenv.config();
await connectDB();

// Auto-seed database on server start (only in development)
if (process.env.NODE_ENV !== "production") {
  console.log("🌱 Seeding database...");
  try {
    await seedData();
    console.log("✅ Database seeded successfully");
  } catch (err) {
    console.error("❌ Database seeding failed:", err.message);
  }
}

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/v1/user", authRoutes);
app.use("/api/v1/projects", projectRoutes);
app.use("/api/v1/tasks", taskRoutes);

const PORT = process.env.PORT || 5000;
console.log("Server starting...");
console.log("MONGO_URI:", process.env.MONGO_URI);
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

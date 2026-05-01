import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import seedData from "./seed.js";
import User from "./models/User.js";
import authRoutes from "./routes/authRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";

dotenv.config();
await connectDB();

const shouldSeed = process.env.NODE_ENV !== "production" || process.env.FORCE_SEED === "true";
if (shouldSeed) {
  console.log("🌱 Resetting and seeding database on startup...");
  try {
    await seedData(true);
    console.log("✅ Database seeding completed");
  } catch (err) {
    console.error("❌ Database seeding failed:", err.message);
  }
} else {
  console.log("🔒 Production environment detected; startup seeding skipped.");
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

import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import seedData from "./seed.js";
import authRoutes from "./routes/authRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
import userRoutes from "./routes/userRoutes.js";

dotenv.config();
await connectDB();

const shouldSeed = process.env.NODE_ENV !== "production" || process.env.FORCE_SEED === "true";
if (shouldSeed) {
  await seedData(true);
}

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/v1/user", authRoutes);
app.use("/api/v1/projects", projectRoutes);
app.use("/api/v1/tasks", taskRoutes);
app.use("/api/v1/users", userRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {});

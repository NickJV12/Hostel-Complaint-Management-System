import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";
import { UserRouter } from "./routes/user.js";
import cron from "node-cron";
import complaintRoutes from "./routes/complaints.js";
import graphRoutes from "./routes/graph.js";
import adminComplaintRoutes from "./routes/admincomplaint.js";
import deleteInactiveUsers from "./utils/deleteInactiveUsers.js";

import adminRoutes from "./routes/admincomplaint.js";

dotenv.config();
const PORT = 8093;
const app = express();
// Schedule the task to run every day at midnight
cron.schedule("0 0 * * *", () => {
  console.log("Running scheduled task to delete inactive users...");
  deleteInactiveUsers();
});

//Middleware
app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:5173" , "https://hostel-complaint-management-system.netlify.app"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use(cookieParser());

// Connect to the hostelmanagement database
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to hostelmanagement database"))
  .catch((error) => console.error("Database connection error:", error));

// Set up routes
app.use("/auth", UserRouter);
app.use("/api", complaintRoutes);

app.use("/complaints", complaintRoutes);
app.use("/api", adminRoutes);
app.use("/admincomplaint", adminRoutes);

app.use("/admincomplaint", adminComplaintRoutes); // Admin-specific complaint routes
app.use("/complaints", graphRoutes);

app.get('/', (req, res) => {
  res.send('Backend is running 🚀');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

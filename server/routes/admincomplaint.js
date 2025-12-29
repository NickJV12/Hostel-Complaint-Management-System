import express from "express";
import Complaint from "../models/Complaint.js";

const router = express.Router();

// Fetch all complaints
// Fetch all complaints for the admin dashboard
// Admin: Get all complaints with optional filters
router.get("/all", async (req, res) => {
  const { status, category } = req.query;
  let filter = {};

  if (status) filter.status = status;
  if (category) filter.issueType = category;

  try {
    const complaints = await Complaint.find(filter);

    // Hide userId if complaint is anonymous
    const sanitizedComplaints = complaints.map((complaint) => {
      const obj = complaint.toObject();

      if (obj.isAnonymous) {
        obj.userId = "Anonymous";
        obj.userName = "Anonymous";
        obj.roomNumber = "Hidden";
      }

      return obj;
    });

    res.status(200).json(sanitizedComplaints);
  } catch (error) {
    console.error("Error fetching complaints:", error);
    res.status(500).json({ error: "Failed to fetch complaints" });
  }
});

// Update a complaint
router.put("/update/:id", async (req, res) => {
  const { id } = req.params;
  const { action } = req.body;
  try {
    const updatedComplaint = await Complaint.findByIdAndUpdate(
      id,
      { action },
      { new: true }
    );
    if (!updatedComplaint) {
      return res.status(404).json({ error: "Complaint not found" });
    }

    res.status(200).json(updatedComplaint);
  } catch (error) {
    console.error("Error updating complaint:", error);
    res.status(500).json({ message: "Error updating complaint" });
  }
});

export default router;

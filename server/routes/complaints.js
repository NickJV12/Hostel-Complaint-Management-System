import express from "express";
import nodemailer from "nodemailer";
import Complaint from "../models/Complaint.js";

const router = express.Router();

// Fetch all complaints with optional filters for the admin dashboard
router.get("/all", async (req, res) => {
  const { status, category } = req.query;
  const hostel = req.headers.hostel; // Fetch the hostel from the request header (sent by frontend)

  if (!hostel) {
    return res.status(400).json({ error: "Hostel not provided" });
  }

  let filter = { hostel }; // Filter by the logged-in hostel

  if (status) filter.status = status; // Filter by status if provided
  if (category) filter.issueType = category; // Filter by issue type if provided

  try {
    // Fetch complaints filtered by hostel and any other optional filters
    const complaints = await Complaint.find(filter);
    res.status(200).json(complaints);
  } catch (error) {
    console.error("Error fetching complaints:", error);
    res.status(500).json({ error: "Failed to fetch complaints" });
  }
});

// Update a complaint's status and admin response
// Update a complaint's status and send email
router.put("/update/:id", async (req, res) => {
  const { id } = req.params;
  const { status, adminResponse } = req.body;

  try {
    const complaint = await Complaint.findById(id);

    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    // Update complaint status and admin response
    complaint.status = status;
    complaint.adminResponse = adminResponse;
    complaint.updatedAt = Date.now();

    const updatedComplaint = await complaint.save();

    // Send update email for non-anonymous complaints
    if (!complaint.isAnonymous && complaint.email) {
      const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: complaint.email,
        subject: `Complaint Status updated: ${complaint.issueType}`,
        text: `Hello ${complaint.userName},\n\nYour complaint regarding "${complaint.issueType}" has been updated.\n\nNew status: ${status}\n\nAdmin Response: ${adminResponse}\n\nThank you,\nHostel Management`,
      };

      try {
        await transporter.sendMail(mailOptions);
      } catch (emailError) {
        console.error("Error sending email:", emailError);
        return res.status(500).json({
          message: "Complaint updated, but failed to send status update email",
        });
      }
    }

    // Send update email for anonymous complaints (if email is provided)
    if (complaint.isAnonymous && complaint.email) {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: complaint.email,
        subject: `Anonymous Complaint Status updated: ${complaint.issueType}`,
        text: `Hello,\n\nYour anonymous complaint regarding "${complaint.issueType}" has been updated.\n\nNew status: ${status}\n\nAdmin Response: ${adminResponse}\n\nThank you,\nHostel Management`,
      };

      try {
        await transporter.sendMail(mailOptions);
      } catch (emailError) {
        console.error("Error sending email:", emailError);
        return res.status(500).json({
          message:
            "Complaint updated, but failed to send status update email for anonymous complaint",
        });
      }
    }

    res.status(200).json(updatedComplaint);
  } catch (error) {
    console.error("Error updating complaint:", error);
    res.status(500).json({ message: "Error updating complaint" });
  }
});

// Get complaints for the logged-in user
router.get("/mycomplaint", async (req, res) => {
  const userId = req.headers.userid; // Extract userId from headers
  console.log("Fetching complaints for User ID:", userId);

  try {
    const complaints = await Complaint.find({ userId });
    console.log("Found complaints:", complaints);
    res.status(200).json({ complaints });
  } catch (error) {
    console.error("Error fetching complaints:", error);
    res.status(500).json({ error: "Failed to fetch complaints" });
  }
});

// Route to submit feedback for a specific complaint
router.put("/feedback/:id", async (req, res) => {
  try {
    const { feedback } = req.body;
    const { id } = req.params;

    // Update complaint with feedback
    const updatedComplaint = await Complaint.findByIdAndUpdate(
      id,
      { feedback },
      { new: true }
    );

    if (!updatedComplaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    res.json({
      message: "Feedback submitted successfully",
      complaint: updatedComplaint,
    });
  } catch (error) {
    console.error("Error submitting feedback:", error);
    res.status(500).json({ message: "Server error" });
  }
});
// POST route to register a complaint
router.post("/registercomplaint", async (req, res) => {
  try {
    const {
      userId,
      issueType,
      description,
      isAnonymous,
      roomNumber,
      email,
      hostel, // Ensure hostel is coming from req.body
      userName,
    } = req.body;

    if (!hostel) {
      return res.status(400).json({ message: "Hostel is required." });
    }

    const complaintData = {
      userId,
      issueType,
      description,
      isAnonymous,
      hostel, // Include hostel in complaint data
      email,
    };

    // Include userName and roomNumber only if the complaint is not anonymous
    if (!isAnonymous) {
      if (!userName) {
        return res.status(400).json({ message: "User name is required." });
      }
      complaintData.userName = userName;
      complaintData.roomNumber = roomNumber;
    }

    // Save the complaint in the database
    const complaint = new Complaint(complaintData);
    await complaint.save();

    // Send confirmation email only if the complaint is not anonymous
    if (!isAnonymous && email) {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Complaint Registration Confirmation",
        text: `Hello ${userName},\n\nYour complaint regarding "${issueType}" has been successfully registered.\n\nDescription: ${description}\n\nOur team will review your complaint and respond accordingly.\n\nThank you,\nHostel Management`,
      };

      try {
        await transporter.sendMail(mailOptions);
      } catch (emailError) {
        console.error("Error sending email:", emailError);
        return res.status(500).json({
          message:
            "Complaint registered, but failed to send confirmation email",
        });
      }
    }
    // If complaint is anonymous and email is provided, you may want to send a generic confirmation email.
    if (isAnonymous && email) {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Complaint Registration Confirmation",
        text: `Hello,\n\nYour anonymous complaint regarding "${issueType}" has been successfully registered.\n\nDescription: ${description}\n\nOur team will review your complaint and respond accordingly.\n\nThank you,\nHostel Management`,
      };

      try {
        await transporter.sendMail(mailOptions);
      } catch (emailError) {
        console.error("Error sending email:", emailError);
        return res.status(500).json({
          message:
            "Complaint registered, but failed to send confirmation email for anonymous complaint",
        });
      }
    }
    res.status(201).json({ message: "Complaint registered successfully" });
  } catch (error) {
    console.error("Error registering complaint:", error);
    res.status(500).json({ error: "Failed to register complaint" });
  }
});

export default router;

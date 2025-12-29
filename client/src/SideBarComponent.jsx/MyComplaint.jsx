import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Axios from "axios";
import "../Styles/MyComplaint.css";
const MyComplaint = () => {
  const [complaints, setComplaints] = useState([]);
  const userId = localStorage.getItem("userId");
  const navigate = useNavigate();

  useEffect(() => {
    if (userId) {
      fetchUserComplaints();
    } else {
      console.error("User not logged in");
    }
  }, [userId]);

  
  const fetchUserComplaints = async () => {
    try {
      const response = await Axios.get(
        "https://hostel-complaint-management-webapp.onrender.com/api/mycomplaint",
        {
          headers: { userid: userId },
        }
      );
      setComplaints(response.data.complaints);
    } catch (error) {
      console.error("Error fetching complaints:", error);
    }
  };

  // Handle feedback change
  const handleFeedbackChange = (id, feedback) => {
    setComplaints((prevComplaints) =>
      prevComplaints.map((complaint) =>
        complaint._id === id ? { ...complaint, feedback: feedback } : complaint
      )
    );
  };

  // Submit feedback
  const handleSubmitFeedback = async (id, feedback) => {
    try {
      await Axios.put(`https://hostel-complaint-management-webapp.onrender.com/complaints/feedback/${id}`, {
        feedback: feedback,
      });
      fetchUserComplaints(); // Refresh complaints after feedback submission
    } catch (error) {
      console.error("Error submitting feedback:", error);
    }
  };

  return (
    <div className="my-complaints">
      <button className="back-button" onClick={() => navigate("/home")}>
        ⬅ Back To Home
      </button>
      <h1>My Complaints</h1>
      <table className="complaints-table">
        <thead>
          <tr>
            <th>Issue Type</th>
            <th>Description</th>
            <th>Date Submitted</th>
            <th>Status</th>

            <th>Feedback</th>
          </tr>
        </thead>
        <tbody>
          {complaints && complaints.length > 0 ? (
            complaints.map((complaint) => (
              <tr key={complaint._id}>
                <td>{complaint.issueType}</td>
                <td>{complaint.description}</td>
                <td>
                  {new Date(complaint.createdAt).toLocaleDateString("en-US")}
                </td>
                <td>{complaint.status}</td>

                <td>
                  {complaint.status === "resolved" ? (
                    <div>
                      <textarea
                        className="feedback-textarea"
                        placeholder="Enter feedback"
                        value={complaint.feedback || ""}
                        onChange={(e) =>
                          handleFeedbackChange(complaint._id, e.target.value)
                        }
                      />
                      <button
                        onClick={() =>
                          handleSubmitFeedback(
                            complaint._id,
                            complaint.feedback
                          )
                        }
                      >
                        Submit Feedback
                      </button>
                    </div>
                  ) : (
                    <span>No feedback yet</span>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4">No complaints found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default MyComplaint;

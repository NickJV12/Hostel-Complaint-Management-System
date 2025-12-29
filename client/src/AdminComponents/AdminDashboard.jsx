import { useEffect, useState } from "react";
import Axios from "axios";
import "../Styles/AdminDashboard.css";
import { useNavigate, Link } from "react-router-dom";

const AdminDashboard = () => {
  const [complaints, setComplaints] = useState([]);
  const [statusFilter, setStatusFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchComplaints();
  }, [statusFilter, categoryFilter]);

  const fetchComplaints = async () => {
    const hostel = localStorage.getItem("hostel");

    try {
      const response = await Axios.get("https://hostel-complaint-management-webapp.onrender.com/complaints/all", {
        headers: {
          hostel: hostel,
        },
        params: { status: statusFilter, category: categoryFilter },
      });
      setComplaints(response.data);
    } catch (error) {
      console.error("Error fetching complaints:", error);
    }
  };

  const handleUpdateStatus = async (id, newStatus, responseText) => {
    try {
      await Axios.put(`https://hostel-complaint-management-webapp.onrender.com/complaints/update/${id}`, {
        status: newStatus,
        adminResponse: responseText,
      });
      setComplaints((prevComplaints) =>
        prevComplaints.map((complaint) =>
          complaint._id === id
            ? { ...complaint, status: newStatus, adminResponse: responseText }
            : complaint
        )
      );
    } catch (error) {
      console.error("Error updating complaint:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("adminId");
    localStorage.removeItem("hostel");
    navigate("/");
  };

  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard - Complaints Management</h1>

      <div style={{ width: "100%", display: "flex", justifyContent: "center", margin: "20px 0" }}>
        <Link to="/complaints-graph">
          <button style={{ padding: "10px 20px", backgroundColor: "#059669", color: "white", border: "none", borderRadius: "8px", fontWeight: "bold", cursor: "pointer" }}>
            View Complaints Graph
          </button>
        </Link>
      </div>

      <div className="logout-container">
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>

      {/* Filters Section */}
      <div className="filters">
        <label>Status Filter:</label>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="">All</option>
          <option value="pending">Pending</option>
          <option value="in-progress">In Progress</option>
          <option value="resolved">Resolved</option>
        </select>

        <label>Category Filter:</label>
        <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
          <option value="">All</option>
          <option value="Maintenance">Maintenance</option>
          <option value="Cleanliness">Cleanliness</option>
          <option value="Other">Other</option>
          <option value="Water">Water</option>
          <option value="Noise">Noise</option>
          <option value="Electricity">Electricity</option>
        </select>

        <button className="apply-filter-btn">Apply Filters</button>
      </div>

      {/* Complaints Table */}
      <div className="table-container">
        <table className="complaints-table">
          <thead>
            <tr>
              <th>User Info</th>
              <th>Description</th>
              <th>Issue Type</th>
              <th>Date Submitted</th>
              <th>Status</th>
              <th>Response</th>
              <th>Actions</th>
              <th>Feedback</th>
            </tr>
          </thead>
          <tbody>
            {complaints.length > 0 ? (
              complaints.map((complaint) => (
                <tr key={complaint._id}>
                  <td>
                    {complaint.isAnonymous ? (
                      <span>Anonymous User</span>
                    ) : (
                      <div style={{ lineHeight: "1.5" }}>
                        <div><strong>Name:</strong> {complaint.userName}</div>
                        <div><strong>Room:</strong> {complaint.roomNumber}</div>
                        <div><strong>Email:</strong> {complaint.email}</div>
                      </div>
                    )}
                  </td>
                  <td>{complaint.description}</td>
                  <td>{complaint.issueType}</td>
                  <td>{new Date(complaint.createdAt).toLocaleDateString("en-US")}</td>
                  <td>{complaint.status}</td>
                  <td>{complaint.adminResponse || "No response"}</td>
                  <td>
                    <select
                      value={complaint.status}
                      onChange={(e) =>
                        handleUpdateStatus(complaint._id, e.target.value, "Status updated by admin")
                      }
                    >
                      <option value="pending">Pending</option>
                      <option value="in-progress">In Progress</option>
                      <option value="resolved">Resolved</option>
                    </select>
                    <button
                      onClick={() =>
                        handleUpdateStatus(complaint._id, "resolved", "Resolved by admin")
                      }
                    >
                      Mark as Resolved
                    </button>
                  </td>
                  <td>
                    {complaint.status === "resolved"
                      ? complaint.feedback || "No feedback provided"
                      : "N/A"}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8">No complaints found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard;

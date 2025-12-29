import { useState } from "react";
import Axios from "axios";


const ComplaintDetail = ({ complaint }) => {
  const [status, setStatus] = useState(complaint.status);
  const [adminResponse, setAdminResponse] = useState(complaint.adminResponse || "");

  const handleUpdate = () => {
    Axios.put(`https://hostel-complaint-management-webapp.onrender.com/complaints/update/${complaint._id}`, {
      status,
      adminResponse,
    })
      .then(() => {
        alert("Complaint updated successfully");
        })
      .catch((error) => console.error("Error updating complaint:", error));
  };

  return (
    <div>
      <h3>{complaint.title}</h3>
      <p>{complaint.description}</p>
      <label>
        Status:
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="pending">Pending</option>
          <option value="in-progress">In Progress</option>
          <option value="resolved">Resolved</option>
        </select>
      </label>
      <label>
        Admin Response:
        <textarea value={adminResponse} onChange={(e) => setAdminResponse(e.target.value)} />
      </label>
      <button onClick={handleUpdate}>Update</button>
    </div>
  );
};

export default ComplaintDetail;

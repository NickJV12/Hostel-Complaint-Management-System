import axios from "axios";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();
  axios.defaults.withCredentials = true;

  useEffect(() => {
    const verifyUser = async () => {
      try {
        const res = await axios.get("https://hostel-complaint-management-webapp.onrender.com/auth/verify");

        // Ensure to access the correct property based on your backend response
        if (res.data.status) {
          // Assuming the status is directly on res.data
          console.log("User verified:", res.data); // Debugging statement
        } else {
          navigate("/"); // Redirect to home if not verified
        }
      } catch (error) {
        console.error("Error verifying user:", error); // Log error
        navigate("/"); // Redirect on error as well, if necessary
      }
    };

    verifyUser(); // Call the async function
  }, [navigate]); // Include navigate in the dependency array

  return <div>Loading...</div>; // Show loading state while verifying
};

export default Dashboard;

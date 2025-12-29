import React, { useState } from "react";
import Axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();
  const handleSubmit = (e) => {
    e.preventDefault();
    Axios.post("https://hostel-complaint-management-webapp.onrender.com/auth/forgot-password", {
      email,
    })
      .then((response) => {
        if (response.data.status) {
          alert("check your email for reset password lin");
          navigate("/login");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <div className="container">
      <h2>Forgot Password</h2>
      <form onSubmit={handleSubmit}>
        <input
          placeholder="email"
          name="email"
          onChange={(e) => setEmail(e.target.value)}
        />
        <button className="my-btn" type="submit">
          Submit
        </button>
      </form>
    </div>
  );
};

export default ForgotPassword;

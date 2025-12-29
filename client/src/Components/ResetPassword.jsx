import React, { useState } from "react";
import Axios from "axios";
import { Link, useNavigate, useParams } from "react-router-dom";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const { token } = useParams();
  const navigate = useNavigate();
  const handleSubmit = (e) => {
    e.preventDefault();
    Axios.post("https://hostel-complaint-management-webapp.onrender.com/auth/reset-password/" + token, {
      password,
    })
      .then((response) => {
        if (response.data.status) {
          navigate("/login");
        }
        console.log(response.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <div className="container">
      <h2>New Password</h2>
      <form onSubmit={handleSubmit}>
        <input
          placeholder="password"
          name="password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="my-btn" type="submit">
          Reset
        </button>
      </form>
    </div>
  );
};

export default ResetPassword;

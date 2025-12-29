import { useState } from "react";
import Axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "../Styles/Signup.css";

const Signup = () => {
  const [username, setUsername] = useState("");
  const [userId, setUserId] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [hostel, setHostel] = useState("");
  const [popupMessage, setPopupMessage] = useState("");

  const navigate = useNavigate();

  const handleClosePopup = () => {
    setPopupMessage("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Frontend validation
    if (!username || !userId || !email || !password || !hostel) {
      setPopupMessage("All fields are required.");
      return;
    }

    Axios.post("https://hostel-complaint-management-webapp.onrender.com/auth/signup", {
      username,
      email,
      password,
      userId,
      hostel,
    })
      .then((response) => {
        if (response.data && response.data.status) {
          console.log("Signup successful:", response.data.message);
          navigate("/login");
        } else {
          setPopupMessage("Signup failed. Please try again.");
        }
      })
      .catch((error) => {
        console.error("Signup error:", error);

        if (error.response) {
          const { status, data } = error.response;

          if (status === 409 && data.field === "userId") {
            setPopupMessage("User ID already registered.");
          } else if (status === 409 && data.field === "email") {
            setPopupMessage("Email already registered.");
          } else if (status === 400 && data.message === "All fields are required") {
            setPopupMessage("All fields are required.");
          } else {
            setPopupMessage(data.message || "Signup error. Please try again.");
          }
        } else {
          setPopupMessage("Network error. Please try again later.");
        }
      });
  };

  return (
    <div className="container">
      <h2>Sign Up!</h2>
      <form onSubmit={handleSubmit}>
        <input
          placeholder="Name"
          name="name"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          placeholder="User ID"
          name="userId"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
        />
        <input
          placeholder="Email"
          name="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          placeholder="Password"
          name="password"
          type="password"
          autoComplete="off"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <select
          id="hostel"
          value={hostel}
          onChange={(e) => setHostel(e.target.value)}
        >
          <option value="">Select a hostel</option>
          <option value="KNGH">KNGH</option>
          <option value="DJGH">DJGH</option>
          <option value="PATEL">PATEL</option>
          <option value="NBH">NBH</option>
          <option value="SVH">SVH</option>
          <option value="MALVIYA">MALVIYA</option>
          <option value="TILAK">TILAK</option>
          <option value="TANDON">TANDON</option>
          <option value="IHB">IHB</option>
          <option value="SNGH">SNGH</option>
          <option value="TAGORE">TAGORE</option>
        </select>

        <button className="my-btn" type="submit">
          Sign Up
        </button>
        <p style={{ color: "#ffffff" }}>
          Have an Account? <Link to="/login">Login</Link>
        </p>
      </form>

      {popupMessage && (
        <div className="popup">
          <p>{popupMessage}</p>
          <button onClick={handleClosePopup}>Close</button>
        </div>
      )}
    </div>
  );
};

export default Signup;

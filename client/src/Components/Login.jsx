import { useState } from "react";
import Axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "../App.css"; 

const Login = () => {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [hostel, setHostel] = useState(""); // state for hostel
  const [errorMessage, setErrorMessage] = useState("");
  const [popupMessage, setPopupMessage] = useState(""); // NEW: for error messages

  const navigate = useNavigate();
  const handleClosePopup = () => {
    setPopupMessage("");
  };

  Axios.defaults.withCredentials = true;

  const handleSubmit = (e) => {
    e.preventDefault();

    // Frontend validation
    if (!userId || !password || !hostel) {
      setPopupMessage("All fields are required.");
      return;
    }

    Axios.post("https://hostel-complaint-management-webapp.onrender.com/auth/login", {
      userId,
      password,
      hostel,
    })
      .then((response) => {
        if (response.data && response.data.status) {
          localStorage.setItem("userId", response.data.userId);
          localStorage.setItem("hostel", response.data.hostel);
          console.log("Login successful:", response.data);
          navigate("/home");
        } else {
          setPopupMessage("Login failed. Please try again.");
        }
      })
      .catch((error) => {
        console.error("Login error:", error);

        if (error.response) {
          const { status, data } = error.response;

          if (status === 400 && data.message === "Invalid credentials") {
            setPopupMessage("Invalid User ID or Password.");
          } else if (status === 400 && data.message === "All fields are required") {
            setPopupMessage("All fields are required.");
          } else {
            setPopupMessage(data.message || "Login error. Please try again.");
          }
        } else {
          setPopupMessage("Network error. Please try again later.");
        }
      });
  };

  return (
    <div className="container">
      <h2>Login!</h2>

      {/* Error Message Display */}
      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}

      <form onSubmit={handleSubmit}>
        <input
          placeholder="User ID"
          name="userId"
          onChange={(e) => setUserId(e.target.value)}
        />
        <input
          placeholder="Password"
          name="password"
          type="password"
          autoComplete="off"
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
          Login
        </button>

        <Link to="/forgotPassword">Forgot Password</Link>
        <p>
          Don&apos;t Have Account? <Link to="/signup">Signup</Link>
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

export default Login;


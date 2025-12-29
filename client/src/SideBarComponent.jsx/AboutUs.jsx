import React from "react";
import "../Styles/AboutUs.css";
import { Link, useNavigate } from "react-router-dom";
import GitHubIcon from "@mui/icons-material/GitHub";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import Face3Icon from "@mui/icons-material/Face3"; 

const AboutUs = () => {
  const navigate = useNavigate();

  const teamMembers = [
    {
      name: "Shrestha Katiyar",
      github: "https://github.com/Codadd",
      linkedin: "https://www.linkedin.com/in/shrestha-katiyar-b99684224",
    },
    {
      name: "Aditi Sonkar",
      github: "https://github.com/AS2409",
      linkedin: "https://www.linkedin.com/in/aditi2409/",
    },
    {
      name: "Shambhavi Mishra",
      github: "https://github.com/AS2409",
      linkedin: "https://www.linkedin.com/in/aditi2409/",
    },
  ];

  return (
    <>
      <button className="back-button" onClick={() => navigate("/home")}>
        ⬅ Back To Home
      </button>

      <p className="init-para">
        Hi! We are StrawHats. We have created a friend for you who will register
        your complaint, resolve your complaint, and update you through a ting
        tong (via message or mail).
      </p>

      <h4 className="text-center heading">
        Here is the brief description of the team StrawHats!!
      </h4>

      <div className="main-row">
        <div className="row justify-content-center">
          {teamMembers.map((member, index) => (
            <div className="col-sm card-one" key={index}>
              <div className="card" style={{ width: "18rem", paddingTop: "1rem" }}>
                <div className="text-center mb-2">
                  <Face3Icon style={{ fontSize: "80px", color: "#ff69b4" }} />
                </div>
                <div className="card-body text-center">
                  <h5 className="card-title">{member.name}</h5>
                  <p className="info-mation">
                    Electronics and Communication Engineering
                  </p>
                  <div className="div-icon d-flex justify-content-center gap-3 mt-2">
                    <Link to={member.github} target="_blank">
                      <GitHubIcon className="icon-col" />
                    </Link>
                    <Link to={member.linkedin} target="_blank">
                      <LinkedInIcon className="icon-col" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default AboutUs;

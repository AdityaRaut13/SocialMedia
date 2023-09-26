/** @format */

import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { getToken } from "../utility";

function UserProfile() {
  const { username } = useParams();
  const [user, setUser] = useState({});
  const navigation = useNavigate();
  useEffect(() => {
    const token = getToken("token");
    if (!token) {
      setTimeout(() => navigation("/auth/login"), 0);
      return;
    }
    axios
      .get(`http://localhost:3000/api/user/${username}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setUser(response.data);
      })
      .catch((error) => {
        console.error(error);
        alert("Something went wrong");
      });
  }, [username, navigation]);
  const { email, bio, workedOn, interested, projects, profileLink } = user;
  const renderIcons = (icon) => {
    return (
      <div className="profile-icon">
        <img src={icon.link} alt={"icon"} />
      </div>
    );
  };
  const renderProject = (project) => {
    return (
      <div className="project">
        <h1>{project.title}</h1>
        <p>{project.description}</p>
      </div>
    );
  };
  return (
    <div className="profile-container">
      <div className="upper-section">
        <div className="profile-cont-1">
          <div className="image">
            <img src={profileLink} alt={"ProfileImage"} />
          </div>
          <div className="profile-sec-1">
            <text className="display-label">email</text>
            <text className="display-text">{email}</text>
            <text className="display-label">username</text>
            <text className="display-text">{username}</text>
            {bio && <text className="display-label">bio</text>}
            <text className="display-text">{bio}</text>
          </div>
          <div className="tech-container">
            <div className="tech">
              {workedOn && workedOn.map((icon) => renderIcons(icon))}
            </div>
            <div className="tech">
              {interested && interested?.map((icon) => renderIcons(icon))}
            </div>
          </div>
        </div>
      </div>
      <div className="projects">
        {projects && projects?.map((project) => renderProject(project))}
      </div>
    </div>
  );
}

export default UserProfile;

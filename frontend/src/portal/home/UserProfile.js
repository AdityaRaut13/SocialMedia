/** @format */

import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

function UserProfile() {
  const { username } = useParams();
  const [user, setUser] = useState({});
  useEffect(() => {
    axios
      .get(`http://localhost:3000/api/user/${username}`)
      .then((response) => {
        setUser(response.data);
      })
      .catch((error) => {
        console.error(error);
        alert("Something went wrong");
      });
  }, [username]);
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
        <h2>{project.description}</h2>
      </div>
    );
  };
  return (
    <div className="userProfile">
      <div className="upper-section">
        <div className="image">
          <img src={profileLink} alt={"ProfileImage"} />
        </div>
        <div className="profile-sec-1">
          <div>{email} </div>
          <div>{username} </div>
          <div>{bio} </div>
        </div>
      </div>
      <div className="lower-section">
        <div className="tech">
          {workedOn && workedOn.map((icon) => renderIcons(icon))}
        </div>
        <div className="tech">
          {interested && interested?.map((icon) => renderIcons(icon))}
        </div>
        <div className="projects">
          {projects && projects?.map((project) => renderProject(project))}
        </div>
      </div>
    </div>
  );
}

export default UserProfile;

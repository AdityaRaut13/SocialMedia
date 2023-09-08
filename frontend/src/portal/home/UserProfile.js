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
  return (
    <div className="userProfile">
      <div className="upper-section">
        <div className="image">
          <img src={profileLink} alt={"ProfileImage"} />
        </div>
        <div className="profile-sec-1">
          <h3>{email} </h3>
          <h3>{username} </h3>
          <h3>{bio} </h3>
        </div>
      </div>
    </div>
  );
}

export default UserProfile;

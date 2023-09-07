/** @format */

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Home() {
  const [otherUsers, setOtherUsers] = useState([]);
  const navigation = useNavigate();
  useEffect(() => {
    axios
      .get("http://localhost:3000/api/user", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        setOtherUsers(response.data);
      })
      .catch((error) => {
        alert(error.message);
      });
  }, []);
  const goToProfile = (username) => {
    setTimeout(() => {
      navigation(`/${username}`);
    });
  };
  const renderIcons = (icons) => {
    return (
      <div className="icon">
        <img src={icons.link} alt={"icon"} />
      </div>
    );
  };

  const renderCard = (user) => {
    const { bio, workedOn, interested } = user;
    return (
      <div
        key={user.id}
        className="user-card"
        onClick={() => goToProfile(user.username)}
      >
        <div className="user-section-1">
          <div className="profile-image">
            <img src={user.profileLink} alt="profileImage" />
          </div>
          <div className="section-1-child">{user.username}</div>
          <div className="section-1-child">{user.email}</div>
        </div>
        <div className="user-section-2">
          {workedOn && (
            <div className="section-2-child">
              {workedOn.map((icons) => renderIcons(icons))}
              {/* {JSON.stringify(user.worked_on_container)} */}
            </div>
          )}
          {interested && (
            <div className="section-2-child">
              {/* {JSON.stringify(user.interested)} */}
              {interested.map((icons) => renderIcons(icons))}
            </div>
          )}
          {bio && <div className="section-2-child">{user.bio}</div>}
        </div>
      </div>
    );
  };
  return (
    <div id="Home">
      <div className="grid-container">
        {otherUsers?.map((user) => renderCard(user))}
      </div>
    </div>
  );
}

export default Home;

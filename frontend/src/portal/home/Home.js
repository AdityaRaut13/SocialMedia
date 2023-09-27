/** @format */

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { getToken } from "../utility";
import { IoIosArrowDropright } from "react-icons/io";
import { IconContext } from "react-icons/lib";
import { TbMessageCode } from "react-icons/tb";

function Home() {
  const [otherUsers, setOtherUsers] = useState([]);
  const navigation = useNavigate();
  useEffect(() => {
    const token = getToken("token");
    if (!token) {
      setTimeout(() => navigation("/auth/login"), 0);
      return;
    }
    axios
      .get("http://localhost:3000/api/user", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setOtherUsers(response.data);
      })
      .catch((error) => {
        alert(error.message);
      });
  }, [navigation]);
  const goToProfile = (username) => {
    setTimeout(() => {
      navigation(`/${username}`);
    });
  };
  const renderIcons = (icons, index) => {
    if (index > 4) {
      return;
    }
    if (index === 4) {
      return (
        <IconContext.Provider
          value={{
            style: {
              width: "100%",
              boxShadow: "1px",
              color: "green",
              height: "100%",
            },
          }}>
          <div className="icon">
            <IoIosArrowDropright />
          </div>
        </IconContext.Provider>
      );
    }
    return (
      <div className="icon">
        <img src={icons.link} alt={"icon"} />
      </div>
    );
  };

  const renderCard = (user) => {
    const { bio, workedOn, interested } = user;
    return (
      <div key={user.id} className="user-card">
        <div className="user-section-1">
          <div className="profile-image">
            <img src={user.profileLink} alt="profileImage" />
          </div>
          <div className="section-1-child">{user.username}</div>
          <div className="section-1-child">{user.email}</div>
        </div>
        <div
          className="user-section-2"
          onClick={() => goToProfile(user.username)}>
          {workedOn && workedOn.length > 0 && (
            <div className="section-2-child">
              {workedOn.map((icons, index) => renderIcons(icons, index))}
              {/* {JSON.stringify(user.worked_on_container)} */}
            </div>
          )}
          {interested && interested.length > 0 && (
            <div className="section-2-child">
              {/* {JSON.stringify(user.interested)} */}
              {interested.map((icons, index) => renderIcons(icons, index))}
            </div>
          )}
          {bio && <div className="section-2-child">{user.bio}</div>}
        </div>
        <Link
          style={{ textDecoration: "none" }}
          className="message-button"
          to={`/messages/${user.username}`}>
          <TbMessageCode size={"20px"} />
        </Link>
      </div>
    );
  };
  return (
    <div id="Home">
      <div className="grid-container">
        {otherUsers.length > 0 && otherUsers.map((user) => renderCard(user))}
      </div>
    </div>
  );
}

export default Home;

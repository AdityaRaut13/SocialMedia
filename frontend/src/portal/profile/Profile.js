import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Tech from "./Tech";

function Profile() {
  const [user, setUser] = useState({});
  const [tech, setTech] = useState([]);
  const fileRef = useRef(null);
  const navigation = useNavigate();
  useEffect(() => {
    axios
      .get(`http://localhost:3000/api/user/me`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        setUser(response.data);
      })
      .catch((error) => {
        console.log(error);
        alert(error.message);
      });
    axios
      .get(`http://localhost:3000/api/tech`)
      .then((response) => {
        setTech(response.data);
      })
      .catch((error) => {
        console.log(error);
        alert("Something went wrong calling tech.");
      });
  }, []);
  const { email, username, bio, workedOn, interested, projects, profileLink } =
    user;
  const setTechInUser = (Tech, isWorkedOn) => {
    setUser({ ...user, [isWorkedOn ? "workedOn" : "interested"]: Tech });
  };
  const imageOnClick = () => {
    fileRef.current.click();
  };
  const fileSelected = () => {
    const selectedFile = fileRef.current.files[0];
    console.log("selected File : ", selectedFile);
    const formData = new FormData();
    formData.append("avatar", selectedFile);
    axios
      .post(`http://localhost:3000/api/user/upload`, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        console.log(response);
        if (response.statusText === "OK") {
          setTimeout(() => {
            navigation(`/profile`);
          }, 500);
        }
      })
      .catch((error) => {
        console.log(error.message);
        alert("Something went wrong");
      });
  };
  return (
    <div id="ProfileScreen">
      <div className="image-div" onClick={imageOnClick}>
        <input
          type="file"
          style={{ display: "none" }}
          ref={fileRef}
          onChange={fileSelected}
        />
        <img src={profileLink} alt="profileImage" />
      </div>
      <div className="bio-section">
        <div className="indiv-sec">
          <text>email</text>
          <br />
          <text>{email}</text>
        </div>
        <div className="indiv-sec">
          <text>username</text>
          <br />
          <text>{username}</text>
        </div>
        <div className="indiv-sec">
          <text>bio</text>
          <br />
          <textarea
            style={{ padding: "0.5rem", borderRadius: "1rem" }}
            value={bio}
            rows={4}
            cols={50}
          />
        </div>
      </div>
      <Tech value={workedOn} list={tech} setValue={setTechInUser} />
    </div>
  );
}

export default Profile;

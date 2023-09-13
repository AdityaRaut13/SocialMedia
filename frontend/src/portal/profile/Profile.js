import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

function Profile() {
  const [user, setUser] = useState({});
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
  }, []);
  const { email, bio, workedOn, interested, projects, profileLink } = user;
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
    </div>
  );
}

export default Profile;

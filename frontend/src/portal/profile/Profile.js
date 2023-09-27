import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Tech from "./Tech";
import { ImCancelCircle } from "react-icons/im";
import "./Profile.css";
import { getToken } from "../utility";

function Profile() {
  const [user, setUser] = useState({});
  const [tech, setTech] = useState([]);
  const fileRef = useRef(null);
  const navigation = useNavigate();
  useEffect(() => {
    const token = getToken("token");
    if (!token) {
      setTimeout(() => navigation("/auth/login"), 0);
      return;
    }
    axios
      .get(`http://localhost:3000/api/user/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
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
  }, [navigation]);
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
    const formData = new FormData();
    formData.append("avatar", selectedFile);
    const token = getToken("token");
    if (!token) {
      setTimeout(() => navigation("/auth/login"), 0);
      return;
    }
    axios
      .post(`http://localhost:3000/api/user/upload`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        if (response.statusText === "OK") {
          setUser({ ...user, profileLink: response.data.link });
        } else {
          throw new Error("someThing went wrong");
        }
      })
      .catch((error) => {
        console.log(error.message);
      });
  };
  const renderProject = (project, index) => {
    return (
      <div key={index} className="profile-project">
        <div className="proj-indiv-sec">
          <p>Title</p>
          <input
            type="text"
            value={project.title}
            onChange={(e) => {
              projects[index].title = e.target.value;
              setUser({ ...user, projects });
            }}
          />
        </div>
        <div className="proj-indiv-sec">
          <p>Description</p>
          <textarea
            value={project.description}
            cols={45}
            rows={3}
            onChange={(e) => {
              projects[index].description = e.target.value;
              setUser({ ...user, projects });
            }}
          />
        </div>
        <div
          onClick={() => {
            projects.splice(index, 1);
            setUser({ ...user, projects });
          }}
          className="project-close">
          <ImCancelCircle style={{ width: "25px", height: "25px" }} />
        </div>
      </div>
    );
  };
  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
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
            <p>email</p>
            <p>{email}</p>
          </div>
          <div className="indiv-sec">
            <p>username</p>
            <p>{username}</p>
          </div>
          <div className="indiv-sec">
            <p>
              bio&nbsp;
              {bio && `${bio.length}/140`}
            </p>
            <textarea
              value={bio}
              onChange={(e) => {
                if (e.target.value.length > 140) return;
                setUser({ ...user, bio: e.target.value });
              }}
              rows={4}
              cols={45}
            />
          </div>
        </div>
        <div className="tech-section">
          <p>WorkedOn Technology </p>
          <Tech
            value={workedOn}
            isWorkedOn={true}
            list={tech}
            setValue={setTechInUser}
          />
        </div>
        <div className="tech-section">
          <p>Interested Technology </p>
          <Tech
            value={interested}
            isWorkedOn={false}
            list={tech}
            setValue={setTechInUser}
          />
        </div>
        {projects && (
          <div className="ps-projects">
            <p>Projects</p>
            {projects.map((project, index) => renderProject(project, index))}
            <button
              onClick={() => {
                setUser({
                  ...user,
                  projects: [...projects, { title: "", description: "" }],
                });
              }}>
              Add Projects
            </button>
          </div>
        )}
        <button
          id="updateProfileButton"
          onClick={() => {
            const token = getToken("token");
            if (!token) {
              setTimeout(() => navigation("/auth/login"), 0);
              return;
            }
            axios
              .put(`http://localhost:3000/api/user/`, user, {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              })
              .then((response) => {
                if (response.statusText === "OK")
                  setTimeout(() => {
                    navigation("/");
                  }, 500);
              })
              .catch((error) => {
                alert("Failed to update the profile.");
                console.error(error);
              });
          }}>
          Update Profile
        </button>
      </div>
    </div>
  );
}

export default Profile;

import React from "react";
import { AiFillHome, AiFillMessage } from "react-icons/ai";
import { BsFillPersonFill } from "react-icons/bs";
import { RiLogoutCircleFill } from "react-icons/ri";
import { Link } from "react-router-dom";

function SideBar() {
  const logout = () => {
    localStorage.removeItem("token");
  };
  return (
    <div id="sidebar">
      <Link className="sidebar-item" to={"/"}>
        <AiFillHome
          style={{ verticalAlign: "middle", padding: "3px" }}
          size={"25px"}
        />
        <h4>&nbsp;&nbsp;Home</h4>
      </Link>
      <Link className="sidebar-item" to={"/profile"}>
        <BsFillPersonFill
          style={{ verticalAlign: "middle", padding: "3px" }}
          size={"25px"}
        />
        <h4>&nbsp;&nbsp;Profile</h4>
      </Link>
      <Link className="sidebar-item" to={"/messages"}>
        <AiFillMessage
          style={{ verticalAlign: "middle", padding: "3px" }}
          size={"25px"}
        />
        <h4>&nbsp;&nbsp;Messages</h4>
      </Link>
      <Link className="sidebar-item" to={"/auth/login"} onClick={logout}>
        <RiLogoutCircleFill
          style={{ verticalAlign: "middle", padding: "3px" }}
          size={"25px"}
        />
        <h4>&nbsp;&nbsp;Logout</h4>
      </Link>
    </div>
  );
}

export default SideBar;

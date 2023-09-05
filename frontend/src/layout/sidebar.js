import React, { useState } from "react";
import { AiFillHome, AiFillMessage } from "react-icons/ai";
import { BsFillPersonFill } from "react-icons/bs";
import { RiLogoutCircleFill } from "react-icons/ri";
import { Link } from "react-router-dom";

function SideBar() {
  const [isOpened, setIsOpened] = useState(false);
  const onMouseOver = () => {
    setIsOpened(true);
  };
  const onMouseOut = () => {
    setIsOpened(false);
  };

  return (
    <div
      style={{
        width: isOpened ? "7%" : "3%",
      }}
      onMouseOver={onMouseOver}
      onMouseOut={onMouseOut}
      id="sidebar">
      <Link className="sidebar-item" to={"/"}>
        <AiFillHome style={{ verticalAlign: "middle" }} size={"20px"} />
        {isOpened && <h3>&nbsp;&nbsp;Home</h3>}
      </Link>
      <Link className="sidebar-item" to={"/profile"}>
        <BsFillPersonFill style={{ verticalAlign: "middle" }} size={"20px"} />
        {isOpened && <h3>&nbsp;&nbsp;Profile</h3>}
      </Link>
      <Link className="sidebar-item" to={"/messages"}>
        <AiFillMessage style={{ verticalAlign: "middle" }} size={"20px"} />
        {isOpened && <h3>&nbsp;&nbsp;Messages</h3>}
      </Link>
      <Link className="sidebar-item">
        <RiLogoutCircleFill style={{ verticalAlign: "middle" }} size={"20px"} />
        {isOpened && <h3>&nbsp;&nbsp;Logout</h3>}
      </Link>
    </div>
  );
}

export default SideBar;

import React, { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import "./Message.css";

function Messages(props) {
  const [readMsgs, setReadMsgs] = useState([]);
  const [selectedUser, setSelectedUser] = useState(props.username);
  const [specificUserMsg, setSpecificUserMsg] = useState([]);
  const socket = useRef(null);
  useEffect(() => {
    socket.current = io("http://localhost:3000/", {
      auth: {
        token: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    socket.current.on("connect", () => {
      console.log(socket);
    });
    socket.current.on("allMessages", (msgs) => {
      console.log("server says : ", msgs);
      setReadMsgs(msgs);
    });
  }, []);
  useEffect(() => {
    socket.current.emit("specificUserMsg", selectedUser, (specificUserMsg) => {
      setSpecificUserMsg(specificUserMsg);
      console.log(specificUserMsg);
    });
  }, [selectedUser]);
  const renderPanelMsg = (msg) => {
    const user = msg.sender ?? msg.reciever ?? {};
    return (
      <div
        className="message"
        key={`messages-users-${user._id}`}
        onClick={() => {
          setSelectedUser(user.username);
        }}>
        <div className="msg-img-container">
          <img src={user.profileLink} alt="profileImage" />
        </div>
        <div className="message-details">
          <div>{user.username}</div>
          <div className="msg-panel-text">{msg.msg}</div>
        </div>
      </div>
    );
  };
  return (
    <div id="msg-container">
      {readMsgs.length > 0 && (
        <div id="msg-panel">{readMsgs.map((msg) => renderPanelMsg(msg))}</div>
      )}
      {specificUserMsg && (
        <div className="msg-text">
          {specificUserMsg.map((msg) => (
            
            <h4>{msg.msg}</h4>
          ))}
        </div>
      )}
    </div>
  );
}

export default Messages;

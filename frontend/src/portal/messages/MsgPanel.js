import React from "react";
import { useOutletContext } from "react-router-dom";
import "./Message.css";

function MsgPanel() {
  const { me, messageSend, user } = useOutletContext();
  const renderTextMsg = (msg) => {
    const isSender = msg.sender === me._id.toString() ? true : false;
    return (
      <div
        style={{ justifySelf: isSender ? "flex-end" : "flex-start" }}
        className="msg-text"
        key={`msg-${
          msg.sender?._id?.toString() + msg.receiver?._id?.toString() ?? "me"
        }-${msg.t}`}>
        <h4 className="sent-text">{msg.msg}</h4>
      </div>
    );
  };
  console.log(messageSend);
  return (
    messageSend && (
      <div className="msg-text-container">
        <div className="msg-text-profile">
          <div className="msg-img-container">
            <img src={user.profileLink} alt="profileImage" />
          </div>
          <div style={{ color: "gray" }} className="message-details">
            <div>{user.username}</div>
          </div>
        </div>
        <div className="msg-center">
          {messageSend.map((msg) => renderTextMsg(msg))}
        </div>
      </div>
    )
  );
}

export default MsgPanel;

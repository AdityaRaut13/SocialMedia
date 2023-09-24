import React, { useState } from "react";
import { useOutletContext } from "react-router-dom";
import { AiOutlineSend } from "react-icons/ai";
import "./Message.css";

function MsgPanel() {
  const { me, messageSend, user } = useOutletContext();
  const [newMsg, setNewMsg] = useState("");
  const renderTextMsg = (msg) => {
    const isSender = msg.sender === me._id ? true : false;
    return (
      <div
        style={{
          alignSelf: isSender ? "flex-end" : "flex-start",
          borderRadius: "1rem",
          [isSender ? "borderBottomRightRadius" : "borderBottomLeftRadius"]:
            "0",
          textAlign: isSender ? "right" : "left",
          backgroundColor: isSender ? "#DCC9C4" : "#6db7df",
        }}
        className="msg-text"
        key={`msg-${
          msg.sender?._id?.toString() + msg.receiver?._id?.toString() ?? "me"
        }-${msg.t}`}>
        <h4 className="sent-text">{msg.msg}</h4>
      </div>
    );
  };
  const sendMsg = () => {
    console.log("inside sendMsg");
    console.log(newMsg);
    console.log(me);
    console.log(user);
  };
  console.log(messageSend);
  return (
    messageSend && (
      <div className="msg-text-container">
        <div className="msg-text-profile">
          <div className="msg-img-container">
            <img src={user.profileLink} alt="profileImage" />
          </div>
          <div style={{ color: "white" }} className="message-details">
            <div>{user.username}</div>
          </div>
        </div>
        <div className="msg-center">
          {messageSend.map((msg) => renderTextMsg(msg))}
        </div>
        <div className="text-box">
          <textarea
            className="text-input"
            value={newMsg}
            onChange={(e) => setNewMsg(e.target.value)}
          />
          <button onClick={sendMsg}>
            <AiOutlineSend size={"30px"} />
          </button>
        </div>
      </div>
    )
  );
}

export default MsgPanel;

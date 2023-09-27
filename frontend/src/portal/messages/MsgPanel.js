import React, { useState, useRef } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { AiOutlineSend } from "react-icons/ai";
import "./Message.css";
import { IconContext } from "react-icons/lib";

function MsgPanel() {
  const [{ me, messageSend, user }, webSocket] = useOutletContext();
  const [newMsg, setNewMsg] = useState("");
  const refPanel = useRef(null);
  const navigation = useNavigate();
  // eslint-disable-next-line no-unused-vars
  const convertDate = (date) => {
    return date.toISOString().split("T")[1].split(".")[0];
  };
  const renderTextMsg = (msg) => {
    const isSender = msg.sender === me._id ? true : false;
    return (
      <div
        style={{
          alignSelf: isSender ? "flex-end" : "flex-start",
          borderRadius: "1rem",
          [isSender ? "borderBottomRightRadius" : "borderBottomLeftRadius"]:
            "0",
          textAlign: isSender ? "end" : "start",
        }}
        className={`msg-text ${isSender ? "sender" : "receiver"}`}
        key={`msg-${
          msg.sender?._id?.toString() + msg.receiver?._id?.toString() ?? "me"
        }-${msg.t.toISOString()}`}>
        <p className="sent-text">{msg.msg}</p>
        {/* <i>{convertDate(msg.t)}</i> */}
        <i>{msg.t.toString()}</i>
      </div>
    );
  };
  const sendMsg = () => {
    webSocket.emit("message", {
      me: me._id.toString(),
      user: user._id.toString(),
      msg: newMsg,
    });
    setNewMsg("");
    refPanel.current.scrollTop = refPanel.current.scrollHeight;
  };
  return (
    messageSend && (
      <div className="msg-text-container">
        <div
          className="msg-text-profile"
          onClick={() => {
            setTimeout(() => navigation(`/${user.username}`), 0);
          }}>
          <div className="msg-img-container">
            <img src={user.profileLink} alt="profileImage" />
          </div>
          <div style={{ color: "white" }} className="message-details">
            <div>{user.username}</div>
          </div>
        </div>
        <div ref={refPanel} className="msg-container-dialog">
          <div className="msg-center">
            {messageSend.map((msg) => renderTextMsg(msg))}
          </div>
        </div>
        <div className="text-box">
          <textarea
            className="text-input"
            value={newMsg}
            onChange={(e) => setNewMsg(e.target.value)}
          />
          <button onClick={sendMsg}>
            <IconContext.Provider
              value={{ style: { width: "100%", height: "100%" } }}>
              <div className="icon">
                <AiOutlineSend />
              </div>
            </IconContext.Provider>
          </button>
        </div>
      </div>
    )
  );
}

export default MsgPanel;

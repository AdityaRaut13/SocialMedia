import React, { useEffect, useState } from "react";
import axios from "axios";
import { Outlet, useParams, Link } from "react-router-dom";
import "./Message.css";

function Messages() {
  const { username } = useParams();
  const [readMsgs, setReadMsgs] = useState([]);
  const [userMsgPanel, setUserMsgPanel] = useState({});
  useEffect(() => {
    const getRecentMessages = async () => {
      try {
        const res = await axios.get(
          `http://localhost:3000/api/messages/recentMessages`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        console.log(res.data);
        setReadMsgs(res.data);
      } catch (error) {
        alert("something went wrong");
        console.log(error);
      }
    };
    getRecentMessages();
  }, []);
  useEffect(() => {
    const getUserMessage = async () => {
      try {
        const res = await axios.get(
          `http://localhost:3000/api/messages/${username}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        console.log(res.data);
        setUserMsgPanel(res.data);
      } catch (error) {
        alert("something went wrong");
        console.log(error);
      }
    };
    if (username) getUserMessage();
  }, [username]);
  const renderPanelMsg = (msg) => {
    const user = msg.sender ?? msg.reciever ?? {};
    return (
      <Link
        style={{ textDecoration: "none" }}
        to={`/messages/${user.username}`}>
        <div
          className="message"
          style={{
            backgroundColor:
              userMsgPanel?.user?._id === user._id ? "#4a3655" : "#6f5f78",
          }}
          key={`messages-users-${user._id}`}>
          <div className="msg-img-container">
            <img src={user.profileLink} alt="profileImage" />
          </div>
          <div className="message-details">
            <div>{user.username}</div>
            <div className="msg-panel-text">{msg.msg}</div>
          </div>
        </div>
      </Link>
    );
  };
  const renderTextMsg = (msg) => {
    const isSender =
      msg.sender === userMsgPanel?.me._id.toString() ? true : false;
    return (
      <div
        key={`msg-${
          msg.sender?._id?.toString() + msg.reciever?._id?.toString() ?? "me"
        }-${msg.t}`}>
        {isSender && <h4 className="sent-text">[you]:{msg.msg}</h4>}
        {!isSender && (
          <h4 className="recieved-text">
            [{userMsgPanel.user?.username}]:{msg.msg}
          </h4>
        )}
      </div>
    );
  };
  return (
    <div id="msg-container">
      {readMsgs.length > 0 && (
        <div id="msg-panel">{readMsgs.map((msg) => renderPanelMsg(msg))}</div>
      )}
      {userMsgPanel.messageSend && (
        <div className="msg-text">
          <div className="msg-center">
            {userMsgPanel.messageSend.map((msg) => renderTextMsg(msg))}
          </div>
        </div>
      )}
      <Outlet />
    </div>
  );
}

export default Messages;

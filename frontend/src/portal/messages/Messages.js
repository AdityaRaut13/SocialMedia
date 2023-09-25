/** @format */

import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { Outlet, useParams, Link } from "react-router-dom";
import { io } from "socket.io-client";
import "./Message.css";

function Messages() {
  const { username } = useParams();
  const [readMsgs, setReadMsgs] = useState([]);
  const [userMsgPanel, setUserMsgPanel] = useState({});
  const usersMsgPanelRef = useRef(null);
  const webSocket = useRef(null);
  useEffect(() => {
    webSocket.current = io(`http://localhost:3000/`, {
      auth: {
        token: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    webSocket.current.on("connect", () => {
      console.log(webSocket.current);
    });
  }, []);
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
        console.log("recentMessages : ", res.data);
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
        console.log("userMessages : ", res.data);
        if (res.data.messageSend.length === 0) {
          setReadMsgs((prev) => [
            ...prev,
            { receiver: res.data.user, msg: "" },
          ]);
        }
        setUserMsgPanel(res.data);
      } catch (error) {
        alert("something went wrong");
        console.log(error);
      }
    };
    if (username) getUserMessage();
  }, [username]);
  const renderPanelMsg = (msg) => {
    const user = msg.sender ?? msg.receiver ?? {};
    return (
      <Link
        style={{ textDecoration: "none" }}
        to={`/messages/${user.username}`}
        key={`messages-users-${user._id}`}>
        <div
          className="message"
          style={{
            backgroundColor:
              userMsgPanel?.user?._id === user._id ? "#4e95bc" : "#447792",
          }}>
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
  return (
    <div id="msg-container">
      <div ref={usersMsgPanelRef} id="msg-panel">
        {readMsgs.length > 0 && readMsgs.map((msg) => renderPanelMsg(msg))}
      </div>
      <Outlet context={[userMsgPanel, webSocket.current]} />
    </div>
  );
}

export default Messages;

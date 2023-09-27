/** @format */

import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { Outlet, useParams, Link, useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import "./Message.css";
import jwt_decode from "jwt-decode";
import { getToken } from "../utility";

function Messages() {
  const { username } = useParams();
  const [readMsgs, setReadMsgs] = useState([]);
  const [userMsgPanel, setUserMsgPanel] = useState({});
  const usersMsgPanelRef = useRef(null);
  const webSocket = useRef(null);
  const navigation = useNavigate();
  useEffect(() => {
    const token = getToken("token");
    if (!token) {
      setTimeout(() => navigation("/auth/login"), 0);
      return;
    }
    webSocket.current = io(`http://localhost:3000/`, {
      auth: {
        token: `Bearer ${token}`,
      },
    });
    webSocket.current.on("error", (err) => alert(err));
    webSocket.current.on("message", (msg) => {
      setUserMsgPanel((prev) => {
        if (Object.keys(prev).length === 0) {
          return prev;
        }
        const { user, messageSend } = prev;
        if (msg.sender._id !== user._id && msg.receiver._id !== user._id) {
          return prev;
        }
        return {
          ...prev,
          messageSend: [
            ...messageSend,
            {
              sender: msg.sender._id.toString(),
              receiver: msg.receiver._id.toString(),
              msg: msg.msg,
              t: new Date(msg.t),
            },
          ],
        };
      });
      setReadMsgs((prev) => {
        const userId = jwt_decode(
          JSON.parse(localStorage.getItem("token")).value
        ).id;
        const otherUser = userId === msg.sender._id ? msg.receiver : msg.sender;
        const result = [];
        const insertMsg = {
          [userId === msg.sender._id ? "receiver" : "sender"]: otherUser,
          msg: msg.msg,
          t: new Date(msg.t),
        };
        let isPresent = false;
        prev.forEach((tempMsg) => {
          const user = tempMsg.sender ?? tempMsg.receiver;
          if (user._id === otherUser._id) {
            result.push(insertMsg);
            isPresent = true;
            return;
          }
          result.push(tempMsg);
        });
        if (!isPresent) result.push(insertMsg);
        return result.sort((a, b) => b.t - a.t);
      });
    });
    return () => {
      webSocket.current.disconnect();
    };
  }, [navigation]);

  useEffect(() => {
    const getRecentMessages = async () => {
      try {
        const token = getToken("token");
        if (!token) {
          setTimeout(() => navigation("/auth/login"), 0);
          return;
        }
        const res = await axios.get(
          `http://localhost:3000/api/messages/recentMessages`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setReadMsgs(() => {
          const result = [];
          for (let msg of res.data) {
            result.push({ ...msg, t: new Date(msg.t) });
          }
          return result;
        });
      } catch (error) {
        console.error(error);
      }
    };
    getRecentMessages();
  }, [navigation]);
  useEffect(() => {
    const getUserMessage = async () => {
      try {
        const token = getToken("token");
        if (!token) {
          setTimeout(() => navigation("/auth/login"), 0);
          return;
        }
        console.log(token);
        const res = await axios.get(
          `http://localhost:3000/api/messages/users/${username}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (res.data.messageSend.length === 0) {
          setReadMsgs((prev) => [
            { receiver: res.data.user, msg: "" },
            ...prev,
          ]);
        }
        setUserMsgPanel(() => {
          const result = { ...res.data, messageSend: [] };
          for (let msg of res.data.messageSend) {
            result.messageSend.push({ ...msg, t: new Date(msg.t) });
          }
          return result;
        });
      } catch (error) {
        console.error(error);
      }
    };
    if (username) getUserMessage();
  }, [username, navigation]);
  const renderPanelMsg = (msg) => {
    const user = msg.sender ?? msg.receiver ?? {};
    return (
      <Link
        style={{ textDecoration: "none" }}
        to={`/messages/${user.username}`}
        key={`messages-users-${user._id}`}>
        <div
          className={`message ${
            userMsgPanel?.user?._id === user._id && "message-selected"
          }`}>
          <div className="msg-img-container">
            <img src={user.profileLink} alt="profileImage" />
          </div>
          <div className="message-details">
            <div>{user.username}</div>
            <div className="msg-panel-text">
              {msg.msg && (msg.sender ? `${user.username}: ` : "you : ")}
              {msg.msg}
            </div>
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

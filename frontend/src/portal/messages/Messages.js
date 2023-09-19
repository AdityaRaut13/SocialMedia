import React, { useEffect } from "react";
import { io } from "socket.io-client";

function Messages() {

  useEffect(() => {
    const socket = io("http://localhost:3000/", {
      auth: {
        token: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    socket.on("connect", () => {
      console.log(socket);
    });
    socket.on("message", (msg) => {
      console.log("server says : ", msg);
    });
  }, []);
  return <div>messages</div>;
}

export default Messages;

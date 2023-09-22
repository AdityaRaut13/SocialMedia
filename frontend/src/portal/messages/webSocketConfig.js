import { io } from "socket.io-client";
let socket;
const getSocket = (token) => {
  if (socket) return socket;
  socket = io("http://localhost:3000/", {
    auth: {
      token: `Bearer ${token}`,
    },
  });
  socket.on("connect", () => {
    console.log(socket);
  });
  return socket;
};
export default getSocket;

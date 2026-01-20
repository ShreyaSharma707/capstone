import { io } from "socket.io-client";
import { API_BASE_URL } from "./api";

let socket = null;

export const initializeSocket = () => {
  if (!socket) {
    socket = io(API_BASE_URL, {
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
    });

    socket.on("connect", () => {
      console.log("Connected to backend socket");
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from backend socket");
    });

    socket.on("connection", (data) => {
      console.log("Socket connection message:", data);
    });
  }

  return socket;
};

export const getSocket = () => socket;

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

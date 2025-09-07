import { io } from "socket.io-client";

// URL backend socket server
const SOCKET_URL = import.meta.env.VITE_API_URL || "http://localhost:9000";

// Lấy token (ví dụ từ localStorage)
const getToken = () => localStorage.getItem("access_token");

export const socket = io(SOCKET_URL, {
  autoConnect: true,
  transports: ["websocket"],
  auth: {
    token: getToken(), // 👈 gửi token khi connect
  },
});

// helper kết nối
export const connectSocket = () => {
  if (!socket.connected) {
    socket.auth = { token: getToken() }; // cập nhật token mỗi lần connect
    socket.connect();
  }
};

// helper ngắt kết nối
export const disconnectSocket = () => {
  if (socket.connected) socket.disconnect();
};

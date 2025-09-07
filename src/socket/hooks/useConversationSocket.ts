import { useEffect } from "react";
import { CONSTANT_EVENT_NAMES } from "~/shared/constants";
import { socket } from "~/socket/socket";

export const useConversationSocket = () => {
  //
  useEffect(() => {
    socket.on("connect_error", (err) => {
      console.error("❌ Socket connect error:", err.message);
      socket.disconnect();

      if (err.message === "jwt expired") {
        console.log("Token jwt expired");
        const getToken = () => localStorage.getItem("access_token");
        socket.auth = { token: getToken() };
        socket.connect();
        console.log("Set token Success");
      }
    });
  }, []);

  //
  const joinConversation = (ids: string[]) => {
    if (!socket.connected) {
      console.warn("⚠️ Socket chưa connect, không thể join room");
      return;
    }
    socket.emit(CONSTANT_EVENT_NAMES.JOIN_ROOM, ids);
  };

  //
  const leaveConversation = (ids: string[]) => {
    if (!socket.connected) {
      console.warn("⚠️ Socket chưa connect, không thể join room");
      return;
    }
    socket.emit(CONSTANT_EVENT_NAMES.LEAVE_ROOM, ids);
  };

  return { leaveConversation, joinConversation };
};

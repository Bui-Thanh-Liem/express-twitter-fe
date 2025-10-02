import { useEffect } from "react";
import { CONSTANT_EVENT_NAMES } from "~/shared/constants";
import { socket } from "~/socket/socket";

export const useStatusSocket = (
  onOnl: (val: { _id: string; hasOnline: boolean }) => void
) => {
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
  useEffect(() => {
    socket.on(CONSTANT_EVENT_NAMES.USER_ONLINE, onOnl);
    return () => {
      socket.off(CONSTANT_EVENT_NAMES.USER_ONLINE, onOnl);
    };
  }, [onOnl]);
};

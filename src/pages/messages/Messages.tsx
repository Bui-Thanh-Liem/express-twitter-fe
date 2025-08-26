import { useEffect } from "react";
import { io } from "socket.io-client";

export default function MessagesPage() {
  useEffect(() => {
    const socket = io(import.meta.env.VITE_API_URL);
    // client-side
    socket.on("connect", () => {
      logger.info(`User ${socket.id} connect to server`);
    });
    socket.on("disconnect", () => {
      logger.info(`User disconnect connect server`);
    });

    socket.on("getting", (arg) => {
      logger.info("arg:::", arg);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return <div>Messages</div>;
}

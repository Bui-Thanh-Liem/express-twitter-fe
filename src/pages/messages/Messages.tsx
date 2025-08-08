import { useEffect } from "react";
import { io } from "socket.io-client";

export default function MessagesPage() {
  useEffect(() => {
    const socket = io(import.meta.env.VITE_API_URL);
    // client-side
    socket.on("connect", () => {
      console.log(`User ${socket.id} connect to server`);
    });
    socket.on("disconnect", () => {
      console.log(`User disconnect connect server`);
    });

    socket.on("getting", (arg) => {
      console.log("arg:::", arg);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return <div>Messages</div>;
}

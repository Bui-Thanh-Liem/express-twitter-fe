import { useEffect } from "react";
import { CONSTANT_EVENT_NAMES } from "~/shared/constants";
import type { INotification } from "~/shared/interfaces/schemas/notification.interface";
import { socket } from "~/socket/socket";

export const useNotificationSocket = (
  onNewNotification: (data: INotification) => void,
  onUnreadCount: (count: number) => void
) => {
  // Kết nối socket
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

  // Lắng nghe thông báo
  useEffect(() => {
    socket.on(CONSTANT_EVENT_NAMES.NEW_NOTIFICATION, onNewNotification);
    return () => {
      socket.off(CONSTANT_EVENT_NAMES.NEW_NOTIFICATION, onNewNotification);
    };
  }, [onNewNotification]);

  // Lắng nghe số lượng thông báo chưa đọc
  useEffect(() => {
    socket.on(CONSTANT_EVENT_NAMES.UNREAD_NOTIFICATION, onUnreadCount);
    return () => {
      socket.off(CONSTANT_EVENT_NAMES.UNREAD_NOTIFICATION, onUnreadCount);
    };
  }, [onUnreadCount]);

  // Tham gia vào phòng của mình (user_id)
  const joinConversationSelf = (id: string[]) => {
    if (!socket.connected) {
      console.warn("⚠️ Socket chưa connect, không thể join room self");
      return;
    }
    socket.emit(CONSTANT_EVENT_NAMES.JOIN_CONVERSATION, id);
  };

  return { joinConversationSelf };
};

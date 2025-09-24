import { CONSTANT_EVENT_NAMES } from "~/shared/constants";
import type { INotification } from "~/shared/interfaces/schemas/notification.interface";
import { socket } from "~/socket/socket"; // hoặc tạo riêng trong chat

// Nhận notification từ server
export const newNotifications = (
  callback: (newNoti: INotification) => void
) => {
  socket.on(CONSTANT_EVENT_NAMES.NEW_NOTIFICATION, callback);
  return () => socket.off(CONSTANT_EVENT_NAMES.NEW_NOTIFICATION, callback); // cleanup
};

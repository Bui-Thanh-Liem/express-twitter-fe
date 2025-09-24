import { CONSTANT_EVENT_NAMES } from "~/shared/constants";
import { socket } from "~/socket/socket"; // hoặc tạo riêng trong chat

// Nhận thời gian onl/off từ server
export const lastSeenUser = (callback: (lastSeen: Date) => void) => {
  socket.on(CONSTANT_EVENT_NAMES.STATUS_USER, callback);
  return () => socket.off(CONSTANT_EVENT_NAMES.STATUS_USER, callback); // cleanup
};

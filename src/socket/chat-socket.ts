import { CONSTANT_EVENT_NAMES } from "~/shared/constants";
import { type sendMessageDto } from "~/shared/dtos/req/socket/message.dto";
import { socket } from "~/socket/socket"; // hoặc tạo riêng trong chat

// Gửi message lên server
export const sendMessage = (message: sendMessageDto) => {
  socket.emit(CONSTANT_EVENT_NAMES.SEND_MESSAGE, message);
};

// Nhận message từ server
export const newMessages = (callback: (data: sendMessageDto) => void) => {
  socket.on(CONSTANT_EVENT_NAMES.NEW_MESSAGE, callback);
  return () => socket.off(CONSTANT_EVENT_NAMES.NEW_MESSAGE, callback); // cleanup
};

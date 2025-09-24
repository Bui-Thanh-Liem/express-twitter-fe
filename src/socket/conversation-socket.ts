import { CONSTANT_EVENT_NAMES } from "~/shared/constants";
import { socket } from "~/socket/socket"; // hoặc tạo riêng trong chat

// Join conversation
export const joinConversation = (id: string) => {
  socket.emit(CONSTANT_EVENT_NAMES.JOIN_CONVERSATION, id);
};

// Leave conversation
export const leaveConversation = (id: string) => {
  socket.emit(CONSTANT_EVENT_NAMES.LEAVE_CONVERSATION, id);
};

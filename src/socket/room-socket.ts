import { CONSTANT_EVENT_NAMES } from "~/shared/constants";
import { socket } from "~/socket/socket"; // hoặc tạo riêng trong chat

// Join Room
export const joinRoom = (id: string) => {
  socket.emit(CONSTANT_EVENT_NAMES.JOIN_ROOM, id);
};

// Leave room
export const leaveRoom = (id: string) => {
  socket.emit(CONSTANT_EVENT_NAMES.LEAVE_ROOM, id);
};

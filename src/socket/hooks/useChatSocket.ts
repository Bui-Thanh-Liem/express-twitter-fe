import { useEffect } from "react";
import { CONSTANT_EVENT_NAMES } from "~/shared/constants";
import type { messageDto } from "~/shared/dtos/req/socket/message.dto";
import { socket } from "~/socket/socket";

export const useChatSocket = (onMessage: (data: messageDto) => void) => {
  useEffect(() => {
    socket.connect();

    socket.on(CONSTANT_EVENT_NAMES.NEW_MESSAGE, onMessage);

    return () => {
      socket.off(CONSTANT_EVENT_NAMES.NEW_MESSAGE, onMessage);
      socket.disconnect();
    };
  }, [onMessage]);

  const sendMessage = (data: messageDto) => {
    socket.emit(CONSTANT_EVENT_NAMES.SEND_MESSAGE, data);
  };

  return { sendMessage };
};

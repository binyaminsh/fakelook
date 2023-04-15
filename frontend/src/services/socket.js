import io from "socket.io-client";
import env from "react-dotenv";

export const socket = io(env.REACT_APP_FEED_SOCKET_URL, {
  reconnection: true,
  transports: ["websocket"],
});


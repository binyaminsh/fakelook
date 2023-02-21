import { feedActions } from "../store/feed-slice";
import { socket } from "../services/socket";
import { fetchFeedData } from "../store/feed-actions";

const feedMiddleware = (store) => {
  return (next) => (action) => {
    // TODO: Maybe add connection here
    // const isConnectionEstablished = socket && store.getState().chat.isConnected;

    if (!action.type.startsWith("feed/")) {
      return next(action);
    }

    if (feedActions.startConnection.match(action)) {
      socket.on("connect", () => {
        console.log(
          `ws connection established with ${socket.io.uri}\nUserID: ${socket.id}`
        );
        store.dispatch(fetchFeedData());
      });

      socket.on("post-added", (post) => {
        store.dispatch(feedActions.addNewPost({ post }));
      });

      socket.on("post-updated", (post) => {
        store.dispatch(feedActions.updatePost({ post }));
      });

      socket.on("user-added", (user) => {
        store.dispatch(feedActions.addNewUser({ user }));
      });

      socket.on("user-updated", (user) => {
        store.dispatch(feedActions.updateUser({ user }));
      });
    }
    next(action);
  };
};

export default feedMiddleware;

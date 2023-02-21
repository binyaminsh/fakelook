import { feedActions } from "./feed-slice";
import { socket } from "../services/socket";

export const fetchFeedData = () => {
  return async (dispatch) => {
    const dataHandler = ({ postsDto, usersDto }) => {
      postsDto = postsDto.map((post) => {
        post.time = new Date(post.time).toISOString(); // Serialize date
        return post;
      });

      dispatch(
        feedActions.setData({
          posts: postsDto,
          users: usersDto,
        })
      );
    };

    socket.emit("dataRequest");
    // socket.on("data", dataHandler);
    // Alternative
    socket.off("data", dataHandler).on("data", dataHandler);
  };
};

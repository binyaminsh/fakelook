import { AiFillLike, AiOutlineLike } from "react-icons/ai";
import classes from "./LikeButton.module.css";

const LikeButton = ({ likeStatus, onLikeClicked, likeCounter }) => {
  return (
    <div className={classes.like}>
      {likeStatus && (
        <AiFillLike className={classes["like-icon"]} onClick={onLikeClicked} />
      )}
      {!likeStatus && (
        <AiOutlineLike
          className={classes["like-icon"]}
          onClick={onLikeClicked}
        />
      )}
      {likeCounter}
    </div>
  );
};

export default LikeButton;

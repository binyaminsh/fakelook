import classes from "./CommentItem.module.css";
import AuthContext from "../../store/auth-context";
import { useContext, useState, useEffect } from "react";
import LikeButton from "../UI/LikeButton";
import { toggleLike } from "../../util/api";
import LoadingSpinner from "../UI/LoadingSpinner";
import Card from "../UI/Card";
import EditPostTags from "../Posts/EditPost/EditPostTags";
import { formatRelative } from "date-fns";

const CommentItem = ({ comment, postId }) => {
  const [likeStatus, setLikeStatus] = useState(false);

  // const [isPublisher, setIsPublisher] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const authCtx = useContext(AuthContext);
  const { isLoggedIn } = authCtx;

  let currentUser;
  if (isLoggedIn) {
    currentUser = authCtx.currentUser;
  }

  useEffect(() => {
    if (isLoggedIn && currentUser) {
      // check if user is publisher of the comment
      // const isEditable = comment.publisher === currentUser.username;
      // setIsPublisher(isEditable);

      // check if user liked the comment
      const isLiked = comment.likes.includes(currentUser.username);
      setLikeStatus(isLiked);
    } else {
      // setIsPublisher(false);
      setLikeStatus(false);
    }
  }, [comment, isLoggedIn, currentUser]);

  const LikeHandler = async () => {
    if (isLoggedIn && currentUser) {
      toggleLike(postId, currentUser.username, likeStatus, comment.id);
    }
  };

  const closeTagsEdit = () => {
    setIsEditing(false);
  };

  if (!comment) {
    return <LoadingSpinner className="centered" />;
  }

  return (
    <Card className={classes.card}>
      <p className={classes.publisher}>
        <span className={classes.name}>
          {comment.publisherName}&nbsp;&nbsp;
        </span>
        <span> @{comment.publisher}&nbsp;</span>
        <span>
          •&nbsp;{formatRelative(new Date(comment.createdAt), new Date())}
        </span>
      </p>
      <li className={classes.item}>
        <p>{comment.content}</p>
        <div className={classes.tags}>
          <LikeButton
            likeStatus={likeStatus}
            onLikeClicked={LikeHandler}
            likeCounter={comment.likes.length}
          />
          {!isEditing && (
            <>
              {comment.tags.hashTags.length > 0 && (
                <p style={{ fontSize: 13 }}>
                  Tags:{" "}
                  {comment.tags.hashTags.map((tag) => (
                    <span key={tag}>{tag}, </span>
                  ))}
                </p>
              )}
            </>
          )}
        </div>
        {isEditing && isLoggedIn && currentUser && (
          <EditPostTags
            post={comment}
            onCloseEdit={closeTagsEdit}
            isComment={true}
          />
        )}
      </li>
      {/* <div className={classes.edit}>
        {isPublisher && isLoggedIn && (
          <button onClick={() => setIsEditing(true)}>Edit tags</button>
        )}
      </div> */}
    </Card>
  );
};

export default CommentItem;

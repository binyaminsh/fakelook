import classes from "./PostDetails.module.css";
import { formatRelative } from "date-fns";
import AuthContext from "../../../store/auth-context";
import { useContext, useState, useEffect } from "react";
import Modal from "../../Layout/Modal";
import LikeButton from "../../UI/LikeButton";
import { toggleLike } from "../../../util/api";
import EditPostTags from "../EditPost/EditPostTags";
import Comments from "../../comments/Comments";

export default function PostDetails({ post, onHidePostDetails }) {
  const [likeStatus, setLikeStatus] = useState(false);

  const [isPublisher, setIsPublisher] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const authCtx = useContext(AuthContext);
  const { isLoggedIn } = authCtx;

  let currentUser;
  if (isLoggedIn) {
    currentUser = authCtx.currentUser;
  }

  useEffect(() => {
    if (isLoggedIn && currentUser) {
      // check if user is publisher of the post
      const isEditable = post.publisher === currentUser.username;
      setIsPublisher(isEditable);

      // check if user liked the post
      const isLiked = post.likes.includes(currentUser.username);
      setLikeStatus(isLiked);
    } else {
      setIsPublisher(false);
      setLikeStatus(false);
    }
  }, [post, isLoggedIn, currentUser]);

  const LikeHandler = async () => {
    if (isLoggedIn && currentUser) {
      toggleLike(post.id, currentUser.username, likeStatus);
    }
  };

  const closeTagsEdit = () => {
    setIsEditing(false);
  };

  return (
    <Modal className={classes.modal} onClose={onHidePostDetails}>
      <div className={classes.post}>
        <p className={classes.publisher}>
          <span className={classes.name}>{post.publisherName} </span>
          <span> @{post.publisher}</span>
          <span> • {formatRelative(new Date(post.time), new Date())}</span>
        </p>
        <figure>
          <img className={classes.postImg} src={post.photoUrl} alt="" />
          <figcaption className={classes.imgCaption}>
            <LikeButton
              likeStatus={likeStatus}
              onLikeClicked={LikeHandler}
              likeCounter={post.likes.length}
            />
            {post.content}
          </figcaption>
          {!isEditing && (
            <div className={classes.tags}>
              {isPublisher && isLoggedIn && (
                <button onClick={() => setIsEditing(true)}>Edit tags</button>
              )}
              {post.tags.hashTags.length > 0 && (
                <p>
                  Tags:{" "}
                  {post.tags.hashTags.map((tag) => (
                    <span key={tag}>{tag}, </span>
                  ))}
                </p>
              )}
            </div>
          )}
          {isEditing && isLoggedIn && currentUser && (
            <EditPostTags post={post} onCloseEdit={closeTagsEdit} />
          )}
        </figure>
      </div>
      <div className={classes.comments}>
        <Comments comments={post.comments} postId={post.id} />
      </div>
    </Modal>
  );
}

import { useCallback, useContext } from "react";
import classes from "./Comments.module.css";
import NewCommentForm from "./NewCommentForm";
import CommentsList from "./CommentsList";
import AuthContext from "../../store/auth-context";
import useHttp from "../../hooks/use-http";
import LoadingSpinner from "../UI/LoadingSpinner";

const Comments = ({ comments, postId }) => {
  const authCtx = useContext(AuthContext);
  const { error, isLoading, sendRequest: sendNewCommentRequest } = useHttp();

  const addedCommentHandler = useCallback(
    async (url, payload) => {
      await sendNewCommentRequest({
        url,
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: payload,
      });
    },
    [sendNewCommentRequest]
  );

  let commentsJsx;

  if (comments && comments.length > 0) {
    commentsJsx = <CommentsList postId={postId} comments={comments} />;
  }

  if (!comments || comments.length === 0) {
    commentsJsx = <p className="centered">No comments were added yet!</p>;
  }

  return (
    <section className={classes.comments}>
      <h2>User Comments</h2>
      {authCtx.currentUser && authCtx.isLoggedIn && !isLoading && (
        <NewCommentForm postId={postId} onAddedComment={addedCommentHandler} />
      )}
      {error && <p className="error-text">Error, failed to publish comment</p>}
      {isLoading && <LoadingSpinner className="centered" />}
      {commentsJsx}
    </section>
  );
};

export default Comments;

import LoadingSpinner from "../UI/LoadingSpinner";
import CommentItem from "./CommentItem";
import classes from "./CommentsList.module.css";

const CommentsList = ({ comments, postId }) => {
  if (!comments) {
    return <LoadingSpinner className="centered" />;
  }

  return (
    <ul className={classes.comments}>
      {comments.map((comment) => (
        <CommentItem key={comment.id} comment={comment} postId={postId} />
      ))}
    </ul>
  );
};

export default CommentsList;

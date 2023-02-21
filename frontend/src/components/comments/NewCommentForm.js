import { useContext, useState } from "react";
import classes from "./NewCommentForm.module.css";
import Tags from "../UI/Tags";
import Mention from "../UI/Mention";
import useMention from "../../hooks/use-mention";
import AuthContext from "../../store/auth-context";

const NewCommentForm = ({ postId, onAddedComment }) => {
  const [tags, setTags] = useState([]);
  const authCtx = useContext(AuthContext);

  const {
    content,
    contentRef,
    contentChangeHandler,
    tagableUsers,
    taggedUsers,
    showMentionList,
    selectMentionHandler,
    onKeyDown,
  } = useMention();

  async function submitFormHandler(e) {
    e.preventDefault();
    const newComment = contentRef.current.value;

    if (newComment.trim().length === 0) return;

    const commentUrl = `${process.env.REACT_APP_POST_URL}/comment/${postId}`;
    const payload = {
      userId: authCtx.currentUser._id,
      content: newComment,
      hashTags: tags,
      userTags: taggedUsers,
    };

    onAddedComment(commentUrl, payload);
  }

  return (
    <form className={classes.form} onSubmit={submitFormHandler}>
      <div className={classes.control}>
        <label htmlFor="comment"></label>
        <textarea
          id="comment"
          rows="3"
          ref={contentRef}
          name="content"
          value={content}
          onChange={contentChangeHandler}
          onKeyDown={onKeyDown}
          placeholder="Leave a comment..."
        ></textarea>
        {showMentionList && (
          <Mention users={tagableUsers} onSelect={selectMentionHandler} />
        )}
      </div>
      <div className={classes.control}>
        <Tags tags={tags} setTags={setTags} />
      </div>
      <div className={classes.actions}>
        <button>Add Comment</button>
      </div>
    </form>
  );
};

export default NewCommentForm;

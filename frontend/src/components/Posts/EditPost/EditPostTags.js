import { useContext, useEffect, useState } from "react";
import useHttp from "../../../hooks/use-http";
import useMention from "../../../hooks/use-mention";
import AuthContext from "../../../store/auth-context";
import LoadingSpinner from "../../UI/LoadingSpinner";
import Mention from "../../UI/Mention";
import Tags from "../../UI/Tags";
import classes from "./EditPostTags.module.css";

const EditPostTags = ({ post, onCloseEdit, isComment = false }) => {
  const [tags, setTags] = useState([...post.tags.hashTags]);
  const [filteredTagableUsers, setFilteredTagableUsers] = useState([]);

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

  const { error, statusCode, isLoading, sendRequest } = useHttp();
  const authCtx = useContext(AuthContext);

  useEffect(() => {
    if (post.tags.userTags.length > 0) {
      const res = tagableUsers.map((user) => ({
        ...user,
        is: post.tags.userTags.includes(user.username),
      }));

      const filtered = res.filter((user) => user.is === false);

      setFilteredTagableUsers(filtered);
    } else {
      setFilteredTagableUsers(tagableUsers);
    }
  }, [tagableUsers, post]);

  const onClose = () => {
    onCloseEdit();
  };

  const onSave = async (e) => {
    e.preventDefault();

    // Code below relevnt only if comment editing is possible.
    // let url;
    // if (isComment) {
    //   url = `${process.env.REACT_APP_POST_URL}/${post._id}`;
    // } else {
    //   url = `${process.env.REACT_APP_POST_URL}/${post.id}`;
    // }

    const postUrl = `${process.env.REACT_APP_POST_URL}/${post.id}`;

    let description = post.content;
    taggedUsers.forEach((mention) => {
      description += `@${mention} `;
    });

    const mentions = post.tags.userTags.concat(taggedUsers);

    const payload = {
      userId: authCtx.currentUser._id,
      hashTags: tags,
      userTags: mentions,
      content: description,
    };

    await sendRequest({
      url: postUrl,
      method: "PUT",
      body: payload,
      headers: { "Content-Type": "application/json" },
    });

    if (statusCode === 200 || statusCode === 201) {
      onCloseEdit();
    }
  };

  return (
    <form className={classes.container} onSubmit={onSave}>
      <div className={classes.control}>
        <input
          ref={contentRef}
          value={content}
          onChange={contentChangeHandler}
          onKeyDown={onKeyDown}
          disabled={isLoading}
          placeholder="Type @ to mention other users"
        ></input>
        {showMentionList && (
          <Mention
            users={filteredTagableUsers}
            onSelect={selectMentionHandler}
          />
        )}
      </div>
      <Tags tags={tags} setTags={setTags} isSubmitting={isLoading} />
      <div className={classes.actions}>
        {!isLoading && (
          <>
            <button>Save Changes</button>
            <button type="button" onClick={onClose}>
              Close
            </button>
          </>
        )}
        {isLoading && <LoadingSpinner className="centered" />}
      </div>
      {error && <p className="error-text">Error, failed to edit tags</p>}
    </form>
  );
};

export default EditPostTags;

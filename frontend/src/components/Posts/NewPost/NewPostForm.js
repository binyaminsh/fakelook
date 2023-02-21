import { useState } from "react";
import useMention from "../../../hooks/use-mention";
import Card from "../../UI/Card";
import Mention from "../../UI/Mention";
import Tags from "../../UI/Tags";
import classes from "./NewPost.module.css";

const PostForm = (props) => {
  const { onCancel, isSubmitting, onSubmit } = props;

  const [imageUrl, setImageUrl] = useState();
  const [tags, setTags] = useState([]);
  const {
    content,
    contentRef,
    contentChangeHandler,
    tagableUsers,
    taggedUsers,
    filter,
    showMentionList,
    selectMentionHandler,
    onKeyDown,
  } = useMention();

  const imageChangeHandler = (e) => {
    const newImage = e.target.files[0];
    if (newImage) {
      const newImageUrl = URL.createObjectURL(newImage);
      setImageUrl(newImageUrl);
    } else {
      setImageUrl(null);
    }
  };

  return (
    <Card className={classes.container}>
      <form
        className={classes.form}
        onSubmit={(e) => onSubmit(e, tags, taggedUsers)}
      >
        <div className={classes.control}>
          <label htmlFor="image">Image</label>
          <input
            type="file"
            name="file"
            id="Image"
            accept="image/*"
            onChange={imageChangeHandler}
            required
            disabled={isSubmitting}
          />
          <img
            className={classes.preview}
            src={imageUrl}
            alt=""
            hidden={!imageUrl}
          />
        </div>
        <div className={`${classes.control} ${classes.mention}`}>
          <label htmlFor="text">Description</label>
          <textarea
            ref={contentRef}
            id="text"
            rows="3"
            name="content"
            value={content}
            onChange={contentChangeHandler}
            onKeyDown={onKeyDown}
            disabled={isSubmitting}
            placeholder="Type @ to mention other users"
          ></textarea>
          {showMentionList && (
            <Mention
              users={tagableUsers}
              onSelect={selectMentionHandler}
              filter={filter}
            />
          )}
        </div>
        {!showMentionList && (
          <>
            <div className={classes.control}>
              <Tags tags={tags} setTags={setTags} isSubmitting={isSubmitting} />
            </div>
            <div className={classes.actions}>
              <button type="button" onClick={onCancel} disabled={isSubmitting}>
                Cancel
              </button>
              <button disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : "Create Post"}
              </button>
            </div>
          </>
        )}
      </form>
    </Card>
  );
};

export default PostForm;

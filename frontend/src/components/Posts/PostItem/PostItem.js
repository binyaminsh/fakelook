import { useState } from "react";
import PostDetails from "../PostDetails/PostDetails";
import classes from "./PostItem.module.css";

const PostItem = (props) => {
  const [showDetails, setShowDetails] = useState(false);

  function navToPostDetails() {
    setShowDetails(true);
  }

  const hidePostDetails = () => {
    setShowDetails(false);
  };

  return (
    <>
      <li className={classes.item} onClick={navToPostDetails}>
        <figure>
          <img width={350} src={props.photoUrl} alt="" />
          <figcaption>{props.content}</figcaption>
        </figure>
      </li>
      {showDetails && (
        <PostDetails post={props.post} onHidePostDetails={hidePostDetails} />
      )}
    </>
  );
};

export default PostItem;

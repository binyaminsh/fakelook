import { useContext, useEffect, useState } from "react";
import Modal from "../../Layout/Modal";
import NewPostForm from "./NewPostForm";
import Card from "../../UI/Card";
import useHttp from "../../../hooks/use-http";
import AuthContext from "../../../store/auth-context";
import { useDispatch, useSelector } from "react-redux";
import { getUserGeolocation } from "../../../store/geolocation-actions";
import classes from "./NewPost.module.css";
import env from "react-dotenv";

const NewPost = ({ onModalClosed }) => {
  const { error, isLoading, sendRequest: sendNewPostRequest } = useHttp();
  const [tagableUsers, setTagableUsers] = useState([]);

  const users = useSelector((state) => state.feed.users);
  const authCtx = useContext(AuthContext);
  const { username } = authCtx.currentUser;

  const dispatch = useDispatch();
  const position = useSelector((state) => state.geolocation.coords);
  const isLocationAllowed = useSelector(
    (state) => state.geolocation.isLocationAllowed
  );

  useEffect(() => {
    dispatch(getUserGeolocation());
  }, [dispatch]);

  useEffect(() => {
    const otherUsers = users.filter((user) => user.username !== username);
    setTagableUsers(otherUsers);
  }, [username, users]);

  const modalClosedHandler = () => {
    if (!isLoading) {
      onModalClosed();
    }
  };

  const navigateToNewPost = (post) => {
    // TODO: navigate with postID
    console.log(post);
    onModalClosed(); // temp
  };

  async function submitPostHandler(e, tags, taggedUsers) {
    e.preventDefault();

    if (!position.lat || !position.lng) return;

    const formData = new FormData(e.target);
    formData.append("userId", authCtx.currentUser._id);
    formData.append("position", JSON.stringify(position));
    formData.append("tags", JSON.stringify(tags));
    formData.append("userTags", JSON.stringify(taggedUsers));

    // const postUrl = process.env.REACT_APP_POST_URL;
    const postUrl = env.REACT_APP_POST_URL;

    await sendNewPostRequest(
      {
        url: postUrl,
        method: "POST",
        headers: { "Content-Type": "multipart/form-data" },
        body: formData,
      },
      navigateToNewPost
    );
  }

  return (
    <Modal className={classes.modal} onClose={modalClosedHandler}>
      {!isLocationAllowed && (
        <Card>
          <h2>Location must be enabled to publish a post</h2>
        </Card>
      )}
      {isLocationAllowed && (
        <NewPostForm
          onCancel={modalClosedHandler}
          isSubmitting={isLoading}
          onSubmit={submitPostHandler}
          tagableUsers={tagableUsers}
          setTagableUsers={setTagableUsers}
        />
      )}
      {error && <p className="error-text">Error, failed to publish post</p>}
    </Modal>
  );
};

export default NewPost;

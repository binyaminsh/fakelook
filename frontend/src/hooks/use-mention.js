import { useContext, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import AuthContext from "../store/auth-context";

const useMention = () => {
  const users = useSelector((state) => state.feed.users);

  const [tagableUsers, setTagableUsers] = useState([]);
  const [taggedUsers, setTaggedUsers] = useState([]);

  const [showMentionList, setShowMentionList] = useState(false);
  const [content, setContent] = useState("");

  const authCtx = useContext(AuthContext);
  const { username } = authCtx.currentUser;

  // eslint-disable-next-line
  const [filter, setFilter] = useState(); // TODO: Implement filtering funcionality.
  const contentRef = useRef();

  useEffect(() => {
    const otherUsers = users.filter((user) => user.username !== username);
    setTagableUsers(otherUsers);
  }, [username, users]);

  const selectMentionHandler = (taggedUsername) => {
    setContent((prevState) => `${prevState}${taggedUsername} `);
    setTaggedUsers((prevState) => [...prevState, taggedUsername]);

    const filteredList = tagableUsers.filter(
      (user) => user.username !== taggedUsername
    );
    setTagableUsers(filteredList);

    setShowMentionList(false);
    contentRef.current.focus();
  };

  const contentChangeHandler = (e) => {
    const newInput = e.target.value;

    setContent(newInput);
    const lastChars = newInput.slice(-2);
    const lastWord = newInput.split(" ").pop();

    if (
      (content !== "" && lastChars.includes(" @")) ||
      (content === "" && lastChars.includes("@")) ||
      lastWord.startsWith("@")
    ) {
      if (tagableUsers.length > 0) {
        setShowMentionList(true);
      }
    } else if (showMentionList) setShowMentionList(false);
  };

  const onKeyDown = (e) => {
    const { key } = e;

    if (key === "Backspace") {
      const existingUsers = taggedUsers.filter((username) => {
        const isExist = content.includes(username);
        if (!isExist) {
          const user = users.find((user) => user.username === username);
          if (user) setTagableUsers((prevState) => [...prevState, user]);
        }
        return isExist;
      });

      setTaggedUsers([...existingUsers]);
    }
  };

  return {
    tagableUsers,
    taggedUsers,
    showMentionList,
    content,
    contentRef,
    filter,
    selectMentionHandler,
    contentChangeHandler,
    onKeyDown,
  };
};

export default useMention;

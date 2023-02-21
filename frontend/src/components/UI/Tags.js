import { useState } from "react";
import classes from "./Tags.module.css";

const Tags = ({ tags, setTags, isSubmitting }) => {
  const [input, setInput] = useState("");
  const [isKeyReleased, setIsKeyReleased] = useState(false);

  const capitalize = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };

  const onChange = (e) => {
    const { value } = e.target;
    setInput(value);
  };

  const onKeyDown = (e) => {
    const { key } = e;
    const newTag = capitalize(input.trim());

    if (key === "," && newTag.length && !tags.includes(newTag)) {
      e.preventDefault();

      setTags((prevState) => [...prevState, newTag]);
      setInput("");
    }

    if (key === "Backspace" && !input.length && tags.length && isKeyReleased) {
      const tagsCopy = [...tags];
      const poppedTag = tagsCopy.pop();
      e.preventDefault();
      setTags(tagsCopy);
      setInput(poppedTag);
    }

    setIsKeyReleased(false);
  };

  const onKeyUp = () => {
    setIsKeyReleased(true);
  };

  const deleteTag = (index) => {
    setTags((prevState) => prevState.filter((tag, i) => i !== index));
  };

  const tagClasses =
    tags.length > 0
      ? `${classes.container} ${classes["container-padding"]}`
      : `${classes.container}`;

  return (
    <div className={tagClasses}>
      {tags.map((tag, index) => (
        <div key={index} className={classes.tag}>
          {tag}
          <button onClick={() => deleteTag(index)}>x</button>
        </div>
      ))}
      <input
        value={input}
        placeholder="Enter a tag (split by ' , ')"
        onKeyDown={onKeyDown}
        onKeyUp={onKeyUp}
        onChange={onChange}
        disabled={isSubmitting}
      />
    </div>
  );
};

export default Tags;

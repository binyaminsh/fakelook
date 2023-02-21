import React, { useEffect, useState } from "react";
import classes from "./Mention.module.css";

const Mention = ({ onSelect, users }) => {
  const [opacity, setOpacity] = useState(0);

  useEffect(() => {
    setOpacity(1);
  }, []);

  return (
    <div style={{ opacity: opacity }} className={classes.container}>
      {users.map((user) => (
        <div
          className={classes.user}
          key={user.username}
          onClick={() => onSelect(user.username)}
        >
          <p>{user.name}</p>
          <p>@{user.username}</p>
        </div>
      ))}
    </div>
  );
};

export default Mention;

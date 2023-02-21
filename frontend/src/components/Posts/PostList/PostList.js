import PostItem from "../PostItem/PostItem";
import classes from "./PostList.module.css";

const PostList = ({ posts }) => {
  return (
    <ul className={classes.posts}>
      {posts.map((post) => (
        <PostItem
          key={post.id}
          id={post.id}
          photoUrl={post.photoUrl}
          content={post.content}
          post={post}
        />
      ))}
    </ul>
  );
};

export default PostList;

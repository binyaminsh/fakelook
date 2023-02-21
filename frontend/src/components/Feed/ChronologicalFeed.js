import classes from "./ChronologicalFeed.module.css";
import PostList from "../Posts/PostList/PostList";
import Card from "../UI/Card";
import { useSelector } from "react-redux";

function ChronologicalFeed() {
  const posts = useSelector((state) => state.feed.filteredPosts);

  let chronologicalPosts = [...posts].reverse();

  return (
    <div className={classes["feed-container"]}>
      <h4 className="centered">Chronological Feed</h4>
      <PostList posts={chronologicalPosts} />
      {posts.length === 0 && (
        <Card className={`${classes.card} centered`}>
          <p>No Posts to show.</p>
        </Card>
      )}
    </div>
  );
}

export default ChronologicalFeed;

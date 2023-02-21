import Map from "../components/Map/Map";
import { useLoadScript } from "@react-google-maps/api";
import LoadingSpinner from "../components/UI/LoadingSpinner";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUserGeolocation } from "../store/geolocation-actions";
import { feedActions } from "../store/feed-slice";
import classes from "../components/Feed/GraphicalFeed.module.css";
import Places from "../components/Map/Places";
import MapFilters from "../components/Map/MapFilters";
import { postsFilter } from "../util/post-filter";
import ChronologicalFeed from "../components/Feed/ChronologicalFeed";

const libraries = ["places"];

const HomePage = () => {
  const posts = useSelector((state) => state.feed.posts);
  const filteredPosts = useSelector((state) => state.feed.filteredPosts);
  const showFeed = useSelector((state) => state.ui.showFeed);

  const [place, setPlace] = useState();
  const [bounds, setBounds] = useState();
  const [tags, setTags] = useState([]);
  const [publishers, setPublishers] = useState();
  const [taggedUsers, setTaggedUsers] = useState();

  const [dateFrom, setDateFrom] = useState();
  const [dateTo, setDateTo] = useState();
  const [radius, setRadius] = useState(0);

  const dispatch = useDispatch();

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries,
  });

  useEffect(() => {
    dispatch(getUserGeolocation());
  }, [dispatch]);

  useEffect(() => {
    if (bounds && posts.length > 0) {
      const filtered = postsFilter(posts, bounds, tags, dateFrom, dateTo, publishers, taggedUsers)

      // console.log("Filtered Posts in current bounds", filtered);

      dispatch(feedActions.setFilteredPosts(filtered));
    }
  },  [bounds, posts, tags, dateFrom, dateTo, publishers, taggedUsers, dispatch]); // prettier-ignore

  const mapIdleHandler = (currentMapBounds) => {
    if (radius === 0) {
      setBounds(currentMapBounds);
    }
  };

  const radiusChangedHandler = useCallback(
    (radiusBounds, mapBounds) => {
      if (radius > 0) {
        setBounds(radiusBounds);
      } else {
        setBounds(mapBounds);
      }
    },
    [radius]
  );

  const onSetPlace = useCallback((position) => {
    setPlace(position);
  }, []);

  const radiusInputHandler = useCallback((e) => {
    const radiusNumber = +e.target.value;
    const radiusInMeters = radiusNumber * 1000;

    setRadius(radiusInMeters);
  }, []);

  const dateFromChangeHandler = useCallback((e) => {
    setDateFrom(new Date(e.target.value));
  }, []);
  const dateToChangeHandler = useCallback((e) => {
    setDateTo(new Date(e.target.value));
  }, []);

  const publishersChangeHandler = useCallback((e) => {
    const trimmedInput = e.target.value.trim();
    setPublishers(trimmedInput);
  }, []);

  const taggedUsersChangeHandler = useCallback((e) => {
    const trimmedInput = e.target.value.trim();
    setTaggedUsers(trimmedInput);
  }, []);

  if (loadError) return <div>Error loading Map</div>;
  if (!isLoaded)
    return (
      <div className="centered">
        <LoadingSpinner />
      </div>
    );

  return (
    <div className={classes.container}>
      {!showFeed && (
        <div className={classes.controls}>
          <h1>Search</h1>
          <Places setPlace={onSetPlace} />
          <h3>Filters</h3>
          <MapFilters
            radius={radius / 1000}
            onRadiusChange={radiusInputHandler}
            tags={tags}
            setTags={setTags}
            onDateFromChange={dateFromChangeHandler}
            onDateToChange={dateToChangeHandler}
            onPublishersChange={publishersChangeHandler}
            onTaggedUsersChange={taggedUsersChangeHandler}
          />
        </div>
      )}
      {showFeed && <ChronologicalFeed />}
      <Map
        posts={filteredPosts}
        onMapIdleHandler={mapIdleHandler}
        onRadiusChangedHandler={radiusChangedHandler}
        radius={radius}
        place={place}
      />
    </div>
  );
};

export default HomePage;

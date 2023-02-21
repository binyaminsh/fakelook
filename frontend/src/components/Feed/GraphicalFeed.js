// import { useCallback, useEffect, useState } from "react";
// import { useSelector } from "react-redux";
// import Map from "../Map/Map";
// import MapFilters from "../Map/MapFilters";
// import Places from "../Map/Places";
// import classes from "./GraphicalFeed.module.css";

// const defaultRadius = null;

// const GraphicalFeed = () => {
//   const posts = useSelector((state) => state.feed.posts);
//   const [filteredPosts, setFilteredPosts] = useState([]);

//   const [bounds, setBounds] = useState();
//   // const [radius, setRadius] = useState();

//   const [place, setPlace] = useState();
//   const [radius, setRadius] = useState(defaultRadius);

//   useEffect(() => {
//     if (bounds) {
//       const filtered = posts.filter((post) =>
//         bounds.contains({ lat: post.lat, lng: post.lng })
//       );
//       console.log("Filtered Posts in current map bounds", filtered);
//       setFilteredPosts(filtered);
//     }
//   }, [bounds, posts]);

//   const onSetPlace = useCallback((position) => {
//     setPlace(position);
//   }, []);

//   const onRadiusChange = useCallback((e) => {
//     const radiusNumber = +e.target.value;
//     const radiusInKM = radiusNumber * 1000;

//     setRadius(radiusInKM);
//   }, []);

//   const mapIdleHandler = (currentMapBounds) => {
//     setBounds(currentMapBounds);
//   };

//   return (
//     <div className={classes.container}>
//       <div className={classes.controls}>
//         <h1>Search</h1>
//         <Places setPlace={onSetPlace} />
//         <h3>Filters</h3>
//         <MapFilters
//           radius={radius / 1000}
//           radiusChangeHandler={onRadiusChange}
//         />
//       </div>
//       <Map
//         posts={filteredPosts}
//         onMapIdleHandler={mapIdleHandler}
//         place={place}
//       />
//     </div>
//   );
// };

// export default GraphicalFeed;

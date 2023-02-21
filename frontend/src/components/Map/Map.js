import classes from "./Map.module.css";
import { GoogleMap, InfoWindow, Marker, CircleF } from "@react-google-maps/api";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { formatRelative } from "date-fns";
import { useSelector } from "react-redux";

const defaultMapPosition = { lat: 64.87, lng: -18 };

const Map = (props) => {
  const { posts, onMapIdleHandler, onRadiusChangedHandler, radius, place } =
    props;
  const [selected, setSelected] = useState(null);

  let userPosition = useSelector((state) => state.geolocation.coords);
  if (userPosition.lat === null || userPosition.lng === null) {
    userPosition = defaultMapPosition;
  }

  const mapRef = useRef();
  const circleRef = useRef();
  const center = useMemo(() => userPosition, [userPosition]);
  const options = useMemo(
    () => ({
      mapId: "4c09aad82dfbc6fa",
      clickableIcons: false,
      disableDefaultUI: true,
      // mapTypeId: "hybrid",
    }),
    []
  );

  const onMapLoad = useCallback((map) => (mapRef.current = map), []);
  const onCircleLoad = useCallback(
    (circle) => (circleRef.current = circle),
    []
  );

  const onMapIdle = () => {
    let bounds = mapRef.current.getBounds();
    onMapIdleHandler(bounds);
  };

  useEffect(() => {
    mapRef.current?.panTo(place);
  }, [place]);

  useEffect(() => {
    if (circleRef.current) {
      const bounds = circleRef.current.getBounds();
      const mapBounds = mapRef.current.getBounds();

      onRadiusChangedHandler(bounds, mapBounds);
    }
  }, [radius, onRadiusChangedHandler]);

  let mostLikedPosts;
  if (posts.length > 100) {
    let sortedPosts = [...posts];
    sortedPosts = sortedPosts.sort((a, b) => a.likes.length - b.likes.length);

    mostLikedPosts = sortedPosts.slice(0, 100);
  }

  return (
    <div className={classes.map}>
      <GoogleMap
        zoom={7}
        center={center}
        mapContainerClassName={classes["map-container"]}
        options={options}
        onLoad={onMapLoad}
        onIdle={onMapIdle}
        // onClick={onMapClick}
      >
        <CircleF
          options={{ fillColor: "white", fillOpacity: 0.1 }}
          center={center}
          radius={radius}
          onLoad={onCircleLoad}
        />
        {place && (
          <Marker
            position={place}
            icon={"https://cdn-icons-png.flaticon.com/512/2826/2826187.png"}
          />
        )}

        {posts.length < 101 &&
          posts.map((post) => (
            <Marker
              key={post.id}
              position={{ lat: post.lat, lng: post.lng }}
              icon={{
                url: posts.length < 31 ? post.photoUrl : undefined,
                scaledSize: new window.google.maps.Size(50, 50),
                origin: new window.google.maps.Point(0, 0),
                anchor: new window.google.maps.Point(25, 25),
              }}
              onClick={() => {
                setSelected(post);
              }}
            />
          ))}

        {posts.length > 100 &&
          mostLikedPosts &&
          mostLikedPosts.map((post) => (
            <Marker
              key={post.id}
              position={{ lat: post.lat, lng: post.lng }}
              icon={{
                scaledSize: new window.google.maps.Size(50, 50),
                origin: new window.google.maps.Point(0, 0),
                anchor: new window.google.maps.Point(25, 25),
              }}
              onClick={() => {
                setSelected(post);
              }}
            />
          ))}

        {selected ? (
          <InfoWindow
            position={{ lat: selected.lat, lng: selected.lng }}
            onCloseClick={() => {
              setSelected(null);
            }}
          >
            <div className={classes["info-window"]}>
              <p>
                <span className={classes.name}>{selected.publisherName}</span>
                <span> @{selected.publisher}</span>
                <span>
                  {" "}
                  • {formatRelative(new Date(selected.time), new Date())}
                </span>
              </p>
              <img src={selected.photoUrl} width={550} alt="" />
              <p className={classes.content}>{selected.content}</p>
              {selected.tags.hashTags.length > 0 && (
                <p>
                  Tags:{" "}
                  {selected.tags.hashTags.map((tag) => (
                    <span key={tag}>{`${tag}, `}</span>
                  ))}
                </p>
              )}
            </div>
          </InfoWindow>
        ) : null}
      </GoogleMap>
    </div>
  );
};

export default Map;

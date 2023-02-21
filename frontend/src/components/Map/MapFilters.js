import Tags from "../UI/Tags";
import classes from "./MapFilters.module.css";

const MapFilters = (props) => {
  return (
    <>
      <div className={classes.control}>
        <label htmlFor="date-from">Date from</label>
        <input
          id="date-from"
          type="datetime-local"
          onChange={props.onDateFromChange}
        />
        <label htmlFor="date-to">Date to</label>
        <input
          id="date-to"
          type="datetime-local"
          onChange={props.onDateToChange}
        />
      </div>
      <div className={classes.control}>
        <label htmlFor="radius">Radius (In KM)</label>
        <input
          id="radius"
          min="0"
          type="number"
          value={props.radius}
          onChange={props.onRadiusChange}
        />
      </div>
      <div className={classes.control}>
        <label htmlFor="publisher">Publishers</label>
        <input
          id="publisher"
          type="text"
          onChange={props.onPublishersChange}
          placeholder="Name/Username (split by ' , ')"
        />
      </div>
      <div className={classes.control}>
        <label>Image tags</label>
        <Tags tags={props.tags} setTags={props.setTags} />
      </div>
      <div className={classes.control}>
        <label htmlFor="tagged-users">Tagged users</label>
        <input
          id="tagged-users"
          type="text"
          onChange={props.onTaggedUsersChange}
          placeholder="Username (split by ' , ')"
        />
      </div>
    </>
  );
};

export default MapFilters;

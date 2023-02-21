import { useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import AuthContext from "../../store/auth-context";
import { uiActions } from "../../store/ui-slice";

import classes from "./MainNavigation.module.css";

const MainNavigation = ({ onAddPostClicked }) => {
  const authCtx = useContext(AuthContext);
  const showFeed = useSelector((state) => state.ui.showFeed);
  const dispatch = useDispatch();

  const isLoggedIn = authCtx.isLoggedIn;

  const logoutHandler = () => {
    authCtx.logout();
  };

  return (
    <header className={classes.header}>
      <Link to="/feed">
        <div className={classes.logo}>Fakelook</div>
      </Link>
      <nav>
        <ul>
          <li>
            <button
              className={classes["modal-button"]}
              onClick={() => dispatch(uiActions.toggleShowFeed())}
            >
              {showFeed ? "Map" : "Feed"}
            </button>
          </li>
          {isLoggedIn && (
            <li>
              <button
                className={classes["modal-button"]}
                onClick={onAddPostClicked}
              >
                Add a post
              </button>
            </li>
          )}
          {!isLoggedIn && (
            <li>
              <Link to="/auth">Login</Link>
            </li>
          )}
          {isLoggedIn && (
            <li>
              <Link to="/profile">Profile</Link>
            </li>
          )}
          {isLoggedIn && (
            <li>
              <button onClick={logoutHandler}>Logout</button>
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default MainNavigation;

import React, { useCallback, useEffect, useState } from "react";

let logoutTimer;
const tokenKey = "token";
const userKey = "user";
const expirationTimeKey = "expirationTime";

const AuthContext = React.createContext({
  token: "",
  currentUser: {},
  isLoggedIn: false,
  login: (token, expirationTime) => {},
  logout: () => {},
  setUser: (user) => {},
});

const calculateRemainingTime = (expirationTime) => {
  const currentTime = new Date().getTime();
  const adjExpirationTime = new Date(expirationTime).getTime();

  const remainingDuration = adjExpirationTime - currentTime;
  return remainingDuration;
};

const retrieveStoredToken = () => {
  const storedToken = localStorage.getItem(tokenKey);
  const storedExpirationDate = localStorage.getItem(expirationTimeKey);
  const storedUser = localStorage.getItem(userKey);

  const remainingTime = calculateRemainingTime(storedExpirationDate);

  if (remainingTime <= 60000) {
    localStorage.removeItem(userKey);
    localStorage.removeItem(tokenKey);
    localStorage.removeItem(expirationTimeKey);
    return null;
  }

  return { token: storedToken, duration: remainingTime, user: storedUser };
};

export const AuthContextProvider = (props) => {
  const tokenData = retrieveStoredToken();
  let initialToken;
  let initialCurrentUser;
  if (tokenData) {
    initialToken = tokenData.token;
    initialCurrentUser = JSON.parse(tokenData.user);
  }
  const [token, setToken] = useState(initialToken);
  const [currentUser, setCurrentUser] = useState(initialCurrentUser);

  const userIsLoggedIn = !!token;

  const logoutHandler = useCallback(() => {
    setToken(null);
    setCurrentUser(null);
    localStorage.removeItem(tokenKey);
    localStorage.removeItem(expirationTimeKey);
    localStorage.removeItem(userKey);

    if (logoutTimer) {
      clearTimeout(logoutTimer);
    }
  }, []);

  const loginHandler = (token, expirationTime) => {
    setToken(token);
    localStorage.setItem(tokenKey, token);
    localStorage.setItem(expirationTimeKey, expirationTime);

    const remainingTime = calculateRemainingTime(expirationTime);

    logoutTimer = setTimeout(logoutHandler, remainingTime);
  };

  const setUserHandler = (user) => {
    setCurrentUser(user);
    localStorage.setItem(userKey, JSON.stringify(user));
  };

  useEffect(() => {
    if (tokenData) {
      logoutTimer = setTimeout(logoutHandler, tokenData.duration);
    }
  }, [tokenData, logoutHandler]);

  const contextValue = {
    token: token,
    currentUser: currentUser,
    isLoggedIn: userIsLoggedIn,
    login: loginHandler,
    logout: logoutHandler,
    setUser: setUserHandler,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthContext;

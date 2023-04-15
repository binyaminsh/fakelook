import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../../store/auth-context";
import ForgotPassword from "./ForgotPassword";
import env from 'react-dotenv'

import classes from "./Auth.module.css";
import LoginForm from "./LoginForm";
import SignUpForm from "./SignUpForm";
import useHttp from "../../hooks/use-http";
// import GoogleAuth from "./GoogleAuth";

// const authUrl = process.env.REACT_APP_AUTH_URL;
// const identityUrl = process.env.REACT_APP_IDENTITY_URL;
const authUrl = env.REACT_APP_AUTH_URL;
const identityUrl = env.REACT_APP_IDENTITY_URL;

const Auth = () => {
  const { error, isLoading, sendRequest: sendAuthRequest } = useHttp();
  const navigate = useNavigate();
  const authCtx = useContext(AuthContext);
  const [isLogin, setIsLogin] = useState(true);
  const [isForgotPassword, setIsForgotPassword] = useState(false);

  const isPasswordResetToggle = () => {
    setIsForgotPassword((prevPass) => !prevPass);
  };

  const switchAuthModeHandler = () => {
    setIsLogin((prevState) => !prevState);
  };

  const signupResponseHandler = async (requestInfo) => {
    await sendAuthRequest(
      {
        url: `${authUrl}/login`,
        method: "POST",
        body: { ...requestInfo },
        headers: { "Content-Type": "application/json" },
      },
      authResponseHandler
    );
  };
  const setUserHandler = (userData) => {
    authCtx.setUser(userData);
  };

  const authResponseHandler = async (loginResult) => {
    const { token, expiresIn, userId } = loginResult;
    const expirationTime = new Date(new Date().getTime() + expiresIn * 1000);
    authCtx.login(token, expirationTime.toISOString());

    await sendAuthRequest(
      {
        url: `${identityUrl}/user/${userId}`,
      },
      setUserHandler
    );

    if (!error) {
      navigate("/");
    }
  };

  const submitHandler = async (authRequest) => {
    let url;
    let authResponseMethod;

    if (isLogin) {
      url = `${authUrl}/login`;
      authResponseMethod = authResponseHandler;
    } else {
      url = `${identityUrl}/createUser`;
      const requestInfo = {
        email: authRequest.email,
        password: authRequest.password,
      };
      authResponseMethod = signupResponseHandler.bind(null, requestInfo);
    }

    await sendAuthRequest(
      {
        url,
        method: "POST",
        body: { ...authRequest },
        headers: { "Content-Type": "application/json" },
      },
      authResponseMethod
    );
  };

  // TODO: Add routing
  if (isForgotPassword) {
    return (
      <section className={classes.auth}>
        <ForgotPassword onBackClicked={isPasswordResetToggle} />
      </section>
    );
  }

  return (
    <section className={classes.auth}>
      <h1>{isLogin ? "Login" : "Sign Up"}</h1>
      {!isLogin && (
        <SignUpForm onSubmitHandler={submitHandler} isLoading={isLoading} />
      )}
      {isLogin && (
        <LoginForm onSubmitHandler={submitHandler} isLoading={isLoading} />
      )}
      {error && <p className={classes["error-text"]}>{error}</p>}
      {!isLoading && (
        <section className={classes.actions}>
          <button
            type="button"
            className={classes.toggle}
            onClick={switchAuthModeHandler}
          >
            {isLogin ? "Create new account" : "Login with existing account"}
          </button>
          {isLogin && (
            <button
              type="button"
              className={classes.toggle}
              onClick={isPasswordResetToggle}
            >
              Forgot Password?
            </button>
          )}
        </section>
      )}
      <div className={classes.seperator}>
        <hr />
        <span>or</span>
        <hr />
      </div>
      <section className={classes.providers}>
        {/* <GoogleAuth onAuthResponse={authResponseHandler} /> */}
      </section>
    </section>
  );
};

export default Auth;

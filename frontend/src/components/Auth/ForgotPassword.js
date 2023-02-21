import { Fragment } from "react";
import useHttp from "../../hooks/use-http";
import useInput from "../../hooks/use-input";
import classes from "./Auth.module.css";

const ForgotPassword = (props) => {
  const {
    error,
    isLoading,
    statusCode,
    sendRequest: sendResetRequest,
  } = useHttp();

  const {
    value: email,
    isValid: isEmailValid,
    hasError: emailHasError,
    valueChangeHandler: emailChangeHandler,
    inputBlurHandler: emailBlurHandler,
  } = useInput(
    (value) =>
      value.trim() !== "" && value.includes("@") && value.trim().length > 2
  );

  const submitHandler = async (e) => {
    e.preventDefault();

    if (!isEmailValid) return;

    // const resetUrl = "http://localhost:5000/auth/requestResetPassword";
    const resetUrl = process.env.REACT_APP_RESET_PASSWORD_URL;

    await sendResetRequest({
      url: resetUrl,
      method: "POST",
      body: { email },
      headers: { "Content-Type": "application/json" },
    });
  };

  const emailClasses = emailHasError
    ? `${classes.control} ${classes.invalid}`
    : `${classes.control}`;

  if (!error && statusCode === 200 && !isLoading) {
    return (
      <Fragment>
        <p>Reset Link has been sent to your E-Mail.</p>
        <div className={classes.actions}>
          <button onClick={props.onBackClicked} type="button">
            Back
          </button>
        </div>
      </Fragment>
    );
  }

  return (
    <form onSubmit={submitHandler}>
      <h1>Forgot your password?</h1>
      <p>
        We'll send you a link to reset it. Enter the email address you use to
        sign in to Fakelook.
      </p>
      <div className={emailClasses}>
        <label htmlFor="email">Your email address</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={emailChangeHandler}
          onBlur={emailBlurHandler}
          required
        />
        {emailHasError && (
          <p className={classes["error-text"]}>Please enter a valid email</p>
        )}
      </div>
      {error && <p>{error}</p>}
      <div className={classes.actions}>
        {!isLoading && (
          <button onClick={props.onBackClicked} type="button">
            Back
          </button>
        )}
        {!isLoading && <button>Send reset link</button>}
        {isLoading && <p>Sending request...</p>}
      </div>
    </form>
  );
};

export default ForgotPassword;

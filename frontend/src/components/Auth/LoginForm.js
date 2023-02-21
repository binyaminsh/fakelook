import useInput from "../../hooks/use-input";
import LoadingSpinner from "../UI/LoadingSpinner";
import classes from "./Auth.module.css";

const LoginForm = (props) => {
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
  const {
    value: password,
    isValid: isPasswordValid,
    hasError: passwordHasError,
    valueChangeHandler: passwordChangeHandler,
    inputBlurHandler: passwordBlurHandler,
  } = useInput(
    (value) =>
      value.trim() !== "" && value.trim().length > 5 && value.trim().length < 31
  );

  const isFormValid = isEmailValid && isPasswordValid;

  const submitHandler = (e) => {
    e.preventDefault();

    if (isFormValid) {
      props.onSubmitHandler({
        email,
        password,
      });
    }
  };

  const emailClasses = emailHasError
    ? `${classes.control} ${classes.invalid}`
    : `${classes.control}`;

  const passwordClasses = passwordHasError
    ? `${classes.control} ${classes.invalid}`
    : `${classes.control}`;

  return (
    <form onSubmit={submitHandler}>
      <div className={emailClasses}>
        <label htmlFor="email">Your Email</label>
        <input
          type="email"
          id="email"
          required
          value={email}
          onChange={emailChangeHandler}
          onBlur={emailBlurHandler}
        />
        {emailHasError && (
          <p className={classes["error-text"]}>Please enter a valid email</p>
        )}
      </div>
      <div className={passwordClasses}>
        <label htmlFor="password">Your Password</label>
        <input
          type="password"
          id="password"
          required
          value={password}
          onChange={passwordChangeHandler}
          onBlur={passwordBlurHandler}
        />
        {passwordHasError && (
          <p className={classes["error-text"]}>
            Enter a valid Password (6 - 30 charachters)
          </p>
        )}
      </div>
      <div className={classes.actions}>
        {!props.isLoading && <button>Login</button>}
        {props.isLoading && (
          <>
            <p>Sending request...</p>
            <LoadingSpinner />
          </>
        )}
      </div>
    </form>
  );
};

export default LoginForm;

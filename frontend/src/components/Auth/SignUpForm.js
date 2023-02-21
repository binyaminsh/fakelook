import { useState } from "react";
import useInput from "../../hooks/use-input";
import LoadingSpinner from "../UI/LoadingSpinner";
import classes from "./Auth.module.css";

const SignUpForm = (props) => {
  const [signUpPage, setSignUpPage] = useState(1);

  const setNextPage = () => {
    setSignUpPage((prevState) => prevState + 1);
  };

  const setPreviousPage = () => {
    setSignUpPage((prevState) => prevState - 1);
  };

  const {
    value: name,
    isValid: isNameValid,
    hasError: nameHasError,
    valueChangeHandler: nameChangeHandler,
    inputBlurHandler: nameBlurHandler,
  } = useInput((value) => value.trim() !== "");

  const {
    value: username,
    isValid: isUsernameValid,
    hasError: usernameHasError,
    valueChangeHandler: usernameChangeHandler,
    inputBlurHandler: usernameBlurHandler,
  } = useInput((value) => value.trim() !== "" && value.split(" ").length === 1);
  // TODO: prevent special charachters

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

  const { value: dateOfBirth, valueChangeHandler: dateChangeHandler } =
    useInput();

  const { value: address, valueChangeHandler: addressChangeHandler } =
    useInput();

  const { value: workplace, valueChangeHandler: workplaceChangeHandler } =
    useInput();

  const isFormValid =
    isNameValid && isEmailValid && isPasswordValid && isUsernameValid;

  const submitHandler = (e) => {
    e.preventDefault();

    if (isFormValid) {
      props.onSubmitHandler({
        name,
        username,
        email,
        password,
        address,
        workplace: workplace,
        dateOfBirth,
      });
    }
  };

  const nameClasses = nameHasError
    ? `${classes.control} ${classes.invalid}`
    : `${classes.control}`;

  const usernameClasses = usernameHasError
    ? `${classes.control} ${classes.invalid}`
    : `${classes.control}`;

  const emailClasses = emailHasError
    ? `${classes.control} ${classes.invalid}`
    : `${classes.control}`;

  const passwordClasses = passwordHasError
    ? `${classes.control} ${classes.invalid}`
    : `${classes.control}`;

  return (
    <>
      <div className={classes["page-title"]}>
        <span>Step {signUpPage} of 2</span>
      </div>
      <form onSubmit={submitHandler}>
        {signUpPage === 1 && (
          <>
            <div className={nameClasses}>
              <label htmlFor="name">Full Name*</label>
              <input
                type="text"
                id="name"
                required
                value={name}
                onChange={nameChangeHandler}
                onBlur={nameBlurHandler}
              />
              {nameHasError && (
                <p className={classes["error-text"]}>Name cannot be empty</p>
              )}
            </div>
            <div className={usernameClasses}>
              <label htmlFor="username">Username*</label>
              <input
                type="text"
                id="username"
                required
                value={username}
                placeholder="Your @Username is unique"
                onChange={usernameChangeHandler}
                onBlur={usernameBlurHandler}
              />
              {usernameHasError && (
                <p className={classes["error-text"]}>
                  Username must be a single word without special charachters.
                </p>
              )}
            </div>
            <div className={emailClasses}>
              <label htmlFor="email">Your Email*</label>
              <input
                type="email"
                id="email"
                required
                value={email}
                onChange={emailChangeHandler}
                onBlur={emailBlurHandler}
              />
              {emailHasError && (
                <p className={classes["error-text"]}>
                  Please enter a valid email
                </p>
              )}
            </div>
            <div className={passwordClasses}>
              <label htmlFor="password">Your Password*</label>
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
          </>
        )}

        {signUpPage === 2 && (
          <>
            <div className={classes.control}>
              <label htmlFor="age">Date of birth</label>
              <input
                type="date"
                id="age"
                value={dateOfBirth}
                onChange={dateChangeHandler}
              />
            </div>
            <div className={classes.control}>
              <label htmlFor="address">Address</label>
              <input
                type="text"
                id="address"
                value={address}
                onChange={addressChangeHandler}
              />
            </div>
            <div className={classes.control}>
              <label htmlFor="workplace">Workplace</label>
              <input
                type="text"
                id="workplace"
                value={workplace}
                onChange={workplaceChangeHandler}
              />
            </div>
          </>
        )}
        <div className={classes.actions}>
          {!props.isLoading && (
            <>
              {signUpPage > 1 && (
                <button type="button" onClick={setPreviousPage}>
                  Back
                </button>
              )}

              {signUpPage === 1 && (
                <button
                  disabled={!isFormValid}
                  type="button"
                  onClick={setNextPage}
                >
                  Next
                </button>
              )}
              {signUpPage === 2 && <button>Create Account</button>}
            </>
          )}
          {props.isLoading && (
            <>
              <p>Sending request...</p>
              <LoadingSpinner />
            </>
          )}
        </div>
      </form>
    </>
  );
};

export default SignUpForm;

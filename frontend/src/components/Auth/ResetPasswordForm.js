import { Form } from "react-router-dom";
import useInput from "../../hooks/use-input";
import classes from "./Auth.module.css";

const ResetPasswordForm = ({ isSubmitting, data }) => {
  const {
    value: password,
    hasError: passwordHasError,
    valueChangeHandler: passwordChangeHandler,
    inputBlurHandler: passwordBlurHandler,
  } = useInput((value) => value.trim().length > 5 && value.trim().length < 31);

  const passwordClasses = passwordHasError
    ? `${classes.control} ${classes.invalid}`
    : `${classes.control}`;

  return (
    <Form className={classes.auth} method="post" action="/passwordReset">
      <div className={passwordClasses}>
        <label htmlFor="password">Enter New Password</label>
        <input
          id="password"
          type="password"
          name="password"
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
      {data && data.response.data && data.response.status && (
        <p className={classes["error-text"]}>
          {data.response.data.errors[0].message}
        </p>
      )}
      <div className={classes.actions}>
        {!isSubmitting && <button>Submit</button>}
        {isSubmitting && <p>Sending request...</p>}
      </div>
    </Form>
  );
};

export default ResetPasswordForm;

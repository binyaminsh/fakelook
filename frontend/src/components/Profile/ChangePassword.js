import { useRef } from "react";
import classes from "./ProfileForm.module.css";

const ChangePassword = () => {
  // const navigate = useNavigate();
  // const authCtx = useContext(AuthContext);
  const newPasswordInputRef = useRef();

  const submitHandler = (e) => {
    e.preventDefault();

    // const enteredNewPassword = newPasswordInputRef.current.value;

    // // add validation

    // fetch(
    //   "https://identitytoolkit.googleapis.com/v1/accounts:update?key=AIzaSyDiPWITJW3CGmWCRXURLCkxnupDgGeobck",
    //   {
    //     method: "POST",
    //     body: JSON.stringify({
    //       idToken: authCtx.token,
    //       password: enteredNewPassword,
    //       returnSecureToken: false,
    //     }),
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //   }
    // ).then((res) => {
    //   // assuming res is successful

    //   navigate("/");
    // });
  };

  return (
    <form className={classes.form} onSubmit={submitHandler}>
      <div className={classes.control}>
        <label htmlFor="new-password">New Password</label>
        <input
          type="password"
          minLength="6"
          id="new-password"
          ref={newPasswordInputRef}
        />
      </div>
      <div className={classes.action}>
        <button>Change Password</button>
      </div>
    </form>
  );
};

export default ChangePassword;

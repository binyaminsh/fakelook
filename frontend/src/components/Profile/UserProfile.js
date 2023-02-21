import { useState } from "react";
import ProfileDetails from "./ProfileDetails"
import ProfileForm from "./ProfileForm"
import classes from "./UserProfile.module.css";

const UserProfile = () => {
  const [isEdit, setIsEdit] = useState(false);

  function isEditingHandler() {
    setIsEdit((prevIsEdit) => !prevIsEdit);
  }

  return (
    <>
      <section className={classes.profile}>
        <h1>Your User Profile</h1>
        {isEdit && <ProfileForm  onFinisEditing={isEditingHandler}/>}
        {!isEdit && <ProfileDetails/>}
      </section>
      <section>
        <div className={classes.action}>
          <button  onClick={isEditingHandler}>{!isEdit ? "Edit" : "Details"}</button>
        </div>
      </section>
    </>
  );
};

export default UserProfile;

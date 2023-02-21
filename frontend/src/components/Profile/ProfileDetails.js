import { useContext } from "react";
import AuthContext from "../../store/auth-context";

const ProfileDetails = () => {
  const AuthCtx = useContext(AuthContext);
  const currentUser = AuthCtx.currentUser;

  return (
    <div>
      <h1>Info</h1>
      <p>user Name : {currentUser.name}</p>
      <p>Adress : {currentUser.address}</p>
      <p>workPlace : {currentUser.workplace}</p>
    </div>
  );
};

export default ProfileDetails;

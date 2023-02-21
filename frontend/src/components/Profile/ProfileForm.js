import { useContext, useState } from "react";
import classes from "./ProfileForm.module.css";
import AuthContext from "../../store/auth-context";
import useHttp from "../../hooks/use-http";

const ProfileForm = (props) => {

    const { sendRequest: SendUpdatedUserDetails } = useHttp()
    const AuthCtx = useContext(AuthContext);
    const currentUser = AuthCtx.currentUser;
    const [name, SetName] = useState(currentUser.name);
    const [address, SetAddress] = useState(currentUser.address);
    const [workplace, SetWorkPlace] = useState(currentUser.workplace);
    const [dateOfBirth, SetdateOfBirth] = useState(currentUser.dateOfBirth);
    const updatedUser = { name, address, workplace, dateOfBirth };

    const [errorMessage, setErrorMessage] = useState("");
    function Validation(value) {
        if (value.length > 1) return true;
        else return false;
    }

    function updateResponsHandler(updatedUser) { AuthCtx.setUser(updatedUser) }

    const submitHandler = async (e) => {
        e.preventDefault();
        if (Validation(name)) {
            await SendUpdatedUserDetails(
                {
                    // url: `http://localhost:5001/identity/updateUser/${currentUser._id}`,
                    url: `${process.env.REACT_APP_IDENTITY_UPDATEUSER_URL}/${currentUser._id}`,
                    method: "PUT",
                    body: { ...updatedUser },
                    headers: { "Content-Type": "application/json" },
                },
                updateResponsHandler
            );
            props.onFinisEditing();
        }
        else {
            setErrorMessage(" Enter a valid name (1 - 30 charachters) ")
        }
    }

    return (
        <div>
            <form className={classes.form} onSubmit={submitHandler}>
                <div className={classes.control}>
                    <label htmlFor="name">Name</label>
                    <input
                        type="text"
                        id="name"
                        required
                        value={name}
                        onChange={(e) => SetName(e.target.value)}
                    />
                    {errorMessage && <div className="error-text"> {errorMessage} </div>}
                </div>

                <div className={classes.control}>
                    <label htmlFor="address">Address</label>
                    <input
                        type="text"
                        minLength="2"
                        id="address"
                        value={address}
                        onChange={(e) => SetAddress(e.target.value)}
                    />
                </div>
                <div className={classes.control}>
                    <label htmlFor="name">WorkPlace</label>
                    <input
                        type="text"
                        minLength="2"
                        id="workPlace"
                        value={workplace}
                        onChange={(e) => SetWorkPlace(e.target.value)}
                    />
                </div>
                <div className={classes.control}>
                    <label htmlFor="age">Date of birth</label>
                    <input
                        type="date"
                        id="age"
                        value={dateOfBirth}
                        onChange={(e) => SetdateOfBirth(e.target.value)}
                    />
                </div>
                <div className={classes.action}>
                    <button>Save changes</button>
                </div>
            </form>
        </div>
    );
}

export default ProfileForm;

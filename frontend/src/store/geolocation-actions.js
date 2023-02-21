import { geolocationActions } from "./geolocation-slice";

export const getUserGeolocation = () => {
  return async (dispatch) => {
    navigator.geolocation.getCurrentPosition((position) =>
      dispatch(
        geolocationActions.getGeolocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        })
      )
    );
  };
};

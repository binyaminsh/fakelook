import classes from "./Auth.module.css";

import { useEffect, useRef } from "react";
import useHttp from "../../hooks/use-http";

const loadScript = (src) =>
  new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) return resolve();
    const script = document.createElement("script");
    script.src = src;
    script.onload = () => resolve();
    script.onerror = (err) => reject(err);
    document.body.appendChild(script);
  });

const authUrl = process.env.REACT_APP_AUTH_URL;

const GoogleAuth = (props) => {
  const googleButton = useRef(null);
  const { error, sendRequest: sendAuthRequest } = useHttp();

  const { onAuthResponse } = props;

  useEffect(() => {
    const src = "https://accounts.google.com/gsi/client";
    const id = process.env.REACT_APP_GOOGLE_KEY;

    const handleCredentialResponse = async (response) => {
      await sendAuthRequest(
        {
          url: `${authUrl}/google`,
          method: "POST",
          body: { token: response.credential },
          headers: { "Content-Type": "application/json" },
        },
        onAuthResponse
      );
    };

    loadScript(src)
      .then(() => {
        /*global google*/
        google.accounts.id.initialize({
          client_id: id,
          callback: handleCredentialResponse,
        });
        google.accounts.id.renderButton(googleButton.current, {
          theme: "outline",
          size: "large",
        });
      })
      .catch(console.error);

    return () => {
      const scriptTag = document.querySelector(`script[src="${src}"]`);
      if (scriptTag) document.body.removeChild(scriptTag);
    };
  }, [sendAuthRequest, onAuthResponse]);

  return (
    <>
      <div className={classes.g_id_signin} ref={googleButton}></div>
      {error && <p>{error}</p>}
    </>
  );
};

export default GoogleAuth;

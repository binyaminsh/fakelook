import { useCallback, useState } from "react";
import axios from "axios";

const useHttp = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [statusCode, setStatusCode] = useState();

  const sendRequest = useCallback(async (requestConfig, dataHandler) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await axios(requestConfig.url, {
        method: requestConfig.method ? requestConfig.method : "GET",
        headers: requestConfig.headers ? requestConfig.headers : {},
        data: requestConfig.body ? requestConfig.body : null,
      });
      
      console.log(response);
      setStatusCode(response.status);
      if (response.data && dataHandler) {
        dataHandler(response.data);
      }
    } catch (err) {
      console.log(err);

      if (err.response.data) {
        setError(
          err.response.data.errors[0].message || "Something went wrong!"
        );
      } else {
        setError(err.name);
      }
    }
    setIsLoading(false);
  }, []);

  return {
    isLoading,
    error,
    statusCode,
    sendRequest,
  };
};

export default useHttp;

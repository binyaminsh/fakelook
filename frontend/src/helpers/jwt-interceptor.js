import axios from "axios";

export function jwtInterceptor() {
  const tokenKey = "token";

  axios.interceptors.request.use((request) => {
    // add auth header with jwt if account is logged in and request is to the api url

    const token = localStorage.getItem(tokenKey);
    if (token) {
      request.headers.common.Authorization = `Bearer ${token}`;
    }

    return request;
  });
}

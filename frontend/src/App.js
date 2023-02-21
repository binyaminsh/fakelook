import { useContext, useEffect, useMemo } from "react";
import {
  Route,
  Navigate,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";
import AuthContext from "./store/auth-context";
import RootLayout from "./components/Layout/RootLayout";
import AuthPage from "./pages/AuthPage";
import HomePage from "./pages/HomePage";
import ErrorPage from "./pages/ErrorPage";
import ResetPassword, {
  action as ResetPasswordAction,
} from "./pages/ResetPassword";
import ProfilePage from "./pages/ProfilePage";
import { useDispatch } from "react-redux";
import { feedActions } from "./store/feed-slice";

function App() {
  const authCtx = useContext(AuthContext);
  const { isLoggedIn } = authCtx;
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(feedActions.startConnection());
  }, [dispatch]);

  const router = useMemo(
    () =>
      createBrowserRouter(
        createRoutesFromElements(
          <Route path="/" element={<RootLayout />} errorElement={<ErrorPage />}>
            <Route index exact element={<Navigate to="/feed" replace />} />
            <Route path="feed" element={<HomePage />} />
            {!isLoggedIn && <Route path="/auth" element={<AuthPage />} />}
            {isLoggedIn && <Route path="/profile" element={<ProfilePage />} />}
            <Route path="*" element={<Navigate replace to="/feed" />} />
            <Route
              path="/passwordReset"
              element={<ResetPassword />}
              action={ResetPasswordAction}
            />
          </Route>
        )
      ),
    [isLoggedIn]
  );

  return <RouterProvider router={router} />;
}

export default App;

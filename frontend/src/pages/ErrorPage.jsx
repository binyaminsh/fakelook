import { useRouteError } from "react-router-dom";
import MainNavigation from "../components/Layout/MainNavigation";

function ErrorPage() {
  const error = useRouteError();

  return (
    <>
      <MainNavigation />
      <main>
        <h1>An error occurred</h1>
        {error && error.message && <p>{error.message}</p>}
        {error && error.response && error.response.data && (
          <p>{error.response.data.errors[0].message}</p>
        )}
      </main>
    </>
  );
}

export default ErrorPage;

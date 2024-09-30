import { Outlet, Navigate, useLocation } from "react-router-dom";

type PrivateRoutesProps = {
  route: string;
};

function PrivateRoutes({ route }: PrivateRoutesProps) {
  const location = useLocation();
  const isAuth = localStorage.getItem("isLoggedIn") === "true";

  return (
    <>
      {isAuth ? (
        <Outlet />
      ) : (
        <Navigate to={route} state={{ from: location }} replace />
      )}
    </>
  );
}

export default PrivateRoutes;

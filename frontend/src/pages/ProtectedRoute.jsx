import { Fragment } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedRoutes = () => {
  const { isAuth } = useSelector((state) => state.authReducer);
  return (
    <Fragment>
      {isAuth === true && <Outlet />}
      {isAuth === false && <Navigate to="/login" />}
      {/* {isAuth === null && <Navigate to="/login" />} */}
    </Fragment>
  );
};

export default ProtectedRoutes;

import  { Fragment, useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import AuthContext from "../context/Auth-ctx";

const ProtectedRoutes = () => {
  const authCtx = useContext(AuthContext);
  const { isLoggedIn } = authCtx;
  return (
    <Fragment>{isLoggedIn ? <Outlet /> : <Navigate to="/login" />}</Fragment>
  );
};

export default ProtectedRoutes;

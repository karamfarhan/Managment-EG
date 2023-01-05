import { Fragment } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedRoutes = () => {
  const { user } = useSelector((state) => state.authReducer);

  return (
    <Fragment>{user !== null ? <Outlet /> : <Navigate to="/login" />}</Fragment>
  );
};

export default ProtectedRoutes;

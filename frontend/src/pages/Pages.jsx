import { Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

//pages
import AuthPage from "./AuthPage";
import { CarsPage } from "./CarsPage";
import { GalleryPage } from "./GalleryPage";
import ProtectedRoutes from "./ProtectedRoute";
import StaffPage from "./StaffPage";
import { StoresPage } from "./StoresPage";

const Pages = () => {
  const { user } = useSelector((state) => state.authReducer);

  return (
    <Routes>
      <Route
        path="/login"
        element={user !== null ? <Navigate to="/staff" /> : <AuthPage />}
      />
      <Route
        path="/"
        element={
          user !== null ? <Navigate to="/staff" /> : <Navigate to="/login" />
        }
      />
      <Route element={<ProtectedRoutes />}>
        <Route
          path="/staff"
          element={user !== null ? <StaffPage /> : <AuthPage />}
        />
        <Route path="/store" element={<StoresPage />} />
        <Route path="/gallery" element={<GalleryPage />} />
        <Route path="/cars" element={<CarsPage />} />
      </Route>
    </Routes>
  );
};

export default Pages;

import { Routes, Route, Navigate } from "react-router-dom";
import jwt_decode from "jwt-decode";
import { useSelector } from "react-redux";

//pages
import AuthPage from "./AuthPage";
import CarsPage from "./CarsPage";
import GalleryPage from "./GalleryPage";
import ProtectedRoutes from "./ProtectedRoute";
import StaffPage from "./StaffPage";
import StoresPage from "./StoresPage";
import StoreDetailPage from "./StoreDetailPage";
import CreateSubstancePage from "./CreateSubstancePage";
import InvoiceDetailPage from "./InvoiceDetailPage";
import EmpolyeeData from "./EmpolyeeData";
import CarDetailPage from "./CarDetailPage";
import EditCarPage from "./EditCarPage";
const Pages = () => {
  const { token } = useSelector((state) => state.authReducer);

  const { isAuth } = useSelector((state) => state.authReducer);

  const ar = ["staff"];
  // let decoded;
  // if (token !== null) {
  //   decoded = jwt_decode(token);
  // }
  // const permissions = token && decoded.permissions;
  // const allPermissions = token && permissions.join(" ");

  // if (isAuth && token && allPermissions.includes("employee")) {
  //   Navigate("/s");
  // }

  return (
    <Routes>
      <Route
        path="/login"
        element={isAuth ? <Navigate to={`/${ar[0]}`} /> : <AuthPage />}
      />
      <Route
        path="/"
        element={isAuth ? <Navigate to="/staff" /> : <Navigate to="/login" />}
      />
      <Route element={<ProtectedRoutes />}>
        <Route
          path="/staff/*"
          element={isAuth ? <StaffPage /> : <AuthPage />}
        />
        <Route
          path="/staff/:empolyeeId"
          element={isAuth ? <EmpolyeeData /> : <AuthPage />}
        />
        <Route path="/store/*" element={<StoresPage />} />
        <Route path="/store/:storeId/*" element={<StoreDetailPage />} />
        <Route
          path="/store/:storeId/:invoiceId"
          element={<InvoiceDetailPage />}
        />
        <Route path="/create_subs/*" element={<CreateSubstancePage />} />
        <Route path="/gallery" element={<GalleryPage />} />
        <Route path="/cars/*" element={<CarsPage />} />
        <Route path="/cars/:driverId/:carId" element={<CarDetailPage />} />
        <Route path="/cars/edit/:driverId" element={<EditCarPage />} />
      </Route>
    </Routes>
  );
};

export default Pages;

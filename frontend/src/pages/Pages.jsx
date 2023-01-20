import { useContext } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import AuthContext from "../context/Auth-ctx";
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
  const authCtx = useContext(AuthContext);
  const { isLoggedIn } = authCtx;
  console.log(isLoggedIn);
  return (
    <Routes>
      <Route
        path="/login"
        element={isLoggedIn ? <Navigate to="/staff" /> : <AuthPage />}
      />
      <Route
        path="/"
        element={
          isLoggedIn ? <Navigate to="/staff" /> : <Navigate to="/login" />
        }
      />
      <Route element={<ProtectedRoutes />}>
        <Route
          path="/staff/*"
          element={isLoggedIn ? <StaffPage /> : <AuthPage />}
        />
        <Route
          path="/staff/:empolyeeId"
          element={isLoggedIn ? <EmpolyeeData /> : <AuthPage />}
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

import { Routes, Route, Navigate } from "react-router-dom";
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
import HomePage from "./HomePage";
const Pages = () => {
  const { isAuth } = useSelector((state) => state.authReducer);

  return (
    <Routes>
      <Route
        path="/login"
        element={isAuth === true ? <Navigate to="/main" /> : <AuthPage />}
      />

      <Route
        path="/"
        element={
          isAuth === true ? <Navigate to="/main" /> : <Navigate to="/login" />
        }
      />
      <Route element={<ProtectedRoutes />}>
        <Route
          path="/main"
          element={isAuth === true ? <HomePage /> : <AuthPage />}
        />
        <Route
          path="/staff/*"
          element={isAuth === true ? <StaffPage /> : <AuthPage />}
        />
        <Route
          path="/staff/:empolyeeId"
          element={isAuth === true ? <EmpolyeeData /> : <AuthPage />}
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

import { Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

//pages
import AuthPage from "./AuthPage";
import CarsPage from "./CarsPage";
// import GalleryPage from "./GalleryPage";
import ProtectedRoutes from "./ProtectedRoute";
import StaffPage from "./StaffPage";
import StoresPage from "./StoresPage";
import StoreDetailPage from "./StoreDetailPage";
import CreateSubstancePage from "./CreateSubstancePage";
import InvoiceDetailPage from "./InvoiceDetailPage";
import EmpolyeeData from "./EmpolyeeData";
import CarDetailPage from "./CarDetailPage";
import HomePage from "./HomePage";
import InvoicesPage from "./InvoicesPage";
import PurchasesPage from "./PurchasesPage";
const Pages = () => {
  const { isAuth } = useSelector((state) => state.authReducer);
  console.log(isAuth);

  return (
    <Routes>
      <Route
        path="/login"
        element={isAuth === true ? <Navigate to="/staff" /> : <AuthPage />}
      />

      <Route
        path="/"
        element={
          isAuth === true ? <Navigate to="/staff" /> : <Navigate to="/login" />
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
        <Route path="/purchases" element={<PurchasesPage />} />

        <Route path="/invoice" element={<InvoicesPage />} />

        <Route path="/create_subs/*" element={<CreateSubstancePage />} />
        {/* <Route path="/projects" element={<GalleryPage />} /> */}
        <Route path="/cars/*" element={<CarsPage />} />
        <Route path="/cars/:carId" element={<CarDetailPage />} />
      </Route>
    </Routes>
  );
};

export default Pages;

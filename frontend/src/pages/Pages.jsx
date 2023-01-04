import { Routes, Route } from "react-router-dom";

//pages
import AuthPage from "./AuthPage";
import { CarsPage } from "./CarsPage";
import { GalleryPage } from "./GalleryPage";
import StaffPage from "./StaffPage";
import { StoresPage } from "./StoresPage";

const Pages = () => {
  return (
    <Routes>
      <Route path="/" element={<AuthPage />} />
      <Route path="/staff" element={<StaffPage />} />
      <Route path="/store" element={<StoresPage />} />
      <Route path="/gallery" element={<GalleryPage />} />
      <Route path="/cars" element={<CarsPage />} />
    </Routes>
  );
};

export default Pages;

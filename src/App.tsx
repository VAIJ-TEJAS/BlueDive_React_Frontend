import { Route, Routes } from "react-router-dom";
import "./assets/css/tailwind.css";
import "./assets/css/materialdesignicons.min.css";
import Home from "./pages/Home";
import Package from "./pages/Package";
import TourPackages from "./pages/TourPackages";
import Booking from "./pages/Booking";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/tour-packages/" element={<TourPackages />} />
      <Route path="/package/:package_name" element={<Package />} />
      <Route path="/booking/:package_name" element={<Booking />} />
    </Routes>
  );
}

export default App;

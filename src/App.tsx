import { Route, Routes } from "react-router-dom";
import "./assets/css/tailwind.css";
import "./assets/css/materialdesignicons.min.css";
import Home from "./pages/Home";
import Package from "./pages/Package";
import TourPackages from "./pages/TourPackages";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/tour-packages/" element={<TourPackages />} />
      <Route path="/package/:package_name" element={<Package />} />
      <Route path="/booking/" element={<Package />} />
    </Routes>
  );
}

export default App;

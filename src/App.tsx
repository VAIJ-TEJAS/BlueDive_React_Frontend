import { Route, Routes } from "react-router-dom";
import "./assets/css/tailwind.css";
import "./assets/css/materialdesignicons.min.css";
import Home from "./pages/Home";
import Package from "./pages/Package";
import TourPackages from "./pages/TourPackages";
import Booking from "./pages/Booking";
import Aboutus from "./pages/About";
import Contact from "./pages/Contact";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import UserProfile from "./pages/UserProfile";
import UserSetting from "./pages/UserSettings";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/tour-packages/" element={<TourPackages />} />
      <Route path="/package/:package_name" element={<Package />} />
      <Route path="/booking/:package_name" element={<Booking />} />
      <Route path="/aboutus/" element={<Aboutus />} />
      <Route path="/contact/" element={<Contact />} />
      <Route path="/privacy-policy/" element={<Privacy />} />
      <Route path="/terms-of-service/" element={<Terms />} />

      {/* Authenticated Routes  */}
      <Route path="/user-profile/" element={<UserProfile />} />
      <Route path="/user-setting/" element={<UserSetting />} />
    </Routes>
  );
}

export default App;

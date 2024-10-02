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
import Auth from "./components/auth";
import { Context } from "./context/context.provider";
import UserTour from "./pages/UserTour";
import Partner from "./pages/Partner";

function App() {
  const { userAuthenticated } = Context();

  return (
    <div>
      <Auth />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/tour-packages/" element={<TourPackages />} />
        <Route path="/package/:package_name" element={<Package />} />
        <Route path="/booking/:package_name" element={<Booking />} />
        <Route path="/aboutus/" element={<Aboutus />} />
        <Route path="/contact/" element={<Contact />} />
        <Route path="/privacy-policy/" element={<Privacy />} />
        <Route path="/terms-of-service/" element={<Terms />} />
        <Route path="/partner/" element={<Partner />} />

        {userAuthenticated && (
          <>
            <Route path="/user-profile/" element={<UserProfile />} />
            <Route path="/user-setting/" element={<UserSetting />} />
            <Route path="/user-tour/:id" element={<UserTour />} />
          </>
        )}
      </Routes>
    </div>
  );
}

export default App;

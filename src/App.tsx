import { Route, Routes } from "react-router-dom";
import "./assets/css/tailwind.css";
import "./assets/css/materialdesignicons.min.css";
import Home from "./pages/Home";
import Package from "./pages/Package";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/package/:package_name" element={<Package />} />
    </Routes>
  );
}

export default App;

import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { MyContextProvider } from "./context/context.provider.tsx";
import App from "./App.tsx";
import "./index.css";

declare global {
  interface Window {
    global: any;
  }
}

window.global ||= window;

ReactDOM.createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <MyContextProvider>
      <App />
    </MyContextProvider>
  </BrowserRouter>
);

import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { MyContextProvider } from "./context/context.provider.tsx";
import App from "./App.tsx";
import "./index.css";
import { ConfigProvider } from "antd";

declare global {
  interface Window {
    global: any;
  }
}

window.global ||= window;

ReactDOM.createRoot(document.getElementById("root")!).render(
  <ConfigProvider
    theme={{
      token: {
        colorPrimary: "#ef4444",
      },
    }}
  >
    <BrowserRouter>
      <MyContextProvider>
        <App />
      </MyContextProvider>
    </BrowserRouter>
  </ConfigProvider>
);

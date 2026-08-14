import { Provider } from "react-redux";
import React from "react";
import ReactDom from "react-dom/client";
import { store } from "./store/store.js";
import App from "./App.jsx";
import "./styles/index.css";

ReactDom.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
);

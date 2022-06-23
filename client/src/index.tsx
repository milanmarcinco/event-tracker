import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import axios from "axios";

import store from "./store/index";

import App from "./App";

import "./index.scss";

axios.defaults.baseURL = process.env.REACT_APP_BACKEND_URL;
axios.defaults.timeout = 7000;
axios.defaults.headers.post["Content-Type"] = "application/json";
store.subscribe(() => {
  axios.defaults.headers.common["Authorization"] = `Bearer ${store.getState().authSlice.accessToken}` || "";
});

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <Provider store={store}>
        <App />
      </Provider>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById("root")
);

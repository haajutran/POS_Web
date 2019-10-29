import "antd/dist/antd.css";
import "./assets/css/login.css";
import "./assets/css/index.css";
import "./assets/scss/custom.scss";

// import "froala-editor/js/froala_editor.pkgd.min.js";
// import "froala-editor/css/froala_style.min.css";
// import "froala-editor/css/froala_editor.pkgd.min.css";
// import "froala-editor/js/plugins.pkgd.min.js";
// import "font-awesome/css/font-awesome.css";
import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import configureStore from "./store/configureStore";

const store = configureStore();

ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>,
  document.getElementById("root")
);

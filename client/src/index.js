import React from "react";
import ReactDOM from "react-dom";

import App from "./App";
// bootstrap
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import "../node_modules/bootstrap/dist/js/bootstrap.min.js";
import "../node_modules/jquery/dist/jquery.min.js";
import "../node_modules/popper.js/dist/popper.min.js";
//Ant design
import "../node_modules/antd/dist/antd.css";
//font awesome
import "../node_modules/font-awesome/css/font-awesome.min.css";
//Loading
import "../node_modules/react-loader-spinner/dist/loader/css/react-spinner-loader.css";

//Redux
import { Provider } from "react-redux";
import store from "./store/index";
import SocketService from "./service/socket/SocketService";
//Notification
import "react-notifications/lib/notifications.css";

ReactDOM.render(
  <Provider store={store}>
    <SocketService uri={"http://localhost:4001"}>
      <App />
    </SocketService>
  </Provider>,
  document.getElementById("root")
);

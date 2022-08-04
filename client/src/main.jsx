import React from "react";
import ReactDOM from "react-dom";

import App from "./App.jsx";
//Ant design
import "../node_modules/antd/dist/antd.css";

//Redux
import { Provider } from "react-redux";
import store from "./store/store";
import SocketService from "./service/socket/SocketService.jsx";

import "./styles/styles.scss";

ReactDOM.render(
  <Provider store={store}>
    <SocketService uri={"http://localhost:4001"}>
      <App />
    </SocketService>
  </Provider>,
  document.getElementById("root")
);

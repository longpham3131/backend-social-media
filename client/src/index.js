import React from "react";
import ReactDOM from "react-dom";

import App from "./App";
//Ant design
import "../node_modules/antd/dist/antd.css";


//Redux
import { Provider } from "react-redux";
import store from "./store/index";
import SocketService from "./service/socket/SocketService";

import './App.less'
import './styles/styles.scss'

ReactDOM.render(
  <Provider store={store}>
    <SocketService uri={"http://localhost:4001"}>
      <App />
    </SocketService>
  </Provider>,
  document.getElementById("root")
);

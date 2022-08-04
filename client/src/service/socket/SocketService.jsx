import React from "react";
import PropTypes from "prop-types";
import io from "socket.io-client";
import { SocketContext } from "./SocketContext";
// import { debug } from "./utils";

class SocketService extends React.Component {
  constructor(props) {
    super(props);

<<<<<<< HEAD:client/src/service/socket/SocketService.js
    this.socket = io(props.uri,{ transports: ["websocket"] });
=======
    this.socket = io(props.uri, {transports: ['websocket']});
>>>>>>> refactor-FE:client/src/service/socket/SocketService.jsx

    this.socket.status = "initialized";

   
  }

  render() {
    return (
      <SocketContext.Provider value={this.socket}>
        {React.Children.only(this.props.children)}
      </SocketContext.Provider>
    );
  }
}

SocketService.propTypes = {
  options: PropTypes.object,
  uri: PropTypes.string,
  children: PropTypes.element.isRequired,
};

export default SocketService;

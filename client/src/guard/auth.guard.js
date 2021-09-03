import React from "react";
import { Route, Redirect } from "react-router-dom";

const AuthRoute = ({ path, Component }) => {
  return (
    <Route
      path={path}
      render={(routeProps) => {
        if (localStorage.getItem("accessToken")) {
          return <Component {...routeProps} />;
        }
        return <Redirect to="/login" />;
      }}
    />
  );
};
export default AuthRoute;

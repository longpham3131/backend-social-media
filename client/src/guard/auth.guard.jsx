import React from "react";
import { Outlet, Navigate } from "react-router-dom";

const AuthRoute = () => {
  const auth = localStorage.getItem("token"); // determine if authorized

  // If authorized, return an outlet that will render child elements
  // If not, return element that will navigate to login page
  return auth ? <Outlet /> : <Navigate to="/login" />;
};
export default AuthRoute;

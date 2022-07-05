import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import AuthRoute from "./guard/auth.guard";
//SCSS

import AuthPage from "@/pages/Auth";
import Social from "@/pages/Social";
import Message from "@/pages/Social/Message";
import Login from "@/pages/Auth/Login";
import Register from "@/pages/Auth/Register";
import ForgetPassword from "@/pages/Auth/ForgetPassword";
const App = () => {
  return (
    <BrowserRouter>
      {/* <Header /> */}
      <Routes>
        <Route path="/login" element={<AuthPage slot={<Login />} />} />
        <Route path="/register" element={<AuthPage slot={<Register />} />} />
        <Route
          path="/forget-password"
          element={<AuthPage slot={<ForgetPassword />} />}
        />

        {/* <AuthPage /> */}
        <Route exact path="*" element={<AuthRoute />}>
          <Route exact path="*" element={<Social />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;

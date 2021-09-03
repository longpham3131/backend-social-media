import React, { useEffect } from "react";
import { BrowserRouter, Route, Switch, useHistory } from "react-router-dom";
import AuthRoute from "./guard/auth.guard";
import LoginAndRegister from "./pages/LoginAndRegister";
import Profile from "./pages/Profile";
import SocialMedia from "./pages/SocialMedia";

const App = () => {
  return (
    <BrowserRouter>
      <>
        <Switch>
          <Route
            path="/login"
            render={(props) => <LoginAndRegister {...props} />}
          />
          <AuthRoute path="/" Component={SocialMedia} />
          <AuthRoute path="/profile/:id" Component={Profile} />
        </Switch>
      </>
    </BrowserRouter>
  );
};

export default App;

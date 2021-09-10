import React, { useEffect } from "react";
import { BrowserRouter, Route, Switch, useHistory } from "react-router-dom";
import AuthRoute from "./guard/auth.guard";
import LoginAndRegister from "./pages/LoginAndRegister";
import Profile from "./pages/Profile";
import SocialMedia from "./pages/SocialMedia";

//SCSS
import "./scss/index.scss";

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
          <AuthRoute path="/profile/" Component={Profile} />
        </Switch>
      </>
    </BrowserRouter>
  );
};

export default App;

import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import AuthRoute from "./guard/auth.guard";
import LoginAndRegister from "./pages/LoginAndRegister";
import Profile from "./pages/Profile";
import SocialMedia from "./pages/SocialMedia";
import Header from "./compoents/Header";

//SCSS
import "./scss/index.scss";

const App = () => {
  return (
    <BrowserRouter>
      <>
        <Header />
        <Switch>
          <Route
            path="/login"
            render={(props) => <LoginAndRegister {...props} />}
          />
          <AuthRoute path="/profile/:id" Component={Profile} />
          <AuthRoute path="/" Component={SocialMedia} />
        </Switch>
      </>
    </BrowserRouter>
  );
};

export default App;

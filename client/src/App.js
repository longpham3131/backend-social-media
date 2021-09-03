import React from "react";
import { BrowserRouter, Route, Switch, useHistory } from "react-router-dom";
import Auth from "./pages/Auth";
import Profile from "./pages/Profile";
import SocialMedia from "./pages/SocialMedia";

const App = () => {
  return (
    <BrowserRouter>
      <>
        <Switch>
          <Route path="/" render={() => <SocialMedia />}></Route>
          <Route path="/auth" render={() => <Auth></Auth>}></Route>
          <Route path="/profile/:id" render={() => <Profile></Profile>}></Route>
        </Switch>
      </>
    </BrowserRouter>
  );
};

export default App;

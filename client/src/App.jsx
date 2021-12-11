import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import AuthRoute from "./guard/auth.guard";
//SCSS

import AuthPage from "@/pages/Auth";
import Social from "@/pages/Social";

const App = () => {
  return (
    <BrowserRouter>
      {/* <Header /> */}
      <Switch>
        <Route path="/login" render={(props) => <AuthPage {...props} />} />
        <AuthRoute path="" Component={Social} />
        {/* <AuthRoute path="/profile/:id" Component={Profile} />
          <AuthRoute path="/search/:keySearch" Component={Search} />
          <AuthRoute path="/" Component={SocialMedia} /> */}
      </Switch>
    </BrowserRouter>
  );
};

export default App;

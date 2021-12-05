import React,{useEffect} from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import AuthRoute from "./guard/auth.guard";
import { useSelector,useDispatch} from "react-redux";
import userAPI from "apis/userAPI";
//SCSS

import AuthPage from "pages/Auth";

const App = () => {

  return (
    <BrowserRouter>
      <>
        {/* <Header /> */}
        <Switch>
          <Route
            path=""
            render={(props) => <AuthPage {...props} />}
          />
          {/* <AuthRoute path="/post" Component={PostDetail} />
          <AuthRoute path="/profile/:id" Component={Profile} />
          <AuthRoute path="/search/:keySearch" Component={Search} />
          <AuthRoute path="/" Component={SocialMedia} /> */}
    
          
        </Switch>
      </>
    </BrowserRouter>
  );
};

export default App;
